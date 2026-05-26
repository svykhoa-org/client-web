import { useEffect, useRef, useState } from 'react'

import { ClockCircleOutlined } from '@ant-design/icons'

interface QuizTimerProps {
  expiresAt: string // ISO date string
  onExpire: () => void
}

export const QuizTimer = ({ expiresAt, onExpire }: QuizTimerProps) => {
  const expiry = new Date(expiresAt).getTime()

  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((expiry - Date.now()) / 1000)),
  )
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    const expiryMs = new Date(expiresAt).getTime()
    const calc = () => Math.max(0, Math.floor((expiryMs - Date.now()) / 1000))

    const initial = calc()
    setRemaining(initial)

    if (initial <= 0) {
      onExpireRef.current()
      return
    }

    const id = setInterval(() => {
      const next = calc()
      setRemaining(next)
      if (next <= 0) {
        clearInterval(id)
        onExpireRef.current()
      }
    }, 1000)

    return () => clearInterval(id)
  }, [expiresAt])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const isWarning = remaining <= 60
  const isExpired = remaining <= 0

  const formatted = isExpired
    ? 'Hết giờ'
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium tabular-nums ${
        isWarning
          ? 'bg-red-50 text-red-600 animate-pulse'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      <ClockCircleOutlined />
      {formatted}
    </div>
  )
}
