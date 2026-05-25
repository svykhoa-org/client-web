import { BookOutlined, ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
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
    <div className="space-y-6 py-4">
      {/* Bài học */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Bài học
        </h3>
        <div className="rounded-lg border border-slate-100 bg-white p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-base font-semibold text-slate-800 leading-snug">{lesson.title}</h2>
            <Tag color={LESSON_TYPE_COLOR[lesson.type]} className="shrink-0">
              {LESSON_TYPE_LABEL[lesson.type]}
            </Tag>
          </div>

          {lesson.description && (
            <p className="text-sm text-slate-500 leading-relaxed">{lesson.description}</p>
          )}

          <div className="flex flex-wrap gap-4 pt-1 text-sm text-slate-500">
            {lesson.durationMinutes > 0 && (
              <span className="flex items-center gap-1.5">
                <ClockCircleOutlined className="text-slate-400" />
                {formatDuration(lesson.durationMinutes)}
              </span>
            )}
            {lesson.isPreview && (
              <span className="flex items-center gap-1.5">
                <PlayCircleOutlined className="text-slate-400" />
                Bài học xem thử
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Khoá học */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Khoá học
        </h3>
        <div className="rounded-lg border border-slate-100 bg-white p-4 space-y-3">
          <div className="flex items-start gap-3">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-14 w-20 rounded object-cover shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm leading-snug">{course.title}</p>
              {course.subTitle && (
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{course.subTitle}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1 text-sm text-slate-500 border-t border-slate-50">
            {course.totalDurationMinutes != null && (
              <span className="flex items-center gap-1.5 pt-2">
                <ClockCircleOutlined className="text-slate-400" />
                {formatTotalDuration(course.totalDurationMinutes)} tổng thời lượng
              </span>
            )}
            {course.currentEnrollments > 0 && (
              <span className="flex items-center gap-1.5 pt-2">
                <BookOutlined className="text-slate-400" />
                {course.currentEnrollments.toLocaleString('vi-VN')} học viên
              </span>
            )}
            {course.category && (
              <span className="flex items-center gap-1.5 pt-2 text-slate-400">
                {course.category.name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Mục tiêu khoá học */}
      {course.objectives && course.objectives.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Bạn sẽ học được
          </h3>
          <div className="rounded-lg border border-slate-100 bg-white p-4">
            <ul className="space-y-2">
              {course.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
