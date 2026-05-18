-- ============================================================
-- MIGRACIÓN: Nuevos cambios LastHit
-- Ejecutar en Supabase → SQL Editor → New Query → Pegar → Run
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. TABLA: staff_users (Administrador, Cocina, Cajero, Garzón)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.staff_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('administrador', 'cocina', 'cajero', 'garzon')),
  pin text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_staff_users_role on public.staff_users(role);
create index if not exists idx_staff_users_pin on public.staff_users(pin);

-- Trigger updated_at
drop trigger if exists trg_staff_users_updated_at on public.staff_users;
create trigger trg_staff_users_updated_at
before update on public.staff_users
for each row execute function public.set_updated_at();

-- RLS
alter table public.staff_users enable row level security;

drop policy if exists "public staff_users all" on public.staff_users;
create policy "public staff_users all"
on public.staff_users
for all
to anon
using (true)
with check (true);


-- ─────────────────────────────────────────────────────────────
-- 2. TABLA: table_reservations (Reserva de mesas)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.table_reservations (
  id uuid primary key default gen_random_uuid(),
  table_id uuid references public.restaurant_tables(id) on delete set null,
  table_label text not null,
  customer_name text not null,
  guest_count integer not null default 2 check (guest_count > 0),
  reservation_date date not null,
  reservation_time time not null,
  status text not null default 'Pendiente'
    check (status in ('Pendiente', 'Confirmada', 'Completada', 'Cancelada')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_table_reservations_date on public.table_reservations(reservation_date);

-- Trigger updated_at
drop trigger if exists trg_table_reservations_updated_at on public.table_reservations;
create trigger trg_table_reservations_updated_at
before update on public.table_reservations
for each row execute function public.set_updated_at();

-- RLS
alter table public.table_reservations enable row level security;

drop policy if exists "public table_reservations all" on public.table_reservations;
create policy "public table_reservations all"
on public.table_reservations
for all
to anon
using (true)
with check (true);


-- ─────────────────────────────────────────────────────────────
-- 3. COLUMNAS NUEVAS en tabla "orders"
--    (método de pago + garzón asignado)
-- ─────────────────────────────────────────────────────────────

-- Método de pago: Efectivo, Débito, Crédito, Transferencia
alter table public.orders
  add column if not exists payment_method text default null
    check (payment_method is null or payment_method in ('Efectivo', 'Débito', 'Crédito', 'Transferencia'));

-- Garzón que atendió el pedido
alter table public.orders
  add column if not exists waiter_id uuid references public.staff_users(id) on delete set null;

alter table public.orders
  add column if not exists waiter_name text;


-- ─────────────────────────────────────────────────────────────
-- 4. DATOS INICIALES: Usuarios por defecto
-- ─────────────────────────────────────────────────────────────
insert into public.staff_users (name, role, pin) values
  ('Admin Principal', 'administrador', '1234'),
  ('Chef Marco', 'cocina', '5678'),
  ('Cajero Ana', 'cajero', '9012'),
  ('Garzon Pedro', 'garzon', '3456'),
  ('Maria Gonzalez', 'garzon', '7890')
on conflict (pin) do nothing;


-- ============================================================
-- ¡LISTO! Refresca la página de Supabase para ver las tablas
-- ============================================================
