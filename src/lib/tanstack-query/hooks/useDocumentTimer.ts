import { useEffect, useRef } from 'react'

import { useUpdateWatchTime } from './useLessonProgressQueries'

export const useDocumentTimer = (
  lessonId: string,
  options?: { onUnlock?: (unlockedLessonId: string) => void },
) => {
  const { mutate: sendWatchTime } = useUpdateWatchTime(lessonId, options)
  const activeRef = useRef(true)
  const lastTickRef = useRef(Date.now())

  useEffect(() => {
    activeRef.current = true
    lastTickRef.current = Date.now()

    const consumeElapsed = (): number => {
      const now = Date.now()
      const elapsed = activeRef.current
        ? Math.floor((now - lastTickRef.current) / 1000)
        : 0
      lastTickRef.current = now
      return elapsed
    }

    const sendTick = () => {
      const elapsed = consumeElapsed()
      if (elapsed > 0) sendWatchTime(elapsed)
    }

    const handleHide = () => {
      const elapsed = consumeElapsed()
      if (elapsed > 0) sendWatchTime(elapsed)
      activeRef.current = false
    }

    const handleShow = () => {
      lastTickRef.current = Date.now()
      activeRef.current = true
    }

    const handleVisibility = () => {
      if (document.hidden) handleHide()
      else handleShow()
    }

    const interval = setInterval(sendTick, 30_000)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('blur', handleHide)
    window.addEventListener('focus', handleShow)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('blur', handleHide)
      window.removeEventListener('focus', handleShow)
      const elapsed = consumeElapsed()
      if (elapsed > 0) sendWatchTime(elapsed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])
}
