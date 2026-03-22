import type { SuccessResponse } from '@/common/interface/ServiceResponse';
import type { Course } from '@/models/Course';
import { httpClient } from '@/services/apiClient';

import { getEnrolledCourses, isEnrolled } from './mockEnrollments';

// Interface cho enrolled course
export interface EnrolledCourse {
  course: Course;
  enrolledAt: string;
  progress: number;
  completed: boolean;
}

// Service để lấy danh sách khóa học đã đăng ký với thông tin chi tiết
export const getUserEnrolledCourses = async (): Promise<EnrolledCourse[]> => {
  const enrolledCourses = getEnrolledCourses();

  return enrolledCourses.map(course => ({
    course,
    enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
    progress: Math.floor(Math.random() * 100),
    completed: Math.random() > 0.7, // 30% chance of completion
  }));
};

// Service để kiểm tra xem user đã đăng ký khóa học chưa
export const checkCourseEnrollment = async (courseId: string): Promise<boolean> => {
  return isEnrolled(courseId);
};

// Export các function từ mockEnrollments
export { isEnrolled, getEnrolledCourses, enrollCourse, getCourseProgress } from './mockEnrollments';

export const getMyCourses = async (): Promise<SuccessResponse<Course[]>> => {
  return await httpClient.get<Course[]>('/enrollment/my-courses');
};
