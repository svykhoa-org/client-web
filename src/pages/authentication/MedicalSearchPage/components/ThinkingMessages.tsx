import { useEffect, useMemo, useState } from 'react'

import { Sparkles } from 'lucide-react'

interface ThinkingMessagesProps {
  /** Latest real backend status, surfaced first before the curated rotation. */
  liveStatus?: string
}

const PERIOD_MS = 6500 // approx time between phrase changes
const CHAR_STAGGER = 30 // ms between each character animating
const CHAR_ANIM = 400 // ms per character (keep in sync with CSS .msearch-char-*)
const MIN_DWELL = 1200 // ms a phrase stays fully visible at minimum

// Progressive phrases that make the wait feel like active, multi-step work
// instead of a single frozen line.
const PHRASES = [
  'Đang phân tích câu hỏi của bạn...',
  'Đang tra cứu kho dữ liệu y khoa...',
  'Đang đối chiếu các nguồn tài liệu liên quan...',
  'Đang tổng hợp thông tin từ nhiều nguồn...',
  'Đang kiểm tra tính chính xác của dữ liệu...',
  'Đang sắp xếp nội dung câu trả lời...',
  'Sắp hoàn tất, vui lòng chờ trong giây lát...',
]

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

export const ThinkingMessages = ({ liveStatus }: ThinkingMessagesProps) => {
  const reduced = usePrefersReducedMotion()

  const messages = useMemo(
    () => (liveStatus?.trim() ? [liveStatus.trim(), ...PHRASES] : PHRASES),
    [liveStatus],
  )

  const [index, setIndex] = useState(0)
  // 'in' = current phrase typing in (start -> end)
  // 'out' = current phrase dissolving (end -> start) before advancing
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  // Restart from the top whenever the message set changes (e.g. a new live status).
  useEffect(() => {
    setIndex(0)
    setPhase('in')
  }, [messages])

  useEffect(() => {
    const text = messages[index] ?? ''
    const sweep = Math.max(0, text.length - 1) * CHAR_STAGGER + CHAR_ANIM

    // Reduced motion: no per-character choreography, just swap on a timer.
    if (reduced) {
      const id = window.setTimeout(() => {
        setIndex(prev => (prev + 1) % messages.length)
      }, PERIOD_MS)
      return () => clearTimeout(id)
    }

    if (phase === 'in') {
      // Hold the fully-typed phrase, then start dissolving it.
      const dwell = Math.max(MIN_DWELL, PERIOD_MS - 2 * sweep)
      const id = window.setTimeout(() => setPhase('out'), sweep + dwell)
      return () => clearTimeout(id)
    }

    // 'out' finished dissolving: advance to the next phrase and type it in.
    const id = window.setTimeout(() => {
      setIndex(prev => (prev + 1) % messages.length)
      setPhase('in')
    }, sweep)
    return () => clearTimeout(id)
  }, [index, phase, messages, reduced])

  const text = messages[index] ?? ''
  const chars = [...text]
  const total = chars.length

  return (
    <div
      className="text-primary-7 flex items-start gap-2 text-sm font-medium"
      role="status"
      aria-live="polite"
    >
      <Sparkles size={16} className="mt-0.5 shrink-0 animate-pulse" />

      {/* Full phrase for screen readers; the animated characters are decorative. */}
      <span className="sr-only">{text}</span>

      {reduced ? (
        <span aria-hidden="true">{text}</span>
      ) : (
        <span aria-hidden="true">
          {chars.map((ch, i) => {
            if (ch === ' ') return <span key={`${index}-space-${i}`}> </span>
            // in: first -> last. out: last -> first.
            const delay = phase === 'in' ? i * CHAR_STAGGER : (total - 1 - i) * CHAR_STAGGER
            return (
              <span
                key={`${index}-${phase}-${i}`}
                className={phase === 'in' ? 'msearch-char-in' : 'msearch-char-out'}
                style={{ animationDelay: `${delay}ms` }}
              >
                {ch}
              </span>
            )
          })}
        </span>
      )}
    </div>
  )
}
