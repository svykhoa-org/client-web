import { useState } from 'react';
import ReactPlayer from 'react-player';

import { Spin } from 'antd';
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
} from 'media-chrome/react';

import { useLessonDetail } from '@/lib/tanstack-query';

interface VideoPlayerProps {
  courseId: string;
  lessonId: string;
  onProgress?: (progress: { played: number; playedSeconds: number }) => void;
  onEnded?: () => void;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const [hasVideoError, setHasVideoError] = useState(false);

  const { data, isLoading, isError } = useLessonDetail({
    courseId: props.courseId,
    lessonId: props.lessonId,
    enabled: !!props.courseId && !!props.lessonId,
  });

  const showError = isError || hasVideoError;

  return (
    <MediaController className="relative aspect-video w-full">
      <ReactPlayer
        controls={false}
        slot="media"
        src={data?.streamUrl}
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
        }}
        onError={() => {
          setHasVideoError(true);
        }}
      />
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <Spin spinning size="large" />
        </div>
      )}
      {!isLoading && showError && (
        <div className="shadow-text pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white">
          Video không khả dụng
        </div>
      )}
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
  );
};
