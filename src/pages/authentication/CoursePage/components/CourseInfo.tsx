import { ClockCircleOutlined, TeamOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Rate, Tag } from 'antd';

import { type Course, CourseLevelColor, CourseLevelLabel, CourseStatusColor, CourseStatusLabel } from '@/models/Course';

interface CourseInfoProps {
  course: Course;
}

export const CourseInfo = ({ course }: CourseInfoProps) => {
  return (
    <Card className="mb-6 shadow-sm">
      {/* Course Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Tag color={CourseLevelColor[course.level]}>{CourseLevelLabel[course.level]}</Tag>
              <Tag color={CourseStatusColor[course.status]}>{CourseStatusLabel[course.status]}</Tag>
              {course.price === 0 && <Tag color="gold">Miễn phí</Tag>}
            </div>
          </div>
          {course.thumbnail && (
            <img src={course.thumbnail} alt={course.title} className="ml-4 h-32 w-48 rounded-lg object-cover" />
          )}
        </div>

        {course.description && <p className="text-base leading-relaxed text-gray-600">{course.description}</p>}
      </div>

      {/* Course Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-4">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-lg text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Thời lượng</div>
            <div className="font-semibold">{course.duration || 0} phút</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TeamOutlined className="text-lg text-green-500" />
          <div>
            <div className="text-xs text-gray-500">Học viên</div>
            <div className="font-semibold">{course.enrollmentCount || 0}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrophyOutlined className="text-lg text-yellow-500" />
          <div>
            <div className="text-xs text-gray-500">Đánh giá</div>
            <div className="flex items-center gap-1">
              <Rate disabled value={course.averageRating / 20} allowHalf className="text-xs" />
              <span className="text-xs text-gray-500">({course.reviewCount || 0})</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserOutlined className="text-lg text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">Giá</div>
            <div className="font-semibold">
              {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')} đ`}
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Info */}
      {course.instructorName && (
        <div className="border-t pt-4">
          <h3 className="mb-3 text-lg font-semibold">Giảng viên</h3>
          <div className="flex items-start gap-4">
            <Avatar size={64} src={course.instructorAvatar} icon={<UserOutlined />} className="flex-shrink-0" />
            <div className="flex-1">
              <h4 className="mb-1 text-base font-semibold">{course.instructorName}</h4>
              {course.instructorBio && <p className="text-sm text-gray-600">{course.instructorBio}</p>}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
