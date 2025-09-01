export interface FileVersion {
  versionId: string;
  isLatest: boolean;
  lastModified: Date;
  size: number;
  etag: string;
}
