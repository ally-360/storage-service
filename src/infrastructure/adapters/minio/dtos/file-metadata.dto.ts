export interface FileMetadata {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  etag?: string;
  versionId?: string;
}
