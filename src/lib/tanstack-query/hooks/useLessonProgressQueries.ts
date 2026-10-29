import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/tanstack-query'
import { getLessonLearning } from '@/services/LessonProgress/getLessonLearning'
import { getCourseAccess } from '@/services/LessonProgress/getCourseAccess'
import { getProgressMap } from '@/services/LessonProgress/getProgressMap'
import { updateWatchTime } from '@/services/LessonProgress/updateWatchTime'

export const useLessonLearning = (lessonId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.lessonProgress.learning(lessonId),
    queryFn: () => getLessonLearning(lessonId),
    enabled: enabled && !!lessonId,
    staleTime: 1000 * 30, // 30s
    retry: false,
  })
}

export const useProgressMap = (enrollmentId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.lessonProgress.progressMap(enrollmentId),
    queryFn: () => getProgressMap(enrollmentId),
    enabled: enabled && !!enrollmentId,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

/** Server-computed unlock state of every lesson (sidebar). */
export const useCourseAccess = (courseId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.lessonProgress.access(courseId),
    queryFn: () => getCourseAccess(courseId),
    enabled: enabled && !!courseId,
    staleTime: 0,
    retry: false,
  })
}

export const useUpdateWatchTime = (
  lessonId: string,
  courseId: string,
  options?: {
    onUnlock?: (unlockedLessonId: string) => void
    onCourseComplete?: () => void
  },
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (watchedSeconds: number) => updateWatchTime(lessonId, watchedSeconds),
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonProgress.learning(lessonId),
      })
      if (data.enrollmentProgress !== null) {
        queryClient.setQueryData(
          queryKeys.enrollment.myEnrollment(courseId),
          (old: Record<string, unknown> | undefined) =>
            old ? { ...old, progress: data.enrollmentProgress } : old,
        )
        // Lesson just completed — refresh progressMap so sidebar shows tick + correct accessibility
        queryClient.invalidateQueries({ queryKey: queryKeys.lessonProgress.all })
        if (data.enrollmentProgress >= 100) {
          options?.onCourseComplete?.()
        }
      }
      if (data.unlockedLessonId) {
        options?.onUnlock?.(data.unlockedLessonId)
      }
    },
  })
}
