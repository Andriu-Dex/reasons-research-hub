# REASONS Research Hub

Plataforma web academica multi-tenant para gestionar organizaciones, investigadores, lineas de investigacion, proyectos, publicaciones, noticias, contacto y configuracion institucional.

## Stack

- Frontend: Angular
- Backend: Node.js, Express y TypeScript
- Base de datos: PostgreSQL con Prisma
- Validacion: Zod
- Seguridad: JWT, refresh token en cookie HttpOnly, Helmet, CORS y rate limiting

## Primer arranque local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env` desde `.env.example` y configurar `DATABASE_URL`.

3. Ejecutar migraciones y seed:

```bash
npm run db:migrate
npm run db:seed
```

4. Levantar frontend y backend:

```bash
npm run dev
```

## URLs locales

- Portal publico: `http://localhost:4200/uta-reasons`
- Panel administrativo: `http://localhost:4200/admin/login`
- API healthcheck: `http://localhost:3000/api/health`

## Credenciales seed

- Admin organizacion: `admin@uta.edu.ec`
- Superadmin: `superadmin@reasons.local`
- Contrasena: `Admin12345!`

## Variables externas

Imgur, SMTP y Cloudflare Turnstile pueden trabajar en modo mock durante desarrollo usando:

```env
IMGUR_MOCK="true"
SMTP_MOCK="true"
TURNSTILE_MOCK="true"
```
