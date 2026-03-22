import type { BaseModel } from './BaseModel';
import type { Course } from './Course';
import type { Lesson } from './Lesson';

export interface Module extends BaseModel {
  title: string;
  rank: string; // Thứ tự sắp xếp (dạng chuỗi để dễ chèn giữa)

  courseId: string;
  course?: Course;
  lessons?: Lesson[];
}
