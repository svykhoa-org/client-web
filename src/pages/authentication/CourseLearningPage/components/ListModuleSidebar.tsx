import { useCallback, useEffect, useRef, useState } from 'react'

import { useNavigate, useParams } from 'react-router'

import {
  BookOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  DownOutlined,
  EyeOutlined,
  FileTextOutlined,
  LeftOutlined,
  LockOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Progress, Spin } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useCourseWithCurriculum } from '@/lib/tanstack-query/hooks/useCourseQueries'
import { useMyEnrollment } from '@/lib/tanstack-query/hooks/useEnrollmentQueries'
import { useProgressMap } from '@/lib/tanstack-query/hooks/useLessonProgressQueries'
import type { CourseInstructor, LessonProgressApi, LessonType } from '@/types/course-api'

const lessonTypeIcon = (type: LessonType) => {
  switch (type) {
    case 'video':
      return <PlayCircleOutlined className="text-primary-6" />
    case 'document':
      return <FileTextOutlined className="text-success-3" />
    case 'quiz':
      return <QuestionCircleOutlined className="text-warning-3" />
    default:
      return <BookOutlined className="text-neutral-5" />
  }
}

const InstructorCard = ({ instructors }: { instructors: CourseInstructor[] }) => {
  const [index, setIndex] = useState(0)
  if (instructors.length === 0) return null

  const safeIndex = Math.min(index, instructors.length - 1)
  const instructor = instructors[safeIndex]
  const hasMany = instructors.length > 1

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-5">
          Giảng viên
        </h3>
        {hasMany && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Giảng viên trước"
              onClick={() => setIndex(i => (i - 1 + instructors.length) % instructors.length)}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-3 text-[10px] text-neutral-5 transition-colors hover:border-neutral-6 hover:text-neutral-8"
            >
              <LeftOutlined />
            </button>
            <span className="text-xs text-neutral-5">
              {safeIndex + 1}/{instructors.length}
            </span>
            <button
              type="button"
              aria-label="Giảng viên kế tiếp"
              onClick={() => setIndex(i => (i + 1) % instructors.length)}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-3 text-[10px] text-neutral-5 transition-colors hover:border-neutral-6 hover:text-neutral-8"
            >
              <RightOutlined />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-neutral-3 bg-neutral-2 p-3">
        <Avatar
          src={instructor.avatar ?? undefined}
          icon={!instructor.avatar && <UserOutlined />}
          size={48}
          className="shrink-0 bg-neutral-3 text-neutral-6"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-neutral-9">{instructor.fullName}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-6">Giảng viên khoá học</p>
        </div>
      </div>
    </div>
  )
}

interface ListModuleSidebarProps {
  latestUnlockedId?: string | null
}

