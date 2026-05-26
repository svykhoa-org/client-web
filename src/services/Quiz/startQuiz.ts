import type { StartQuizResult } from '@/types/course-api'
import { httpClient } from '../apiClient'

export async function startQuiz(quizId: string, courseId: string): Promise<StartQuizResult> {
  const response = await httpClient.post<StartQuizResult>(
    `/quizzes/${quizId}/start?courseId=${courseId}`,
  )
  return response.data as StartQuizResult
}
