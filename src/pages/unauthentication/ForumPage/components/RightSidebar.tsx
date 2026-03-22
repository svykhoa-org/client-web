import { useNavigate } from 'react-router';

import { ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import ResourceCard from '@/components/resource/ResourceCard';
import ActiveUserItem from '@/components/user/ActiveUserItem';
import RouteConfig from '@/constants/RouteConfig';
import type { ActiveUser } from '@/mocks/activeUsers';
import type { FeaturedDocument } from '@/mocks/categories';
import type { Resource } from '@/models/Resource';

interface RightSidebarProps {
  activeUsers: ActiveUser[];
  featuredDocuments: FeaturedDocument[];
  featuredResources?: Resource[];
}

const RightSidebar = ({ activeUsers, featuredDocuments, featuredResources = [] }: RightSidebarProps) => {
  const navigate = useNavigate();
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Thành viên hoạt động */}
      <div className="bg-neutral-1 rounded-lg p-4">
        <h3 className="text-neutral-9 mb-4 text-lg font-semibold">Thành viên tích cực</h3>
        <div className="space-y-1">
          {activeUsers.map(user => (
            <ActiveUserItem key={user._id} user={user} />
          ))}
        </div>
      </div>

      {/* Tài liệu nổi bật */}
      <div className="bg-neutral-1 rounded-lg p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-neutral-9 text-lg font-semibold">Tài liệu y khoa</h3>
          <Button
            type="link"
            size="small"
            className="text-primary-500 flex items-center text-sm"
            onClick={() => navigate(RouteConfig.ResourceListPage.path)}
          >
            Xem thêm <ArrowRightOutlined />
          </Button>
        </div>

        <div className="space-y-4">
          {featuredResources.length > 0
            ? featuredResources.map(resource => <ResourceCard key={resource._id} resource={resource} />)
            : // Show mock documents if no resources available
              featuredDocuments.map(doc => (
                <div
                  key={doc._id}
                  className="border-neutral-3 hover:bg-neutral-2 rounded-md border p-3 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-neutral-9 mb-1 text-sm font-medium">{doc.title}</h4>
                      <p className="text-neutral-6 mb-2 text-xs">{doc.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="bg-secondary-1 text-secondary-8 rounded px-2 py-1 text-xs font-medium">
                          {doc.category}
                        </span>
                        <div className="text-neutral-5 flex items-center space-x-2 text-xs">
                          <span className="bg-neutral-3 text-neutral-7 rounded px-1.5 py-0.5 font-mono">
                            {doc.fileType}
                          </span>
                          <span>{formatNumber(doc.viewCount)} lượt xem</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Widget thống kê */}
      <div className="bg-neutral-1 rounded-lg p-4">
        <h3 className="text-neutral-9 mb-4 text-lg font-semibold">Thống kê diễn đàn</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-6 text-sm">Tổng bài viết</span>
            <span className="text-neutral-9 text-sm font-semibold">2,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-6 text-sm">Thành viên</span>
            <span className="text-neutral-9 text-sm font-semibold">15,234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-6 text-sm">Bài viết hôm nay</span>
            <span className="text-primary-6 text-sm font-semibold">127</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-6 text-sm">Người online</span>
            <span className="text-success-3 text-sm font-semibold">892</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
