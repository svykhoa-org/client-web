import { type Course, CourseLevel, CourseStatus } from '@/models/Course';
import type { Lesson } from '@/models/Lesson';
import type { Module } from '@/models/Module';

import { bindStage } from '../_shared/utils/bind-stage';
import { httpClient } from '../apiClient';

// This represents the data payload inside the API response
export interface GetCourseDetailData {
  course: Course & {
    modules?: (Module & {
      lessons?: Lesson[];
    })[];
  };
  enrollment: unknown | null;
  isPaid: boolean;
  canAccess: boolean;
}

export const getCourse = bindStage<string, GetCourseDetailData>({
  stage: 'dev',
  mockFn: async (courseId: string): Promise<GetCourseDetailData> => {
    return {
      course: {
        id: courseId,
        title: 'Mock Course Title',
        description: 'This is a mock course description.',
        thumbnail: 'https://example.com/course-thumbnail.jpg',
        price: 99.99,
        averageRating: 4.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [],
        duration: 3600, // Duration in seconds (1 hour)
        enrollmentCount: 1000,
        instructorAvatar: 'https://example.com/instructor-avatar.jpg',
        instructorBio: 'This is a mock instructor bio.',
        instructorName: 'John Doe',
        level: CourseLevel.ADVANCED,
        reviewCount: 200,
        slug: 'mock-course-title',
        status: CourseStatus.PUBLISHED,
      },
      canAccess: true,
      enrollment: null,
      isPaid: true,
    };
  },
  devFn: async (courseId: string): Promise<GetCourseDetailData> => {
    const response = await httpClient.get<GetCourseDetailData>(`/courses/${courseId}`);
    return response.data as GetCourseDetailData;
  },
});
