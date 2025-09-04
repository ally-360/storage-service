# Contratos de API - Storage Service

## Descripción General

El Storage Service es un microservicio que maneja operaciones de almacenamiento de archivos utilizando MinIO como backend de almacenamiento y PostgreSQL para metadatos. Se comunica mediante patrones de microservicios usando TCP.

## Patrones de Comunicación

### 1. storage_find_one
**Descripción:** Obtiene un registro de almacenamiento por ID

**Payload:**
```typescript
{
  id: number // ID del registro de almacenamiento
}
```

**Respuesta:**
```typescript
{
  id: number;
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  filePath: string;
  bucket: string;
  key: string;
  action: StorageAction;
  status: StorageStatus;
  tenantId: string;
  userId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
  errorMessage: string;
  isPublic: boolean;
  downloadedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
```

**Errores:**
- `404`: Registro no encontrado

---

### 2. storage_upload
**Descripción:** Sube un archivo al sistema de almacenamiento

**Payload:**
```typescript
{
  filename: string;        // Nombre del archivo
  file: Buffer;           // Contenido del archivo
  mimetype?: string;      // Tipo MIME (opcional)
  size?: number;          // Tamaño del archivo (opcional)
  tenantId: string;       // ID del tenant
  userId: string;         // ID del usuario
  sessionId: string;      // ID de sesión
  ipAddress: string;      // Dirección IP
  userAgent: string;      // User Agent
}
```

**Respuesta:**
```typescript
{
  success: boolean;
  bucket: string;
  key: string;
  etag: string;
  metadata: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    bucket: string;
    key: string;
    etag: string;
  };
}
```

---

### 3. storage_download
**Descripción:** Descarga un archivo del sistema de almacenamiento

**Payload:**
```typescript
{
  key: string;            // Clave del archivo en el bucket
  bucket?: string;        // Nombre del bucket (opcional)
  versionId?: string;     // ID de versión (opcional)
  tenantId: string;       // ID del tenant
  userId: string;         // ID del usuario
  sessionId: string;      // ID de sesión
  ipAddress: string;      // Dirección IP
  userAgent: string;      // User Agent
}
```

**Respuesta:**
```typescript
{
  success: boolean;
  data: Buffer;           // Contenido del archivo
  metadata: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    bucket: string;
    key: string;
    etag: string;
    versionId?: string;
  };
  stream: ReadableStream;
}
```

**Errores:**
- `404`: Archivo no encontrado

---

### 4. storage_delete
**Descripción:** Elimina un archivo del sistema de almacenamiento

**Payload:**
```typescript
{
  key: string;            // Clave del archivo en el bucket
  bucket?: string;        // Nombre del bucket (opcional)
  versionId?: string;     // ID de versión (opcional)
  tenantId: string;       // ID del tenant
  userId: string;         // ID del usuario
  sessionId: string;      // ID de sesión
  ipAddress: string;      // Dirección IP
  userAgent: string;      // User Agent
}
```

**Respuesta:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

## Enums

### StorageAction
```typescript
enum StorageAction {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  DELETE = 'delete',
  UPDATE = 'update',
  MOVE = 'move',
  COPY = 'copy'
}
```

### StorageStatus
```typescript
enum StorageStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
  PROCESSING = 'processing'
}
```

## Consideraciones de Implementación

1. **Autenticación:** Todos los endpoints requieren información de tenant, usuario y sesión
2. **Logging:** Todas las operaciones se registran con metadatos de auditoría
3. **Validación:** Los payloads se validan usando class-validator
4. **Manejo de Errores:** Se utilizan RpcException para errores específicos del microservicio
5. **Transacciones:** Las operaciones de base de datos y almacenamiento se manejan de forma atómica
