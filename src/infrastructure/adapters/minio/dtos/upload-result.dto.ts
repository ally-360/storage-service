import { FileMetadata } from './file-metadata.dto';

export interface UploadResult {
  success: boolean;
  bucket: string;
  key: string;
  etag: string;
  versionId?: string;
  url?: string;
  metadata: FileMetadata;
}
