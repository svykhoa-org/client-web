import { useNavigate, useParams } from 'react-router'

import {
  BookOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Collapse, Progress, Spin, Tag } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useCourseWithCurriculum } from '@/lib/tanstack-query/hooks/useCourseQueries'
import { useMyEnrollment } from '@/lib/tanstack-query/hooks/useEnrollmentQueries'
import type { LessonType } from '@/types/course-api'

const lessonTypeIcon = (type: LessonType) => {
  switch (type) {
    case 'video':
      return <PlayCircleOutlined className="text-blue-500" />
    case 'document':
      return <FileTextOutlined className="text-green-600" />
    case 'quiz':
      return <QuestionCircleOutlined className="text-orange-500" />
    default:
      return <BookOutlined className="text-gray-400" />
  }
}

export const ListModuleSidebar = () => {
  const params = useParams()
  const courseId = params[RouteConfig.CourseLearningPage.paramKey.courseId] ?? ''
  const activeLessonId = params[RouteConfig.CourseLearningPage.paramKey.lessonId]
  const navigate = useNavigate()

  const { data: curriculumData, isLoading: isCurriculumLoading } = useCourseWithCurriculum(courseId)
  const { data: enrollment, isLoading: isEnrollmentLoading } = useMyEnrollment(courseId)

  const curriculum = curriculumData?.curriculum ?? []
  const isLoading = isCurriculumLoading || isEnrollmentLoading

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin />
      </div>
    )
  }

  const defaultOpenKeys = curriculum
    .filter(mod => mod.lessons.some(l => l.id === activeLessonId))
    .map(mod => mod.id)

  const collapseItems = curriculum.map(mod => ({
    key: mod.id,
    label: (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-gray-800 text-sm leading-snug">{mod.title}</span>
        <span className="text-xs text-gray-500">
          {mod.lessonCount ?? mod.lessons.length} bài
          {mod.totalDurationMinutes ? ` · ${mod.totalDurationMinutes} phút` : ''}
        </span>
      </div>
    ),
    children: (
      <div className="flex flex-col">
        {mod.lessons.map(lesson => {
          const isActive = lesson.id === activeLessonId
          return (
            <button
              key={lesson.id}
              onClick={() => navigate(RouteConfig.CourseLearningPage.getPath(courseId, lesson.id))}
              className={`flex items-start gap-2 px-3 py-2.5 text-left transition-colors hover:bg-blue-50 ${
                isActive ? 'bg-blue-50 border-l-2 border-blue-500' : 'border-l-2 border-transparent'
              }`}
            >
              <span className="mt-0.5 shrink-0 text-base">{lessonTypeIcon(lesson.type)}</span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs leading-snug ${isActive ? 'font-semibold text-blue-700' : 'text-gray-700'}`}
                >
                  {lesson.title}
                  {isActive && <CheckCircleFilled className="ml-1 text-blue-500 text-xs" />}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  {lesson.isPreview && (
                    <Tag
                      icon={<EyeOutlined />}
                      color="cyan"
                      className="text-xs m-0 px-1 py-0 leading-4"
                    >
                      Xem thử
                    </Tag>
                  )}
                  {lesson.durationMinutes > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-gray-400">
                      <ClockCircleOutlined />
                      {lesson.durationMinutes} phút
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    ),
  }))

  return (
    <div className="flex h-full flex-col border-l border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="font-bold text-gray-800 text-sm">Nội dung khoá học</h3>
        {enrollment && (
          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
              <span>Tiến độ</span>
              <span>{enrollment.progress ?? 0}%</span>
            </div>
            <Progress
              percent={enrollment.progress ?? 0}
              showInfo={false}
              strokeColor="#2563eb"
              trailColor="#e5e7eb"
              size="small"
            />
          </div>
        )}
      </div>

      {/* Module accordion */}
      <div className="flex-1 overflow-y-auto">
        <Collapse
          defaultActiveKey={
            defaultOpenKeys.length > 0 ? defaultOpenKeys : [curriculum[0]?.id ?? '']
          }
          bordered={false}
          className="bg-white"
          items={collapseItems}
        />
      </div>
    </div>
  )
}
