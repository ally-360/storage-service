import { FileMetadata } from './file-metadata.dto';

export interface DownloadResult {
  success: boolean;
  data: Buffer;
  metadata: FileMetadata;
  stream?: any;
}
