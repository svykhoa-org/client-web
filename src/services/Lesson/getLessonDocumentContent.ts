import type { Document } from '@/models/Document'

import { httpClient } from '../apiClient'

export async function getLessonDocumentContent(lessonId: string): Promise<Document> {
  const response = await httpClient.get<Document>(`/lessons/${lessonId}/document-content`)
  return response.data as Document
}
