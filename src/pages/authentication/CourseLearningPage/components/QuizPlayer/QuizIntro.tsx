import { ClockCircleOutlined, QuestionCircleOutlined, TrophyOutlined } from '@ant-design/icons'
import { Alert, Button, Statistic, Tag } from 'antd'

import type { QuizApi, QuizAttemptApi } from '@/types/course-api'

interface QuizIntroProps {
  quiz: QuizApi
  submittedAttempts: QuizAttemptApi[]
  onStart: () => void
  isStarting: boolean
}

export const QuizIntro = ({ quiz, submittedAttempts, onStart, isStarting }: QuizIntroProps) => {
  const attemptsUsed = submittedAttempts.length
  const attemptsLeft = quiz.maxAttempts !== null ? quiz.maxAttempts - attemptsUsed : null
  const isExhausted = attemptsLeft !== null && attemptsLeft <= 0

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <QuestionCircleOutlined className="text-5xl text-orange-400" />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-slate-800">{quiz.title}</h2>
        <p className="mb-8 text-sm text-slate-500">{quiz.questions.length} câu hỏi</p>

        <div className="mb-8 grid grid-cols-3 gap-4 text-center">
          <Statistic
            title="Điểm đạt"
            value={quiz.passingScore}
            suffix="%"
            valueStyle={{ fontSize: 20, color: '#16a34a' }}
            prefix={<TrophyOutlined />}
          />
          <Statistic
            title="Thời gian"
            value={quiz.timeLimit ?? '∞'}
            suffix={quiz.timeLimit ? 'phút' : ''}
            valueStyle={{ fontSize: 20, color: '#2563eb' }}
            prefix={<ClockCircleOutlined />}
          />
          <Statistic
            title="Lượt thi"
            value={quiz.maxAttempts !== null ? `${attemptsUsed}/${quiz.maxAttempts}` : attemptsUsed}
            suffix={quiz.maxAttempts === null ? ' (không giới hạn)' : ''}
            valueStyle={{ fontSize: 20, color: '#d97706' }}
          />
        </div>

        {attemptsUsed > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-xs text-slate-400">Kết quả lần thi gần nhất</p>
            {(() => {
              const last = submittedAttempts[submittedAttempts.length - 1]!
              return (
                <Tag color={last.isPassed ? 'success' : 'error'} className="text-sm px-3 py-1">
                  {last.isPassed ? '✓ Đạt' : '✗ Chưa đạt'} — {last.score}%
                </Tag>
              )
            })()}
          </div>
        )}

        {isExhausted ? (
          <Alert
            type="warning"
            message="Bạn đã dùng hết số lần thi cho phép."
            showIcon
            className="text-left"
          />
        ) : (
          <Button
            type="primary"
            size="large"
            loading={isStarting}
            onClick={onStart}
            className="w-full rounded-xl bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
          >
            {attemptsUsed > 0 ? 'Thi lại' : 'Bắt đầu làm bài'}
          </Button>
        )}
      </div>
    </div>
  )
}
