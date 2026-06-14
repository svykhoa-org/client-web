import ReactMarkdown from 'react-markdown'

import { AlertCircle, RotateCw, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { AnswerStatus } from '../hooks/useAiSearch'
import { ThinkingMessages } from './ThinkingMessages'

interface AnswerPanelProps {
  status: AnswerStatus
  answer: string
  statusMessage: string
  error: string | null
  onRetry: () => void
}

const ThinkingSkeleton = ({ liveStatus }: { liveStatus: string }) => (
  <div className="space-y-4">
    <ThinkingMessages liveStatus={liveStatus} />
    <div className="space-y-3">
      {['w-[92%]', 'w-full', 'w-[78%]', 'w-[88%]', 'w-[64%]'].map((w, i) => (
        <div
          key={i}
          className={cn('bg-neutral-3/70 h-3.5 animate-pulse rounded-full', w)}
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  </div>
)

export const AnswerPanel = ({
  status,
  answer,
  statusMessage,
  error,
  onRetry,
}: AnswerPanelProps) => {
  if (status === 'error') {
    return (
      <div className="border-error-2/60 bg-error-1 flex flex-col items-start gap-3 rounded-2xl border p-6">
        <div className="text-error-3 flex items-center gap-2 font-semibold">
          <AlertCircle size={18} />
          <span>Không thể tải câu trả lời</span>
        </div>
        <p className="text-sm leading-relaxed text-neutral-7">
          {error ?? 'Đã xảy ra lỗi. Vui lòng thử lại sau giây lát.'}
        </p>
        <button
          onClick={onRetry}
          className="bg-primary-6 hover:bg-primary-7 mt-1 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors active:scale-[0.97]"
        >
          <RotateCw size={15} />
          Thử lại
        </button>
      </div>
    )
  }

  if (status === 'streaming' && !answer) {
    return (
      <div className="rounded-2xl border border-neutral-3 bg-white p-6 shadow-sm sm:p-8">
        <ThinkingSkeleton liveStatus={statusMessage} />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-neutral-3 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-primary-7 mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <Sparkles size={14} />
        Trợ lý y khoa AI
      </div>

      <div className="prose prose-sm">
        <ReactMarkdown>{answer}</ReactMarkdown>
        {status === 'streaming' && (
          <span
            className="bg-primary-6 ml-0.5 inline-block h-[1.1em] w-[3px] translate-y-[2px] animate-pulse rounded-full align-text-bottom"
            aria-hidden="true"
          />
        )}
      </div>

      {status === 'done' && (
        <p className="mt-6 border-t border-neutral-2 pt-4 text-xs leading-relaxed text-neutral-5">
          Thông tin do AI tổng hợp, chỉ mang tính tham khảo. Vui lòng tham vấn ý kiến bác sĩ chuyên
          khoa trước khi đưa ra quyết định điều trị.
        </p>
      )}
    </div>
  )
}
