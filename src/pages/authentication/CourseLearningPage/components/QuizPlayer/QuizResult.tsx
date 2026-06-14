import { useState } from 'react'

import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CloseCircleFilled,
  DownOutlined,
  ReloadOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Alert, Button, Progress } from 'antd'

import type { QuizApi, QuizAttemptApi, SnapshotAnswerRecord } from '@/types/course-api'

interface QuizResultProps {
  quiz: QuizApi
  attempt: QuizAttemptApi
  canRetry: boolean
  onRetry: () => void
  isRetrying: boolean
}

const ReviewQuestion = ({ record, index }: { record: SnapshotAnswerRecord; index: number }) => {
  const sortedOptions = [...record.allOptions].sort((a, b) => a.order - b.order)

  return (
    <div className="px-5 py-4">
      {/* Question header row */}
      <div className="mb-3 flex items-start gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            record.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}
        >
          {index + 1}
        </span>
        <p className="flex-1 min-w-0 text-sm font-medium leading-snug text-neutral-9">
          {record.questionContent}
        </p>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
            record.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {record.pointsEarned}/{record.maxPoints} đ
        </span>
      </div>

      {/* Answer area */}
      {record.questionType === 'short_answer' ? (
        <div className="ml-10 rounded-lg bg-neutral-2 px-3 py-2.5 text-sm">
          <span className="text-neutral-5">Câu trả lời: </span>
          <span className={record.isCorrect ? 'font-medium text-green-700' : 'text-red-600'}>
            {record.textAnswer || '(Bỏ trống)'}
          </span>
        </div>
      ) : (
        <div className="ml-10 flex flex-col gap-1.5">
          {sortedOptions.map(opt => {
            const isSelected = (record.selectedOptionIds ?? []).includes(opt.id)
            const isCorrect = opt.isCorrect

            let cardCls: string
            let textCls: string
            let icon: React.ReactNode

            if (isSelected && isCorrect) {
              cardCls = 'border-green-400 bg-green-50'
              textCls = 'font-medium text-green-800'
              icon = <CheckCircleFilled className="shrink-0 text-green-500" />
            } else if (isSelected && !isCorrect) {
              cardCls = 'border-red-400 bg-red-50'
              textCls = 'text-red-700'
              icon = <CloseCircleFilled className="shrink-0 text-red-500" />
            } else if (!isSelected && isCorrect) {
              cardCls = 'border-green-200 bg-green-50/40'
              textCls = 'text-green-700'
              icon = <CheckCircleOutlined className="shrink-0 text-green-400" />
            } else {
              cardCls = 'border-neutral-2 bg-white'
              textCls = 'text-neutral-5'
              icon = <span className="w-4 shrink-0" />
            }

            return (
              <div
                key={opt.id}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${cardCls}`}
              >
                {icon}
                <span className={textCls}>{opt.content}</span>
              </div>
            )
          })}

          {/* Answer key hint when wrong */}
          {!record.isCorrect && (
            <p className="mt-1 text-[11px] text-neutral-5">
              <span className="mr-1 inline-block h-2 w-2 rounded-full border border-green-400 bg-green-50/40" />
              Đáp án đúng
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export const QuizResult = ({ quiz, attempt, canRetry, onRetry, isRetrying }: QuizResultProps) => {
  const answers = attempt.answers ?? []
  const correctCount = answers.filter(a => a.isCorrect).length
  const incorrectCount = answers.length - correctCount
  const earnedPoints = answers.reduce((s, a) => s + a.pointsEarned, 0)
  const totalPoints = answers.reduce((s, a) => s + a.maxPoints, 0)

  const [reviewOpen, setReviewOpen] = useState(!attempt.isPassed)

  const passColor = '#16a34a'
  const failColor = '#dc2626'
  const strokeColor = attempt.isPassed ? passColor : failColor

  return (
    <div className="flex flex-col gap-4 px-4 py-8 max-w-2xl mx-auto w-full">
      {/* ── Score hero ── */}
      <div className="overflow-hidden rounded-2xl border border-neutral-3 bg-white shadow-sm">
        {/* Accent line */}
        <div className="h-1" style={{ background: strokeColor }} />

        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            {/* Circle score */}
            <div className="flex shrink-0 flex-col items-center gap-3">
              <Progress
                type="circle"
                percent={Number(attempt.score)}
                size={120}
                strokeWidth={8}
                strokeColor={strokeColor}
                trailColor="#e5e5e5"
                format={p => (
                  <span className="text-[26px] font-bold" style={{ color: strokeColor }}>
                    {p}%
                  </span>
                )}
              />
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                  attempt.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}
              >
                {attempt.isPassed ? (
                  <CheckCircleFilled className="text-green-500" />
                ) : (
                  <CloseCircleFilled className="text-red-500" />
                )}
                {attempt.isPassed ? 'Đạt' : 'Chưa đạt'}
              </span>
            </div>

            {/* Stats + actions */}
            <div className="flex-1 min-w-0 w-full">
              {/* Stats grid */}
              <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl bg-neutral-2 p-4">
                <div className="text-center">
                  <p className="text-[11px] text-neutral-5">Câu đúng</p>
                  <p className="mt-0.5 text-lg font-bold leading-none text-neutral-9">
                    {correctCount}
                    <span className="text-xs font-normal text-neutral-5">/{answers.length}</span>
                  </p>
                </div>
                <div className="text-center border-x border-neutral-3">
                  <p className="text-[11px] text-neutral-5">Điểm số</p>
                  <p className="mt-0.5 text-lg font-bold leading-none text-neutral-9">
                    {earnedPoints}
                    <span className="text-xs font-normal text-neutral-5">/{totalPoints}</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-neutral-5">Lần thi</p>
                  <p className="mt-0.5 text-lg font-bold leading-none text-neutral-9">
                    #{attempt.attemptNumber}
                  </p>
                </div>
              </div>

              <p className="mb-4 flex items-center gap-1.5 text-xs text-neutral-5">
                <TrophyOutlined className="text-warning-3" />
                Điểm cần đạt: {quiz.passingScore}%
              </p>

              {attempt.isPassed && (
                <Alert
                  type="success"
                  message="Chúc mừng! Bài học đã được ghi nhận hoàn thành."
                  showIcon
                  className="rounded-xl text-left"
                />
              )}
              {!attempt.isPassed && !canRetry && (
                <Alert
                  type="warning"
                  message="Bạn đã dùng hết số lần thi cho phép."
                  showIcon
                  className="rounded-xl text-left"
                />
              )}
              {!attempt.isPassed && canRetry && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRetry}
                  loading={isRetrying}
                  type="primary"
                  className="rounded-xl"
                >
                  Thi lại
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Question review ── */}
      {answers.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-neutral-3 bg-white shadow-sm">
          {/* Toggle header */}
          <button
            type="button"
            onClick={() => setReviewOpen(v => !v)}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-neutral-2"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-neutral-9">Chi tiết từng câu</span>
              {correctCount > 0 && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                  {correctCount} đúng
                </span>
              )}
              {incorrectCount > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                  {incorrectCount} sai
                </span>
              )}
            </div>
            <DownOutlined
              className="text-xs text-neutral-5 transition-transform duration-200"
              style={{ transform: reviewOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {/* Question list */}
          {reviewOpen && (
            <div className="divide-y divide-neutral-2 border-t border-neutral-3">
              {answers.map((record, idx) => (
                <ReviewQuestion key={record.questionId} record={record} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
