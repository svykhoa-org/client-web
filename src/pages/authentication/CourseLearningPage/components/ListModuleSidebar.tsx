import { useCallback, useEffect, useRef, useState } from 'react'

import { useNavigate, useParams } from 'react-router'

import {
  BookOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  LockOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Collapse, Progress, Spin, Tag } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useCourseWithCurriculum } from '@/lib/tanstack-query/hooks/useCourseQueries'
import { useMyEnrollment } from '@/lib/tanstack-query/hooks/useEnrollmentQueries'
import { useProgressMap } from '@/lib/tanstack-query/hooks/useLessonProgressQueries'
import type { LessonProgressApi, LessonType } from '@/types/course-api'

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

interface ListModuleSidebarProps {
  /** lessonId returned by the server when a lesson is newly unlocked — triggers flash */
  latestUnlockedId?: string | null
}

export const ListModuleSidebar = ({ latestUnlockedId }: ListModuleSidebarProps) => {
  const params = useParams()
  const courseId = params[RouteConfig.CourseLearningPage.paramKey.courseId] ?? ''
  const activeLessonId = params[RouteConfig.CourseLearningPage.paramKey.lessonId]
  const navigate = useNavigate()

  const { data: curriculumData, isLoading: isCurriculumLoading } =
    useCourseWithCurriculum(courseId)
  const { data: enrollment, isLoading: isEnrollmentLoading } = useMyEnrollment(courseId)
  const { data: progressList } = useProgressMap(enrollment?.id ?? '', !!enrollment?.id)

  const curriculum = curriculumData?.curriculum ?? []
  const isLoading = isCurriculumLoading || isEnrollmentLoading

  // Build Map<lessonId, LessonProgress> from flat list
  const progressMap = new Map<string, LessonProgressApi>()
  progressList?.forEach((p) => progressMap.set(p.lessonId, p))

  // Flat ordered lesson list: modules sorted by order, lessons within by order
  const flatLessons = [...curriculum]
    .sort((a, b) => a.order - b.order)
    .flatMap((mod) => [...mod.lessons].sort((a, b) => a.order - b.order))

  // Compute accessibility for each lesson
  const accessibilityMap: Record<string, boolean> = {}
  flatLessons.forEach((lesson, i) => {
    if (lesson.isPreview || i === 0) {
      accessibilityMap[lesson.id] = true
      return
    }
    const prev = flatLessons[i - 1]
    const prevProgress = progressMap.get(prev.id)

    // completed status always unlocks the next lesson
    if (prevProgress?.status === 'completed') {
      accessibilityMap[lesson.id] = true
      return
    }

    // fallback: for in-progress videos, unlock when 80% watched
    const prevWatched = prevProgress?.watchedSeconds ?? 0
    if (prev.durationMinutes > 0) {
      accessibilityMap[lesson.id] = prevWatched / (prev.durationMinutes * 60) >= 0.8
    } else {
      accessibilityMap[lesson.id] = false
    }
  })

  // Flash animation state
  const [flashSet, setFlashSet] = useState<Set<string>>(new Set())
  const flashTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const triggerFlash = useCallback((lessonId: string) => {
    setFlashSet((prev) => new Set(prev).add(lessonId))
    const existing = flashTimers.current.get(lessonId)
    if (existing) clearTimeout(existing)
    const timer = setTimeout(() => {
      setFlashSet((prev) => {
        const next = new Set(prev)
        next.delete(lessonId)
        return next
      })
      flashTimers.current.delete(lessonId)
    }, 2000)
    flashTimers.current.set(lessonId, timer)
  }, [])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      flashTimers.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  // Trigger flash when parent signals a newly unlocked lesson
  useEffect(() => {
    if (latestUnlockedId) triggerFlash(latestUnlockedId)
  }, [latestUnlockedId, triggerFlash])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin />
      </div>
    )
  }

  const defaultOpenKeys = curriculum
    .filter((mod) => mod.lessons.some((l) => l.id === activeLessonId))
    .map((mod) => mod.id)

  const collapseItems = curriculum.map((mod) => ({
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
        {[...mod.lessons]
          .sort((a, b) => a.order - b.order)
          .map((lesson) => {
            const isActive = lesson.id === activeLessonId
            const isAccessible = accessibilityMap[lesson.id] ?? true
            const isFlashing = flashSet.has(lesson.id)
            return (
              <button
                key={lesson.id}
                disabled={!isAccessible}
                onClick={() =>
                  navigate(RouteConfig.CourseLearningPage.getPath(courseId, lesson.id))
                }
                className={[
                  'flex items-start gap-2 px-3 py-2.5 text-left transition-colors border-l-2',
                  isActive ? 'bg-blue-50 border-blue-500' : 'border-transparent',
                  isAccessible && !isActive ? 'hover:bg-blue-50' : '',
                  !isAccessible ? 'cursor-not-allowed opacity-60' : '',
                  isFlashing ? 'animate-pulse bg-blue-50' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="mt-0.5 shrink-0 text-base">
                  {isAccessible ? (
                    lessonTypeIcon(lesson.type)
                  ) : (
                    <LockOutlined className="text-gray-400" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs leading-snug ${
                      isActive
                        ? 'font-semibold text-blue-700'
                        : isAccessible
                          ? 'text-gray-700'
                          : 'text-gray-400'
                    }`}
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
