// src/lib/tanstack-query/hooks/useEnrollmentQueries.ts
import { useQuery } from '@tanstack/react-query'

import { getAccessToken } from '@/lib/axios'
import { getMyEnrollment } from '@/services/enrollment/getMyEnrollment'
import { getMyCourses } from '@/services/enrollment'

const queryKeys = {
  enrollment: {
    all: ['enrollment'],
    myCourses: () => [...queryKeys.enrollment.all, 'my-courses'],
    myEnrollment: (courseId: string) => [...queryKeys.enrollment.all, 'my-enrollment', courseId],
  },
}

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
