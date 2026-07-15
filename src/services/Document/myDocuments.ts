import type { Document } from '@/models/Document'
import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'

const DOCUMENT_LICENSE_ENDPOINT = '/document-license/my-documents'

export interface PurchasedDocument {
  licenseId: string
  purchasedAt: string
  downloadCount: number
  document: Document
}

export type ListMyDocumentsOutput = PurchasedDocument[]

export async function listMyDocuments(): Promise<ListMyDocumentsOutput> {
  const response = await httpClient.get<ListMyDocumentsOutput>(DOCUMENT_LICENSE_ENDPOINT)

  return unwrapSuccess(response)
}
