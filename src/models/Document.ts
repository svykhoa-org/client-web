import type { BaseModel } from '@/shared/interface/BaseModel';

import type { DocumentClassify } from './DocumentClassify';

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface Document extends BaseModel {
  title: string;
  description: string;
  slug: string;
  price: number;

  // FIXME: Cần thay đổi để trả về id & FileResource thay vì url
  thumbnailUrl: string;
  // FIXME: Cần thay đổi để trả về id & FileResource thay vì url
  previewUrl: string;

  categoryId: string;
  category?: DocumentClassify;
  totalPages: number;
  fileSize: number;
  status: DocumentStatus;
}
