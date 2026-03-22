import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LockOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Collapse, Empty, Tag } from 'antd';

import type { Lesson, LessonContentType, LessonStatus } from '@/models/Lesson';
import type { Module } from '@/models/Module';

interface CourseModulesProps {
  modules?: Module[];
  isAccess?: boolean;
}

const LessonIcon = ({ contentType }: { contentType: LessonContentType }) => {
  return contentType === 'VIDEO' ? (
    <PlayCircleOutlined className="text-blue-500" />
  ) : (
    <FileTextOutlined className="text-green-500" />
  );
};

const LessonStatusTag = ({ status }: { status: LessonStatus }) => {
  const statusConfig = {
    PUBLISHED: { color: 'success', icon: <CheckCircleOutlined />, text: 'Đã xuất bản' },
    DRAFT: { color: 'default', icon: <ClockCircleOutlined />, text: 'Bản nháp' },
    UPLOADING: { color: 'processing', icon: <ClockCircleOutlined />, text: 'Đang tải lên' },
  };

  const config = statusConfig[status];
  return (
    <Tag color={config.color} icon={config.icon} className="ml-2">
      {config.text}
    </Tag>
  );
};

export const CourseModules = ({
  modules,
  onLessonClick,
  isAccess = true,
}: CourseModulesProps & { onLessonClick?: (lessonId: string) => void }) => {
  if (!modules || modules.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6">
        <Empty description="Chưa có module nào" />
      </div>
    );
  }

  const items = modules.map(module => ({
    key: module.id,
    label: (
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">
          {module.rank}. {module.title}
        </span>
        <span className="text-sm text-gray-500">{module.lessons?.length || 0} bài học</span>
      </div>
    ),
    children: (
      <div className="space-y-2">
        {module.lessons && module.lessons.length > 0 ? (
          module.lessons.map((lesson: Lesson, index: number) => (
            <div
              key={lesson.id}
              onClick={() => onLessonClick?.(lesson.id || '')}
              className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-1 items-center gap-3">
                <LessonIcon contentType={lesson.contentType} />
                <span className="text-gray-700">
                  {index + 1}. {lesson.title}
                </span>
                {!isAccess && <LockOutlined className="text-gray-400" />}
              </div>
              <LessonStatusTag status={lesson.status} />
            </div>
          ))
        ) : (
          <Empty description="Chưa có bài học nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    ),
  }));

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold text-gray-900">Nội dung khóa học</h2>
        <p className="mt-1 text-sm text-gray-500">
          {modules.length} module • {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} bài học
        </p>
      </div>
      <div className="p-4">
        <Collapse items={items} defaultActiveKey={modules[0]?.id} className="border-none bg-transparent" />
      </div>
    </div>
  );
};
