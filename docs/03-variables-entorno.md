# Variables de Entorno - Storage Service

## Descripción General

Este documento detalla todas las variables de entorno necesarias para el funcionamiento del Storage Service. Las variables se organizan por categorías y se incluyen ejemplos de valores para cada entorno.

## Variables de Aplicación

### HOST
- **Descripción:** Host TCP en el que se ejecutará el microservicio
- **Tipo:** string
- **Valor por defecto:** `0.0.0.0`
- **Ejemplo:** `0.0.0.0`
- **Requerido:** No
- **Entornos:** Todos

### PORT
- **Descripción:** Puerto HTTP del microservicio
- **Tipo:** number
- **Valor por defecto:** `3000`
- **Ejemplo:** `3000`
- **Requerido:** No
- **Entornos:** Todos

### NODE_ENV
- **Descripción:** Entorno de ejecución de Node.js
- **Tipo:** string
- **Valores válidos:** `development`, `local`, `production`
- **Valor por defecto:** `development`
- **Ejemplo:** `development`
- **Requerido:** No
- **Entornos:** Todos

### ENABLE_SWAGGER
- **Descripción:** Habilitar documentación Swagger
- **Tipo:** boolean
- **Valores válidos:** `true`, `false`
- **Valor por defecto:** `false`
- **Ejemplo:** `true`
- **Requerido:** No
- **Entornos:** Todos

## Variables de Base de Datos

### DB_HOST
- **Descripción:** Host de la base de datos PostgreSQL
- **Tipo:** string
- **Ejemplo:** `localhost`, `postgres`, `db.example.com`
- **Requerido:** Sí
- **Entornos:** Todos

### DB_PORT
- **Descripción:** Puerto de la base de datos PostgreSQL
- **Tipo:** number
- **Valor por defecto:** `5432`
- **Ejemplo:** `5432`
- **Requerido:** No
- **Entornos:** Todos

### DB_DATABASE
- **Descripción:** Nombre de la base de datos
- **Tipo:** string
- **Ejemplo:** `storage_db`, `ally360_storage`
- **Requerido:** Sí
- **Entornos:** Todos

### DB_USERNAME
- **Descripción:** Usuario para autenticarse en la base de datos
- **Tipo:** string
- **Ejemplo:** `postgres`, `storage_user`
- **Requerido:** Sí
- **Entornos:** Todos

### DB_PASSWORD
- **Descripción:** Contraseña para autenticarse en la base de datos
- **Tipo:** string
- **Ejemplo:** `mypassword`, `secret123`
- **Requerido:** Sí
- **Entornos:** Todos

### DB_SCHEMA
- **Descripción:** Esquema de la base de datos
- **Tipo:** string
- **Ejemplo:** `public`, `storage_schema`
- **Requerido:** Sí
- **Entornos:** Todos

## Variables de Almacenamiento (MinIO)

### STORAGE_BUCKET_NAME
- **Descripción:** Nombre del bucket en MinIO
- **Tipo:** string
- **Ejemplo:** `storage-bucket`, `ally360-files`
- **Requerido:** Sí
- **Entornos:** Todos

### STORAGE_API_ENDPOINT
- **Descripción:** Endpoint de la API de MinIO
- **Tipo:** string
- **Ejemplo:** `http://localhost:9000`, `https://minio.example.com`
- **Requerido:** Sí
- **Entornos:** Todos

### STORAGE_PORT
- **Descripción:** Puerto de la API de MinIO
- **Tipo:** number
- **Valor por defecto:** `9000`
- **Ejemplo:** `9000`
- **Requerido:** No
- **Entornos:** Todos

### STORAGE_ACCESS_KEY
- **Descripción:** Clave de acceso para MinIO
- **Tipo:** string
- **Ejemplo:** `minioadmin`, `access_key_123`
- **Requerido:** Sí
- **Entornos:** Todos

### STORAGE_SECRET_KEY
- **Descripción:** Clave secreta para MinIO
- **Tipo:** string
- **Ejemplo:** `minioadmin`, `secret_key_456`
- **Requerido:** Sí
- **Entornos:** Todos

### STORAGE_USE_SSL
- **Descripción:** Usar SSL para conexiones a MinIO
- **Tipo:** boolean
- **Valores válidos:** `true`, `false`
- **Valor por defecto:** `false`
- **Ejemplo:** `false`
- **Requerido:** No
- **Entornos:** Todos

## Variables de Logging

### LOG_LEVEL
- **Descripción:** Nivel de detalle para los logs
- **Tipo:** string
- **Valores válidos:** `debug`, `info`, `warn`, `error`
- **Valor por defecto:** `info`
- **Ejemplo:** `info`
- **Requerido:** No
- **Entornos:** Todos

## Archivos de Ejemplo por Entorno

### Development (.env.development)
```bash
# Aplicación
HOST=0.0.0.0
PORT=3000
NODE_ENV=development
ENABLE_SWAGGER=true
LOG_LEVEL=debug

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=storage_dev
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public

# Almacenamiento
STORAGE_BUCKET_NAME=storage-dev
STORAGE_API_ENDPOINT=http://localhost:9000
STORAGE_PORT=9000
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_USE_SSL=false
```

### Local (.env.local)
```bash
# Aplicación
HOST=0.0.0.0
PORT=3000
NODE_ENV=local
ENABLE_SWAGGER=true
LOG_LEVEL=info

# Base de Datos
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=storage_local
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public

# Almacenamiento
STORAGE_BUCKET_NAME=storage-local
STORAGE_API_ENDPOINT=http://storage:9000
STORAGE_PORT=9000
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_USE_SSL=false
```

### Production (.env.production)
```bash
# Aplicación
HOST=0.0.0.0
PORT=3000
NODE_ENV=production
ENABLE_SWAGGER=false
LOG_LEVEL=warn

# Base de Datos
DB_HOST=prod-postgres.example.com
DB_PORT=5432
DB_DATABASE=storage_prod
DB_USERNAME=storage_user
DB_PASSWORD=secure_password_123
DB_SCHEMA=storage

# Almacenamiento
STORAGE_BUCKET_NAME=storage-prod
STORAGE_API_ENDPOINT=https://minio.example.com
STORAGE_PORT=9000
STORAGE_ACCESS_KEY=prod_access_key
STORAGE_SECRET_KEY=prod_secret_key
STORAGE_USE_SSL=true
```

## Validación de Variables

### Variables Requeridas
Las siguientes variables son obligatorias y deben estar definidas:
- `DB_HOST`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SCHEMA`
- `STORAGE_BUCKET_NAME`
- `STORAGE_API_ENDPOINT`
- `STORAGE_ACCESS_KEY`
- `STORAGE_SECRET_KEY`

### Validaciones Específicas
- **NODE_ENV:** Debe ser uno de los valores válidos
- **PORT:** Debe ser un número válido entre 1 y 65535
- **DB_PORT:** Debe ser un número válido entre 1 y 65535
- **STORAGE_PORT:** Debe ser un número válido entre 1 y 65535
- **LOG_LEVEL:** Debe ser uno de los niveles válidos
- **STORAGE_USE_SSL:** Debe ser 'true' o 'false'

## Consideraciones de Seguridad

1. **Variables Sensibles:** Nunca incluir contraseñas o claves en el código fuente
2. **Archivos .env:** No versionar archivos .env en el repositorio
3. **Permisos:** Restringir acceso a archivos de configuración
4. **Rotación:** Cambiar claves y contraseñas regularmente
5. **Encriptación:** Usar encriptación para variables sensibles en producción
