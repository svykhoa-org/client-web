import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/tanstack-query';
import { type GetLessonDetailResponse, getLessonDetail } from '@/services/Lesson/getLessonDetail';

interface UseLessonDetailParams {
  courseId: string;
  lessonId: string;
  enabled?: boolean;
}

export const useLessonDetail = ({ courseId, lessonId, enabled = true }: UseLessonDetailParams) => {
  return useQuery({
    queryKey: queryKeys.lessons.detail(courseId, lessonId),
    queryFn: async () => {
      const response = await getLessonDetail({ courseId, lessonId });
      return response.data as GetLessonDetailResponse;
    },
    enabled: enabled && !!courseId && !!lessonId,
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
};
