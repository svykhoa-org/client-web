import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { Button, Result, Spin } from 'antd'
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

import { getDocumentStream, type GetDocumentStreamOutput } from '@/services/Document'

interface WatermarkedVideoPlayerProps {
  documentId: string
}

// Ask for a fresh signed URL this long before the current one expires.
const REFRESH_LEAD_MS = 60_000
const MIN_REFRESH_DELAY_MS = 5_000
// How often the burnt-in identity jumps to a new spot, so cropping one corner
// cannot remove it for the whole recording.
const OVERLAY_MOVE_INTERVAL_MS = 10_000
const OVERLAY_GUARD_INTERVAL_MS = 3_000
const OVERLAY_MIN_OPACITY = 0.05

const randomInRange = (min: number, max: number) => min + Math.random() * (max - min)
const randomPosition = () => ({ top: randomInRange(8, 72), left: randomInRange(4, 55) })

/**
 * Plays a purchased VIDEO document. The viewer's name/email/license code is
 * rendered as a moving overlay. It is a SIBLING of <MediaController> inside a
 * wrapper that is set as the controller's fullscreenElement, because:
 *  - media-chrome fades every slotted child of <media-controller> to opacity 0
 *    while the user is idle (`userinactive`), which would hide a child overlay
 *    exactly while the video plays;
 *  - the wrapper (not the controller) is what goes fullscreen, so the sibling
 *    overlay still shows there.
 * It deters and traces leaks made through this player; it does not prevent
 * downloading (without HLS the signed mp4 URL can still be copied during its
 * TTL). Known gap: iOS
 * Safari's native <video> fullscreen bypasses DOM overlays.
 */
const WatermarkedVideoPlayerInner = ({ documentId }: WatermarkedVideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  // Playback state captured right before the URL is swapped on refresh.
  const resumeRef = useRef<{ time: number; wasPlaying: boolean } | null>(null)

  const [stream, setStream] = useState<GetDocumentStreamOutput | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [position, setPosition] = useState(randomPosition)
  const [tampered, setTampered] = useState(false)

  const getVideoElement = useCallback(
    () => containerRef.current?.querySelector('video') ?? null,
    [],
  )

  const loadStream = useCallback(
    async (isRefresh: boolean) => {
      try {
        if (isRefresh) {
          const video = getVideoElement()
          resumeRef.current = video
            ? { time: video.currentTime, wasPlaying: !video.paused && !video.ended }
            : null
        }
        const next = await getDocumentStream({ documentId })
        setStream(next)
        setErrorMessage(null)
      } catch (error) {
        // Keep the current (still valid for a moment) stream on a refresh failure.
        if (!isRefresh) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Không thể tải video. Vui lòng thử lại.',
          )
        }
      }
    },
    [documentId, getVideoElement],
  )

  useEffect(() => {
    void loadStream(false)
  }, [loadStream])

  // Make the wrapper (controller + overlay) the fullscreen target.
  const hasStream = stream !== null
  useEffect(() => {
    const container = containerRef.current
    const controller = container?.querySelector('media-controller') as
      | (HTMLElement & { fullscreenElement: HTMLElement })
      | null
    if (container && controller) controller.fullscreenElement = container
  }, [hasStream, tampered])

  // Schedule the next signed-URL refresh from the current expiry.
  useEffect(() => {
    if (!stream) return
    const delay = Math.max(
      MIN_REFRESH_DELAY_MS,
      new Date(stream.expiresAt).getTime() - Date.now() - REFRESH_LEAD_MS,
    )
    const timer = setTimeout(() => void loadStream(true), delay)
    return () => clearTimeout(timer)
  }, [stream, loadStream])

  // After a refresh swaps the src, jump back to where the viewer was.
  const streamUrl = stream?.streamUrl
  useEffect(() => {
    const resume = resumeRef.current
    if (!streamUrl || !resume) return
    const video = getVideoElement()
    if (!video) return
    const onLoaded = () => {
      video.currentTime = resume.time
      if (resume.wasPlaying) void video.play().catch(() => undefined)
      resumeRef.current = null
    }
    video.addEventListener('loadedmetadata', onLoaded, { once: true })
    return () => video.removeEventListener('loadedmetadata', onLoaded)
  }, [streamUrl, getVideoElement])

  useEffect(() => {
    const timer = setInterval(() => setPosition(randomPosition()), OVERLAY_MOVE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  // Tamper guard: if the overlay node is removed or hidden, stop playback by
  // unmounting the whole player (a notice replaces it). Rebuilding only the
  // overlay via a React key would make React call removeChild on a node the
  // user already detached and crash the page. Stops casual devtools edits only
  // — a determined user can still bypass.
  useEffect(() => {
    const container = containerRef.current
    if (!container || !stream || tampered) return

    const restore = () => {
      getVideoElement()?.pause()
      setTampered(true)
    }
    const check = () => {
      const overlay = overlayRef.current
      if (!overlay || !overlay.isConnected) return restore()
      const style = window.getComputedStyle(overlay)
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        Number(style.opacity) < OVERLAY_MIN_OPACITY
      ) {
        restore()
      }
    }

    const observer = new MutationObserver(check)
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
    })
    const timer = setInterval(check, OVERLAY_GUARD_INTERVAL_MS)
    return () => {
      observer.disconnect()
      clearInterval(timer)
    }
  }, [stream, tampered, getVideoElement])

  if (tampered) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-10">
        <Result
          status="warning"
          title="Phát hiện thay đổi giao diện trình phát"
          subTitle="Video đã được tạm dừng. Vui lòng tải lại trình phát để tiếp tục xem."
          extra={
            <Button type="primary" onClick={() => setTampered(false)}>
              Tải lại trình phát
            </Button>
          }
        />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-10">
        <Result status="warning" title="Không thể phát video" subTitle={errorMessage} />
      </div>
    )
  }

  if (!stream) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-10">
        <Spin />
      </div>
    )
  }

  const { fullName, email, code } = stream.watermark

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg bg-neutral-10 [&:fullscreen]:flex [&:fullscreen]:items-center [&:fullscreen]:justify-center"
      onContextMenu={event => event.preventDefault()}
    >
      <MediaController className="aspect-video w-full">
        <ReactPlayer
          controls={false}
          slot="media"
          src={stream.streamUrl}
          preload="auto"
          playsInline
          style={{ width: '100%', height: '100%' }}
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
      {/* Sibling of MediaController: immune to media-chrome's idle fade. */}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none absolute z-10 select-none text-xs font-medium text-white/50 drop-shadow transition-all duration-1000"
        style={{ top: `${position.top}%`, left: `${position.left}%` }}
      >
        <div>{fullName}</div>
        <div>{email}</div>
        <div className="font-mono tracking-widest">{code}</div>
      </div>
    </div>
  )
}

interface BoundaryState {
  failed: boolean
}

// Contain any render/commit crash (e.g. a browser extension or devtools mutating
// the player's DOM) to the player instead of blanking the whole route.
class PlayerErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-10">
        <Result
          status="warning"
          title="Không thể hiển thị trình phát"
          subTitle="Vui lòng thử lại."
          extra={
            <Button type="primary" onClick={() => this.setState({ failed: false })}>
              Thử lại
            </Button>
          }
        />
      </div>
    )
  }
}

export const WatermarkedVideoPlayer = (props: WatermarkedVideoPlayerProps) => (
  <PlayerErrorBoundary>
    <WatermarkedVideoPlayerInner {...props} />
  </PlayerErrorBoundary>
)
