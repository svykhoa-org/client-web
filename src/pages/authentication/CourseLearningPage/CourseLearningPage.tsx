import { useParams } from 'react-router';

import { Result } from 'antd';

import RouteConfig from '@/constants/RouteConfig';

import { ListModuleSidebar } from './components/ListModuleSidebar';
import { VideoPlayer } from './components/VideoPlayer';

export const CourseLearningPage = () => {
  const params = useParams();
  const courseId = params[RouteConfig.CourseLearningPage.paramKey.courseId];
  const lessonId = params[RouteConfig.CourseLearningPage.paramKey.lessonId];

  return (
    <div className="flex min-h-svh flex-col gap-4 md:flex-row">
      <div className="w-full md:flex-1">
        {!courseId || !lessonId ? (
          <Result title="Bài học không hợp lệ" />
        ) : (
          <VideoPlayer courseId={courseId} lessonId={lessonId} />
        )}
      </div>
      <div className="md:basis-[300px]">
        <ListModuleSidebar />
      </div>
    </div>
  );
};
