# Entornos y Configuración - Storage Service

## Descripción General

El microservicio soporta múltiples entornos de ejecución con configuraciones específicas para cada uno. La configuración se maneja mediante archivos de entorno y variables de sistema.

## Entornos Soportados

### 1. Development
**Archivo:** `src/config/envs/development.ts`
**Descripción:** Configuración para desarrollo local
**Características:**
- Logging detallado
- Swagger habilitado
- Conexiones a servicios locales
- Debugging habilitado

### 2. Local
**Archivo:** `src/config/envs/local.ts`
**Descripción:** Configuración para desarrollo local con Docker
**Características:**
- Servicios containerizados
- Configuración optimizada para Docker Compose
- Redes internas de Docker

### 3. Production
**Archivo:** `src/config/envs/prod.ts`
**Descripción:** Configuración para producción
**Características:**
- Logging optimizado
- Swagger deshabilitado
- Configuración de seguridad
- Conexiones a servicios de producción

### 4. Default
**Archivo:** `src/config/envs/default.ts`
**Descripción:** Configuración base compartida
**Características:**
- Valores por defecto
- Configuración común a todos los entornos
- Estructura base de configuración

## Estructura de Configuración

### Aplicación
```typescript
app: {
  host: string;           // Host TCP del microservicio
  port: number;          // Puerto HTTP
  environment: string;   // Entorno actual
  enableSwagger: boolean; // Habilitar Swagger
}
```

### Base de Datos
```typescript
database: {
  type: 'postgres';      // Tipo de base de datos
  entities: [Storage];   // Entidades de TypeORM
  host: string;          // Host de la base de datos
  port: number;          // Puerto de la base de datos
  database: string;      // Nombre de la base de datos
  username: string;      // Usuario de la base de datos
  password: string;      // Contraseña de la base de datos
  schema: string;        // Esquema de la base de datos
}
```

### Almacenamiento (MinIO)
```typescript
storage: {
  bucketName: string;    // Nombre del bucket
  apiEndpoint: string;   // Endpoint de la API
  port: number;         // Puerto de la API
  accessKey: string;    // Clave de acceso
  secretKey: string;    // Clave secreta
  useSSL: boolean;      // Usar SSL
}
```

### Logging
```typescript
logging: {
  level: string;         // Nivel de logging (debug, info, warn, error)
}
```

## Carga de Configuración

La configuración se carga dinámicamente basándose en la variable de entorno `NODE_ENV`:

```typescript
// Proceso de carga
1. Cargar configuración base (default.ts)
2. Cargar configuración específica del entorno
3. Fusionar ambas configuraciones
4. Aplicar variables de entorno como override
```

## Validación de Configuración

Se utiliza Joi para validar la configuración:

```typescript
// Archivo: src/config/validations/joi.validation.ts
- Validación de tipos de datos
- Validación de valores requeridos
- Validación de formatos específicos
- Mensajes de error personalizados
```

## Variables de Entorno

### Aplicación
- `HOST`: Host TCP del microservicio
- `PORT`: Puerto HTTP
- `NODE_ENV`: Entorno de ejecución
- `ENABLE_SWAGGER`: Habilitar Swagger

### Base de Datos
- `DB_HOST`: Host de la base de datos
- `DB_PORT`: Puerto de la base de datos
- `DB_DATABASE`: Nombre de la base de datos
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_SCHEMA`: Esquema de la base de datos

### Almacenamiento
- `STORAGE_BUCKET_NAME`: Nombre del bucket
- `STORAGE_API_ENDPOINT`: Endpoint de la API
- `STORAGE_PORT`: Puerto de la API
- `STORAGE_ACCESS_KEY`: Clave de acceso
- `STORAGE_SECRET_KEY`: Clave secreta
- `STORAGE_USE_SSL`: Usar SSL

### Logging
- `LOG_LEVEL`: Nivel de logging

## Configuración por Entorno

### Development
```bash
NODE_ENV=development
HOST=0.0.0.0
PORT=3000
ENABLE_SWAGGER=true
LOG_LEVEL=debug
```

### Local (Docker)
```bash
NODE_ENV=local
HOST=0.0.0.0
PORT=3000
ENABLE_SWAGGER=true
LOG_LEVEL=info
```

### Production
```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
ENABLE_SWAGGER=false
LOG_LEVEL=warn
```

## Consideraciones de Seguridad

1. **Variables Sensibles:** Las contraseñas y claves secretas nunca se incluyen en el código
2. **Validación:** Todas las configuraciones se validan al inicio
3. **Override:** Las variables de entorno tienen prioridad sobre los archivos de configuración
4. **Logging:** No se registran valores sensibles en los logs
