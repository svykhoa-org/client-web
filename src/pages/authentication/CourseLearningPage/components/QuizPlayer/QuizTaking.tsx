import { useEffect, useRef, useState } from 'react'

import {
  ExclamationCircleOutlined,
  ExpandOutlined,
  EyeInvisibleOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Button, Progress } from 'antd'

import { useStrictMode } from '@/hooks/useStrictMode'
import type {
  QuizApi,
  QuizAttemptApi,
  SubmitAnswerPayload,
  SubmitQuizPayload,
} from '@/types/course-api'

import { QuizQuestionItem } from './QuizQuestionItem'
import { QuizTimer } from './QuizTimer'

interface QuizTakingProps {
  quiz: QuizApi
  attempt: QuizAttemptApi
  onSubmit: (payload: SubmitQuizPayload) => void
  isSubmitting: boolean
}

// Overlays use fixed inset-0: inside a fullscreen element, position:fixed is relative to
// the fullscreen viewport (covers the entire screen). Outside fullscreen it covers the viewport too.
const ExitWarningOverlay = ({
  onReturn,
  onSubmit,
}: {
  onReturn: () => void
  onSubmit: () => void
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <ExclamationCircleOutlined className="text-3xl text-red-500" />
        </div>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-9">Bạn đã thoát toàn màn hình</h3>
      <p className="mb-8 text-sm text-neutral-6 leading-relaxed">
        Bài thi vẫn đang tiến hành. Vui lòng quay lại toàn màn hình để tiếp tục hoặc nộp bài ngay.
      </p>
      <div className="flex flex-col gap-3">
        <Button
          type="primary"
          size="large"
          icon={<ExpandOutlined />}
          onClick={onReturn}
          className="w-full rounded-xl border-orange-500 bg-orange-500 hover:border-orange-600 hover:bg-orange-600"
        >
          Quay lại toàn màn hình
        </Button>
        <Button
          size="large"
          icon={<SendOutlined />}
          onClick={onSubmit}
          danger
          className="w-full rounded-xl"
        >
          Nộp bài ngay
        </Button>
      </div>
    </div>
  </div>
)

const SubmitConfirmOverlay = ({
  unanswered,
  onConfirm,
  onCancel,
  isSubmitting,
}: {
  unanswered: number
  onConfirm: () => void
  onCancel: () => void
  isSubmitting: boolean
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
          <SendOutlined className="text-3xl text-amber-500" />
        </div>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-9">Nộp bài?</h3>
      {unanswered > 0 ? (
        <p className="mb-8 text-sm leading-relaxed text-neutral-6">
          Bạn còn <span className="font-semibold text-red-500">{unanswered} câu</span> chưa trả lời.
          Các câu bỏ trống sẽ tính 0 điểm.
        </p>
      ) : (
        <p className="mb-8 text-sm leading-relaxed text-neutral-6">
          Bạn đã trả lời tất cả câu hỏi. Xác nhận nộp bài?
        </p>
      )}
      <div className="flex flex-col gap-3">
        <Button
          type="primary"
          size="large"
          danger
          loading={isSubmitting}
          onClick={onConfirm}
          className="w-full rounded-xl"
        >
          Xác nhận nộp bài
        </Button>
        <Button size="large" onClick={onCancel} className="w-full rounded-xl">
          Làm tiếp
        </Button>
      </div>
    </div>
  </div>
)

export const QuizTaking = ({ quiz, attempt, onSubmit, isSubmitting }: QuizTakingProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [answers, setAnswers] = useState<Record<string, SubmitAnswerPayload>>({})
  const [expired, setExpired] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  const {
    isFullscreen,
    showExitWarning,
    tabViolations,
    requestFullscreen,
    exitFullscreen,
    dismissExitWarning,
  } = useStrictMode({ enabled: true, elementRef: containerRef })

  const expiresAt =
    attempt.startedAt && quiz.timeLimit
      ? new Date(new Date(attempt.startedAt).getTime() + quiz.timeLimit * 60 * 1000).toISOString()
      : null

  const answeredCount = Object.keys(answers).length
  const totalCount = quiz.questions.length
  const sortedQuestions = [...quiz.questions].sort((a, b) => a.order - b.order)
  const progressPercent = Math.round((answeredCount / totalCount) * 100)

  const buildPayload = (): SubmitQuizPayload => ({
    answers: quiz.questions.map(q => answers[q.id] ?? { questionId: q.id }),
  })

  // Capture payload before the async exitFullscreen() to avoid reading stale closure state
  const doSubmit = () => {
    const payload = buildPayload()
    exitFullscreen().then(() => onSubmit(payload))
  }

  useEffect(() => {
    requestFullscreen()
  }, [requestFullscreen])

  const handleAnswer = (answer: SubmitAnswerPayload) => {
    setAnswers(prev => ({ ...prev, [answer.questionId]: answer }))
  }

  const handleExpire = () => {
    setExpired(true)
    const payload = buildPayload()
    exitFullscreen().then(() => onSubmit(payload))
  }

  return (
    /*
     * This div is the fullscreen target — only its content is visible when in fullscreen.
     * [&:fullscreen] applies h-screen immediately (before React re-render).
     * isFullscreen also applies h-screen as a JS-based backup after the state update.
     * Both together ensure the flex layout fills the screen height reliably.
     */
    <div
      ref={containerRef}
      className={`flex flex-col bg-neutral-2 [&:fullscreen]:h-screen [&:fullscreen]:overflow-hidden${isFullscreen ? ' h-screen overflow-hidden' : ''}`}
    >
      {/* Overlays — inside the container so they appear in fullscreen */}
      {showExitWarning && <ExitWarningOverlay onReturn={dismissExitWarning} onSubmit={doSubmit} />}
      {showSubmitConfirm && (
        <SubmitConfirmOverlay
          unanswered={totalCount - answeredCount}
          onConfirm={() => {
            setShowSubmitConfirm(false)
            doSubmit()
          }}
          onCancel={() => setShowSubmitConfirm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Header — shrink-0 so it never compresses in fullscreen flex layout */}
      <div className="shrink-0 border-b border-neutral-3 bg-white">
        <div className="flex items-center gap-4 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-9">{quiz.title}</p>
            <div className="mt-1">
              <Progress
                percent={progressPercent}
                size="small"
                strokeColor="#f97316"
                className="mb-0 w-36"
                format={() => `${answeredCount}/${totalCount}`}
              />
            </div>
          </div>

          {tabViolations > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              <EyeInvisibleOutlined />
              <span>{tabViolations} vi phạm</span>
            </div>
          )}

          {expiresAt && !expired && <QuizTimer expiresAt={expiresAt} onExpire={handleExpire} />}
          {expired && (
            <div className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
              Hết giờ — đang nộp bài...
            </div>
          )}
        </div>
      </div>

      {/* Questions — flex-1 + overflow-y-auto scrolls within fullscreen container */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {sortedQuestions.map((q, idx) => (
            <QuizQuestionItem
              key={q.id}
              question={q}
              index={idx}
              answer={answers[q.id]}
              onChange={handleAnswer}
            />
          ))}
        </div>
      </div>

      {/* Footer — shrink-0 always sticks to bottom of the fullscreen container */}
      <div className="shrink-0 border-t border-neutral-3 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <p className="text-sm text-neutral-6">
            {answeredCount}/{totalCount} câu đã trả lời
          </p>
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            loading={isSubmitting}
            disabled={expired && !isSubmitting}
            onClick={() => setShowSubmitConfirm(true)}
            className="rounded-xl border-orange-500 bg-orange-500 px-8 hover:border-orange-600 hover:bg-orange-600"
          >
            Nộp bài
          </Button>
        </div>
      </div>
    </div>
  )
}
