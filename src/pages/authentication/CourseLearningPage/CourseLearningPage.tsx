import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Result, Tabs } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useCourseWithCurriculum } from '@/lib/tanstack-query/hooks/useCourseQueries'

import { LessonInfoTab } from './components/LessonInfoTab'
import { LessonNotesTab } from './components/LessonNotesTab'
import { ListModuleSidebar } from './components/ListModuleSidebar'
import { VideoPlayer, type VideoPlayerHandle } from './components/VideoPlayer'
import { QuizPlayer } from './components/QuizPlayer'

export const CourseLearningPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const courseId = params[RouteConfig.CourseLearningPage.paramKey.courseId]
  const lessonId = params[RouteConfig.CourseLearningPage.paramKey.lessonId]

  const currentTimeRef = useRef(0)
  const playerRef = useRef<VideoPlayerHandle>(null)
  const [latestUnlockedId, setLatestUnlockedId] = useState<string | null>(null)

  const { data: curriculumData } = useCourseWithCurriculum(courseId ?? '')

  const allLessons = curriculumData?.curriculum.flatMap(m => m.lessons) ?? []
  const currentIndex = allLessons.findIndex(l => l.id === lessonId)
  const currentLesson = currentIndex >= 0 ? allLessons[currentIndex] : undefined
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : undefined
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : undefined

  const goToLesson = (id: string) => {
    navigate(RouteConfig.CourseLearningPage.getPath(courseId!, id))
  }

  if (!courseId || !lessonId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Result
          status="warning"
          title="Bài học không hợp lệ"
          subTitle="Vui lòng chọn một bài học từ danh sách."
        />
      </div>
    )
  }

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Lesson content — video or quiz */}
        {currentLesson?.type === 'quiz' && currentLesson.contentId ? (
          <QuizPlayer quizId={currentLesson.contentId} courseId={courseId} lessonId={lessonId} />
        ) : (
          <VideoPlayer
            ref={playerRef}
            courseId={courseId}
            lessonId={lessonId}
            onProgress={({ playedSeconds }) => {
              currentTimeRef.current = playedSeconds
            }}
            onEnded={() => {
              if (nextLesson) goToLesson(nextLesson.id)
            }}
            onUnlock={setLatestUnlockedId}
          />
        )}

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3">
          <Button
            icon={<LeftOutlined />}
            disabled={!prevLesson}
            onClick={() => prevLesson && goToLesson(prevLesson.id)}
            className="rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
          >
            Bài trước
          </Button>

          <div className="text-center">
            {currentLesson && (
              <p className="text-sm font-medium text-slate-700 max-w-xs truncate">
                {currentLesson.title}
              </p>
            )}
            {allLessons.length > 0 && (
              <p className="text-xs text-slate-400">
                {currentIndex + 1} / {allLessons.length}
              </p>
            )}
          </div>

          <Button
            disabled={!nextLesson}
            onClick={() => nextLesson && goToLesson(nextLesson.id)}
            className="rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
          >
            Bài tiếp theo
            <RightOutlined />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex-1 bg-slate-50 px-6">
          <Tabs
            defaultActiveKey="info"
            items={[
              {
                key: 'info',
                label: 'Thông tin',
                children:
                  curriculumData && currentLesson ? (
                    <LessonInfoTab course={curriculumData.course} lesson={currentLesson} />
                  ) : (
                    <div className="py-8 text-center text-sm text-slate-400">
                      Đang tải thông tin bài học...
                    </div>
                  ),
              },
              {
                key: 'notes',
                label: 'Ghi chú',
                children: (
                  <LessonNotesTab
                    lessonId={lessonId}
                    getCurrentTime={() => currentTimeRef.current}
                    onSeek={seconds => playerRef.current?.seekTo(seconds)}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="shrink-0 border-t border-gray-200 md:w-80 md:border-t-0 md:border-l">
        <div className="sticky top-0 h-[calc(100vh-64px)] overflow-hidden">
          <ListModuleSidebar latestUnlockedId={latestUnlockedId} />
        </div>
      </div>
    </div>
  )
}
