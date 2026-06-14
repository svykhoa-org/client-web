import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import {
  LeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Drawer, Result, Tabs } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useCourseWithCurriculum } from '@/lib/tanstack-query/hooks/useCourseQueries'

import { CelebrationModal } from './components/CelebrationModal'
import { DocumentViewer } from './components/DocumentViewer'
import { LessonInfoTab } from './components/LessonInfoTab'
import { LessonNotesTab } from './components/LessonNotesTab'
import { ListModuleSidebar } from './components/ListModuleSidebar'
import { QuizPlayer } from './components/QuizPlayer'
import { VideoPlayer, type VideoPlayerHandle } from './components/VideoPlayer'

const getSidebarPref = () => {
  try {
    return localStorage.getItem('course-sidebar') !== 'false'
  } catch {
    return true
  }
}

export const CourseLearningPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const courseId = params[RouteConfig.CourseLearningPage.paramKey.courseId]
  const lessonId = params[RouteConfig.CourseLearningPage.paramKey.lessonId]

  const currentTimeRef = useRef(0)
  const playerRef = useRef<VideoPlayerHandle>(null)
  const [latestUnlockedId, setLatestUnlockedId] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(getSidebarPref)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

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

  const toggleSidebar = () => {
    setSidebarOpen(v => {
      const next = !v
      try {
        localStorage.setItem('course-sidebar', String(next))
      } catch {}
      return next
    })
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

  const handleCourseComplete = () => setShowCelebration(true)

  // Desktop nav bar
  const navBar = (
    <div className="flex shrink-0 items-center gap-2 border-b border-neutral-3 bg-white px-4 py-2">
      <button
        disabled={!prevLesson}
        onClick={() => prevLesson && goToLesson(prevLesson.id)}
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-6 transition-colors hover:bg-neutral-2 hover:text-neutral-9 disabled:pointer-events-none disabled:opacity-40"
      >
        <LeftOutlined className="text-xs" />
        Bài trước
      </button>

      <div className="min-w-0 flex-1 text-center">
        {currentLesson && (
          <p className="truncate text-sm font-semibold text-neutral-9">{currentLesson.title}</p>
        )}
        {allLessons.length > 0 && (
          <p className="text-xs text-neutral-5">
            {currentIndex + 1} / {allLessons.length}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          disabled={!nextLesson}
          onClick={() => nextLesson && goToLesson(nextLesson.id)}
          className="flex items-center gap-1.5 rounded-lg bg-primary-6 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-7 disabled:pointer-events-none disabled:opacity-50"
        >
          Bài tiếp
          <RightOutlined className="text-xs" />
        </button>

        <button
          onClick={toggleSidebar}
          title={sidebarOpen ? 'Thu gọn danh sách' : 'Mở danh sách bài'}
          className="hidden h-9 w-9 items-center justify-center rounded-lg border border-neutral-3 text-neutral-6 transition-colors hover:bg-neutral-2 hover:text-neutral-8 md:flex"
        >
          {sidebarOpen ? (
            <MenuFoldOutlined className="text-sm" />
          ) : (
            <MenuUnfoldOutlined className="text-sm" />
          )}
        </button>
      </div>
    </div>
  )

  // Mobile fixed bottom bar
  const mobileNav = (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center border-t border-neutral-3 bg-white px-3 md:hidden">
      <button
        disabled={!prevLesson}
        onClick={() => prevLesson && goToLesson(prevLesson.id)}
        className="flex shrink-0 items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-6 transition-colors hover:text-neutral-9 disabled:pointer-events-none disabled:opacity-40"
      >
        <LeftOutlined className="text-xs" />
        Trước
      </button>

      <button
        onClick={() => setMobileDrawerOpen(true)}
        className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1"
      >
        <span className="flex items-center gap-1.5 text-[11px] text-neutral-5">
          <UnorderedListOutlined />
          {allLessons.length > 0 && (
            <span>
              {currentIndex + 1}/{allLessons.length}
            </span>
          )}
        </span>
        {currentLesson && (
          <p className="max-w-[160px] truncate text-xs font-semibold text-neutral-9">
            {currentLesson.title}
          </p>
        )}
      </button>

      <button
        disabled={!nextLesson}
        onClick={() => nextLesson && goToLesson(nextLesson.id)}
        className="flex shrink-0 items-center gap-1 rounded-lg bg-primary-6 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-7 disabled:pointer-events-none disabled:opacity-40"
      >
        Tiếp
        <RightOutlined className="text-xs" />
      </button>
    </div>
  )

  const sidebarContent = <ListModuleSidebar latestUnlockedId={latestUnlockedId} />

  const mobileDrawer = (
    <Drawer
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      placement="bottom"
      height="75vh"
      className="md:hidden"
      styles={{ header: { display: 'none' }, body: { padding: 0, overflow: 'hidden' } }}
    >
      {sidebarContent}
    </Drawer>
  )

  // overflow: clip prevents the collapsing sidebar from showing overflow,
  // while still allowing position:sticky to work on descendants (unlike overflow:hidden)
  const desktopSidebar = (
    <div
      className="hidden shrink-0 border-l border-neutral-3 transition-[width] duration-300 ease-in-out md:block"
      style={{ width: sidebarOpen ? 320 : 0, overflow: 'clip' }}
    >
      <div className="sticky top-0 h-[calc(100vh-64px)] w-80">{sidebarContent}</div>
    </div>
  )

  // ── Document layout ──────────────────────────────────────────────────────────
  if (currentLesson?.type === 'document') {
    return (
      <div className="-mx-4 flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
        <CelebrationModal open={showCelebration} onClose={() => setShowCelebration(false)} />
        {mobileDrawer}

        <div className="flex min-w-0 flex-1 flex-col pb-14 md:pb-0">
          <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
            <DocumentViewer
              courseId={courseId}
              lessonId={lessonId}
              onUnlock={setLatestUnlockedId}
              onCourseComplete={handleCourseComplete}
            />
            <div className="hidden md:block">{navBar}</div>
          </div>
          {curriculumData && currentLesson && (
            <div className="border-t border-neutral-3 bg-white px-6 py-6">
              <LessonInfoTab course={curriculumData.course} lesson={currentLesson} />
            </div>
          )}
        </div>

        {desktopSidebar}
        {mobileNav}
      </div>
    )
  }

  // ── Video / Quiz layout ──────────────────────────────────────────────────────
  return (
    <div className="-mx-4 flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
      <CelebrationModal open={showCelebration} onClose={() => setShowCelebration(false)} />
      {mobileDrawer}

      <div className="flex min-w-0 flex-1 flex-col pb-14 md:pb-0">
        {currentLesson?.type === 'quiz' && currentLesson.contentId ? (
          <QuizPlayer
            quizId={currentLesson.contentId}
            courseId={courseId}
            lessonId={lessonId}
            onCourseComplete={handleCourseComplete}
          />
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
            onCourseComplete={handleCourseComplete}
          />
        )}

        <div className="hidden md:block">{navBar}</div>

        <div className="flex-1 bg-white px-6">
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
                    <div className="py-8 text-center text-sm text-neutral-5">
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

      {desktopSidebar}
      {mobileNav}
    </div>
  )
}
