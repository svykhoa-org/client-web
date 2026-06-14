import {
  BookOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { Tag } from 'antd'

import type { CourseApiItem, CourseLesson, LessonType } from '@/types/course-api'

interface LessonInfoTabProps {
  course: CourseApiItem
  lesson: CourseLesson
}

const LESSON_TYPE_LABEL: Record<LessonType, string> = {
  video: 'Video',
  document: 'Tài liệu',
  quiz: 'Bài kiểm tra',
}

const LESSON_TYPE_COLOR: Record<LessonType, string> = {
  video: 'blue',
  document: 'green',
  quiz: 'orange',
}

function formatDuration(minutes: number): string {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h}g ${m}p`
  return `${m} phút`
}

function formatTotalDuration(minutes: number | null): string {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h} giờ ${m} phút`
  return `${m} phút`
}

export function LessonInfoTab({ course, lesson }: LessonInfoTabProps) {
  return (
    <div className="divide-y divide-neutral-3 py-2">
      {/* Bài học */}
      <section className="pb-5 pt-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold leading-snug text-neutral-9">{lesson.title}</h2>
          <Tag color={LESSON_TYPE_COLOR[lesson.type]} className="shrink-0">
            {LESSON_TYPE_LABEL[lesson.type]}
          </Tag>
        </div>

        {lesson.description && (
          <p className="mb-3 text-sm leading-relaxed text-neutral-6">{lesson.description}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-neutral-6">
          {lesson.durationMinutes > 0 && (
            <span className="flex items-center gap-1.5">
              <ClockCircleOutlined className="text-neutral-5" />
              {formatDuration(lesson.durationMinutes)}
            </span>
          )}
          {lesson.isPreview && (
            <span className="flex items-center gap-1.5">
              <PlayCircleOutlined className="text-neutral-5" />
              Bài học xem thử
            </span>
          )}
        </div>
      </section>

      {/* Khoá học */}
      <section className="py-5">
        <div className="flex items-start gap-3">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-14 w-20 shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-neutral-9">{course.title}</p>
            {course.subTitle && (
              <p className="mt-0.5 text-xs leading-relaxed text-neutral-6">{course.subTitle}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-5">
              {course.totalDurationMinutes != null && (
                <span className="flex items-center gap-1">
                  <ClockCircleOutlined />
                  {formatTotalDuration(course.totalDurationMinutes)} tổng thời lượng
                </span>
              )}
              {course.currentEnrollments > 0 && (
                <span className="flex items-center gap-1">
                  <BookOutlined />
                  {course.currentEnrollments.toLocaleString('vi-VN')} học viên
                </span>
              )}
              {course.category && <span>{course.category.name}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Mục tiêu khoá học */}
      {course.objectives && course.objectives.length > 0 && (
        <section className="py-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-5">
            Bạn sẽ học được
          </h3>
          <ul className="space-y-2">
            {course.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-7">
                <CheckOutlined className="mt-0.5 shrink-0 text-primary-6" />
                {obj}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
