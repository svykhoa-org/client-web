import type { BaseModel } from '@/shared/interface/BaseModel'

import type { DocumentClassify } from './DocumentClassify'
import type { FileResource } from './FileResource'
import type { DocumentLicense } from './DocumentLicense'

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum DocumentKind {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
}

export interface Document extends BaseModel {
  // Older API responses may omit it; treat undefined as PDF.
  kind?: DocumentKind
  durationMinutes?: number | null
  title: string
  description?: string | null
  slug: string
  price: number
  thumbnailId?: string | null
  thumbnail?: FileResource | null
  previewId?: string | null
  preview?: FileResource | null
  fileId?: string | null
  file?: FileResource | null
  categoryId?: string | null
  category?: Omit<DocumentClassify, 'parent' | 'parentId'> | null
  totalPages?: number | null
  fileSize?: number | null
  status: DocumentStatus
  license: DocumentLicense | null
}
