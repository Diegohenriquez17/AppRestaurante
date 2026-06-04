-- ============================================================
-- MIGRACIÓN: eliminar la columna de contraseñas en texto plano
-- ============================================================
-- La autenticación por email/contraseña la gestiona Supabase Auth (auth.users),
-- que guarda las contraseñas hasheadas. La antigua columna public.staff_users.password
-- almacenaba texto plano y NO debe existir.
--
-- Idempotente: seguro de ejecutar aunque la columna ya no exista.
-- Ejecútalo en el editor SQL de Supabase de cualquier entorno que aún la tenga.

alter table public.staff_users drop column if exists password;
