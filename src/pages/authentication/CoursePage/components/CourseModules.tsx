// src/pages/authentication/CoursePage/components/CourseModules.tsx
import {
  ClockCircleOutlined,
  FileTextOutlined,
  FormOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { Collapse, Empty } from 'antd'

import type { CourseLesson, CourseModuleWithLessons, LessonType } from '@/types/course-api'

interface CourseModulesProps {
  curriculum: CourseModuleWithLessons[]
}

const lessonTypeConfig: Record<LessonType, { icon: React.ReactNode; color: string }> = {
  video: { icon: <PlayCircleOutlined />, color: 'text-primary-6' },
  document: { icon: <FileTextOutlined />, color: 'text-success-3' },
  quiz: { icon: <FormOutlined />, color: 'text-warning-3' },
}

const LessonRow = ({ lesson }: { lesson: CourseLesson }) => {
  const config = lessonTypeConfig[lesson.type]

  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-neutral-1">
      <div className="flex flex-1 items-center gap-3">
        <span className={`shrink-0 ${config.color}`}>{config.icon}</span>
        <span className="text-sm text-neutral-8">{lesson.title}</span>
      </div>
      {lesson.durationMinutes > 0 && (
        <span className="ml-2 flex shrink-0 items-center gap-1 text-xs tabular-nums text-neutral-5">
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
      <div className="rounded-xl border border-neutral-3 bg-white p-6">
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
        <span className="font-semibold text-neutral-9">
          Chương {mod.order}: {mod.title}
        </span>
        <span className="ml-2 shrink-0 text-xs tabular-nums text-neutral-5">
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
    <div className="overflow-hidden rounded-xl border border-neutral-3 bg-white">
      <div className="border-b border-neutral-2 px-5 py-4">
        <h2 className="text-lg font-bold text-neutral-10">Nội dung khoá học</h2>
        <p className="mt-0.5 text-sm text-neutral-6">
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
