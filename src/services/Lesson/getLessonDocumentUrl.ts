import { httpClient } from '../apiClient'

export interface LessonDocumentUrlResponse {
  documentUrl: string
  expiresAt: string
}

export async function getLessonDocumentUrl(lessonId: string): Promise<LessonDocumentUrlResponse> {
  const response = await httpClient.get<LessonDocumentUrlResponse>(
    `/lessons/${lessonId}/document-url`,
  )
  return response.data as LessonDocumentUrlResponse
}
