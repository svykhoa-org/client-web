// src/pages/authentication/CoursePage/components/CourseItem.tsx
import { useNavigate } from 'react-router'

import { ClockCircleOutlined, TeamOutlined } from '@ant-design/icons'
import { Tag } from 'antd'

import defaultThumbnail from '@/assets/course-thumbnail-default.jpeg'
import RouteConfig from '@/constants/RouteConfig'
import { cn } from '@/lib/utils'
import type { CourseApiItem } from '@/types/course-api'

interface Props {
  course: CourseApiItem
  onClick?: () => void
}

export const CourseItem = ({ course, onClick }: Props) => {
  const navigate = useNavigate()

  const goToDetail =
    onClick ?? (() => navigate(RouteConfig.CourseDetailPage.path.replace(':id', course.id)))

  const isFree = course.price === 0
  const durationHours = course.totalDurationMinutes
    ? Math.round(course.totalDurationMinutes / 60)
    : null
  const estimatedLessons = course.totalDurationMinutes
    ? Math.round(course.totalDurationMinutes / 10)
    : null

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          goToDetail()
        }
      }}
      className={cn(
        'group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-3 bg-white',
        'shadow-primary-10/5 shadow-sm transition-all duration-200',
        'hover:border-primary-3 hover:shadow-primary-10/10 hover:-translate-y-1 hover:shadow-md',
        'focus-visible:ring-primary-5/60 focus-visible:outline-none focus-visible:ring-2',
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-neutral-2">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={`Ảnh bìa khoá học ${course.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={e => {
              ;(e.target as HTMLImageElement).src = defaultThumbnail
            }}
          />
        ) : (
          <div className="from-primary-7 to-primary-10 flex h-full w-full items-center justify-center bg-gradient-to-br">
            <span className="text-4xl font-bold tracking-wide text-white/25">
              {course.shortCode.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {isFree && (
          <span className="bg-success-3 absolute right-2 top-2 rounded-md px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            Miễn phí
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-10">
          {course.title}
        </h3>

        {course.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-neutral-5">
            {course.description}
          </p>
        )}

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 2).map(tag => (
              <Tag key={tag.id} color={tag.color ?? undefined} className="m-0 rounded-md text-xs">
                {tag.name}
              </Tag>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center gap-3 pt-1 text-xs text-neutral-5">
          {course.currentEnrollments > 0 && (
            <span className="flex items-center gap-1">
              <TeamOutlined />
              <span className="tabular-nums">
                {course.currentEnrollments.toLocaleString('vi-VN')}
              </span>
            </span>
          )}
          {durationHours !== null && (
            <span className="flex items-center gap-1">
              <ClockCircleOutlined />
              {durationHours} giờ
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-1 flex items-center justify-between border-t border-neutral-2 pt-3">
          {isFree ? (
            <span className="text-success-3 text-base font-bold">Miễn phí</span>
          ) : (
            <span className="text-primary-8 text-base font-bold tabular-nums">
              {course.price.toLocaleString('vi-VN')}đ
            </span>
          )}
          {estimatedLessons && (
            <span className="bg-primary-1 text-primary-8 rounded-md px-2 py-0.5 text-xs font-medium">
              ~{estimatedLessons} bài
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
