import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/tanstack-query'
import { getLessonDocumentContent } from '@/services/Lesson/getLessonDocumentContent'
import { getLessonDocumentUrl } from '@/services/Lesson/getLessonDocumentUrl'
import { type GetLessonDetailResponse, getLessonDetail } from '@/services/Lesson/getLessonDetail'

interface UseLessonDetailParams {
  courseId: string
  lessonId: string
  enabled?: boolean
}

export const useLessonDetail = ({ courseId, lessonId, enabled = true }: UseLessonDetailParams) => {
  return useQuery({
    queryKey: queryKeys.lessons.detail(courseId, lessonId),
    queryFn: async () => {
      const response = await getLessonDetail({ courseId, lessonId })
      return response.data as GetLessonDetailResponse
    },
    enabled: enabled && !!courseId && !!lessonId,
    staleTime: 1000 * 60 * 10,
  })
}

export const useLessonDocumentContent = (lessonId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.lessons.documentContent(lessonId),
    queryFn: () => getLessonDocumentContent(lessonId),
    enabled: enabled && !!lessonId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useLessonDocumentUrl = (lessonId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.lessons.documentUrl(lessonId),
    queryFn: () => getLessonDocumentUrl(lessonId),
    enabled: enabled && !!lessonId,
    staleTime: 1000 * 60 * 10, // 10 min — well within 15 min TTL
    retry: false,
  })
}
