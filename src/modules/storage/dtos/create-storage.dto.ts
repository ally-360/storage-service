import { StorageAction, StorageStatus } from '../entities/storage.entity';

export class CreateStorageDto {
  filename: string;
  originalFilename?: string;
  mimetype?: string;
  size: number;
  filePath?: string;
  bucket?: string;
  key?: string;
  action: StorageAction;
  status?: StorageStatus;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  isPublic?: boolean;
  expiresAt?: Date;
}
