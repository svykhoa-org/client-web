import type { Course } from '@/models/Course';

import { mockCourses } from '../Course/mockCourse';

// Mock data cho các khóa học đã đăng ký
// Giả sử user đã mua 10 khóa học đầu tiên
export const mockEnrolledCourseIds = mockCourses.slice(0, 10).map(course => course._id);

// Service để kiểm tra xem user đã đăng ký khóa học chưa
export const isEnrolled = (courseId: string): boolean => {
  return mockEnrolledCourseIds.includes(courseId);
};

// Service để lấy danh sách khóa học đã đăng ký
export const getEnrolledCourses = (): Course[] => {
  return mockCourses.filter(course => mockEnrolledCourseIds.includes(course._id));
};

// Service để đăng ký khóa học mới
export const enrollCourse = (courseId: string): boolean => {
  if (!mockEnrolledCourseIds.includes(courseId)) {
    mockEnrolledCourseIds.push(courseId);
    return true;
  }
  return false;
};

// Service để lấy progress học tập (mock)
export const getCourseProgress = (courseId: string): { completed: boolean; progress: number } => {
  if (!isEnrolled(courseId)) {
    return { completed: false, progress: 0 };
  }

  // Mock random progress cho các khóa học đã đăng ký
  const randomProgress = Math.floor(Math.random() * 100);
  return {
    completed: randomProgress === 100,
    progress: randomProgress,
  };
};
