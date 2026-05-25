import type { WatchTimeResponse } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function updateWatchTime(
  lessonId: string,
  watchedSeconds: number,
): Promise<WatchTimeResponse> {
  const response = await httpClient.patch<WatchTimeResponse>(
    `/lesson-progress/${lessonId}/watch-time`,
    { watchedSeconds },
  )
  return response.data as WatchTimeResponse
}
