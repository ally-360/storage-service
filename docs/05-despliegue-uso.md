# Despliegue y Uso - Storage Service

## Descripción General

Este documento proporciona instrucciones detalladas para el despliegue y uso del Storage Service en diferentes entornos, incluyendo desarrollo local, Docker y producción.

## Requisitos Previos

### Software Requerido
- **Node.js:** Versión 18.x o superior
- **npm:** Versión 8.x o superior
- **PostgreSQL:** Versión 13.x o superior
- **MinIO:** Versión RELEASE.2023-xx-xx o superior
- **Docker:** Versión 20.x o superior (opcional)
- **Docker Compose:** Versión 2.x o superior (opcional)

### Dependencias del Sistema
- **Git:** Para clonar el repositorio
- **Make:** Para comandos de automatización (opcional)

## Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd storage-service
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables según el entorno
nano .env
```

### 4. Configurar Base de Datos
```bash
# Crear base de datos
createdb storage_dev

# Ejecutar migraciones (si las hay)
npm run migration:run
```

### 5. Configurar MinIO
```bash
# Iniciar MinIO localmente
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ACCESS_KEY=minioadmin \
  -e MINIO_SECRET_KEY=minioadmin \
  minio/minio server /data --console-address ":9001"
```

## Entornos de Despliegue

### Desarrollo Local

#### 1. Configuración
```bash
# Variables de entorno para desarrollo
NODE_ENV=development
HOST=0.0.0.0
PORT=3000
ENABLE_SWAGGER=true
LOG_LEVEL=debug

# Base de datos local
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=storage_dev
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public

# MinIO local
STORAGE_BUCKET_NAME=storage-dev
STORAGE_API_ENDPOINT=http://localhost:9000
STORAGE_PORT=9000
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_USE_SSL=false
```

#### 2. Ejecución
```bash
# Modo desarrollo con hot reload
npm run start:dev

# Modo debug
npm run start:debug

# Modo producción local
npm run build
npm run start:prod
```

#### 3. Verificación
```bash
# Verificar que el servicio esté funcionando
curl http://localhost:3000/health

# Acceder a Swagger (si está habilitado)
open http://localhost:3000/api
```

### Docker Local

#### 1. Configuración
```bash
# Variables de entorno para Docker
NODE_ENV=local
HOST=0.0.0.0
PORT=3000
ENABLE_SWAGGER=true
LOG_LEVEL=info

# Base de datos Docker
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=storage_local
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public

# MinIO Docker
STORAGE_BUCKET_NAME=storage-local
STORAGE_API_ENDPOINT=http://storage:9000
STORAGE_PORT=9000
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_USE_SSL=false
```

#### 2. Ejecución con Docker Compose
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f storage

# Detener servicios
docker-compose down
```

#### 3. Ejecución Manual con Docker
```bash
# Construir imagen
docker build -t storage-service .

# Ejecutar contenedor
docker run -d \
  --name storage-service \
  --network storage \
  -p 3000:3000 \
  -e NODE_ENV=local \
  -e DB_HOST=postgres \
  -e STORAGE_API_ENDPOINT=http://storage:9000 \
  storage-service
```

### Producción

#### 1. Configuración
```bash
# Variables de entorno para producción
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
ENABLE_SWAGGER=false
LOG_LEVEL=warn

# Base de datos de producción
DB_HOST=prod-postgres.example.com
DB_PORT=5432
DB_DATABASE=storage_prod
DB_USERNAME=storage_user
DB_PASSWORD=secure_password_123
DB_SCHEMA=storage

# MinIO de producción
STORAGE_BUCKET_NAME=storage-prod
STORAGE_API_ENDPOINT=https://minio.example.com
STORAGE_PORT=9000
STORAGE_ACCESS_KEY=prod_access_key
STORAGE_SECRET_KEY=prod_secret_key
STORAGE_USE_SSL=true
```

#### 2. Despliegue con Docker
```bash
# Construir imagen de producción
docker build -t storage-service:prod .

# Ejecutar en producción
docker run -d \
  --name storage-service-prod \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.production \
  storage-service:prod
```

#### 3. Despliegue con Kubernetes
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: storage-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: storage-service
  template:
    metadata:
      labels:
        app: storage-service
    spec:
      containers:
      - name: storage-service
        image: storage-service:prod
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: storage-secrets
              key: db-host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: storage-secrets
              key: db-password
```

## Comandos de Desarrollo

### Scripts Disponibles
```bash
# Desarrollo
npm run start:dev          # Iniciar en modo desarrollo
npm run start:debug        # Iniciar en modo debug
npm run start:prod         # Iniciar en modo producción

# Construcción
npm run build              # Construir aplicación
npm run start              # Iniciar aplicación construida

# Calidad de código
npm run lint               # Ejecutar linter
npm run format             # Formatear código
npm run test               # Ejecutar tests
npm run test:watch         # Ejecutar tests en modo watch
npm run test:cov           # Ejecutar tests con cobertura
npm run test:e2e           # Ejecutar tests end-to-end
```

### Comandos de Base de Datos
```bash
# Migraciones (si están implementadas)
npm run migration:generate -- --name=CreateStorageTable
npm run migration:run
npm run migration:revert

# Seeds (si están implementados)
npm run seed:run
```

## Monitoreo y Logs

### Logs de Aplicación
```bash
# Ver logs en desarrollo
npm run start:dev

# Ver logs en Docker
docker-compose logs -f storage

# Ver logs en producción
docker logs -f storage-service-prod
```

### Métricas de Salud
```bash
# Endpoint de salud
curl http://localhost:3000/health

# Métricas de rendimiento
curl http://localhost:3000/metrics
```

### Monitoreo de Recursos
```bash
# Uso de CPU y memoria
docker stats storage-service

# Logs de sistema
journalctl -u storage-service -f
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté ejecutándose
pg_isready -h localhost -p 5432

# Verificar credenciales
psql -h localhost -U postgres -d storage_dev
```

#### 2. Error de Conexión a MinIO
```bash
# Verificar que MinIO esté ejecutándose
curl http://localhost:9000/minio/health/live

# Verificar credenciales
mc alias set local http://localhost:9000 minioadmin minioadmin
```

#### 3. Error de Puerto en Uso
```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Terminar proceso
kill -9 <PID>
```

#### 4. Error de Permisos
```bash
# Verificar permisos de archivos
ls -la

# Cambiar permisos si es necesario
chmod +x scripts/*
```

### Logs de Debug
```bash
# Habilitar logs detallados
LOG_LEVEL=debug npm run start:dev

# Ver logs específicos
grep "ERROR" logs/app.log
grep "WARN" logs/app.log
```

## Mantenimiento

### Actualizaciones
```bash
# Actualizar dependencias
npm update

# Actualizar dependencias de seguridad
npm audit fix

# Reconstruir imagen Docker
docker build --no-cache -t storage-service .
```

### Backup y Restauración
```bash
# Backup de base de datos
pg_dump -h localhost -U postgres storage_dev > backup.sql

# Restauración de base de datos
psql -h localhost -U postgres storage_dev < backup.sql

# Backup de archivos MinIO
mc mirror local/storage-bucket ./backup/
```

### Limpieza
```bash
# Limpiar contenedores Docker
docker system prune -a

# Limpiar volúmenes Docker
docker volume prune

# Limpiar archivos temporales
npm run clean
```
