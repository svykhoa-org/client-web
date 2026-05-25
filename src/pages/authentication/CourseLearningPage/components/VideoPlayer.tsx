import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { LockOutlined } from '@ant-design/icons'
import { Result, Spin } from 'antd'
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaPlaybackRateButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from 'media-chrome/react'
import ReactPlayer from 'react-player'

import { useLessonDetail, useLessonLearning, useUpdateWatchTime } from '@/lib/tanstack-query'

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void
}

interface VideoPlayerProps {
  courseId: string
  lessonId: string
  onProgress?: (progress: { played: number; playedSeconds: number }) => void
  onEnded?: () => void
  onUnlock?: (unlockedLessonId: string) => void
}

const HEARTBEAT_INTERVAL_MS = 30_000

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const watchedSecondsRef = useRef(0)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      const videoEl = containerRef.current?.querySelector('video')
      if (videoEl) videoEl.currentTime = seconds
    },
  }))

  const {
    data: learningData,
    isLoading: isLearningLoading,
    isError: isLearningError,
  } = useLessonLearning(props.lessonId, !!props.lessonId)

  const { data: streamData } = useLessonDetail({
    courseId: props.courseId,
    lessonId: props.lessonId,
    enabled: !!learningData?.isAccessible,
  })

  const { mutate: sendWatchTime } = useUpdateWatchTime(props.lessonId, {
    onUnlock: props.onUnlock,
  })

  const startHeartbeat = () => {
    if (heartbeatRef.current) return
    heartbeatRef.current = setInterval(() => {
      if (watchedSecondsRef.current > 0) {
        sendWatchTime(watchedSecondsRef.current)
      }
    }, HEARTBEAT_INTERVAL_MS)
  }

  const stopHeartbeat = () => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
    if (watchedSecondsRef.current > 0) {
      sendWatchTime(watchedSecondsRef.current)
    }
  }

  // Cleanup heartbeat on unmount / lesson change
  useEffect(() => {
    watchedSecondsRef.current = 0
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
        heartbeatRef.current = null
      }
      if (watchedSecondsRef.current > 0) {
        sendWatchTime(watchedSecondsRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lessonId])

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    if (video.duration) {
      const currentTime = video.currentTime
      watchedSecondsRef.current = Math.max(watchedSecondsRef.current, Math.floor(currentTime))
      props.onProgress?.({
        played: currentTime / video.duration,
        playedSeconds: currentTime,
      })
    }
  }

  if (isLearningLoading) {
    return (
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (isLearningError || !learningData) {
    return (
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        <Result status="error" title="Không thể tải bài học" />
      </div>
    )
  }

  if (!learningData.isAccessible) {
    const pct = learningData.prerequisite?.watchedPercent ?? 0
    return (
      <div className="relative aspect-video w-full bg-slate-900 flex flex-col items-center justify-center gap-3 text-white">
        <LockOutlined style={{ fontSize: 40 }} />
        <p className="font-semibold text-lg">Bài học bị khoá</p>
        <p className="text-sm text-slate-300">
          Bạn cần xem ít nhất 80% bài trước (đã xem {pct.toFixed(0)}%)
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      <MediaController className="relative aspect-video w-full">
        <ReactPlayer
          controls={false}
          slot="media"
          src={streamData?.streamUrl}
          preload="auto"
          style={{ width: '100%', height: '100%' }}
          onPlay={startHeartbeat}
          onPause={stopHeartbeat}
          onEnded={() => {
            stopHeartbeat()
            props.onEnded?.()
          }}
          onTimeUpdate={handleTimeUpdate}
          onError={() => {
            /* handled by streamData being undefined */
          }}
        />
        <MediaControlBar>
          <MediaPlayButton className="aspect-square" />
          <MediaSeekBackwardButton seekOffset={10} className="aspect-square" />
          <MediaSeekForwardButton seekOffset={10} className="aspect-square" />
          <MediaTimeRange />
          <MediaTimeDisplay showDuration />
          <MediaMuteButton className="aspect-square" />
          <MediaVolumeRange className="aspect-square" />
          <MediaPlaybackRateButton className="aspect-square" />
          <MediaFullscreenButton className="aspect-square" />
        </MediaControlBar>
      </MediaController>
    </div>
  )
})

VideoPlayer.displayName = 'VideoPlayer'
