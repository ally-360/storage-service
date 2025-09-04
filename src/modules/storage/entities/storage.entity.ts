import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StorageAction {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  DELETE = 'delete',
  UPDATE = 'update',
  MOVE = 'move',
  COPY = 'copy',
}

export enum StorageStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
  PROCESSING = 'processing',
}

@Entity('storage')
export class Storage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  filename: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  originalFilename: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimetype: string;

  @Column({ type: 'bigint', nullable: false })
  size: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  filePath: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bucket: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  key: string;

  @Column({ type: 'enum', enum: StorageAction, nullable: false })
  action: StorageAction;

  @Column({ type: 'enum', enum: StorageStatus, default: StorageStatus.ACTIVE })
  status: StorageStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tenantId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sessionId: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'varchar', length: 500, nullable: true })
  errorMessage: string;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'timestamp', nullable: true })
  downloadedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
