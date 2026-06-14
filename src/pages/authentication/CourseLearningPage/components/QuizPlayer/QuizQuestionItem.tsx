import { CheckOutlined } from '@ant-design/icons'
import { Input } from 'antd'

import type { QuestionType, QuizQuestion, SubmitAnswerPayload } from '@/types/course-api'

interface QuizQuestionItemProps {
  question: QuizQuestion
  index: number
  answer: SubmitAnswerPayload | undefined
  onChange: (answer: SubmitAnswerPayload) => void
}

const isSingleSelect = (type: QuestionType) => type === 'single_choice' || type === 'true_false'

export const QuizQuestionItem = ({ question, index, answer, onChange }: QuizQuestionItemProps) => {
  const sortedOptions = [...question.options].sort((a, b) => a.order - b.order)

  const handleSingleSelect = (optionId: string) => {
    onChange({ questionId: question.id, selectedOptionIds: [optionId] })
  }

  const handleMultiSelect = (optionId: string, checked: boolean) => {
    const current = answer?.selectedOptionIds ?? []
    const next = checked ? [...current, optionId] : current.filter(id => id !== optionId)
    onChange({ questionId: question.id, selectedOptionIds: next })
  }

  const handleTextChange = (text: string) => {
    onChange({ questionId: question.id, textAnswer: text })
  }

  return (
    <div className="rounded-xl border border-neutral-3 bg-white p-6">
      <p className="mb-4 font-medium text-neutral-9">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-1 text-xs font-bold text-primary-7">
          {index + 1}
        </span>
        {question.content}
        {question.points > 1 && (
          <span className="ml-2 text-xs text-neutral-5">({question.points} điểm)</span>
        )}
      </p>

      {isSingleSelect(question.type) ? (
        <div className="flex flex-col gap-2">
          {sortedOptions.map(opt => {
            const isSelected = answer?.selectedOptionIds?.[0] === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSingleSelect(opt.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-primary-6 bg-primary-1'
                    : 'border-neutral-3 bg-white hover:border-primary-4 hover:bg-neutral-2'
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? 'border-primary-6' : 'border-neutral-4'
                  }`}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-primary-6" />}
                </span>
                <span
                  className={`text-sm ${isSelected ? 'font-medium text-primary-8' : 'text-neutral-8'}`}
                >
                  {opt.content}
                </span>
              </button>
            )
          })}
        </div>
      ) : question.type === 'multiple_choice' ? (
        <div className="flex flex-col gap-2">
          {sortedOptions.map(opt => {
            const isChecked = (answer?.selectedOptionIds ?? []).includes(opt.id)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleMultiSelect(opt.id, !isChecked)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  isChecked
                    ? 'border-primary-6 bg-primary-1'
                    : 'border-neutral-3 bg-white hover:border-primary-4 hover:bg-neutral-2'
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isChecked ? 'border-primary-6 bg-primary-6' : 'border-neutral-4'
                  }`}
                >
                  {isChecked && <CheckOutlined className="text-[10px] text-white" />}
                </span>
                <span
                  className={`text-sm ${isChecked ? 'font-medium text-primary-8' : 'text-neutral-8'}`}
                >
                  {opt.content}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <Input.TextArea
          rows={3}
          placeholder="Nhập câu trả lời của bạn..."
          value={answer?.textAnswer ?? ''}
          onChange={e => handleTextChange(e.target.value)}
          className="rounded-lg"
        />
      )}
    </div>
  )
}
