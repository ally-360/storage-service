import { Injectable } from '@nestjs/common';
import { UploadFileUseCase } from '../use-cases/upload-file.use-case';
import { DownloadFileUseCase } from '../use-cases/download-file.use-case';
import { PresignedUrlFileUseCase } from '../use-cases/presigned-url-file.use-case';
import { DeleteFileUseCase } from '../use-cases/delete-file.use-case';

export enum UseCaseType {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  PRESIGNED_URL = 'presignedUrl',
  DELETE = 'delete',
}

@Injectable()
export class UseCaseFactory {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly downloadFileUseCase: DownloadFileUseCase,
    private readonly presignedUrlFileUseCase: PresignedUrlFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) {}

  getUploadUseCase(): UploadFileUseCase {
    return this.uploadFileUseCase;
  }

  getDownloadUseCase(): DownloadFileUseCase {
    return this.downloadFileUseCase;
  }

  getPresignedUrlUseCase(): PresignedUrlFileUseCase {
    return this.presignedUrlFileUseCase;
  }

  getDeleteUseCase(): DeleteFileUseCase {
    return this.deleteFileUseCase;
  }
}
