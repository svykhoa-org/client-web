import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

interface UseStrictModeOptions {
  enabled: boolean
  elementRef?: RefObject<HTMLElement | null>
  onTabViolation?: (count: number) => void
}

interface UseStrictModeReturn {
  isFullscreen: boolean
  showExitWarning: boolean
  tabViolations: number
  requestFullscreen: () => Promise<void>
  exitFullscreen: () => Promise<void>
  dismissExitWarning: () => void
}

export const useStrictMode = ({
  enabled,
  elementRef,
  onTabViolation,
}: UseStrictModeOptions): UseStrictModeReturn => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showExitWarning, setShowExitWarning] = useState(false)
  const [tabViolations, setTabViolations] = useState(0)

  // Tracks whether the fullscreen exit was triggered by our own code
  const intentionalExitRef = useRef(false)

  const requestFullscreen = useCallback(async () => {
    try {
      const el = elementRef?.current ?? document.documentElement
      await el.requestFullscreen()
    } catch {
      // Fullscreen not supported or user denied — continue without it
    }
  }, [elementRef])

  const exitFullscreen = useCallback(async () => {
    intentionalExitRef.current = true
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch {
      // ignore
    }
  }, [])

  const dismissExitWarning = useCallback(() => {
    setShowExitWarning(false)
    requestFullscreen()
  }, [requestFullscreen])

  useEffect(() => {
    if (!enabled) return

    const handleFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement
      setIsFullscreen(inFullscreen)

      if (!inFullscreen && !intentionalExitRef.current) {
        setShowExitWarning(true)
      }
      if (inFullscreen) {
        setShowExitWarning(false)
      }
      intentionalExitRef.current = false
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabViolations(prev => {
          const next = prev + 1
          onTabViolation?.(next)
          return next
        })
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, onTabViolation])

  // Exit fullscreen cleanly on unmount
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        intentionalExitRef.current = true
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  return {
    isFullscreen,
    showExitWarning,
    tabViolations,
    requestFullscreen,
    exitFullscreen,
    dismissExitWarning,
  }
}
