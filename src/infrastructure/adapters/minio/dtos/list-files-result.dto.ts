import { FileMetadata } from './file-metadata.dto';

export interface ListFilesResult {
  files: FileMetadata[];
  nextContinuationToken?: string;
  isTruncated: boolean;
}
