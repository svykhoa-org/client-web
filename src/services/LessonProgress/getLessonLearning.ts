import type { LessonLearningResponse } from '@/types/course-api'

import { httpClient } from '../apiClient'

export async function getLessonLearning(lessonId: string): Promise<LessonLearningResponse> {
  const response = await httpClient.get<LessonLearningResponse>(
    `/lesson-progress/lessons/${lessonId}`,
  )
  return response.data as LessonLearningResponse
}
