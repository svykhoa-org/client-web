import type { QuizSubmitResult, SubmitQuizPayload } from '@/types/course-api'
import { httpClient } from '../apiClient'

export async function submitQuiz(
  quizId: string,
  attemptId: string,
  payload: SubmitQuizPayload,
): Promise<QuizSubmitResult> {
  const response = await httpClient.post<QuizSubmitResult>(
    `/quizzes/${quizId}/attempts/${attemptId}/submit`,
    payload,
  )
  return response.data as QuizSubmitResult
}
