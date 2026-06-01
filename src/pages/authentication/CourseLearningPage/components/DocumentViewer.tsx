import { FileTextOutlined, LockOutlined } from '@ant-design/icons'
import { Result, Skeleton, Spin } from 'antd'

import { PdfViewer } from '@/components/PdfViewer/PdfViewer'
import {
  useDocumentTimer,
  useLessonDocumentContent,
  useLessonDocumentUrl,
  useLessonLearning,
} from '@/lib/tanstack-query'

interface DocumentViewerProps {
  courseId: string
  lessonId: string
  onUnlock?: (unlockedLessonId: string) => void
  onCourseComplete?: () => void
}

export const DocumentViewer = ({ courseId, lessonId, onUnlock, onCourseComplete }: DocumentViewerProps) => {
  const {
    data: learningData,
    isLoading: isLearningLoading,
    isError: isLearningError,
  } = useLessonLearning(lessonId, !!lessonId)

  const isAccessible = !!learningData?.isAccessible

  const { data: doc, isLoading: isDocLoading } = useLessonDocumentContent(lessonId, isAccessible)
  const { data: urlData, isLoading: isUrlLoading } = useLessonDocumentUrl(lessonId, isAccessible)

  // Silently tracks active reading time — pauses on tab hide/blur, heartbeat every 30s
  useDocumentTimer(lessonId, courseId, { onUnlock, onCourseComplete })

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLearningLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-100">
        <Skeleton active paragraph={{ rows: 5 }} className="max-w-sm" />
      </div>
    )
  }

  if (isLearningError || !learningData) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-white">
        <Result status="error" title="Không thể tải bài học" />
      </div>
    )
  }

  // ── Locked ───────────────────────────────────────────────────────────────────
  if (!isAccessible) {
    const pct = learningData.prerequisite?.watchedPercent ?? 0
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-slate-900 text-white">
        <LockOutlined style={{ fontSize: 40 }} />
        <p className="text-lg font-semibold">Bài học bị khoá</p>
        <p className="text-sm text-slate-300">
          Bạn cần hoàn thành ít nhất 80% bài trước (đã xem {pct.toFixed(0)}%)
        </p>
      </div>
    )
  }

  // ── Document / URL loading ───────────────────────────────────────────────────
  if (isDocLoading || isUrlLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-slate-50">
        <Spin size="large" />
        <p className="text-sm text-slate-400">Đang tải tài liệu...</p>
      </div>
    )
  }

  const pdfUrl = urlData?.documentUrl
  const title = doc?.title ?? learningData.lesson.title
  const totalPages = doc?.totalPages
  const fileSize = doc?.fileSize ?? doc?.file?.size ?? doc?.preview?.size

  // ── No URL available ─────────────────────────────────────────────────────────
  if (!pdfUrl) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-slate-50">
        <FileTextOutlined className="text-5xl text-slate-300" />
        <p className="text-sm text-slate-500">Tài liệu chưa có tệp đính kèm.</p>
      </div>
    )
  }

  // ── PDF viewer ────────────────────────────────────────────────────────────────
  return <PdfViewer url={pdfUrl} title={title} totalPages={totalPages} fileSize={fileSize} />
}
