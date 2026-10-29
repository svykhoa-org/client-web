import { Skeleton } from 'antd'

import {
  useMyAttempts,
  useQuizDetail,
  useStartQuiz,
  useSubmitQuiz,
} from '@/lib/tanstack-query/hooks/useQuizQueries'
import { useLessonLearning } from '@/lib/tanstack-query/hooks/useLessonProgressQueries'
import type { SubmitQuizPayload } from '@/types/course-api'

import { LockedLessonNotice } from '../LockedLessonNotice'

import { QuizIntro } from './QuizIntro'
import { QuizResult } from './QuizResult'
import { QuizTaking } from './QuizTaking'

interface QuizPlayerProps {
  quizId: string
  courseId: string
  lessonId: string
  onCourseComplete?: () => void
}

export const QuizPlayer = ({ quizId, courseId, lessonId, onCourseComplete }: QuizPlayerProps) => {
  const { data: lessonData, isLoading: isLessonLoading } = useLessonLearning(lessonId)
  const { data: quiz, isLoading: isQuizLoading } = useQuizDetail(quizId)
  const { data: attempts = [], isLoading: isAttemptsLoading } = useMyAttempts(quizId)

  const startMutation = useStartQuiz(quizId, courseId)
  const submitMutation = useSubmitQuiz(quizId, lessonId, courseId, { onCourseComplete })

  if (isLessonLoading || isQuizLoading || isAttemptsLoading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    )
  }

  if (!lessonData?.isAccessible) {
    return (
      <LockedLessonNotice
        courseId={courseId}
        prerequisite={lessonData?.prerequisite ?? null}
        className="flex h-64 flex-col items-center justify-center gap-3 text-neutral-8"
      />
    )
  }

  if (!quiz) return null

  const inProgressAttempt = attempts.find(a => a.status === 'in_progress')
  const submittedAttempts = attempts.filter(a => a.status === 'submitted')
  const lastSubmitted = submittedAttempts[submittedAttempts.length - 1]

  const attemptsUsed = submittedAttempts.length
  const canRetry = quiz.maxAttempts === null || attemptsUsed < quiz.maxAttempts

  // Active (in-progress) attempt → taking view
  if (inProgressAttempt) {
    const handleSubmit = (payload: SubmitQuizPayload) => {
      submitMutation.mutate({ attemptId: inProgressAttempt.id, payload })
    }
    return (
      <QuizTaking
        quiz={quiz}
        attempt={inProgressAttempt}
        onSubmit={handleSubmit}
        isSubmitting={submitMutation.isPending}
      />
    )
  }

  // Has a submitted attempt → result view (with retry option)
  if (lastSubmitted) {
    const handleRetry = () => startMutation.mutate()
    return (
      <QuizResult
        quiz={quiz}
        attempt={lastSubmitted}
        canRetry={canRetry}
        onRetry={handleRetry}
        isRetrying={startMutation.isPending}
      />
    )
  }

  // No attempt yet → intro view
  return (
    <QuizIntro
      quiz={quiz}
      submittedAttempts={submittedAttempts}
      onStart={() => startMutation.mutate()}
      isStarting={startMutation.isPending}
    />
  )
}
