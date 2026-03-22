import type { ListResponseDataV2 } from '@/common/interface/ServiceResponse';
import type { Course } from '@/models/Course';

import { bindStage } from '../_shared/utils/bind-stage';
import { httpClient } from '../apiClient';
import { mockCourses } from './mockCourse';

export type GetCoursesResponseData = Course;

export interface GetCourses {
  page?: number;
  pageSize?: number;
  limit?: number;
  level?: string;
  category?: string;
  isFree?: boolean;
  search?: string;
}

export const getCourses = bindStage<GetCourses, ListResponseDataV2<GetCoursesResponseData>>({
  stage: 'dev',
  mockFn: async (inputs: GetCourses): Promise<ListResponseDataV2<GetCoursesResponseData>> => {
    await Promise.resolve(new Promise(resolve => setTimeout(resolve, 1500)));

    return {
      items: [],
      pagination: {
        hasNext: false,
        hasPrevious: false,
        page: inputs.page || 1,
        pageSize: inputs.pageSize || 10,
        totalItems: 0,
        totalPages: 0,
      },
    };
  },
  devFn: async (inputs: GetCourses): Promise<ListResponseDataV2<GetCoursesResponseData>> => {
    const response = await httpClient.get<ListResponseDataV2<GetCoursesResponseData>>('/courses', {
      page: inputs.page,
      pageSize: inputs.pageSize,
    });

    return response.data as ListResponseDataV2<GetCoursesResponseData>;
  },
});

export const getAvailableCourses = async ({ page = 1, limit = 10 }: GetCourses = {}) => {
  await Promise.resolve(new Promise(resolve => setTimeout(resolve, 1500)));

  return {
    code: 200,
    message: 'Courses fetched successfully',
    data: {
      items: mockCourses,
      pagination: {
        totalItems: mockCourses.length,
        totalPages: Math.ceil(mockCourses.length / limit),
        page,
        limit,
      },
    },
  };
};
export const getUpcomingCourses = async ({ page = 1, limit = 10 }: GetCourses = {}) => {
  await Promise.resolve(new Promise(resolve => setTimeout(resolve, 1500)));

  return {
    code: 200,
    message: 'Courses fetched successfully',
    data: {
      items: mockCourses,
      pagination: {
        totalItems: mockCourses.length,
        totalPages: Math.ceil(mockCourses.length / limit),
        page,
        limit,
      },
    },
  };
};
