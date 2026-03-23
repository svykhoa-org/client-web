import type { BaseModel } from '@/shared/interface/BaseModel'
import type { Document } from './Document'
import type { User } from './User'
import type { DocumentOrder } from './DocumentOrder'

export enum DocumentLicenseStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
}

export interface DocumentLicense extends BaseModel {
  userId: string
  user?: User
  documentId: string
  document?: Document
  documentOrderId: string
  documentOrder?: DocumentOrder
  status: DocumentLicenseStatus
  revokedAt: number | null // timestamp
  revokedBy: string | null
  revokeReason: string | null
}
