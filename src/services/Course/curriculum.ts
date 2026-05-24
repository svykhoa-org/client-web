import type { CourseApiItem, CourseModuleWithLessons } from '@/types/course-api'

import { getCourseById } from './detail'
import { getModuleLessons } from './lessons'
import { getCourseModules } from './modules'

export interface CourseCurriculum {
  course: CourseApiItem
  curriculum: CourseModuleWithLessons[]
}

export async function getCourseWithCurriculum(courseId: string): Promise<CourseCurriculum> {
  const [course, modules] = await Promise.all([getCourseById(courseId), getCourseModules(courseId)])

  const lessonsPerModule = await Promise.all(
    modules.map(mod => getModuleLessons(mod.id).then(lessons => ({ moduleId: mod.id, lessons }))),
  )

  const curriculum: CourseModuleWithLessons[] = modules.map(mod => ({
    ...mod,
    lessons: lessonsPerModule.find(l => l.moduleId === mod.id)?.lessons ?? [],
  }))

  return { course, curriculum }
}
