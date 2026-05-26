# LastHit

Sistema de restaurante con React, Vite y Electron.

## Incluye

- Menu digital por mesa en `/menu/:mesaId`
- Carrito con notas, descuento y propina
- Envio de pedido con mensaje listo para WhatsApp
- Pantalla cocina en `/cocina`
- Admin en `/admin`
- Superadmin SaaS en `/superadmin`
- CRUD basico de productos
- Generador de QR por mesa
- Configuracion inicial de Supabase

## Scripts

- `npm run dev`: Vite
- `npm run electron:dev`: Vite + Electron
- `npm run build`: build web
- `npm run preview`: preview web

## Supabase

1. Copia `.env.example` a `.env.local`
2. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Nunca guardes `service_role`, passwords reales ni tokens privados en el frontend

## Accesos de Desarrollo

Las credenciales no se versionan en el repositorio.

### Acceso Administrativo en `/login`

- En Supabase, crea usuarios en `staff_users` con rol `superadmin` o `administrador`.
- Para desarrollo local sin Supabase, configura `VITE_DEV_SUPERADMIN_EMAIL` y `VITE_DEV_SUPERADMIN_PASSWORD` en `.env.local`.

### Acceso de Personal en `/pin`

- Los PIN demo viven en datos locales y deben cambiarse antes de usar el sistema en produccion.
