import type { CourseApiItem, CoursePaginationMeta } from '@/types/course-api'

import { httpClient } from '../apiClient'

const COURSE_ENDPOINT = '/courses'

export interface ListCourseInput {
  page?: number
  limit?: number
  title?: string
  sortPrice?: 'ASC' | 'DESC'
  sortCreatedAt?: 'ASC' | 'DESC'
}

export interface ListCourseOutput {
  items: CourseApiItem[]
  pagination: CoursePaginationMeta
}

export async function listCourses(input: ListCourseInput = {}): Promise<ListCourseOutput> {
  const params: Record<string, string | number> = {
    page: input.page ?? 1,
    limit: input.limit ?? 12,
  }

  if (input.title?.trim()) {
    params['filter[title]'] = input.title.trim()
  }

  if (input.sortPrice) {
    params['sort[price]'] = input.sortPrice
  }

  params['sort[createdAt]'] = input.sortCreatedAt ?? 'DESC'

  const response = await httpClient.get<ListCourseOutput>(COURSE_ENDPOINT, params)

  return response.data as ListCourseOutput
}
