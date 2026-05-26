import type { QuizApi } from '@/types/course-api'
import { httpClient } from '../apiClient'

export async function getQuizDetail(quizId: string): Promise<QuizApi> {
  const response = await httpClient.get<QuizApi>(`/quizzes/${quizId}/take`)
  return response.data as QuizApi
}
