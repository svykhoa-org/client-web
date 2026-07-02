import type { SuccessResponse, ListResponseDataV2 } from '@/common/interface/ServiceResponse'
import type {
  ForumCategoryGroup,
  ForumComment,
  ForumSubCategory,
  ForumThread,
  ThreadSortOption,
} from '@/models/Forum'
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

export const getThreadById = async (id: string): Promise<ForumThread> => {
  const res = await httpClient.get<ForumThread>(`/forum/threads/${id}`)
  return (res as SuccessResponse<ForumThread>).data as ForumThread
}

export const getSubCategoryById = async (id: string): Promise<ForumSubCategory> => {
  const res = await httpClient.get<ForumSubCategory>(`/forum/sub-categories/${id}`)
  return (res as SuccessResponse<ForumSubCategory>).data as ForumSubCategory
}

export const createThread = async (data: {
  subCategoryId: string
  title: string
  content: string
  prefixTagId?: string
}): Promise<ForumThread> => {
  const res = await httpClient.post<ForumThread>('/forum/threads', data)
  return (res as SuccessResponse<ForumThread>).data as ForumThread
}

// Comments come back as a flat array (not paginated) from the backend.
export const getThreadComments = async (threadId: string): Promise<ForumComment[]> => {
  const res = await httpClient.get<ForumComment[]>(`/forum/threads/${threadId}/comments`)
  return ((res as SuccessResponse<ForumComment[]>).data as ForumComment[]) ?? []
}

export const createComment = async (
  threadId: string,
  content: string,
  parentId?: string,
): Promise<ForumComment> => {
  const res = await httpClient.post<ForumComment>('/forum/comments', {
    threadId,
    content,
    parentId,
  })
  return (res as SuccessResponse<ForumComment>).data as ForumComment
}

// Toggle a "like" reaction on the thread (article). Returns the new count + state.
export const toggleThreadReaction = async (
  threadId: string,
): Promise<{ reacted: boolean; count: number }> => {
  const res = await httpClient.post<{ reacted: boolean; count: number }>('/forum/reactions', {
    targetType: 'thread',
    targetId: threadId,
    reactionType: 'like',
  })
  return (res as SuccessResponse<{ reacted: boolean; count: number }>).data as {
    reacted: boolean
    count: number
  }
}
