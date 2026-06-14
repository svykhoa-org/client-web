import type { Document } from '@/models/Document'
import { listCourses } from '@/services/Course/list'
import { listDocument } from '@/services/Document/list'
import type { CourseApiItem } from '@/types/course-api'

/**
 * Related resources shown alongside an AI search answer.
 *
 * The fulltext search API is not ready yet, so these helpers reuse the existing
 * list endpoints as a stand-in and trim the result to a handful of items.
 */

const RELATED_LIMIT = 3

export async function fetchRelatedCourses(_query: string): Promise<CourseApiItem[]> {
  // TODO: Replace with Fulltext Search API when ready.
  const { items } = await listCourses({ page: 1, limit: 6, sortCreatedAt: 'DESC' })
  return items.slice(0, RELATED_LIMIT)
}

export async function fetchRelatedDocuments(_query: string): Promise<Document[]> {
  // TODO: Replace with Fulltext Search API when ready.
  const { items } = await listDocument({ page: 1, pageSize: 6 })
  return items.slice(0, RELATED_LIMIT)
}
