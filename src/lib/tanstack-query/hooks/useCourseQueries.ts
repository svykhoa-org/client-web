import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getCourse, getCourses } from '@/services/Course';

const queryKeys = {
  courses: {
    all: ['courses'],
    list: (params: Record<string, unknown>) => [...queryKeys.courses.all, 'list', params],
    detail: (id: string) => [...queryKeys.courses.all, 'detail', id],
  },
};

interface CourseParams extends Record<string, unknown> {
  page: number;
  pageSize: number;
}

export const useListCourse = (params: CourseParams) => {
  return useQuery({
    queryKey: queryKeys.courses.list(params),

    queryFn: async () => {
      const response = await getCourses({
        page: params.page,
        pageSize: params.pageSize,
      });
      return response;
    },

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 10, // 5 phút

    select: data => ({
      courses: data.items,
      pagination: data.pagination,
    }),
  });
};

export const useDetailCourse = (id: string) => {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),

    queryFn: async () => {
      const response = await getCourse(id);
      return response;
    },

    staleTime: 1000 * 60 * 10, // 10 phút

    select: data => ({
      course: data.course,
      enrollment: data.enrollment,
      isPaid: data.isPaid,
      canAccess: data.canAccess,
    }),
  });
};
