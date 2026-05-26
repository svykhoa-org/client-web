import type { LessonProgressApi } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function getProgressMap(enrollmentId: string): Promise<LessonProgressApi[]> {
  const response = await httpClient.get<LessonProgressApi[]>(
    `/lesson-progress/enrollment/${enrollmentId}`,
  )
  return (response.data as LessonProgressApi[]) ?? []
}
