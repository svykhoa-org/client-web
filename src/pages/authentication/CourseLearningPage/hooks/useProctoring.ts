import { useCallback, useEffect, useRef, useState } from 'react'

import type { ProctoringConfig } from '@/types/course-api'

import { submitProctoringSnapshot } from '@/services/LessonProgress/submitProctoringSnapshot'

const INTERACTION_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'] as const

interface UseProctoringParams {
  lessonId: string
  config: ProctoringConfig | null | undefined
  /** Master switch — proctoring runs only while true (e.g. config.enabled && lesson not completed). */
  active: boolean
  isPlaying: boolean
  getVideoPositionSeconds: () => number
  pauseVideo: () => void
  playVideo: () => void
}

export interface ProctoringState {
  /** Presence-check modal (webcam photo) is open. */
  presenceCheckOpen: boolean
  /** Lightweight "are you still there?" prompt is open. */
  idlePromptOpen: boolean
  cameraRequired: boolean
  /** True while the photo upload is in flight. */
  submitting: boolean
  submitPhoto: (photo: Blob) => Promise<void>
  declineCheck: () => Promise<void>
  dismissIdlePrompt: () => void
}

const minutesToSeconds = (m: number) => Math.max(1, Math.round(m * 60))

export function useProctoring({
  lessonId,
  config,
  active,
  isPlaying,
  getVideoPositionSeconds,
  pauseVideo,
  playVideo,
}: UseProctoringParams): ProctoringState {
  const [presenceCheckOpen, setPresenceCheckOpen] = useState(false)
  const [idlePromptOpen, setIdlePromptOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Accumulated play time (seconds) and bookkeeping refs.
  const playSecondsRef = useRef(0)
  const lastInteractionRef = useRef(Date.now())
  const checksDoneRef = useRef(0)
  const nextCheckAtRef = useRef<number | null>(null)
  const isPlayingRef = useRef(isPlaying)
  isPlayingRef.current = isPlaying

  const presence = config?.presenceCheck
  const presenceEnabled = !!(active && config?.enabled && presence?.enabled)
  const cameraRequired = !!config?.cameraRequired
  const maxInactivity = config?.maxInactivitySeconds ?? 0

  const scheduleNextCheck = useCallback(() => {
    if (!presence) {
      nextCheckAtRef.current = null
      return
    }
    if (checksDoneRef.current >= presence.maxChecksPerVideo) {
      nextCheckAtRef.current = null
      return
    }
    if (presence.mode === 'random') {
      const min = minutesToSeconds(presence.randomMinMinutes)
      const max = minutesToSeconds(presence.randomMaxMinutes)
      const span = Math.max(0, max - min)
      nextCheckAtRef.current = playSecondsRef.current + min + Math.floor(Math.random() * (span + 1))
    } else {
      nextCheckAtRef.current =
        (checksDoneRef.current + 1) * minutesToSeconds(presence.intervalMinutes)
    }
  }, [presence])

  // Reset all state when the lesson changes or proctoring (de)activates.
  useEffect(() => {
    playSecondsRef.current = 0
    checksDoneRef.current = 0
    lastInteractionRef.current = Date.now()
    setPresenceCheckOpen(false)
    setIdlePromptOpen(false)
    if (presenceEnabled) scheduleNextCheck()
    else nextCheckAtRef.current = null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, presenceEnabled])

  // Track user interaction for the idle watchdog.
  useEffect(() => {
    if (!active) return
    const onInteract = () => {
      lastInteractionRef.current = Date.now()
    }
    INTERACTION_EVENTS.forEach(evt => window.addEventListener(evt, onInteract, { passive: true }))
    return () => {
      INTERACTION_EVENTS.forEach(evt => window.removeEventListener(evt, onInteract))
    }
  }, [active])

  // 1s tick: accumulate play time, run idle + presence checks.
  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      if (!isPlayingRef.current) return

      playSecondsRef.current += 1

      // Idle watchdog — pause when the user hasn't interacted for too long.
      if (maxInactivity > 0 && Date.now() - lastInteractionRef.current >= maxInactivity * 1000) {
        pauseVideo()
        setIdlePromptOpen(true)
        return
      }

      // Presence check — pause and require a webcam photo.
      if (
        presenceEnabled &&
        nextCheckAtRef.current !== null &&
        playSecondsRef.current >= nextCheckAtRef.current
      ) {
        pauseVideo()
        setPresenceCheckOpen(true)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [active, maxInactivity, presenceEnabled, pauseVideo])

  const submitPhoto = useCallback(
    async (photo: Blob) => {
      setSubmitting(true)
      try {
        await submitProctoringSnapshot({
          lessonId,
          status: 'submitted',
          videoPositionSeconds: getVideoPositionSeconds(),
          photo,
        })
        checksDoneRef.current += 1
        scheduleNextCheck()
        lastInteractionRef.current = Date.now()
        setPresenceCheckOpen(false)
        playVideo()
      } finally {
        setSubmitting(false)
      }
    },
    [lessonId, getVideoPositionSeconds, scheduleNextCheck, playVideo],
  )

  const declineCheck = useCallback(async () => {
    try {
      await submitProctoringSnapshot({
        lessonId,
        status: 'declined',
        videoPositionSeconds: getVideoPositionSeconds(),
      })
    } catch {
      // best-effort logging of the decline; ignore network errors here
    }
    if (cameraRequired) {
      // Hard requirement: keep the video paused, leave the modal open.
      return
    }
    checksDoneRef.current += 1
    scheduleNextCheck()
    lastInteractionRef.current = Date.now()
    setPresenceCheckOpen(false)
    playVideo()
  }, [lessonId, getVideoPositionSeconds, cameraRequired, scheduleNextCheck, playVideo])

  const dismissIdlePrompt = useCallback(() => {
    lastInteractionRef.current = Date.now()
    setIdlePromptOpen(false)
    playVideo()
  }, [playVideo])

  return {
    presenceCheckOpen,
    idlePromptOpen,
    cameraRequired,
    submitting,
    submitPhoto,
    declineCheck,
    dismissIdlePrompt,
  }
}
