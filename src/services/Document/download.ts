import { AppConfig } from '@/constants/AppConfig'
import { unwrapSuccess } from '@/utils/apiResponse'

import { httpClient } from '../apiClient'

const DOCUMENT_LICENSE_ENDPOINT = '/document-license/download'

export interface GetDocumentDownloadInput {
  documentId: string
}

interface GetDocumentDownloadApiOutput {
  presignUrl: string
}

export interface GetDocumentDownloadOutput extends GetDocumentDownloadApiOutput {
  downloadUrl: string
}

const buildDownloadUrl = (presignUrl: string) => {
  if (presignUrl.startsWith('http://') || presignUrl.startsWith('https://')) {
    return presignUrl
  }

  const fileBaseUrl = AppConfig.API_FILE_URL.replace(/\/+$/, '')
  const normalizedPath = presignUrl.startsWith('/') ? presignUrl : `/${presignUrl}`
  return `${fileBaseUrl}${normalizedPath}`
}

export async function getDocumentDownloadUrl(
  input: GetDocumentDownloadInput,
): Promise<GetDocumentDownloadOutput> {
  const response = await httpClient.post<GetDocumentDownloadApiOutput>(
    `${DOCUMENT_LICENSE_ENDPOINT}/${input.documentId}`,
  )

  const data = unwrapSuccess(response)

  return {
    ...data,
    downloadUrl: buildDownloadUrl(data.presignUrl),
  }
}
