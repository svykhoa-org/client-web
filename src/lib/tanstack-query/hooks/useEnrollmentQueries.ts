// src/lib/tanstack-query/hooks/useEnrollmentQueries.ts
import { useQuery } from '@tanstack/react-query'

import { getAccessToken } from '@/lib/axios'
import { queryKeys } from '@/lib/tanstack-query'
import { getMyEnrollment } from '@/services/enrollment/getMyEnrollment'
import { getMyCourses } from '@/services/enrollment'

export const useMyCourses = () => {
  return useQuery({
    queryKey: queryKeys.enrollment.myCourses(),
    queryFn: getMyCourses,
  })
}

export const useMyEnrollment = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.enrollment.myEnrollment(courseId),
    queryFn: () => getMyEnrollment(courseId),
    enabled: !!courseId && !!getAccessToken(),
    staleTime: 1000 * 60 * 2,
    retry: false,
  })
}
