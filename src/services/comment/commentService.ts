import type { ListResponseData, SuccessResponse } from '@/common/interface/ServiceResponse';
import type { Comment } from '@/models/Comment';

import { httpClient } from '../apiClient';

export interface GetCommentsParams {
  postId: string;
  flat?: boolean;
  page?: number;
  limit?: number;
}

// Use the new ListResponseData format
export type GetCommentsResponse = ListResponseData<Comment>;

export const getComments = async (params: GetCommentsParams): Promise<SuccessResponse<GetCommentsResponse>> => {
  const { postId, flat = true, page = 1, limit = 100 } = params;
  return await httpClient.get<GetCommentsResponse>(`/comments`, {
    postId,
    flat,
    page,
    limit,
  });
};

export interface CreateCommentData {
  content: string;
  postId: string;
  parentId?: string;
}

export const createComment = async (commentData: CreateCommentData): Promise<SuccessResponse<Comment>> => {
  return await httpClient.post<Comment>('/comments', commentData);
};

export const updateComment = async (
  commentId: string,
  commentData: Partial<Comment>
): Promise<SuccessResponse<Comment>> => {
  return await httpClient.put<Comment>(`/comments/${commentId}`, commentData);
};

export const deleteComment = async (commentId: string): Promise<SuccessResponse<null>> => {
  return await httpClient.delete<null>(`/comments/${commentId}`);
};
