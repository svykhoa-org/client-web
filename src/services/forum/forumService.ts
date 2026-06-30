import type { SuccessResponse, ListResponseDataV2 } from '@/common/interface/ServiceResponse'
import type { ForumCategoryGroup, ForumThread, ThreadSortOption } from '@/models/Forum'
import { httpClient } from '../apiClient'

export const getForumHomepage = async (): Promise<ForumCategoryGroup[]> => {
  const res = await httpClient.get<ForumCategoryGroup[]>('/forum/categories')
  return (res as SuccessResponse<ForumCategoryGroup[]>).data as ForumCategoryGroup[]
}

export const getThreadsBySubCategory = async (
  subCategoryId: string,
  params?: {
    page?: number
    limit?: number
    sort?: ThreadSortOption
    prefixTagId?: string
  },
): Promise<ListResponseDataV2<ForumThread>> => {
  const res = await httpClient.get<ListResponseDataV2<ForumThread>>(
    `/forum/sub-categories/${subCategoryId}/threads`,
    params,
  )
  return (res as SuccessResponse<ListResponseDataV2<ForumThread>>)
    .data as ListResponseDataV2<ForumThread>
}
