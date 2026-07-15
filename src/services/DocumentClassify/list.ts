import type { DocumentClassify } from '@/models/DocumentClassify'
import type { ApiListData } from '@/shared/types/api'
import { unwrapSuccess } from '@/utils/apiResponse'
import { buildQuery, type QueryInput } from '@/utils/buildQuery'

import { httpClient } from '../apiClient'

const DOCUMENT_CLASSIFY_ENDPOINT = '/document-classify'

type DocumentClassifySearchFields = 'name' | 'parentId'
type DocumentClassifySortFields = 'name' | 'createdAt' | 'updatedAt'

export type ListDocumentClassifyInput = QueryInput<
  DocumentClassifySearchFields,
  DocumentClassifySortFields
>

export type ListDocumentClassifyOutput = ApiListData<DocumentClassify>

export async function listDocumentClassify(
  input?: ListDocumentClassifyInput,
): Promise<ListDocumentClassifyOutput> {
  const response = await httpClient.get<ApiListData<DocumentClassify>>(
    DOCUMENT_CLASSIFY_ENDPOINT,
    input ? buildQuery(input) : undefined,
  )

  return unwrapSuccess(response)
}
