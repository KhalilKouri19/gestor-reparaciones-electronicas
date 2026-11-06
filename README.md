# Gestor de Reparaciones Electrónicas

Aplicación web para registrar equipos recibidos por un servicio técnico, administrar sus órdenes y permitir que los clientes consulten el avance mediante un código único.

## Tecnologías

- **Frontend:** Next.js (App Router), React y CSS.
- **Backend:** Node.js, Express y API REST.
- **Persistencia:** MySQL.
- **Seguridad:** JWT, bcryptjs, Helmet, CORS y variables de entorno.
- **Calidad:** Jest.

## Funcionalidades

- Inicio de sesión para administradores y clientes.
- Acceso administrativo restringido a usuarios con rol de administrador.
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

Abrí phpMyAdmin e importá el archivo `database/schema.sql`.

El script crea la base de datos `gestor_reparaciones` y sus tablas.

Si utilizás otra base de datos, configurá el nombre correspondiente en `DB_NAME` dentro del archivo `backend/.env`. La estructura de las tablas debe ser compatible con el esquema del proyecto.

## 2. Configurar el backend

Desde la carpeta raíz del proyecto, abrí una terminal y ejecutá:

```bash
cd backend
cp .env.example .env
```

Editá `backend/.env` con los datos de conexión a MySQL.

Configurá especialmente:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Definí un `JWT_SECRET` largo, aleatorio y privado. La contraseña del administrador debe tener al menos 10 caracteres.

Instalá las dependencias:

```bash
npm install
```

Inicializá el administrador:

```bash
npm run seed:admin
```

Iniciá el servidor:

```bash
npm run dev
```

El backend queda disponible en:

`http://localhost:4000`

## 3. Configurar el frontend

Abrí otra terminal desde la carpeta raíz del proyecto y ejecutá:

```bash
cd frontend
cp .env.local.example .env.local
```

Instalá las dependencias:

```bash
npm install
```

Iniciá el frontend:

```bash
npm run dev
```

Abrí el navegador en:

`http://localhost:3000`

## 4. Ejecutar pruebas

Desde una terminal, ingresá a la carpeta del backend:

```bash
cd backend
npm test
```

Las pruebas unitarias verifican:

- Creación correcta de una orden y generación de su código.
- Rechazo de un email inválido.
- Validación del teléfono de ocho caracteres y limpieza de espacios.
- Rechazo de entradas nulas o incompletas.
- Formato del código de seguimiento.

## API REST

Todas las rutas están bajo `/api`.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/login` | Público | Iniciar sesión |
| GET | `/reparaciones` | JWT (admin) | Listar y filtrar órdenes |
| POST | `/reparaciones` | JWT (admin) | Registrar una orden |
| GET | `/reparaciones/seguimiento/:codigo` | Público | Consultar estado por código |
| PATCH | `/reparaciones/:id/estado` | JWT (admin) | Actualizar estado |
| PUT | `/reparaciones/:id` | JWT (admin) | Editar datos de una orden |
| DELETE | `/reparaciones/:id` | JWT (admin) | Eliminar una orden |
| GET | `/health` | Público | Comprobar disponibilidad |

Las rutas administrativas requieren un token JWT válido con rol de administrador.

Filtros admitidos en el listado: `cliente`, `estado` y `modelo`.

## Estructura del proyecto

```text
backend/
  src/
    config/          conexión MySQL
    controllers/     controladores HTTP
    middlewares/     autenticación y errores
    repositories/    consultas SQL
    routes/          definición de endpoints
    scripts/         inicialización de usuarios
    services/        reglas de negocio y validaciones
    utils/           generación de códigos
  tests/              pruebas automatizadas

frontend/
  app/                páginas Next.js
  components/         componentes reutilizables
  lib/                configuración de API

database/
  schema.sql          estructura de MySQL
```

## Decisiones de diseño

Se utiliza la arquitectura Controller–Service–Repository:

- **Controller:** interpreta las solicitudes HTTP y devuelve las respuestas.
- **Service:** valida y aplica las reglas del negocio.
- **Repository:** concentra el acceso a MySQL.

El código de seguimiento se genera exclusivamente en el backend y la base de datos aplica una restricción `UNIQUE` para evitar duplicados.

La función `generarCodigoSeguimiento` genera una identificación visible de la orden; no es un token criptográfico.

## Seguridad

- Las contraseñas se almacenan mediante hash con bcryptjs.
- La autenticación administrativa utiliza JWT.
- Las rutas administrativas están protegidas mediante middleware.
- Las credenciales y claves privadas se configuran mediante variables de entorno.
- Los archivos `.env` y `.env.local` están excluidos del repositorio mediante `.gitignore`.
- Los usuarios clientes se crean mediante un script de inicialización; no existe registro público desde la aplicación.

Nunca publiques contraseñas reales, tokens ni secretos.

## Repositorio

Código fuente disponible en GitHub:

https://github.com/KhalilKouri19/gestor-reparaciones-electronicas