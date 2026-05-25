import { useEffect, useRef } from 'react'

import { useUpdateWatchTime } from './useLessonProgressQueries'

/**
 * Tracks active time a user spends on a document lesson.
 * Pauses when the tab is hidden or the window loses focus.
 * Sends accumulated seconds every 30s and flushes on unmount.
 */
export const useDocumentTimer = (
  lessonId: string,
  options?: { onUnlock?: (unlockedLessonId: string) => void },
) => {
  const { mutate: sendWatchTime } = useUpdateWatchTime(lessonId, options)
  const activeRef = useRef(true)
  const accumulatedRef = useRef(0)
  const lastTickRef = useRef(Date.now())

  useEffect(() => {
    activeRef.current = true
    accumulatedRef.current = 0
    lastTickRef.current = Date.now()

    const tick = () => {
      const now = Date.now()
      if (activeRef.current) {
        accumulatedRef.current += Math.floor((now - lastTickRef.current) / 1000)
      }
      lastTickRef.current = now
    }

    const sendAccumulated = () => {
      tick()
      if (accumulatedRef.current > 0) {
        sendWatchTime(accumulatedRef.current)
      }
    }

    const handleHide = () => {
      tick()
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

    const interval = setInterval(sendAccumulated, 30_000)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('blur', handleHide)
    window.addEventListener('focus', handleShow)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('blur', handleHide)
      window.removeEventListener('focus', handleShow)
      sendAccumulated()
    }
    // sendWatchTime identity is stable (useMutation); lessonId change resets the timer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])
}
