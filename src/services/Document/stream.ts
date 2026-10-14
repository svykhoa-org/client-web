import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'

const DOCUMENT_ENDPOINT = '/documents'

export interface GetDocumentStreamInput {
  documentId: string
}

export interface DocumentStreamWatermark {
  fullName: string
  email: string
  code: string
}

export interface GetDocumentStreamOutput {
  streamUrl: string
  expiresAt: string
  watermark: DocumentStreamWatermark
}

export async function getDocumentStream(
  input: GetDocumentStreamInput,
): Promise<GetDocumentStreamOutput> {
  const response = await httpClient.get<GetDocumentStreamOutput>(
    `${DOCUMENT_ENDPOINT}/${input.documentId}/stream`,
  )

  return unwrapSuccess(response)
}
