-- ============================================================
-- SCRIPT DE MIGRACIÓN Y LIMPIEZA TOTAL (clean_saas.sql)
-- Ejecuta esto en tu editor SQL de Supabase para reparar tu base de datos,
-- crear las columnas requeridas (email, password) y configurar tus accesos.
-- ============================================================

-- 1. CREACIÓN DE LA TABLA: organizations (Si no existe)
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

-- Habilitar RLS para organizations
alter table public.organizations enable row level security;
drop policy if exists "public organizations all" on public.organizations;
create policy "public organizations all" on public.organizations for all to anon using (true) with check (true);

-- 2. MODIFICACIÓN DE LA TABLA staff_users PARA SOPORTAR EMAIL/PASSWORD Y SUPERADMIN
alter table public.staff_users add column if not exists email text;
alter table public.staff_users add column if not exists password text;

-- Modificar restricción de roles para admitir 'superadmin'
alter table public.staff_users drop constraint if exists staff_users_role_check;
alter table public.staff_users add constraint staff_users_role_check check (role in ('superadmin', 'administrador', 'cocina', 'cajero', 'garzon'));

-- Índice único para email de staff_users (evitando duplicados excepto valores nulos/vacíos)
drop index if exists idx_staff_users_email;
create unique index idx_staff_users_email on public.staff_users(email) where email is not null and email != '';

-- 3. AÑADIR COLUMNA organization_id A TABLAS EXISTENTES Y AJUSTAR RESTRICCIONES
do $$
begin
  -- restaurant_settings
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'restaurant_settings' and column_name = 'organization_id') then
    alter table public.restaurant_settings add column organization_id uuid references public.organizations(id) on delete cascade;
    alter table public.restaurant_settings drop constraint if exists restaurant_settings_pkey;
    alter table public.restaurant_settings add primary key (organization_id);
    alter table public.restaurant_settings alter column singleton drop default;
  end if;

  -- menu_categories
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'menu_categories' and column_name = 'organization_id') then
    alter table public.menu_categories add column organization_id uuid references public.organizations(id) on delete cascade;
    -- Quitar constraints anteriores para evitar conflictos
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
    alter table public.restaurant_tables drop constraint if exists restaurant_tables_label_key;
    alter table public.restaurant_tables drop constraint if exists restaurant_tables_slug_key;
    alter table public.restaurant_tables add constraint restaurant_tables_org_label_key unique (organization_id, label);
    alter table public.restaurant_tables add constraint restaurant_tables_org_slug_key unique (organization_id, slug);
  end if;

  -- staff_users
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'staff_users' and column_name = 'organization_id') then
    alter table public.staff_users add column organization_id uuid references public.organizations(id) on delete cascade;
    alter table public.staff_users drop constraint if exists staff_users_pin_key;
    alter table public.staff_users add constraint staff_users_org_pin_key unique (organization_id, pin);
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

-- 4. LIMPIEZA TOTAL DE HISTORIAL Y DATOS ANTIGUOS
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.menu_products CASCADE;
TRUNCATE TABLE public.menu_categories CASCADE;
TRUNCATE TABLE public.restaurant_tables CASCADE;
TRUNCATE TABLE public.restaurant_settings CASCADE;
TRUNCATE TABLE public.staff_users CASCADE;
TRUNCATE TABLE public.organizations CASCADE;

-- 5. SEMBRAR ORGANIZACIÓN DEL SUPERADMIN ("Empresa de Jefe")
INSERT INTO public.organizations (id, name, slug, plan, status, rut, mrr)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Empresa de Jefe', 
  'empresa-jefe', 
  'Empresa', 
  'Activo', 
  '99.999.999-9', 
  100
);

-- Configuración del Superadmin
INSERT INTO public.restaurant_settings (organization_id, singleton, name, whatsapp, base_url, primary_color)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  false,
  'Empresa de Jefe',
  '+56900000000',
  'http://localhost:5173',
  '#0d9488'
);

-- Crear el Usuario Superadmin (diegohenriquez176@gmail.com)
INSERT INTO public.staff_users (id, organization_id, name, role, pin, active, email, password)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Diego Superadmin',
  'superadmin',
  '9999',
  true,
  'diegohenriquez176@gmail.com',
  'diego2412'
);

-- 6. SEMBRAR ORGANIZACIÓN DEL ADMINISTRADOR DE RESTAURANTE ("Restaurante Guaton XII")
INSERT INTO public.organizations (id, name, slug, plan, status, rut, mrr)
VALUES (
  '33333333-3333-3333-3333-333333333333', 
  'Restaurante Guaton XII', 
  'restaurante-guaton-xii', 
  'Básico', 
  'Activo', 
  '11.111.111-1', 
  30
);

-- Configuración para Guaton XII
INSERT INTO public.restaurant_settings (organization_id, singleton, name, whatsapp, base_url, primary_color)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  false,
  'Restaurante Guaton XII',
  '+56936306560',
  'http://localhost:5173',
  '#c2553d'
);

-- Crear el Usuario Administrador del Restaurante (diegohen2005gonzales@gmail.com)
INSERT INTO public.staff_users (id, organization_id, name, role, pin, active, email, password)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'Diego Administrador',
  'administrador',
  '7777',
  true,
  'diegohen2005gonzales@gmail.com',
  'diego2412'
);

-- 7. Crear personal para Restaurante Guaton XII (Garzones y Cajeros de prueba)
INSERT INTO public.staff_users (id, organization_id, name, role, pin, active)
VALUES 
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Garzón Juan', 'garzon', '1234', true),
  ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Cajero Pedro', 'cajero', '5678', true);

-- 8. Cargar algunas mesas de prueba para Restaurante Guaton XII
INSERT INTO public.restaurant_tables (id, organization_id, label, slug, active)
VALUES
  ('77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'Mesa 1', 'mesa-01', true),
  ('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'Mesa 2', 'mesa-02', true),
  ('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'Mesa 3', 'mesa-03', true);

-- 9. Cargar algunas categorías y productos básicos de prueba para Restaurante Guaton XII
INSERT INTO public.menu_categories (id, organization_id, name)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Comestibles'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Bebestibles');

INSERT INTO public.menu_products (id, organization_id, category_name, name, description, price, available)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Comestibles', 'Empanada de Pino', 'Tradicional empanada chilena al horno.', 2500, true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Comestibles', 'Lomo a lo Pobre', 'Bife de lomo liso con papas fritas, cebolla frita y dos huevos.', 9500, true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Bebestibles', 'Bebida en Lata', 'Coca-Cola, Fanta o Sprite.', 1500, true);
