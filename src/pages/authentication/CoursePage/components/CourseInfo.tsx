// src/pages/authentication/CoursePage/components/CourseInfo.tsx
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Tag } from 'antd'

import defaultThumbnail from '@/assets/course-thumbnail-default.jpeg'
import type { CourseApiItem, CourseInstructor } from '@/types/course-api'

interface CourseInfoProps {
  course: CourseApiItem
  instructors?: CourseInstructor[]
}

export const CourseInfo = ({ course, instructors }: CourseInfoProps) => {
  const durationHours = course.totalDurationMinutes
    ? Math.round(course.totalDurationMinutes / 60)
    : null

  return (
    <div className="flex flex-col gap-5">
      {/* Thumbnail */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={course.thumbnail ?? defaultThumbnail}
          alt={course.title}
          className="h-56 w-full object-cover sm:h-72"
          onError={e => {
            ;(e.target as HTMLImageElement).src = defaultThumbnail
          }}
        />
      </div>

      {/* Title + subtitle */}
      <div>
        <h1 className="text-2xl font-bold leading-tight text-gray-900">{course.title}</h1>
        {course.subTitle && <p className="mt-1 text-base text-gray-500">{course.subTitle}</p>}
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1 font-semibold text-amber-500">
          <StarFilled />
          4.5
          <span className="font-normal text-gray-400">(mock)</span>
        </span>
        {course.currentEnrollments > 0 && (
          <span className="flex items-center gap-1">
            <TeamOutlined />
            {course.currentEnrollments.toLocaleString('vi-VN')} học viên
          </span>
        )}
        {durationHours !== null && (
          <span className="flex items-center gap-1">
            <ClockCircleOutlined />
            {durationHours} giờ học
          </span>
        )}
        {course.cmeCredits != null && <Tag color="gold">{course.cmeCredits} CME credits</Tag>}
      </div>

      {/* Description */}
      {course.description && <p className="leading-relaxed text-gray-600">{course.description}</p>}

      {/* Instructors */}
      {instructors && instructors.length > 0 && (
        <div>
          <h2 className="mb-3 font-bold text-gray-900">Giảng viên</h2>
          <div className="flex flex-col gap-3">
            {instructors.map(instructor => (
              <div key={instructor.id} className="flex items-center gap-3">
                <Avatar
                  src={instructor.avatar ?? undefined}
                  icon={!instructor.avatar && <UserOutlined />}
                  size={48}
                  className="shrink-0 bg-blue-100 text-blue-600"
                />
                <span className="font-medium text-gray-800">{instructor.fullName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {course.tags && course.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {course.tags.map(tag => (
            <Tag key={tag.id} color={tag.color ?? 'blue'}>
              {tag.name}
            </Tag>
          ))}
        </div>
      )}

      {/* Objectives */}
      {course.objectives.length > 0 && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h2 className="mb-3 font-bold text-gray-900">Bạn sẽ học được gì</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {course.objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircleOutlined className="mt-0.5 shrink-0 text-blue-500" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements */}
      {course.requirements.length > 0 && (
        <div>
          <h2 className="mb-2 font-bold text-gray-900">Yêu cầu đầu vào</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            {course.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Suitable for */}
      {course.suitableFor.length > 0 && (
        <div>
          <h2 className="mb-2 font-bold text-gray-900">Khoá học dành cho</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            {course.suitableFor.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
