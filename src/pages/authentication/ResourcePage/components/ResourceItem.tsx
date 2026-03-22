import { type MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  BookOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Avatar, Button, Card, Modal, Tag, Tooltip, Typography, message } from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import type { Resource } from '@/models/Resource';
import { resourceOrderService } from '@/services/Order/checkoutResource';

const { Text, Title } = Typography;

interface ResourceItemProps {
  resource: Resource;
  isFeatured?: boolean;
}

export const ResourceItem = ({ resource, isFeatured = false }: ResourceItemProps) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleAction = () => {
    navigate(RouteConfig.ResourceDetailPage.path.replace(':id', resource.id || resource._id || ''));
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(price);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Mock categories
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Y Khoa Tổng Quát': 'blue',
      'Nhi Khoa': 'green',
      'Sản Phụ Khoa': 'pink',
      'Tim Mạch': 'red',
      'Thần Kinh': 'purple',
      'Da Liễu': 'orange',
      default: 'geekblue',
    };
    return colors[category || ''] || colors.default;
  };

  const checkoutMutation = useMutation({
    mutationFn: (resourceId: string) => resourceOrderService.checkoutResource(resourceId),
    onSuccess: response => {
      if (response.statusCode === 201 || response.statusCode === 200) {
        if (response.data && 'checkoutUrl' in response.data) {
          window.location.href = response.data.checkoutUrl;
        } else {
          message.success('Đã chuyển đến trang thanh toán!');
        }
      } else {
        message.error(response.message || 'Có lỗi xảy ra');
      }
    },
    onError: () => {
      message.error('Không thể kết nối đến hệ thống');
    },
  });

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const resourceId = resource.id || resource._id;
    if (resourceId) {
      checkoutMutation.mutate(resourceId);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    message.success(isWishlisted ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // Render badge based on resource properties
  const renderBadges = () => {
    const badges = [];

    if (isFeatured) {
      badges.push(
        <Tag key="featured" color="orange" className="mb-1 flex items-center gap-1">
          <RocketOutlined /> Nổi bật
        </Tag>
      );
    }

    if (resource.soldCount && resource.soldCount > 50) {
      badges.push(
        <Tag key="bestseller" color="red" className="mb-1 flex items-center gap-1">
          🔥 Bán chạy
        </Tag>
      );
    }

    if (resource.price === 0) {
      badges.push(
        <Tag key="free" color="green" className="mb-1 flex items-center gap-1">
          <CheckCircleOutlined /> Miễn phí
        </Tag>
      );
    } else if (resource.avgRating && resource.avgRating >= 4.5) {
      badges.push(
        <Tag key="rating" color="gold" className="mb-1 flex items-center gap-1">
          ⭐ {resource.avgRating}
        </Tag>
      );
    }

    return badges;
  };

  return (
    <>
      <Card
        hoverable
        className={`group relative h-full overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl ${
          isFeatured ? 'ring-2 ring-orange-400' : ''
        }`}
        bodyStyle={{ padding: '0' }}
        onClick={handleAction}
      >
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {resource.thumbnail ? (
            <img
              alt={resource.title}
              src={resource.thumbnail}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="flex flex-col items-center">
                <BookOutlined className="text-5xl text-blue-300" />
                <span className="mt-2 text-sm font-semibold text-gray-500">{resource.fileType || 'DOC'}</span>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">{renderBadges()}</div>

          {/* Wishlist button */}
          <div className="absolute top-2 right-2 z-10">
            <Tooltip title={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>
              <Button
                type="default"
                shape="circle"
                icon={isWishlisted ? <HeartOutlined className="text-red-500" /> : <HeartOutlined />}
                onClick={handleWishlist}
                className="flex h-9 w-9 items-center justify-center border-0 bg-white/90 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              />
            </Tooltip>
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              type="default"
              size="small"
              onClick={handleQuickView}
              className="h-9 border-white bg-white/90 text-gray-700 backdrop-blur-sm transition-transform hover:scale-105"
            >
              Xem nhanh
            </Button>
            {resource.price === 0 ? (
              <Button
                type="primary"
                size="small"
                icon={<BookOutlined />}
                onClick={e => {
                  e.stopPropagation();
                  handleAction();
                }}
                className="h-9 border-0 bg-green-500 transition-transform hover:scale-105 hover:bg-green-600"
              >
                Tải ngay
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                icon={<ShoppingCartOutlined />}
                onClick={handleQuickBuy}
                loading={checkoutMutation.isPending}
                className="h-9 border-0 bg-green-500 transition-transform hover:scale-105 hover:bg-green-600"
              >
                Mua ngay
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex min-h-[160px] flex-col justify-between p-4">
          <div>
            {/* Category */}
            {resource.category && (
              <Text
                className="mb-1 block text-xs font-medium tracking-wide uppercase"
                style={{ color: getCategoryColor(resource.category.name) }}
              >
                {resource.category.name}
              </Text>
            )}

            {/* Title */}
            <Title level={5} className="mb-2 line-clamp-2 text-gray-800 transition-colors group-hover:text-blue-600">
              {resource.title}
            </Title>

            {/* Description */}
            <Text className="mb-3 line-clamp-2 block text-xs text-gray-500">
              {resource.description || 'Không có mô tả'}
            </Text>

            {/* Stats */}
            <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
              {resource.avgRating && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <StarFilled className="text-xs" />
                  <span className="font-medium">{resource.avgRating}</span>
                  <span className="text-gray-400">({resource.totalReviews || 0})</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <BookOutlined className="text-gray-400" />
                {resource.downloadCount || 0} lượt tải
              </span>
              {resource.fileSize && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">
                  {formatFileSize(resource.fileSize)}
                </span>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2">
              {/* Author avatar */}
              {resource.uploader?.avatarUrl ? (
                <Avatar src={resource.uploader.avatarUrl} size="small" />
              ) : (
                <Avatar size="small" className="bg-blue-500">
                  {resource.uploader?.fullName?.charAt(0) || 'A'}
                </Avatar>
              )}
              <Text className="line-clamp-1 text-xs text-gray-500">{resource.uploader?.fullName || 'Admin'}</Text>
            </div>

            {/* Price */}
            <div className="text-right">
              <Text className={`text-base font-bold ${resource.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                {formatPrice(resource.price, resource.currency)}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick View Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <BookOutlined className="text-blue-600" />
            </div>
            <span className="text-lg font-semibold">Xem nhanh</span>
          </div>
        }
        open={isQuickViewOpen}
        onCancel={() => setIsQuickViewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsQuickViewOpen(false)}>
            Đóng
          </Button>,
          <Button key="view" type="primary" onClick={handleAction}>
            Xem chi tiết
          </Button>,
        ]}
        width={600}
        destroyOnClose
      >
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="flex gap-4">
            <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {resource.thumbnail ? (
                <img src={resource.thumbnail} alt={resource.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <BookOutlined className="text-4xl text-blue-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {resource.category && (
                <Tag color={getCategoryColor(resource.category.name)}>{resource.category.name}</Tag>
              )}
              <Title level={4} className="!mt-2 !mb-2 line-clamp-2">
                {resource.title}
              </Title>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  Đăng bởi: <Text strong>{resource.uploader?.fullName || 'Admin'}</Text>
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Text strong className="mb-2 block">
              Mô tả:
            </Text>
            <Text className="line-clamp-3 text-gray-600">{resource.description || 'Không có mô tả'}</Text>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 rounded-lg bg-gray-50 p-3">
            {resource.avgRating && (
              <div className="flex items-center gap-1">
                <StarFilled className="text-yellow-500" />
                <Text strong>{resource.avgRating}</Text>
                <Text className="text-gray-500">({resource.totalReviews || 0} đánh giá)</Text>
              </div>
            )}
            <div className="flex items-center gap-1">
              <BookOutlined className="text-gray-400" />
              <Text>{resource.downloadCount || 0} lượt tải</Text>
            </div>
            {resource.fileSize && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400">📁</span>
                <Text>{formatFileSize(resource.fileSize)}</Text>
              </div>
            )}
            {resource.soldCount && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400">🛒</span>
                <Text>{resource.soldCount} đã bán</Text>
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <Text className="text-sm text-gray-500">Giá:</Text>
              <div className={`text-2xl font-bold ${resource.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                {formatPrice(resource.price, resource.currency)}
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              icon={resource.price === 0 ? <BookOutlined /> : <ShoppingCartOutlined />}
              onClick={() => {
                setIsQuickViewOpen(false);
                if (resource.price === 0) {
                  handleAction();
                } else {
                  handleQuickBuy({ stopPropagation: () => {} } as unknown as MouseEvent);
                }
              }}
              className="h-12 px-8"
            >
              {resource.price === 0 ? 'Tải ngay' : 'Mua ngay'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
