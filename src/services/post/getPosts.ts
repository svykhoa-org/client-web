import type { ListResponseData, SuccessResponse } from '@/common/interface/ServiceResponse'
import type { Post } from '@/models/Post'

import { httpClient } from '../apiClient'

export interface GetPostsParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  author?: string
}

// Use the new ListResponseData format
export type GetPostsResponse = ListResponseData<Post>

export const getPosts = async (
  params: GetPostsParams = {},
): Promise<SuccessResponse<GetPostsResponse>> => {
  const { page = 1, limit = 10, ...filters } = params

  const queryParams = {
    page,
    limit,
    ...filters,
  }

  return await httpClient.get<GetPostsResponse>('/posts', queryParams)
}
