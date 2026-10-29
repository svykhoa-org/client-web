import { useNavigate } from 'react-router'

import { LockOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useCourseWithCurriculum } from '@/lib/tanstack-query/hooks/useCourseQueries'
import type { LessonPrerequisite } from '@/types/course-api'

interface LockedLessonNoticeProps {
  courseId: string
  prerequisite: LessonPrerequisite | null
  /** Outer container classes — each player keeps its own frame. */
  className: string
  /** Dark players (video/document) get a ghost button. */
  dark?: boolean
}

/**
 * Shown when the server reports a lesson as locked. The unlock rule is the
 * server's (finish the earlier required lesson), so this only names that lesson
 * and links to it — it never states a percentage threshold of its own.
 */
export const LockedLessonNotice = ({
  courseId,
  prerequisite,
  className,
  dark = false,
}: LockedLessonNoticeProps) => {
  const navigate = useNavigate()
  const { data } = useCourseWithCurriculum(courseId)

  const blockingTitle = prerequisite
    ? data?.curriculum.flatMap(m => m.lessons).find(l => l.id === prerequisite.lessonId)?.title
    : undefined
  const watched = Math.round(prerequisite?.watchedPercent ?? 0)

  let message = 'Bạn chưa có quyền truy cập bài học này'
  if (prerequisite) {
    message = blockingTitle
      ? `Hoàn thành bài “${blockingTitle}” để mở bài này`
      : 'Hoàn thành bài học trước để mở bài này'
    if (watched > 0) message += ` (đã xem ${watched}%)`
  }

  return (
    <div className={className}>
      <LockOutlined style={{ fontSize: 40 }} className="opacity-70" />
      <p className="text-lg font-semibold">Bài học bị khoá</p>
      <p className="max-w-md px-4 text-center text-sm opacity-80">{message}</p>
      {prerequisite && (
        <Button
          ghost={dark}
          className="rounded-lg"
          onClick={() =>
            navigate(RouteConfig.CourseLearningPage.getPath(courseId, prerequisite.lessonId))
          }
        >
          {blockingTitle ? `Tới bài “${blockingTitle}”` : 'Tới bài cần học trước'}
        </Button>
      )}
    </div>
  )
}
