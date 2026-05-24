import { type Course, CourseStatus } from '@/models/Course'
import type { Lesson } from '@/models/Lesson'
import type { Module } from '@/models/Module'

import { bindStage } from '../_shared/utils/bind-stage'
import { httpClient } from '../apiClient'

// This represents the data payload inside the API response
export interface GetCourseDetailData {
  course: Course & {
    modules?: (Module & {
      lessons?: Lesson[]
    })[]
  }
  enrollment: unknown | null
  isPaid: boolean
  canAccess: boolean
}

export const getCourse = bindStage<string, GetCourseDetailData>({
  stage: 'mock',
  mockFn: async (courseId: string): Promise<GetCourseDetailData> => {
    return {
      course: {
        id: courseId,
        title: 'Mock Course Title',
        subTitle: null,
        description: 'This is a mock course description.',
        thumbnail: 'https://example.com/course-thumbnail.jpg',
        price: 99.99,
        shortCode: 'MOCK-001',
        status: CourseStatus.PUBLISHED,
        categoryId: null,
        category: null,
        tags: null,
        startDate: null,
        endDate: null,
        registrationStart: null,
        registrationEnd: null,
        maxEnrollments: null,
        currentEnrollments: 0,
        selfPaced: true,
        accessDurationDays: null,
        objectives: [],
        requirements: [],
        suitableFor: [],
        instructorIds: [],
        totalDurationMinutes: null,
        cmeCredits: null,
        certifyingOrganization: null,
        completionCriteria: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [],
      },
      canAccess: true,
      enrollment: null,
      isPaid: true,
    }
  },
  devFn: async (courseId: string): Promise<GetCourseDetailData> => {
    const response = await httpClient.get<GetCourseDetailData>(`/courses/${courseId}`)
    return response.data as GetCourseDetailData
  },
})
