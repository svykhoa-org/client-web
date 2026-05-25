import type { LessonProgressApi } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function updateWatchTime(
  lessonId: string,
  watchedSeconds: number,
): Promise<LessonProgressApi> {
  const response = await httpClient.patch<LessonProgressApi>(
    `/lesson-progress/${lessonId}/watch-time`,
    { watchedSeconds },
  )
  return response.data as LessonProgressApi
}
