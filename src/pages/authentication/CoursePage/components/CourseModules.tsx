// src/pages/authentication/CoursePage/components/CourseModules.tsx
import {
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FormOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { Collapse, Empty, Tag } from 'antd'

import type { CourseLesson, CourseModuleWithLessons, LessonType } from '@/types/course-api'

interface CourseModulesProps {
  curriculum: CourseModuleWithLessons[]
}

const lessonTypeConfig: Record<LessonType, { icon: React.ReactNode; color: string }> = {
  video: { icon: <PlayCircleOutlined />, color: 'text-blue-500' },
  document: { icon: <FileTextOutlined />, color: 'text-green-500' },
  quiz: { icon: <FormOutlined />, color: 'text-orange-500' },
}

const LessonRow = ({ lesson }: { lesson: CourseLesson }) => {
  const config = lessonTypeConfig[lesson.type]

  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-50">
      <div className="flex flex-1 items-center gap-3">
        <span className={`shrink-0 ${config.color}`}>{config.icon}</span>
        <span className="text-sm text-gray-700">{lesson.title}</span>
        {lesson.isPreview && (
          <Tag icon={<EyeOutlined />} color="cyan" className="ml-1 shrink-0">
            Xem thử
          </Tag>
        )}
      </div>
      {lesson.durationMinutes > 0 && (
        <span className="ml-2 flex shrink-0 items-center gap-1 text-xs text-gray-400">
          <ClockCircleOutlined />
          {lesson.durationMinutes} phút
        </span>
      )}
    </div>
  )
}

export const CourseModules = ({ curriculum }: CourseModulesProps) => {
  if (curriculum.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <Empty description="Chưa có nội dung khoá học" />
      </div>
    )
  }

  const totalLessons = curriculum.reduce((sum, mod) => sum + mod.lessons.length, 0)
  const totalMinutes = curriculum.reduce((sum, mod) => sum + (mod.totalDurationMinutes ?? 0), 0)

  const items = curriculum.map(mod => ({
    key: mod.id,
    label: (
      <div className="flex items-center justify-between pr-2">
        <span className="font-semibold text-gray-800">
          Chương {mod.order}: {mod.title}
        </span>
        <span className="ml-2 shrink-0 text-xs text-gray-400">
          {mod.lessonCount > 0 ? mod.lessonCount : mod.lessons.length} bài
          {mod.totalDurationMinutes ? ` · ${mod.totalDurationMinutes} phút` : ''}
        </span>
      </div>
    ),
    children:
      mod.lessons.length === 0 ? (
        <Empty description="Chưa có bài học" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="space-y-1">
          {mod.lessons.map(lesson => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ),
  }))

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-bold text-gray-900">Nội dung khoá học</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          {curriculum.length} chương &bull; {totalLessons} bài học
          {totalMinutes > 0 && ` · ${Math.round(totalMinutes / 60)} giờ`}
        </p>
      </div>
      <div className="p-4">
        <Collapse
          items={items}
          defaultActiveKey={curriculum[0]?.id}
          className="border-none bg-transparent"
        />
      </div>
    </div>
  )
}
