import axiosInstance from '@/lib/axios'
import type { Document } from '@/models/Document'
import type { ApiDetailResponse } from '@/shared/types/api'
import { unwrapDetail } from '@/utils/apiResponse'

const DOCUMENT_LICENSE_ENDPOINT = '/document-license/my-documents'

export interface PurchasedDocument {
  licenseId: string
  purchasedAt: string
  downloadCount: number
  document: Document
}

export type ListMyDocumentsOutput = PurchasedDocument[]

export async function listMyDocuments(): Promise<ListMyDocumentsOutput> {
  const response =
    await axiosInstance.get<ApiDetailResponse<ListMyDocumentsOutput>>(DOCUMENT_LICENSE_ENDPOINT)

  return unwrapDetail(response.data)
}