export const ListModuleSidebar = ({ latestUnlockedId }: ListModuleSidebarProps) => {
  const params = useParams()
  const courseId = params[RouteConfig.CourseLearningPage.paramKey.courseId] ?? ''
  const activeLessonId = params[RouteConfig.CourseLearningPage.paramKey.lessonId]
  const navigate = useNavigate()

  const { data: curriculumData, isLoading: isCurriculumLoading } = useCourseWithCurriculum(courseId)
  const { data: enrollment, isLoading: isEnrollmentLoading } = useMyEnrollment(courseId)
  const { data: progressList } = useProgressMap(enrollment?.id ?? '', !!enrollment?.id)

  const curriculum = curriculumData?.curriculum ?? []
  const isLoading = isCurriculumLoading || isEnrollmentLoading

  const progressMap = new Map<string, LessonProgressApi>()
  progressList?.forEach(p => progressMap.set(p.lessonId, p))

  const flatLessons = [...curriculum]
    .sort((a, b) => a.order - b.order)
    .flatMap(mod => [...mod.lessons].sort((a, b) => a.order - b.order))

  const accessibilityMap: Record<string, boolean> = {}
  flatLessons.forEach((lesson, i) => {
    if (lesson.isPreview || i === 0) {
      accessibilityMap[lesson.id] = true
      return
    }
    const prev = flatLessons[i - 1]
    const prevProgress = progressMap.get(prev.id)
    if (prevProgress?.status === 'completed') {
      accessibilityMap[lesson.id] = true
      return
    }
    const prevWatched = prevProgress?.watchedSeconds ?? 0
    if (prev.durationMinutes > 0) {
      accessibilityMap[lesson.id] = prevWatched / (prev.durationMinutes * 60) >= 0.8
    } else {
      accessibilityMap[lesson.id] = false
    }
  })

  const [flashSet, setFlashSet] = useState<Set<string>>(new Set())
  const flashTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const triggerFlash = useCallback((lessonId: string) => {
    setFlashSet(prev => new Set(prev).add(lessonId))
    const existing = flashTimers.current.get(lessonId)
    if (existing) clearTimeout(existing)
    const timer = setTimeout(() => {
      setFlashSet(prev => {
        const next = new Set(prev)
        next.delete(lessonId)
        return next
      })
      flashTimers.current.delete(lessonId)
    }, 2000)
    flashTimers.current.set(lessonId, timer)
  }, [])

  useEffect(() => {
    return () => {
      flashTimers.current.forEach(t => clearTimeout(t))
    }
  }, [])

  useEffect(() => {
    if (latestUnlockedId) triggerFlash(latestUnlockedId)
  }, [latestUnlockedId, triggerFlash])

  const [openModules, setOpenModules] = useState<Set<string>>(new Set<string>())

  useEffect(() => {
    if (curriculum.length === 0) return
    const activeModule = curriculum.find(mod => mod.lessons.some(l => l.id === activeLessonId))
    const targetId = activeModule?.id ?? curriculum[0]?.id
    if (!targetId) return
    setOpenModules(prev => {
      if (prev.has(targetId)) return prev
      return new Set([...prev, targetId])
    })
  }, [curriculum.length, activeLessonId]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleModule = (id: string) => {
    setOpenModules(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <Spin />
      </div>
    )
  }

  const instructors = curriculumData?.instructors ?? []

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="shrink-0 border-b border-neutral-3 px-4 py-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-5">
          Nội dung khoá học
        </h3>
        {enrollment && (
          <div className="mt-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs text-neutral-6">Tiến độ</span>
              <span className="text-xs font-semibold text-primary-8">
                {enrollment.progress ?? 0}%
              </span>
            </div>
            <Progress
              percent={enrollment.progress ?? 0}
              showInfo={false}
              strokeColor="#1976d2"
              trailColor="#e5e5e5"
              size="small"
            />
          </div>
        )}
      </div>

      {/* Module accordion */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {[...curriculum]
          .sort((a, b) => a.order - b.order)
          .map(mod => {
            const isOpen = openModules.has(mod.id)
            return (
              <div key={mod.id} className="border-b border-neutral-2">
                {/* Module header */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-neutral-9">{mod.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-5">
                      {mod.lessonCount ?? mod.lessons.length} bài
                      {mod.totalDurationMinutes ? ` · ${mod.totalDurationMinutes} phút` : ''}
                    </p>
                  </div>
                  <DownOutlined
                    className="shrink-0 text-xs text-neutral-5 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {/* Lesson list */}
                {isOpen && (
                  <div className="border-t border-neutral-2">
                    {[...mod.lessons]
                      .sort((a, b) => a.order - b.order)
                      .map(lesson => {
                        const isActive = lesson.id === activeLessonId
                        const isAccessible = accessibilityMap[lesson.id] ?? true
                        const isCompleted = progressMap.get(lesson.id)?.status === 'completed'
                        const isFlashing = flashSet.has(lesson.id)

                        return (
                          <button
                            key={lesson.id}
                            disabled={!isAccessible}
                            onClick={() =>
                              navigate(RouteConfig.CourseLearningPage.getPath(courseId, lesson.id))
                            }
                            className={[
                              'flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors',
                              isActive
                                ? 'border-primary-6 bg-primary-1'
                                : isCompleted
                                  ? 'border-success-3/40 hover:bg-neutral-2'
                                  : 'border-transparent hover:bg-neutral-2',
                              !isAccessible ? 'cursor-not-allowed opacity-50' : '',
                              isFlashing && !isActive ? 'animate-pulse bg-primary-1/60' : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <span className="mt-0.5 shrink-0 text-sm">
                              {isCompleted ? (
                                <CheckCircleFilled className="text-success-3" />
                              ) : isAccessible ? (
                                lessonTypeIcon(lesson.type)
                              ) : (
                                <LockOutlined className="text-neutral-4" />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-xs leading-snug ${
                                  isActive
                                    ? 'font-semibold text-primary-8'
                                    : isCompleted
                                      ? 'text-success-3'
                                      : isAccessible
                                        ? 'text-neutral-8'
                                        : 'text-neutral-4'
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                {lesson.isPreview && (
                                  <span className="inline-flex items-center gap-0.5 rounded border border-info-3/60 px-1 py-0.5 text-[10px] font-medium text-info-3">
                                    <EyeOutlined className="text-[10px]" />
                                    Xem thử
                                  </span>
                                )}
                                {lesson.durationMinutes > 0 && (
                                  <span className="flex items-center gap-0.5 text-[11px] text-neutral-5">
                                    <ClockCircleOutlined className="text-[10px]" />
                                    {lesson.durationMinutes} phút
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* Instructor card */}
      {instructors.length > 0 && (
        <div className="shrink-0 border-t border-neutral-3">
          <InstructorCard instructors={instructors} />
        </div>
      )}
    </div>
  )
}
