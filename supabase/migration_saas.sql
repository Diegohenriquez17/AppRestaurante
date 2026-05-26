-- ============================================================
-- MIGRACIÓN: Soporte Multi-Tenant (SaaS) y Ajustes de Acceso
-- Ejecutar en Supabase → SQL Editor → New Query → Pegar → Run
-- ============================================================

-- 1. CREACIÓN DE LA TABLA: organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'Básico' check (plan in ('Básico', 'Empresa', 'Venta Única')),
  status text not null default 'Activo' check (status in ('Activo', 'Inactivo')),
  rut text default '',
  mrr integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger updated_at para organizations
drop trigger if exists trg_organizations_updated_at on public.organizations;
create trigger trg_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

-- RLS para organizations
alter table public.organizations enable row level security;
drop policy if exists "public organizations all" on public.organizations;
create policy "public organizations all"
on public.organizations
for all
to anon
using (true)
with check (true);

-- 2. MODIFICACIÓN DE LA TABLA staff_users PARA SOPORTAR EMAIL/PASSWORD
alter table public.staff_users add column if not exists email text;
alter table public.staff_users add column if not exists password text;

-- Modificar restricción de roles para admitir 'superadmin'
alter table public.staff_users drop constraint if exists staff_users_role_check;
alter table public.staff_users add constraint staff_users_role_check check (role in ('superadmin', 'administrador', 'cocina', 'cajero', 'garzon'));

-- Índice único para email de staff_users (evitando duplicados excepto valores nulos/vacíos)
drop index if exists idx_staff_users_email;
create unique index idx_staff_users_email on public.staff_users(email) where email is not null and email != '';

-- 3. AÑADIR COLUMNA organization_id A TABLAS EXISTENTES (Si no existen)
do $$
begin
  -- restaurant_settings
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'restaurant_settings' and column_name = 'organization_id') then
    alter table public.restaurant_settings add column organization_id uuid references public.organizations(id) on delete cascade;
    -- Quitar singleton primary key para soportar múltiples configuraciones
    alter table public.restaurant_settings drop constraint if exists restaurant_settings_pkey;
    alter table public.restaurant_settings add primary key (organization_id);
    alter table public.restaurant_settings alter column singleton drop default;
  end if;

  -- menu_categories
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'menu_categories' and column_name = 'organization_id') then
    alter table public.menu_categories add column organization_id uuid references public.organizations(id) on delete cascade;
    -- Quitar index unique original por nombre e indexar por org + nombre
    alter table public.menu_products drop constraint if exists menu_products_category_name_fkey;
    alter table public.menu_categories drop constraint if exists menu_categories_name_key;
    alter table public.menu_categories add constraint menu_categories_org_name_key unique (organization_id, name);
  end if;

  -- menu_products
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'menu_products' and column_name = 'organization_id') then
    alter table public.menu_products add column organization_id uuid references public.organizations(id) on delete cascade;
  end if;

  -- restaurant_tables
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'restaurant_tables' and column_name = 'organization_id') then
    alter table public.restaurant_tables add column organization_id uuid references public.organizations(id) on delete cascade;
    -- Ajustar unicidad para que sea por organizacion
    alter table public.restaurant_tables drop constraint if exists restaurant_tables_label_key;
    alter table public.restaurant_tables drop constraint if exists restaurant_tables_slug_key;
    alter table public.restaurant_tables add constraint restaurant_tables_org_label_key unique (organization_id, label);
    alter table public.restaurant_tables add constraint restaurant_tables_org_slug_key unique (organization_id, slug);
  end if;

  -- staff_users
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'staff_users' and column_name = 'organization_id') then
    alter table public.staff_users add column organization_id uuid references public.organizations(id) on delete cascade;
    -- Ajustar PIN único por organización
    alter table public.staff_users drop constraint if exists staff_users_pin_key;
    alter table public.staff_users add constraint staff_users_org_pin_key unique (organization_id, pin);
  end if;

  -- table_reservations
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'table_reservations' and column_name = 'organization_id') then
    alter table public.table_reservations add column organization_id uuid references public.organizations(id) on delete cascade;
  end if;

  -- orders
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'organization_id') then
    alter table public.orders add column organization_id uuid references public.organizations(id) on delete cascade;
  end if;

  -- Clave foránea de productos compuesta (por organización y nombre categoría)
  if not exists (select 1 from information_schema.table_constraints where constraint_name = 'menu_products_org_category_name_fkey') then
    alter table public.menu_products drop constraint if exists menu_products_category_name_fkey;
    alter table public.menu_products add constraint menu_products_org_category_name_fkey foreign key (organization_id, category_name) references public.menu_categories(organization_id, name) on update cascade;
  end if;
end $$;

-- 4. LIMPIEZA TOTAL DE DATOS DEMO (Truncate con cascade para empezar limpio)
truncate table public.order_items cascade;
truncate table public.orders cascade;
truncate table public.menu_products cascade;
truncate table public.menu_categories cascade;
truncate table public.restaurant_tables cascade;
truncate table public.staff_users cascade;
truncate table public.table_reservations cascade;
truncate table public.restaurant_settings cascade;
truncate table public.organizations cascade;

-- 5. SEMBRAR ÚNICAMENTE LA ORGANIZACIÓN 'RESTAURANTE GUATON XII' Y SU ADMINISTRADOR
insert into public.organizations (name, slug, plan, status, rut, mrr) values
  ('Restaurante Guaton XII', 'guaton-xii', 'Venta Única', 'Activo', '76.999.888-k', 45000);

-- restaurant_settings
insert into public.restaurant_settings (singleton, name, whatsapp, base_url, primary_color, organization_id)
select false, 'Restaurante Guaton XII', '', 'http://localhost:5173', '#c2553d', id
from public.organizations where slug = 'guaton-xii';

-- Administrador por organización (Login por Email)
insert into public.staff_users (name, role, pin, active, email, password, organization_id)
select 'Admin Guaton XII', 'administrador', '1234', true, 'admin-restaurante@example.invalid', 'CAMBIAR_PASSWORD_ADMIN', id
from public.organizations where slug = 'guaton-xii';
