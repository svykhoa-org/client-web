import axiosInstance from '@/lib/axios'
import { AppConfig } from '@/constants/AppConfig'
import type { ApiDetailResponse } from '@/shared/types/api'
import { unwrapDetail } from '@/utils/apiResponse'

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
  const response = await axiosInstance.post<ApiDetailResponse<GetDocumentDownloadApiOutput>>(
    `${DOCUMENT_LICENSE_ENDPOINT}/${input.documentId}`,
  )

  const data = unwrapDetail(response.data)

  return {
    ...data,
    downloadUrl: buildDownloadUrl(data.presignUrl),
  }
}
