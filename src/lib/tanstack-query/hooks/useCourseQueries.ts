import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getCourse, getCourses } from '@/services/Course'
import { getCourseWithCurriculum } from '@/services/Course/curriculum'
import { type ListCourseInput, listCourses } from '@/services/Course/list'

// ── Legacy query keys ────────────────────────────────────────────────────────
const legacyKeys = {
  courses: {
    all: ['courses'],
    list: (params: Record<string, unknown>) => [...legacyKeys.courses.all, 'list', params],
    detail: (id: string) => [...legacyKeys.courses.all, 'detail', id],
  },
}

// ── New query keys ───────────────────────────────────────────────────────────
export const courseQueryKeys = {
  all: ['courses-api'] as const,
  lists: () => [...courseQueryKeys.all, 'list'] as const,
  list: (params: ListCourseInput) => [...courseQueryKeys.lists(), params] as const,
  curriculum: (id: string) => [...courseQueryKeys.all, 'curriculum', id] as const,
}

// ── Legacy hooks (kept for backward compat) ───────────────────────────────────
interface LegacyCourseParams extends Record<string, unknown> {
  page: number
  pageSize: number
}

export const useListCourse = (params: LegacyCourseParams) => {
  return useQuery({
    queryKey: legacyKeys.courses.list(params),
    queryFn: async () => {
      const response = await getCourses({
        page: params.page,
        pageSize: params.pageSize,
      })
      return response
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
    select: data => ({
      courses: data.items,
      pagination: data.pagination,
    }),
  })
}

export const useDetailCourse = (id: string) => {
  return useQuery({
    queryKey: legacyKeys.courses.detail(id),
    queryFn: async () => {
      const response = await getCourse(id)
      return response
    },
    staleTime: 1000 * 60 * 10,
    select: data => ({
      course: data.course,
      enrollment: data.enrollment,
      isPaid: data.isPaid,
      canAccess: data.canAccess,
    }),
  })
}

// ── New hooks (real BE API) ──────────────────────────────────────────────────

export const useListCourses = (params: ListCourseInput) => {
  return useQuery({
    queryKey: courseQueryKeys.list(params),
    queryFn: () => listCourses(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCourseWithCurriculum = (courseId: string) => {
  return useQuery({
    queryKey: courseQueryKeys.curriculum(courseId),
    queryFn: () => getCourseWithCurriculum(courseId),
    staleTime: 1000 * 60 * 5,
    enabled: !!courseId,
  })
}
