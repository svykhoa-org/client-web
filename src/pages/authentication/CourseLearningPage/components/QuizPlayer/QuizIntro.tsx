import {
  ClockCircleOutlined,
  ExpandOutlined,
  EyeInvisibleOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Alert, Button, Statistic, Tag } from 'antd'

import type { QuizApi, QuizAttemptApi } from '@/types/course-api'

interface QuizIntroProps {
  quiz: QuizApi
  submittedAttempts: QuizAttemptApi[]
  onStart: () => void
  isStarting: boolean
}

const STRICT_RULES = [
  {
    icon: <ExpandOutlined className="text-orange-500" />,
    label: 'Bài thi chạy ở chế độ toàn màn hình',
  },
  {
    icon: <EyeInvisibleOutlined className="text-amber-500" />,
    label: 'Chuyển tab sẽ bị ghi nhận là vi phạm',
  },
  {
    icon: <SafetyCertificateOutlined className="text-blue-500" />,
    label: 'Thoát toàn màn hình yêu cầu nộp bài hoặc quay lại',
  },
]

export const QuizIntro = ({ quiz, submittedAttempts, onStart, isStarting }: QuizIntroProps) => {
  const attemptsUsed = submittedAttempts.length
  const attemptsLeft = quiz.maxAttempts !== null ? quiz.maxAttempts - attemptsUsed : null
  const isExhausted = attemptsLeft !== null && attemptsLeft <= 0

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="w-full max-w-lg">
        {/* Main card */}
        <div className="rounded-2xl border border-neutral-3 bg-white p-8">
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
              <QuestionCircleOutlined className="text-3xl text-orange-400" />
            </div>
          </div>

          <h2 className="mb-1 text-xl font-semibold text-neutral-9">{quiz.title}</h2>
          <p className="mb-8 text-sm text-neutral-5">{quiz.questions.length} câu hỏi</p>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
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
              value={
                quiz.maxAttempts !== null ? `${attemptsUsed}/${quiz.maxAttempts}` : attemptsUsed
              }
              suffix={quiz.maxAttempts === null ? ' (∞)' : ''}
              valueStyle={{ fontSize: 20, color: '#d97706' }}
            />
          </div>

          {/* Last attempt result */}
          {attemptsUsed > 0 && (
            <div className="mb-6">
              <p className="mb-2 text-xs text-neutral-5">Kết quả lần thi gần nhất</p>
              {(() => {
                const last = submittedAttempts[submittedAttempts.length - 1]!
                return (
                  <Tag
                    color={last.isPassed ? 'success' : 'error'}
                    className="rounded-lg px-3 py-1 text-sm"
                  >
                    {last.isPassed ? '✓ Đạt' : '✗ Chưa đạt'} · {last.score}%
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
              className="rounded-xl text-left"
            />
          ) : (
            <Button
              type="primary"
              size="large"
              loading={isStarting}
              onClick={onStart}
              icon={<ExpandOutlined />}
              className="w-full rounded-xl border-orange-500 bg-orange-500 hover:border-orange-600 hover:bg-orange-600"
            >
              {attemptsUsed > 0 ? 'Thi lại' : 'Bắt đầu làm bài'}
            </Button>
          )}
        </div>

        {/* Strict mode notice */}
        <div className="mt-4 rounded-2xl border border-neutral-3 bg-white px-6 py-5 text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-5">
            Quy định khi làm bài
          </p>
          <div className="flex flex-col gap-3">
            {STRICT_RULES.map((rule, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-neutral-7">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-2">
                  {rule.icon}
                </span>
                {rule.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
