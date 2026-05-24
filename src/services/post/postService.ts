import type { SuccessResponse } from '@/common/interface/ServiceResponse'
import type { Post } from '@/models/Post'

import { httpClient } from '../apiClient'

export const getPostById = async (id: string): Promise<SuccessResponse<Post>> => {
  return await httpClient.get<Post>(`/posts/${id}`)
}

export const createPost = async (
  postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<SuccessResponse<Post>> => {
  return await httpClient.post<Post>('/posts', postData)
}

export const updatePost = async (
  id: string,
  postData: Partial<Post>,
): Promise<SuccessResponse<Post>> => {
  return await httpClient.put<Post>(`/posts/${id}`, postData)
}

export const deletePost = async (id: string): Promise<SuccessResponse<null>> => {
  return await httpClient.delete<null>(`/posts/${id}`)
}
