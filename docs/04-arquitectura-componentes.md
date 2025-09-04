# Arquitectura y Componentes - Storage Service

## Descripción General

El Storage Service está construido con NestJS y sigue una arquitectura hexagonal (Clean Architecture) con separación clara de responsabilidades. Utiliza MinIO para almacenamiento de archivos y PostgreSQL para metadatos.

## Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Microservice  │    │   MinIO         │    │   PostgreSQL    │
│   (NestJS)      │◄──►│   (Storage)     │    │   (Metadata)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Estructura de Directorios

```
src/
├── config/                    # Configuración del sistema
│   ├── envs/                 # Configuraciones por entorno
│   ├── validations/          # Validaciones de configuración
│   └── configuration.ts      # Carga de configuración
├── infrastructure/           # Capa de infraestructura
│   ├── adapters/            # Adaptadores externos
│   │   └── minio/          # Adaptador de MinIO
│   ├── dtos/               # DTOs de infraestructura
│   └── interceptors/       # Interceptores globales
├── modules/                 # Módulos de negocio
│   └── storage/            # Módulo principal de almacenamiento
│       ├── dtos/           # DTOs del módulo
│       ├── entities/       # Entidades de base de datos
│       ├── use-cases/      # Casos de uso
│       ├── storage.controller.ts
│       ├── storage.service.ts
│       └── storage.module.ts
└── main.ts                  # Punto de entrada
```

## Componentes Principales

### 1. Configuración (config/)

#### configuration.ts
- **Propósito:** Carga y fusiona configuraciones por entorno
- **Responsabilidades:**
  - Cargar configuración base
  - Aplicar configuración específica del entorno
  - Fusionar configuraciones
  - Aplicar variables de entorno como override

#### envs/
- **development.ts:** Configuración para desarrollo
- **local.ts:** Configuración para Docker local
- **prod.ts:** Configuración para producción
- **default.ts:** Configuración base compartida

#### validations/
- **joi.validation.ts:** Validación de configuración con Joi

### 2. Infraestructura (infrastructure/)

#### adapters/minio/
- **minio.adapter.ts:** Adaptador para MinIO
- **interfaces/storage.interface.ts:** Interfaz de almacenamiento
- **dtos/:** DTOs específicos de MinIO
- **helpers/:** Utilidades para MinIO

#### interceptors/
- **exception.interceptor.ts:** Manejo global de excepciones
- **response.interceptor.ts:** Formateo de respuestas

### 3. Módulo de Almacenamiento (modules/storage/)

#### storage.controller.ts
- **Propósito:** Controlador de microservicios
- **Responsabilidades:**
  - Manejar patrones de microservicios
  - Validar payloads
  - Delegar lógica al servicio

#### storage.service.ts
- **Propósito:** Servicio principal de almacenamiento
- **Responsabilidades:**
  - Orquestar casos de uso
  - Manejar transacciones
  - Gestionar logging

#### use-cases/
- **upload-file.use-case.ts:** Caso de uso para subir archivos
- **download-file.use-case.ts:** Caso de uso para descargar archivos
- **delete-file.use-case.ts:** Caso de uso para eliminar archivos
- **presigned-url-file.use-case.ts:** Caso de uso para URLs presignadas

#### entities/
- **storage.entity.ts:** Entidad de base de datos para metadatos

#### dtos/
- **upload-file.dto.ts:** DTO para subir archivos
- **download.dto.ts:** DTO para descargar archivos
- **delete.dto.ts:** DTO para eliminar archivos
- **presigned-url.dto.ts:** DTO para URLs presignadas

## Patrones de Diseño

### 1. Arquitectura Hexagonal
- **Puertos:** Interfaces que definen contratos
- **Adaptadores:** Implementaciones concretas
- **Casos de Uso:** Lógica de negocio pura

### 2. Repository Pattern
- **StorageRepository:** Acceso a datos de metadatos
- **MinioAdapter:** Acceso a datos de almacenamiento

### 3. Use Case Pattern
- **UploadFileUseCase:** Lógica para subir archivos
- **DownloadFileUseCase:** Lógica para descargar archivos
- **DeleteFileUseCase:** Lógica para eliminar archivos

### 4. Adapter Pattern
- **MinioAdapter:** Adaptador para MinIO
- **StorageInterface:** Interfaz común de almacenamiento

## Flujo de Datos

### Subida de Archivos
```
1. Cliente → storage_upload
2. Controller → validación de payload
3. Service → UploadFileUseCase
4. UseCase → MinioAdapter (subir archivo)
5. UseCase → StorageRepository (guardar metadatos)
6. UseCase → respuesta al cliente
```

### Descarga de Archivos
```
1. Cliente → storage_download
2. Controller → validación de payload
3. Service → DownloadFileUseCase
4. UseCase → StorageRepository (obtener metadatos)
5. UseCase → MinioAdapter (descargar archivo)
6. UseCase → respuesta al cliente
```

### Eliminación de Archivos
```
1. Cliente → storage_delete
2. Controller → validación de payload
3. Service → DeleteFileUseCase
4. UseCase → MinioAdapter (eliminar archivo)
5. UseCase → StorageRepository (marcar como eliminado)
6. UseCase → respuesta al cliente
```

## Dependencias Externas

### MinIO
- **Propósito:** Almacenamiento de archivos
- **Configuración:** Bucket, credenciales, endpoint
- **Operaciones:** Upload, download, delete, presigned URLs

### PostgreSQL
- **Propósito:** Metadatos de archivos
- **Configuración:** Host, puerto, base de datos, credenciales
- **Entidades:** Storage (metadatos de archivos)

## Manejo de Errores

### Tipos de Errores
1. **ValidationError:** Errores de validación de datos
2. **NotFoundException:** Recursos no encontrados
3. **InternalServerError:** Errores internos del servidor
4. **RpcException:** Errores específicos de microservicios

### Estrategia de Manejo
1. **Interceptores:** Manejo global de excepciones
2. **Logging:** Registro detallado de errores
3. **Respuestas:** Formato consistente de errores
4. **Rollback:** Transacciones atómicas

## Logging y Monitoreo

### Niveles de Logging
- **Debug:** Información detallada para desarrollo
- **Info:** Información general de operaciones
- **Warn:** Advertencias y situaciones inusuales
- **Error:** Errores que requieren atención

### Información Registrada
- **Operaciones:** Upload, download, delete
- **Metadatos:** Usuario, tenant, sesión, IP
- **Rendimiento:** Tiempos de operación
- **Errores:** Stack traces y contexto

## Consideraciones de Rendimiento

### Optimizaciones
1. **Streaming:** Uso de streams para archivos grandes
2. **Conexiones:** Pool de conexiones a base de datos
3. **Caching:** Cache de metadatos frecuentes
4. **Compresión:** Compresión de archivos cuando sea apropiado

### Escalabilidad
1. **Horizontal:** Múltiples instancias del microservicio
2. **Vertical:** Aumento de recursos por instancia
3. **Storage:** Distribución de archivos en múltiples buckets
4. **Database:** Replicación y sharding de metadatos
