import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { Alert, Button, Collapse, Progress, Tag } from 'antd'

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
    <div className="flex flex-col gap-2">
      <p className="font-medium text-slate-700">
        {index + 1}. {record.questionContent}
        {record.isCorrect ? (
          <CheckCircleOutlined className="ml-2 text-green-500" />
        ) : (
          <CloseCircleOutlined className="ml-2 text-red-500" />
        )}
      </p>

      {record.questionType === 'short_answer' ? (
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <span className="text-slate-500">Câu trả lời của bạn: </span>
          <span className={record.isCorrect ? 'text-green-600 font-medium' : 'text-red-600'}>
            {record.textAnswer || '(Bỏ trống)'}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {sortedOptions.map(opt => {
            const isSelected = (record.selectedOptionIds ?? []).includes(opt.id)
            const isCorrect = opt.isCorrect
            const highlight =
              isSelected && isCorrect
                ? 'border-green-400 bg-green-50'
                : isSelected && !isCorrect
                  ? 'border-red-400 bg-red-50'
                  : isCorrect
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-slate-200'
            return (
              <div
                key={opt.id}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${highlight}`}
              >
                {isSelected ? (
                  isCorrect ? (
                    <CheckCircleOutlined className="text-green-500" />
                  ) : (
                    <CloseCircleOutlined className="text-red-500" />
                  )
                ) : isCorrect ? (
                  <CheckCircleOutlined className="text-green-400" />
                ) : (
                  <span className="w-4" />
                )}
                {opt.content}
              </div>
            )
          })}
        </div>
      )}

      <p className="text-right text-xs text-slate-400">
        {record.pointsEarned}/{record.maxPoints} điểm
      </p>
    </div>
  )
}

export const QuizResult = ({ quiz, attempt, canRetry, onRetry, isRetrying }: QuizResultProps) => {
  return (
    <div className="flex flex-col gap-6 px-4 py-8">
      {/* Score card */}
      <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-8 shadow-sm text-center">
        <Progress
          type="circle"
          percent={Number(attempt.score)}
          size={120}
          strokeColor={attempt.isPassed ? '#16a34a' : '#dc2626'}
          format={p => <span className="text-2xl font-bold">{p}%</span>}
        />
        <div className="mt-4">
          <Tag
            color={attempt.isPassed ? 'success' : 'error'}
            className="text-base px-4 py-1 rounded-full"
          >
            {attempt.isPassed ? '✓ Đạt' : '✗ Chưa đạt'}
          </Tag>
          <p className="mt-2 text-sm text-slate-500">
            Điểm yêu cầu: {quiz.passingScore}% — Lần thi thứ {attempt.attemptNumber}
          </p>
        </div>

        {attempt.isPassed && (
          <Alert
            type="success"
            message="Chúc mừng! Bài học đã được ghi nhận hoàn thành."
            showIcon
            className="mt-4 w-full text-left"
          />
        )}

        {canRetry && !attempt.isPassed && (
          <Button
            icon={<ReloadOutlined />}
            onClick={onRetry}
            loading={isRetrying}
            className="mt-6 rounded-xl"
          >
            Thi lại
          </Button>
        )}

        {!canRetry && !attempt.isPassed && (
          <Alert
            type="warning"
            message="Bạn đã dùng hết số lần thi."
            showIcon
            className="mt-4 w-full text-left"
          />
        )}
      </div>

      {/* Per-question review */}
      {attempt.answers && (
        <Collapse
          ghost
          items={[
            {
              key: 'review',
              label: <span className="font-medium text-slate-700">Xem chi tiết từng câu</span>,
              children: (
                <div className="flex flex-col gap-6">
                  {attempt.answers.map((record, idx) => (
                    <ReviewQuestion key={record.questionId} record={record} index={idx} />
                  ))}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
