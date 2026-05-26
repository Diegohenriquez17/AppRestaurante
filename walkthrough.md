# Notas de Implementacion

Este archivo resume cambios funcionales sin incluir credenciales reales.

## Login y SaaS

- El acceso administrativo usa correo y password contra Supabase cuando `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estan configurados.
- El superadmin no debe estar hardcodeado en el frontend.
- Para pruebas locales sin Supabase se pueden usar `VITE_DEV_SUPERADMIN_EMAIL` y `VITE_DEV_SUPERADMIN_PASSWORD` en `.env.local`.

## Seguridad

- `.env.local` queda fuera de Git por `.gitignore`.
- La clave `service_role` nunca debe exponerse en React, Vite, Electron renderer ni archivos publicos.
- Las credenciales de prueba deben rotarse si fueron compartidas o subidas al repositorio.

## Base de Datos

- Los scripts SQL incluidos son plantillas/demo.
- Antes de produccion, reemplazar passwords planos por Supabase Auth o hashing en backend.
