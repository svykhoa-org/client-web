import type { BaseModel } from './BaseModel';

export interface AttachmentMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
}

export interface Attachment extends BaseModel {
  postId: string;
  uploadedBy: string;
  metadata: AttachmentMetadata;
}
