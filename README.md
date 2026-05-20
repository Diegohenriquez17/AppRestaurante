# LastHit

Demo funcional para restaurante con React + Vite + Electron.

## Incluye

- Menu digital por mesa en `/menu/:mesaId`
- Carrito con notas, descuento y propina
- Envio de pedido con mensaje listo para WhatsApp
- Pantalla cocina en `/cocina`
- Admin en `/admin`
- CRUD basico de productos
- Generador de QR por mesa
- Configuracion inicial de Supabase

## Scripts

- `npm run dev`: Vite
- `npm run electron:dev`: Vite + Electron
- `npm run build`: build web
- `npm run preview`: preview web

## Supabase

La demo usa `localStorage` por defecto. Para conectar Supabase:

1. Copia `.env.example` a `.env`
2. Completa `VITE_SUPABASE_ANON_KEY`
3. Luego conectamos tablas y sincronizacion real

## Credenciales de Prueba

### Acceso Administrativo (en `/login`):
* **Superadmin:**
  * Correo: `diegohenriquez176@gmail.com`
  * Contraseña: `diego2412`
* **Administrador de Restaurante:**
  * Correo: `diegohen2005gonzales@gmail.com`
  * Contraseña: `diego2412`

### Acceso de Personal (en `/pin`):
* **Búsqueda de Sucursal:** Escribe `guaton-xii` (o usa la URL directa: `/pin?org=guaton-xii`)
* **PIN de Prueba (Garzón/Staff):** `1234`
