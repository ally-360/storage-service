# Documentación del Storage Service

## Descripción General

El Storage Service es un microservicio desarrollado con NestJS que proporciona funcionalidades de almacenamiento de archivos utilizando MinIO como backend de almacenamiento y PostgreSQL para metadatos. Está diseñado para ser parte de una arquitectura de microservicios y se comunica mediante patrones TCP.

## Características Principales

- **Almacenamiento de Archivos:** Subida, descarga y eliminación de archivos
- **Metadatos:** Gestión de información de archivos en PostgreSQL
- **URLs Presignadas:** Generación de URLs temporales para acceso directo
- **Multi-tenant:** Soporte para múltiples inquilinos
- **Auditoría:** Registro detallado de operaciones
- **Escalabilidad:** Diseñado para escalar horizontalmente

## Tecnologías Utilizadas

- **NestJS:** Framework de Node.js para microservicios
- **MinIO:** Almacenamiento de objetos compatible con S3
- **PostgreSQL:** Base de datos para metadatos
- **TypeORM:** ORM para acceso a datos
- **Docker:** Containerización
- **Joi:** Validación de configuración

## Estructura de la Documentación

### 1. [Contratos de API](./01-contratos-api.md)
Documentación detallada de los patrones de microservicios, payloads, respuestas y manejo de errores.

### 2. [Entornos y Configuración](./02-entornos-configuracion.md)
Configuración del sistema, entornos soportados y estructura de configuración.

### 3. [Variables de Entorno](./03-variables-entorno.md)
Lista completa de variables de entorno, ejemplos por entorno y consideraciones de seguridad.

### 4. [Arquitectura y Componentes](./04-arquitectura-componentes.md)
Arquitectura del sistema, componentes principales, patrones de diseño y flujo de datos.

### 5. [Despliegue y Uso](./05-despliegue-uso.md)
Instrucciones de instalación, configuración, despliegue y mantenimiento.

## Inicio Rápido

### Prerrequisitos
- Node.js 18.x o superior
- PostgreSQL 13.x o superior
- MinIO (local o remoto)
- Docker (opcional)

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd storage-service

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar en modo desarrollo
npm run start:dev
```

### Verificación
```bash
# Verificar que el servicio esté funcionando
curl http://localhost:3000/health
```

## Uso Básico

### Subir un Archivo
```typescript
// Patrón: storage_upload
const payload = {
  filename: 'documento.pdf',
  file: Buffer.from(fileContent),
  mimetype: 'application/pdf',
  size: fileSize,
  tenantId: 'tenant-123',
  userId: 'user-456',
  bucket: 'bucket-name',
  sessionId: 'session-789',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
};
```

### Descargar un Archivo
```typescript
// Patrón: storage_download
const payload = {
  key: 'file-key',
  bucket: 'bucket-name',
  tenantId: 'tenant-123',
  userId: 'user-456',
  sessionId: 'session-789',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
};
```

### Eliminar un Archivo
```typescript
// Patrón: storage_delete
const payload = {
  key: 'file-key',
  bucket: 'bucket-name',
  tenantId: 'tenant-123',
  userId: 'user-456',
  sessionId: 'session-789',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
};
```

## Configuración de Entornos

### Desarrollo
```bash
NODE_ENV=development
DB_HOST=localhost
STORAGE_API_ENDPOINT=http://localhost:9000
```

### Producción
```bash
NODE_ENV=production
DB_HOST=prod-postgres.example.com
STORAGE_API_ENDPOINT=https://minio.example.com
STORAGE_USE_SSL=true
```

## Docker

### Desarrollo Local
```bash
# Iniciar con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f storage
```

### Producción
```bash
# Construir imagen
docker build -t storage-service:prod .

# Ejecutar contenedor
docker run -d --name storage-service \
  -p 3000:3000 \
  --env-file .env.production \
  storage-service:prod
```

## Monitoreo

### Logs
```bash
# Ver logs en desarrollo
npm run start:dev

# Ver logs en Docker
docker logs -f storage-service
```

### Salud del Servicio
```bash
# Endpoint de salud
curl http://localhost:3000/health
```

## Troubleshooting

### Problemas Comunes
1. **Error de conexión a base de datos:** Verificar que PostgreSQL esté ejecutándose
2. **Error de conexión a MinIO:** Verificar que MinIO esté ejecutándose
3. **Puerto en uso:** Verificar que el puerto 3000 esté disponible
4. **Permisos:** Verificar permisos de archivos y directorios

### Logs de Debug
```bash
# Habilitar logs detallados
LOG_LEVEL=debug npm run start:dev
```

## Contribución

### Estructura del Proyecto
- `src/config/` - Configuración del sistema
- `src/infrastructure/` - Capa de infraestructura
- `src/modules/storage/` - Módulo principal
- `docs/` - Documentación

### Comandos de Desarrollo
```bash
npm run lint          # Ejecutar linter
npm run format        # Formatear código
npm run test          # Ejecutar tests
npm run test:cov      # Tests con cobertura
```

## Soporte

Para soporte técnico o preguntas sobre el microservicio, consultar:
1. Documentación técnica en esta carpeta
2. Logs de la aplicación
3. Equipo de desarrollo

## Licencia

[Especificar licencia del proyecto]
