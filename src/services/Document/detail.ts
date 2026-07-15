import type { Document } from '@/models/Document'
import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'

const DOCUMENT_ENDPOINT = '/documents'

export interface GetDocumentDetailInput {
  id: string
}

export type GetDocumentDetailOutput = Document

export async function getDocumentDetail(
  input: GetDocumentDetailInput,
): Promise<GetDocumentDetailOutput> {
  const response = await httpClient.get<GetDocumentDetailOutput>(`${DOCUMENT_ENDPOINT}/${input.id}`)

  return unwrapSuccess(response)
}
