// src/pages/authentication/CoursePage/components/CourseInfo.tsx
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
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

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 text-base font-semibold text-neutral-10">{children}</h2>
)

export const CourseInfo = ({ course, instructors }: CourseInfoProps) => {
  const durationHours = course.totalDurationMinutes
    ? Math.round(course.totalDurationMinutes / 60)
    : null

  return (
    <div className="flex flex-col gap-5">
      {/* Thumbnail */}
      <div className="overflow-hidden rounded-xl border border-neutral-3">
        <img
          src={course.thumbnail ?? defaultThumbnail}
          alt={`Ảnh bìa khoá học ${course.title}`}
          className="h-56 w-full object-cover sm:h-72"
          onError={e => {
            ;(e.target as HTMLImageElement).src = defaultThumbnail
          }}
        />
      </div>

      {/* Main info card */}
      <div className="rounded-xl border border-neutral-3 bg-white p-6 sm:p-7">
        {/* Title + subtitle */}
        <h1 className="text-2xl font-bold leading-tight text-neutral-10 text-balance">
          {course.title}
        </h1>
        {course.subTitle && <p className="mt-1.5 text-base text-neutral-6">{course.subTitle}</p>}

        {/* Stats row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-6">
          {course.currentEnrollments > 0 && (
            <span className="flex items-center gap-1.5">
              <TeamOutlined className="text-neutral-5" />
              <span className="tabular-nums">
                {course.currentEnrollments.toLocaleString('vi-VN')}
              </span>{' '}
              học viên
            </span>
          )}
          {durationHours !== null && (
            <span className="flex items-center gap-1.5">
              <ClockCircleOutlined className="text-neutral-5" />
              {durationHours} giờ học
            </span>
          )}
          {course.cmeCredits != null && (
            <Tag color="gold" className="mr-0 rounded-md">
              {course.cmeCredits} CME credits
            </Tag>
          )}
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {course.tags.map(tag => (
              <Tag key={tag.id} color={tag.color ?? undefined} className="rounded-md">
                {tag.name}
              </Tag>
            ))}
          </div>
        )}

        {/* Description */}
        {course.description && (
          <p className="mt-5 max-w-prose leading-relaxed text-neutral-7 text-pretty">
            {course.description}
          </p>
        )}

        {/* Objectives — highlighted callout */}
        {(course.objectives?.length ?? 0) > 0 && (
          <div className="border-primary-2 bg-primary-1 mt-6 rounded-lg border p-5">
            <SectionHeading>Bạn sẽ học được gì</SectionHeading>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {course.objectives!.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-neutral-8">
                  <CheckCircleOutlined className="text-primary-6 mt-0.5 shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructors */}
        {instructors && instructors.length > 0 && (
          <div className="mt-6">
            <SectionHeading>
              Giảng viên
              <span className="ml-2 text-sm font-normal text-neutral-5">{instructors.length}</span>
            </SectionHeading>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {instructors.map(instructor => (
                <div
                  key={instructor.id}
                  className="hover:border-primary-3 hover:bg-primary-1/40 flex items-center gap-3.5 rounded-xl border border-neutral-2 bg-neutral-1 p-3.5 transition-colors"
                >
                  <Avatar
                    src={instructor.avatar ?? undefined}
                    icon={!instructor.avatar && <UserOutlined />}
                    size={52}
                    className="bg-primary-9 ring-primary-1 shrink-0 text-white ring-2"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-neutral-9">{instructor.fullName}</p>
                    <p className="text-primary-7 mt-0.5 flex items-center gap-1 text-xs">
                      <SafetyCertificateOutlined />
                      Giảng viên
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {(course.requirements?.length ?? 0) > 0 && (
          <div className="mt-6">
            <SectionHeading>Yêu cầu đầu vào</SectionHeading>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-neutral-7">
              {course.requirements!.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Suitable for */}
        {(course.suitableFor?.length ?? 0) > 0 && (
          <div className="mt-6">
            <SectionHeading>Khoá học dành cho</SectionHeading>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-neutral-7">
              {course.suitableFor!.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
