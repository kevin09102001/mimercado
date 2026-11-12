# MiMercado

Marketplace en línea para Honduras, donde varias tiendas venden sus productos en un solo sitio. Precios en lempiras, ISV del 15% calculado en el checkout y comisión por venta para el marketplace.

**Hecho con:** Next.js 16, React 19, TypeScript, Tailwind CSS, Prisma con PostgreSQL y Auth.js (inicio de sesión con Google).

## Funciones

- Registro e inicio de sesión
- Catálogo de productos por categoría y página de cada producto
- Carrito de compras
- Checkout con cálculo de impuesto
- Historial de pedidos del cliente
- Datos de prueba (tiendas, categorías y productos) para levantarlo rápido

## Correr en local

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Variables de entorno necesarias (en `.env`):

```
DATABASE_URL=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```
