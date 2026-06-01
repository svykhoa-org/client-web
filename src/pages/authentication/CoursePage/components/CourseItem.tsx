// src/pages/authentication/CoursePage/components/CourseItem.tsx
import { useNavigate } from 'react-router'

import { StarFilled } from '@ant-design/icons'
import { Tag } from 'antd'

import defaultThumbnail from '@/assets/course-thumbnail-default.jpeg'
import RouteConfig from '@/constants/RouteConfig'
import type { CourseApiItem } from '@/types/course-api'

// Deterministic gradient from shortCode
const GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-600',
]

function getGradient(shortCode: string): string {
  let hash = 0
  for (let i = 0; i < shortCode.length; i++) hash = shortCode.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

interface Props {
  course: CourseApiItem
  onClick?: () => void
}

export const CourseItem = ({ course, onClick }: Props) => {
  const navigate = useNavigate()
  const gradient = getGradient(course.shortCode)

  const estimatedLessons = course.totalDurationMinutes
    ? Math.round(course.totalDurationMinutes / 10)
    : null

  return (
    <div
      onClick={onClick ?? (() => navigate(RouteConfig.CourseDetailPage.path.replace(':id', course.id)))}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={e => {
              ;(e.target as HTMLImageElement).src = defaultThumbnail
            }}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
          >
            <span className="text-4xl font-bold text-white/30">
              {course.shortCode.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {course.price === 0 && (
          <span className="absolute top-2 right-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
            Miễn phí
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">
          {course.title}
        </h3>

        {course.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">{course.description}</p>
        )}

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 2).map(tag => (
              <Tag key={tag.id} color={tag.color ?? 'blue'} className="m-0 text-xs">
                {tag.name}
              </Tag>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <StarFilled />
            <span className="font-semibold">4.5</span>
            <span className="text-gray-400">(mock)</span>
          </div>
          {course.currentEnrollments > 0 && (
            <span className="text-xs text-gray-400">
              {course.currentEnrollments.toLocaleString('vi-VN')} học viên
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          {course.price === 0 ? (
            <span className="text-sm font-bold text-green-600">Miễn phí</span>
          ) : (
            <span className="text-sm font-bold text-blue-600">
              {course.price.toLocaleString('vi-VN')}đ
            </span>
          )}
          {estimatedLessons && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
              ~{estimatedLessons} bài
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
