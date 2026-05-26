import type { QuizAttemptApi } from '@/types/course-api'
import { httpClient } from '../apiClient'

export async function getMyAttempts(quizId: string): Promise<QuizAttemptApi[]> {
  const response = await httpClient.get<QuizAttemptApi[]>(`/quizzes/${quizId}/my-attempts`)
  return response.data as QuizAttemptApi[]
}
