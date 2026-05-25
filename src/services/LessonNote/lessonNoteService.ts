import type { LessonNoteApi } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function getLessonNotes(lessonId: string): Promise<LessonNoteApi[]> {
  const response = await httpClient.get<LessonNoteApi[]>('/lesson-notes', { lessonId })
  return (response.data as LessonNoteApi[]) ?? []
}

export async function appendLessonNote(
  lessonId: string,
  timestampSeconds: number | null,
  content: string,
): Promise<LessonNoteApi> {
  const response = await httpClient.post<LessonNoteApi>('/lesson-notes', {
    lessonId,
    timestampSeconds,
    content,
  })
  return response.data as LessonNoteApi
}

export async function updateLessonNoteItem(
  noteId: string,
  itemIndex: number,
  content: string,
): Promise<LessonNoteApi> {
  const response = await httpClient.patch<LessonNoteApi>(
    `/lesson-notes/${noteId}/items/${itemIndex}`,
    { content },
  )
  return response.data as LessonNoteApi
}

export async function removeLessonNoteItem(
  noteId: string,
  itemIndex: number,
): Promise<LessonNoteApi | null> {
  const response = await httpClient.delete<LessonNoteApi | null>(
    `/lesson-notes/${noteId}/items/${itemIndex}`,
  )
  return response.data as LessonNoteApi | null
}
