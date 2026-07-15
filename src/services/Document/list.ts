import type { Document } from '@/models/Document'
import type { ApiListData } from '@/shared/types/api'
import { unwrapSuccess } from '@/utils/apiResponse'
import { buildQuery, type QueryInput } from '@/utils/buildQuery'

import { httpClient } from '../apiClient'

const DOCUMENT_ENDPOINT = '/documents'

type DocumentSearchFields = 'title' | 'slug' | 'status' | 'categoryId'
type DocumentSortFields = 'title' | 'price' | 'createdAt' | 'updatedAt'

export type ListDocumentInput = QueryInput<DocumentSearchFields, DocumentSortFields>
export type ListDocumentOutput = ApiListData<Document>

export async function listDocument(input?: ListDocumentInput): Promise<ListDocumentOutput> {
  const response = await httpClient.get<ApiListData<Document>>(
    DOCUMENT_ENDPOINT,
    input ? buildQuery(input) : undefined,
  )

  return unwrapSuccess(response)
}
