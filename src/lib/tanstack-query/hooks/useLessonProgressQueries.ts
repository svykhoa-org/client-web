import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/tanstack-query'
import { getLessonLearning } from '@/services/LessonProgress/getLessonLearning'
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

export const useUpdateWatchTime = (lessonId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (watchedSeconds: number) => updateWatchTime(lessonId, watchedSeconds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonProgress.learning(lessonId),
      })
    },
  })
}
