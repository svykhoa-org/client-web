import React from 'react';
import { useNavigate } from 'react-router';

import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import type { Resource } from '@/models/Resource';

interface ResourceCardProps {
  resource: Resource;
  onDownloadClick?: (resource: Resource) => void;
  disabled?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDownloadClick, disabled = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${RouteConfig.ResourceDetailPage.path.replace(':id', resource?._id || '')}`);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownloadClick && !disabled) {
      onDownloadClick(resource);
    }
  };

  // Định dạng giá
  const formatPrice = (price: number, currency: string): string => {
    if (price === 0) return 'Miễn phí';

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
    }).format(price);
  };

  // Định dạng kích thước file
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div
      className="hover:border-primary-500 flex cursor-pointer items-start rounded-lg border border-gray-200 p-3 transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <div className="mr-3 flex-shrink-0">
        <FileTextOutlined className="text-primary-500 text-2xl" />
      </div>
      <div className="flex-grow">
        <h3 className="mb-1 line-clamp-1 text-base font-medium">{resource.title}</h3>
        <p className="text-neutral-7 mb-2 line-clamp-2 text-sm">{resource.description || 'Không có mô tả'}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span>{resource.fileType || 'Tài liệu'}</span>
            {resource.fileSize && <span className="text-neutral-6">{formatFileSize(resource.fileSize)}</span>}
          </div>
          <div className="flex items-center gap-2">
            {onDownloadClick && (
              <Button
                size="small"
                type="text"
                icon={<DownloadOutlined />}
                className="text-primary-6"
                onClick={handleDownloadClick}
                disabled={disabled}
                title="Tải xuống"
              />
            )}
            <Tag color={resource.price === 0 ? 'success' : 'blue'} className="m-0">
              {formatPrice(resource.price, resource.currency)}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
