import { Checkbox, Input, Radio, Space } from 'antd'

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
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <p className="mb-4 font-medium text-slate-800">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
          {index + 1}
        </span>
        {question.content}
        {question.points > 1 && (
          <span className="ml-2 text-xs text-slate-400">({question.points} điểm)</span>
        )}
      </p>

      {isSingleSelect(question.type) ? (
        <Radio.Group
          value={answer?.selectedOptionIds?.[0]}
          onChange={e => handleSingleSelect(e.target.value)}
        >
          <Space direction="vertical" className="w-full">
            {sortedOptions.map(opt => (
              <Radio
                key={opt.id}
                value={opt.id}
                className="w-full rounded-lg p-2 hover:bg-slate-50"
              >
                {opt.content}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      ) : question.type === 'multiple_choice' ? (
        <Space direction="vertical" className="w-full">
          {sortedOptions.map(opt => (
            <Checkbox
              key={opt.id}
              checked={(answer?.selectedOptionIds ?? []).includes(opt.id)}
              onChange={e => handleMultiSelect(opt.id, e.target.checked)}
              className="w-full rounded-lg p-2 hover:bg-slate-50"
            >
              {opt.content}
            </Checkbox>
          ))}
        </Space>
      ) : (
        /* short_answer */
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
