import { useState } from 'react'
import { Alert, Button, Modal, Progress } from 'antd'
import type { QuizApi, QuizAttemptApi, SubmitAnswerPayload, SubmitQuizPayload } from '@/types/course-api'
import { QuizQuestionItem } from './QuizQuestionItem'
import { QuizTimer } from './QuizTimer'

interface QuizTakingProps {
  quiz: QuizApi
  attempt: QuizAttemptApi
  onSubmit: (payload: SubmitQuizPayload) => void
  isSubmitting: boolean
}

export const QuizTaking = ({ quiz, attempt, onSubmit, isSubmitting }: QuizTakingProps) => {
  const [answers, setAnswers] = useState<Record<string, SubmitAnswerPayload>>({})
  const [expired, setExpired] = useState(false)

  const expiresAt =
    attempt.startedAt && quiz.timeLimit
      ? new Date(new Date(attempt.startedAt).getTime() + quiz.timeLimit * 60 * 1000).toISOString()
      : null

  const answeredCount = Object.keys(answers).length
  const totalCount = quiz.questions.length

  const handleAnswer = (answer: SubmitAnswerPayload) => {
    setAnswers(prev => ({ ...prev, [answer.questionId]: answer }))
  }

  const buildPayload = (): SubmitQuizPayload => ({
    answers: quiz.questions.map(q => answers[q.id] ?? { questionId: q.id }),
  })

  const confirmSubmit = () => {
    const unanswered = totalCount - answeredCount
    if (unanswered === 0) {
      onSubmit(buildPayload())
      return
    }
    Modal.confirm({
      title: 'Nộp bài?',
      content: `Bạn còn ${unanswered} câu chưa trả lời. Các câu bỏ trống sẽ tính 0 điểm.`,
      okText: 'Nộp bài',
      cancelText: 'Làm tiếp',
      okButtonProps: { danger: true },
      onOk: () => onSubmit(buildPayload()),
    })
  }

  const handleExpire = () => {
    setExpired(true)
    onSubmit(buildPayload())
  }

  const sortedQuestions = [...quiz.questions].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-xl bg-white px-5 py-3 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-700">{quiz.title}</p>
          <Progress
            percent={Math.round((answeredCount / totalCount) * 100)}
            size="small"
            strokeColor="#f97316"
            className="mb-0 w-40"
            format={() => `${answeredCount}/${totalCount}`}
          />
        </div>
        {expiresAt && !expired && (
          <QuizTimer expiresAt={expiresAt} onExpire={handleExpire} />
        )}
        {expired && (
          <Alert type="error" message="Hết giờ — đang nộp bài..." showIcon className="py-1" />
        )}
      </div>

      {/* Question list */}
      <div className="flex flex-col gap-4">
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

      {/* Submit */}
      <div className="sticky bottom-0 flex justify-end rounded-xl border-t border-slate-100 bg-white/90 px-5 py-4 backdrop-blur">
        <Button
          type="primary"
          size="large"
          loading={isSubmitting}
          disabled={expired && !isSubmitting}
          onClick={confirmSubmit}
          className="rounded-xl bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600 px-8"
        >
          Nộp bài
        </Button>
      </div>
    </div>
  )
}
