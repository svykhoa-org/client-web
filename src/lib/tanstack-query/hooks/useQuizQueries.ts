import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/tanstack-query/queries/queryKeys'
import { getMyAttempts } from '@/services/Quiz/getMyAttempts'
import { getQuizDetail } from '@/services/Quiz/getQuizDetail'
import { startQuiz } from '@/services/Quiz/startQuiz'
import { submitQuiz } from '@/services/Quiz/submitQuiz'
import type { SubmitQuizPayload } from '@/types/course-api'

export const useQuizDetail = (quizId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.quiz.detail(quizId),
    queryFn: () => getQuizDetail(quizId),
    enabled: enabled && !!quizId,
    staleTime: 1000 * 60 * 10,
  })
}

export const useMyAttempts = (quizId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.quiz.attempts(quizId),
    queryFn: () => getMyAttempts(quizId),
    enabled: enabled && !!quizId,
    staleTime: 0,
  })
}

export const useStartQuiz = (quizId: string, courseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => startQuiz(quizId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.attempts(quizId) })
    },
  })
}

export const useSubmitQuiz = (
  quizId: string,
  lessonId: string,
  courseId: string,
  options?: { onCourseComplete?: () => void },
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ attemptId, payload }: { attemptId: string; payload: SubmitQuizPayload }) =>
      submitQuiz(quizId, attemptId, payload),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.attempts(quizId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonProgress.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonProgress.learning(lessonId),
      })
      if (data.isPassed) {
        if (data.enrollmentProgress !== null) {
          queryClient.setQueryData(
            queryKeys.enrollment.myEnrollment(courseId),
            (old: Record<string, unknown> | undefined) =>
              old ? { ...old, progress: data.enrollmentProgress } : old,
          )
          if (data.enrollmentProgress >= 100) {
            options?.onCourseComplete?.()
          }
        } else {
          queryClient.invalidateQueries({
            queryKey: queryKeys.enrollment.myEnrollment(courseId),
          })
        }
      }
    },
  })
}
