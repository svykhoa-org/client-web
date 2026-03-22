import type { SuccessResponse } from '@/common/interface/ServiceResponse';

import { bindStage } from '../_shared/utils/bind-stage';
import { httpClient } from '../apiClient';

export interface GetLessonDetailParams {
  courseId: string;
  lessonId: string;
}

export interface GetLessonDetailResponse {
  streamUrl: string;
  expiresAt: string;
}

// Export service using bindStage
export const getLessonDetail = bindStage<GetLessonDetailParams, SuccessResponse<GetLessonDetailResponse>>({
  stage: 'dev',
  mockFn: async (_params: GetLessonDetailParams) => {
    return {
      statusCode: 200,
      message: 'Mock lesson detail fetched successfully',
      data: {
        hits: [],
        streamUrl: 'https://example.com/stream-url',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Expires in 1 hour
        metadata: {},
      },
      timestamp: new Date().toISOString(),
    };
  },
  devFn: async (params: GetLessonDetailParams) => {
    const response = await httpClient.get<GetLessonDetailResponse>(`/lessons/${params.lessonId}/video/stream-url`);
    if (response.statusCode !== 200) {
      throw new Error(response.message || 'Failed to fetch lesson detail');
    }
    return response;
  },
});
