import type { SuccessResponse, ListResponseDataV2 } from '@/common/interface/ServiceResponse'
import type {
  ForumCategoryGroup,
  ForumComment,
  ForumPrefixTag,
  ForumSubCategory,
  ForumThread,
  ThreadSortOption,
} from '@/models/Forum'
import { httpClient } from '../apiClient'

export const getForumHomepage = async (): Promise<ForumCategoryGroup[]> => {
  const res = await httpClient.get<ForumCategoryGroup[]>('/forum/categories')
  return (res as SuccessResponse<ForumCategoryGroup[]>).data as ForumCategoryGroup[]
}

export const getPrefixTags = async (): Promise<ForumPrefixTag[]> => {
  const res = await httpClient.get<ForumPrefixTag[]>('/forum/prefix-tags')
  return (res as SuccessResponse<ForumPrefixTag[]>).data as ForumPrefixTag[]
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

export const searchForumThreads = async (params: {
  q: string
  page?: number
  limit?: number
}): Promise<ListResponseDataV2<ForumThread>> => {
  const res = await httpClient.get<ListResponseDataV2<ForumThread>>('/forum/search', params)
  return (res as SuccessResponse<ListResponseDataV2<ForumThread>>)
    .data as ListResponseDataV2<ForumThread>
}

// Global (cross-category) thread list for the Hot / New tabs.
export const getGlobalThreads = async (params: {
  sort: 'hot' | 'new'
  page?: number
  limit?: number
}): Promise<ListResponseDataV2<ForumThread>> => {
  const res = await httpClient.get<ListResponseDataV2<ForumThread>>('/forum/threads', params)
  return (res as SuccessResponse<ListResponseDataV2<ForumThread>>)
    .data as ListResponseDataV2<ForumThread>
}

export const getMyForumThreads = async (params?: {
  page?: number
  limit?: number
}): Promise<ListResponseDataV2<ForumThread>> => {
  const res = await httpClient.get<ListResponseDataV2<ForumThread>>('/forum/my/threads', params)
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

// Comments are paginated by ROOT comment; each root carries its nested replies.
// `totalComments` is the thread-wide count (roots + replies) for the header badge.
export type ThreadCommentsResponse = ListResponseDataV2<ForumComment> & {
  totalComments: number
}

export const getThreadComments = async (
  threadId: string,
  params?: { page?: number; limit?: number },
): Promise<ThreadCommentsResponse> => {
  const res = await httpClient.get<ThreadCommentsResponse>(
    `/forum/threads/${threadId}/comments`,
    params,
  )
  return (res as SuccessResponse<ThreadCommentsResponse>).data as ThreadCommentsResponse
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

// Mark a comment as the thread's accepted answer, or pass null to clear it.
// Only the thread author (or an admin) is allowed by the backend.
export const setAcceptedAnswer = async (
  threadId: string,
  commentId: string | null,
): Promise<ForumThread> => {
  const res = await httpClient.patch<ForumThread>(`/forum/threads/${threadId}/accepted-answer`, {
    commentId,
  })
  return (res as SuccessResponse<ForumThread>).data as ForumThread
}

// Upload an inline image for the rich-text editor. Returns the public URL to embed.
export const uploadForumImage = async (file: File): Promise<{ url: string; assetId: string }> => {
  const form = new FormData()
  form.append('file', file)
  const res = await httpClient.post<{ url: string; assetId: string }>(
    '/forum/uploads/image',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return (res as SuccessResponse<{ url: string; assetId: string }>).data as {
    url: string
    assetId: string
  }
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

// Toggle a "like" reaction on a comment. Returns the new count + state.
export const toggleCommentReaction = async (
  commentId: string,
): Promise<{ reacted: boolean; count: number }> => {
  const res = await httpClient.post<{ reacted: boolean; count: number }>('/forum/reactions', {
    targetType: 'comment',
    targetId: commentId,
    reactionType: 'like',
  })
  return (res as SuccessResponse<{ reacted: boolean; count: number }>).data as {
    reacted: boolean
    count: number
  }
}
