import type { Document } from '@/models/Document'
import type { ApiListData } from '@/shared/types/api'
import { unwrapSuccess } from '@/utils/apiResponse'
import { buildQuery, type QueryInput } from '@/utils/buildQuery'

import { httpClient } from '../apiClient'

const DOCUMENT_ENDPOINT = '/documents'

// `releaseYear`/`releaseYearBefore` are pseudo-fields the server intercepts and
// translates to EXTRACT(YEAR FROM created_at) IN / < (see document.controller).
type DocumentSearchFields =
  | 'title'
  | 'slug'
  | 'status'
  | 'categoryId'
  | 'price'
  | 'totalPages'
  | 'releaseYear'
  | 'releaseYearBefore'
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
