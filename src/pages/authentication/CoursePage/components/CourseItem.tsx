import { useNavigate } from 'react-router';

import { Button, Card } from 'antd';

import defaultThumbnail from '@/assets/course-thumbnail-default.jpeg';
import RouteConfig from '@/constants/RouteConfig';
import type { Course } from '@/models/Course';

interface Props {
  course: Course;
}

export const CourseItem = ({ course }: Props) => {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate(RouteConfig.CourseDetailPage.path.replace(':id', course.id || ''));
  };

  return (
    <Card
      hoverable
      className="mb-2 h-full w-full"
      actions={[
        <div className="!h-fit px-3">
          <Button type="primary" block onClick={handleAction}>
            Xem chi tiết
          </Button>
        </div>,
      ]}
      cover={
        <div className="h-32 overflow-hidden sm:h-40">
          <img alt={course.title} src={course?.thumbnail || defaultThumbnail} className="h-full w-full object-cover" />
        </div>
      }
    >
      <div className="min-h-20">
        <div className="mb-2 line-clamp-2 w-full text-base">{course.title}</div>
        <div className="line-clamp-3 w-full text-xs text-gray-500">{course.description}</div>
      </div>
    </Card>
  );
};
