import { useRef } from 'react'

import { MediaPlayer, type MediaPlayerInstance, MediaProvider } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'

export interface VideoPlayerProps {
  url: string
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  const player = useRef<MediaPlayerInstance>(null)

  return (
    <div className="w-full">
      <MediaPlayer
        ref={player}
        className="aspect-video w-full bg-black"
        load="eager"
        muted
        autoPlay
        playsInline
        title="CME Video"
        src={{ src: url, type: 'video/mp4' }}
        onError={e => {
          // @ts-expect-error Checking
          console.error('Vidstack error:', e?.detail ?? e)
        }}
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  )
}
