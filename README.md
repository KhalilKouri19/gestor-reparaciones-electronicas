# Gestor de Reparaciones Electrónicas

Aplicación web para registrar equipos recibidos por un servicio técnico, administrar sus órdenes y permitir que los clientes consulten el avance mediante un código único.

## Tecnologías
- Frontend: Next.js (App Router), React y CSS.
- Backend: Node.js, Express y API REST.
- Persistencia: MySQL.
- Seguridad: JWT, bcryptjs, Helmet, CORS y variables de entorno.
- Calidad: Jest y Supertest.

## Funcionalidades
- Inicio de sesión para personal administrador.
- Alta de órdenes con datos del cliente y del dispositivo.
- Generación en el servidor de códigos `REP-XXXX-0000`.
- Listado, búsqueda y filtrado de reparaciones.
- Actualización del estado y eliminación de órdenes.
- Consulta pública del estado mediante el código de seguimiento.
- Validación de entradas y manejo centralizado de errores.

Estados disponibles: `Ingresado`, `En Diagnóstico`, `Reparado` y `Entregado`.

## Requisitos
- Node.js 20 o superior y npm.
- MySQL 8 o compatible (por ejemplo, WampServer).

## 1. Crear la base de datos
Abrí phpMyAdmin e importá `database/schema.sql`. El script crea la base `gestor_reparaciones` y sus tablas. Si preferís conservar el nombre `Akita`, cambiá `DB_NAME` en el archivo de entorno por el nombre de tu base y adaptá el esquema si ya tenés tablas con otra estructura.

## 2. Configurar el backend
```bash
cd backend
cp .env.example .env
```
Editá `backend/.env` con los datos de tu MySQL y definí un `JWT_SECRET` largo y privado. Instalá dependencias e inicializá el administrador:
```bash
npm install
npm run seed:admin
npm run dev
```
El backend queda disponible en `http://localhost:4000`. El usuario y contraseña iniciales se configuran con `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env` (valores de ejemplo: `admin@gestor.com` / `Admin12345!`). Cambiá la contraseña antes de utilizarlo fuera de un entorno local.

## 3. Configurar el frontend
En otra terminal:
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
Abrí `http://localhost:3000`.

## 4. Ejecutar pruebas
```bash
cd backend
npm test
```
Las pruebas unitarias verifican el caso correcto, el rechazo de un email inválido y el caso límite del teléfono de ocho caracteres. También se prueba el formato del código.

## API REST
Todas las rutas están bajo `/api`.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/login` | Público | Iniciar sesión de administrador |
| GET | `/reparaciones` | JWT | Listar y filtrar órdenes |
| POST | `/reparaciones` | JWT | Registrar una orden |
| GET | `/reparaciones/seguimiento/:codigo` | Público | Consultar estado por código |
| PATCH | `/reparaciones/:id/estado` | JWT | Actualizar estado |
| PUT | `/reparaciones/:id` | JWT | Editar datos de una orden |
| DELETE | `/reparaciones/:id` | JWT | Eliminar una orden |
| GET | `/health` | Público | Comprobar disponibilidad |

Filtros admitidos en el listado: `cliente`, `estado` y `modelo`.

## Estructura
```text
backend/
  src/config/          conexión MySQL
  src/controllers/     controladores HTTP
  src/middlewares/     autenticación y errores
  src/repositories/    consultas SQL
  src/routes/          definición de endpoints
  src/services/        reglas de negocio y validaciones
  src/utils/           generación de códigos
  tests/               pruebas automatizadas
frontend/
  app/                 páginas Next.js
  components/          componentes reutilizables
 database/schema.sql   estructura de MySQL
```

## Decisiones de diseño
Se utiliza la arquitectura Controller–Service–Repository: el Controller interpreta HTTP, el Service valida y aplica reglas del negocio, y el Repository concentra el acceso a MySQL. El código de seguimiento se genera exclusivamente en el backend y la base de datos aplica una restricción `UNIQUE` para evitar duplicados. La función `generarCodigoSeguimiento` es una identificación visible de orden, no un token criptográfico.

## Publicación en GitHub
1. Revisá que `.env` y `.env.local` no estén incluidos (están ignorados por Git).
2. Cambiá las credenciales de ejemplo.
3. Inicializá el repositorio desde la carpeta raíz:
```bash
git init
git add .
git commit -m "Proyecto final: Gestor de Reparaciones Electrónicas"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/gestor-reparaciones-electronicas.git
git push -u origin main
```
Nunca subas secretos, contraseñas reales ni archivos de configuración locales.
