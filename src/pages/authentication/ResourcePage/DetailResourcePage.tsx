import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  ApartmentOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FacebookOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  HeartOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  ShareAltOutlined,
  ShoppingCartOutlined,
  StarFilled,
  TeamOutlined,
  VerifiedOutlined,
  WhatsAppOutlined,
  WindowsOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Descriptions,
  Divider,
  Image,
  List,
  Modal,
  Popover,
  Rate,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import { useDetailResource } from '@/lib/tanstack-query/hooks/useResourceQueries';
import { type CheckoutResponseData, resourceOrderService } from '@/services/Order/checkoutResource';

const { Title, Text, Paragraph } = Typography;

export const DetailResourcePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutResponseData | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [_activePreviewIndex, setActivePreviewIndex] = useState(0);

  const { data: resource, isLoading, isError } = useDetailResource(id || '');

  const checkoutMutation = useMutation({
    mutationFn: (resourceId: string) => resourceOrderService.checkoutResource(resourceId),
    onSuccess: response => {
      if (response.statusCode === 201 || response.statusCode === 200) {
        setCheckoutData(response.data as CheckoutResponseData);
        setIsPaymentModalOpen(true);
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    },
    onError: () => {
      message.error('Không thể kết nối đến hệ thống thanh toán');
    },
  });

  const handleBuy = () => {
    const resourceId = resource?.id || resource?._id;
    if (resourceId) {
      checkoutMutation.mutate(resourceId);
    }
  };

  const handleDownload = () => {
    if (resource?.fileUrl) {
      window.open(resource.fileUrl, '_blank');
    } else {
      message.error('Link tải không khả dụng');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(price);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleShare = (platform: 'facebook' | 'zalo' | 'copy') => {
    const url = window.location.href;
    // const title = resource?.title || 'Tài liệu y khoa';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        message.success('Đã mở chia sẻ Facebook');
        break;
      case 'zalo':
        message.success('Đã sao chép link, mở Zalo để chia sẻ');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        message.success('Đã sao chép link');
        break;
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    message.success(isWishlisted ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
  };

  // Trust badges content
  const trustBadges = [
    {
      icon: <SafetyCertificateOutlined className="text-green-600" />,
      title: 'Bảo đảm chất lượng',
      desc: 'Tài liệu được kiểm duyệt',
    },
    { icon: <VerifiedOutlined className="text-blue-600" />, title: 'Nguồn gốc rõ ràng', desc: 'Tác giả xác minh' },
    { icon: <TeamOutlined className="text-purple-600" />, title: 'Hỗ trợ 24/7', desc: 'Liên hệ mọi lúc' },
    { icon: <CheckCircleOutlined className="text-orange-600" />, title: 'Hoàn tiền 100%', desc: 'Nếu không hài lòng' },
  ];

  // Benefits when buying
  const benefits = [
    'Tải về không giới hạn thời gian',
    'Cập nhật miễn phí trong tương lai',
    'Hỗ trợ kỹ thuật 24/7',
    'Bảo mật thanh toán',
    'Sử dụng cho mục đích cá nhân',
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card className="rounded-xl border-red-200 bg-red-50">
          <div className="flex flex-col items-center py-8">
            <FileTextOutlined className="mb-4 text-5xl text-red-400" />
            <Title level={3} className="text-red-600">
              Không tìm thấy tài liệu
            </Title>
            <Text className="text-gray-500">Tài liệu này có thể đã bị xóa hoặc không tồn tại.</Text>
            <Button type="primary" className="mt-4" onClick={() => navigate(RouteConfig.ResourceDetailPage.path)}>
              Quay lại kho tài liệu
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const canDownload = resource.price === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <div
            className="flex cursor-pointer items-center gap-1 text-gray-500 transition-colors hover:text-blue-600"
            onClick={() => navigate('/')}
          >
            <HomeOutlined /> Trang chủ
          </div>
          <span className="text-gray-300">/</span>
          <div
            className="flex cursor-pointer items-center gap-1 text-gray-500 transition-colors hover:text-blue-600"
            onClick={() => navigate(RouteConfig.ResourceDetailPage.path)}
          >
            <ApartmentOutlined /> Kho tài liệu
          </div>
          <span className="text-gray-300">/</span>
          <Text className="line-clamp-1 text-gray-600">{resource.title}</Text>
        </div>

        {/* Main Content Card */}
        <Card className="overflow-hidden rounded-xl border-0 shadow-lg">
          <Row gutter={[32, 24]}>
            {/* Left Column - Gallery */}
            <Col xs={24} lg={10}>
              {/* Main Image */}
              <div className="relative mb-4 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                {resource.thumbnail ? (
                  <div className="relative cursor-zoom-in" onClick={() => setShowLightbox(true)}>
                    <Image
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full transition-transform duration-300 hover:scale-105"
                      style={{ height: '350px', objectFit: 'cover' }}
                      preview={false}
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-white backdrop-blur-sm">
                      <EyeOutlined /> Xem lớn
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
                    style={{ height: '350px' }}
                  >
                    <div className="flex flex-col items-center">
                      <FileTextOutlined className="text-8xl text-blue-300" />
                      <span className="mt-4 text-xl font-semibold text-gray-500">
                        {resource.fileType || 'DOCUMENT'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {resource.previewImages && resource.previewImages.length > 0 && (
                <div className="mb-4">
                  <Text strong className="mb-2 block text-sm text-gray-500">
                    Xem trước nội dung:
                  </Text>
                  <Carousel dots slidesToShow={4} slidesToScroll={2} className="resource-gallery-carousel">
                    {resource.previewImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="cursor-pointer overflow-hidden rounded-lg px-1"
                        onClick={() => {
                          setActivePreviewIndex(idx);
                          setShowLightbox(true);
                        }}
                      >
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="h-20 w-full object-cover transition-transform hover:scale-110"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}

              {/* Trust Badges */}
              <Card size="small" className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                <Title level={5} className="mb-4 flex items-center gap-2">
                  <SafetyOutlined className="text-blue-600" /> Cam kết chất lượng
                </Title>
                <Row gutter={[16, 16]}>
                  {trustBadges.map((badge, idx) => (
                    <Col span={12} key={idx}>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{badge.icon}</div>
                        <div>
                          <Text strong className="block text-xs">
                            {badge.title}
                          </Text>
                          <Text className="text-xs text-gray-500">{badge.desc}</Text>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>

            {/* Right Column - Info */}
            <Col xs={24} lg={14}>
              <div className="flex h-full flex-col">
                {/* Header */}
                <div>
                  {/* Category & Badges */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {resource.category && (
                      <Tag color="blue" className="text-sm">
                        {resource.category.name}
                      </Tag>
                    )}
                    {resource.price === 0 && (
                      <Tag color="green" className="text-sm">
                        <CheckCircleOutlined /> Miễn phí
                      </Tag>
                    )}
                    {resource.featured && (
                      <Tag color="orange" className="text-sm">
                        <FileSearchOutlined /> Nổi bật
                      </Tag>
                    )}
                  </div>

                  {/* Title */}
                  <Title level={2} className="mb-3 !text-gray-800">
                    {resource.title}
                  </Title>

                  {/* Stats Row */}
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                        <StarFilled className="text-yellow-500" />
                      </div>
                      <div>
                        <Text strong className="text-gray-800">
                          {resource.avgRating?.toFixed(1) || '0.0'}
                        </Text>
                        <Text className="ml-1 text-gray-400">({resource.totalReviews || 0} đánh giá)</Text>
                      </div>
                    </div>

                    <Divider type="vertical" className="h-8 bg-gray-300" />

                    <div className="flex items-center gap-1">
                      <DownloadOutlined />
                      <Text>{resource.downloadCount || 0} lượt tải</Text>
                    </div>

                    {resource.soldCount ? (
                      <>
                        <Divider type="vertical" className="h-8 bg-gray-300" />
                        <div className="flex items-center gap-1 text-green-600">
                          <ShoppingCartOutlined />
                          <Text strong>{resource.soldCount} đã bán</Text>
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/* Author Section */}
                  <Card size="small" className="mb-4 border-0 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {resource.uploader?.avatarUrl ? (
                          <Avatar src={resource.uploader.avatarUrl} size={48} />
                        ) : (
                          <Avatar size={48} className="bg-blue-500">
                            {resource.uploader?.fullName?.charAt(0) || 'A'}
                          </Avatar>
                        )}
                        <div>
                          <Text strong className="block text-base">
                            {resource.uploader?.fullName || 'Admin'}
                          </Text>
                          {resource.uploader?.email && (
                            <Text className="text-xs text-gray-500">{resource.uploader.email}</Text>
                          )}
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <TeamOutlined /> 1.2k followers
                          </div>
                        </div>
                      </div>
                      <Button size="small">Xem profile</Button>
                    </div>
                  </Card>

                  {/* File Info */}
                  <Card size="small" className="mb-4 border border-blue-100 bg-blue-50/50">
                    <Descriptions column={2} size="small" contentStyle={{ fontWeight: 500 }}>
                      <Descriptions.Item
                        label={
                          <span className="flex items-center gap-1">
                            <WindowsOutlined /> Định dạng
                          </span>
                        }
                      >
                        {resource.fileType || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <span className="flex items-center gap-1">
                            <DeleteOutlined /> Dung lượng
                          </span>
                        }
                      >
                        {formatFileSize(resource.fileSize)}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <span className="flex items-center gap-1">
                            <EnvironmentOutlined /> Ngày đăng
                          </span>
                        }
                      >
                        {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <span className="flex items-center gap-1">
                            <FileTextOutlined /> Cập nhật
                          </span>
                        }
                      >
                        {resource.updatedAt ? new Date(resource.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="License">{resource.licenseType || 'Cá nhân'}</Descriptions.Item>
                      <Descriptions.Item label="Thời hạn">
                        {resource.validityPeriod ? `${resource.validityPeriod} ngày` : 'Vĩnh viễn'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  {/* Description */}
                  <div className="mb-4">
                    <Title level={5} className="mb-2">
                      Mô tả
                    </Title>
                    <Paragraph className="text-base leading-relaxed text-gray-700">
                      {resource.description || 'Chưa có mô tả cho tài liệu này.'}
                    </Paragraph>
                  </div>

                  {/* Tags */}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="mb-4">
                      <Text strong className="mr-2">
                        Từ khóa:
                      </Text>
                      {resource.tags.map(tag => (
                        <Tag key={tag} className="mb-1 rounded-full border-gray-200 bg-gray-100 px-3 text-gray-600">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>

                {/* Benefits (if paid) */}
                {resource.price > 0 && (
                  <Card size="small" className="mb-4 border-green-200 bg-green-50">
                    <Title level={5} className="mb-3 flex items-center gap-2 text-green-700">
                      <CheckCircleOutlined /> Bạn sẽ nhận được:
                    </Title>
                    <List
                      size="small"
                      dataSource={benefits}
                      renderItem={item => (
                        <List.Item className="border-0 py-1">
                          <Text className="flex items-center gap-2">
                            <CheckCircleOutlined className="text-green-500" /> {item}
                          </Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                )}

                {/* Actions */}
                <div className="mt-auto border-t border-gray-100 pt-6">
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={14}>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-red-600">
                          {formatPrice(resource.price, resource.currency)}
                        </div>
                        {resource.price > 0 && resource.price > 100000 && (
                          <div className="text-lg text-gray-400 line-through">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: resource.currency }).format(
                              resource.price * 1.2
                            )}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col xs={24} sm={10}>
                      <Space direction="vertical" className="w-full">
                        {canDownload ? (
                          <Button
                            type="primary"
                            size="large"
                            icon={<DownloadOutlined />}
                            onClick={handleDownload}
                            className="h-12 w-full border-none bg-green-600 text-lg font-semibold shadow-md transition-all hover:bg-green-500"
                          >
                            Tải xuống miễn phí
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={handleBuy}
                            loading={checkoutMutation.isPending}
                            className="h-12 w-full border-none bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                          >
                            Mua ngay
                          </Button>
                        )}
                        <div className="flex gap-2">
                          <Button
                            icon={isWishlisted ? <HeartOutlined className="text-red-500" /> : <HeartOutlined />}
                            onClick={handleWishlist}
                            className="flex-1"
                          >
                            {isWishlisted ? 'Đã lưu' : 'Lưu xem sau'}
                          </Button>
                          <Popover
                            content={
                              <div className="flex gap-2">
                                <Button
                                  type="default"
                                  icon={<FacebookOutlined />}
                                  onClick={() => handleShare('facebook')}
                                  className="border-blue-500 text-blue-500"
                                />
                                <Button
                                  type="default"
                                  icon={<WhatsAppOutlined />}
                                  onClick={() => handleShare('zalo')}
                                  className="border-blue-400 text-blue-400"
                                />
                                <Button type="default" icon={<CopyOutlined />} onClick={() => handleShare('copy')} />
                              </div>
                            }
                            title="Chia sẻ"
                            trigger="click"
                          >
                            <Button icon={<ShareAltOutlined />} className="flex-1">
                              Chia sẻ
                            </Button>
                          </Popover>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Reviews Section */}
        <div className="mt-8">
          <Card
            title={
              <div className="flex items-center gap-2">
                <StarFilled className="text-yellow-500" /> Đánh giá & Bình luận
              </div>
            }
            className="rounded-xl shadow-sm"
          >
            {/* Rating Summary */}
            {resource.totalReviews && resource.totalReviews > 0 ? (
              <Row gutter={[32, 24]} className="mb-6">
                <Col xs={24} md={8}>
                  <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
                    <Text className="text-5xl font-bold text-yellow-500">{resource.avgRating?.toFixed(1) || 0}</Text>
                    <Rate disabled defaultValue={resource.avgRating || 0} className="my-2" />
                    <Text className="text-gray-500">{resource.totalReviews} đánh giá</Text>
                  </div>
                </Col>
                <Col xs={24} md={16}>
                  {[5, 4, 3, 2, 1].map(star => {
                    // Calculate percentage based on available rating data
                    const ratingDistribution = resource.reviewSummary?.ratingDistribution;
                    const totalRatings = resource.totalReviews || 1;
                    const starCount = ratingDistribution?.[star as 1 | 2 | 3 | 4 | 5] || 0;
                    const percentage = totalRatings > 0 ? (starCount / totalRatings) * 100 : 0;
                    return (
                      <div key={star} className="mb-2 flex items-center gap-3">
                        <Text className="w-8">{star} sao</Text>
                        <div className="flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-yellow-400 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <Text className="w-12 text-right text-gray-500">{Math.round(percentage)}%</Text>
                      </div>
                    );
                  })}
                </Col>
              </Row>
            ) : (
              <div className="py-8 text-center text-gray-400">
                <StarFilled className="mb-2 text-3xl" />
                <div>Chưa có đánh giá nào cho tài liệu này.</div>
                <Button type="link" className="mt-2">
                  Trở thành người đầu tiên đánh giá
                </Button>
              </div>
            )}

            {/* Reviews - Placeholder for when API supports reviews */}
            {resource.totalReviews && resource.totalReviews > 0 ? (
              <div className="py-4 text-center text-gray-500">
                <StarFilled className="mb-2 text-2xl" />
                <div>{resource.totalReviews} đánh giá - Tính năng đang được phát triển</div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">
                <StarFilled className="mb-2 text-3xl" />
                <div>Chưa có đánh giá nào cho tài liệu này.</div>
                <Button type="link" className="mt-2">
                  Trở thành người đầu tiên đánh giá
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Related Resources - Placeholder for when API supports related resources */}
        <div className="mt-8 py-4 text-center text-gray-400">
          <FileTextOutlined className="mb-2 text-2xl" />
          <div>Tài liệu liên quan đang được cập nhật</div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        title={<div className="border-b pb-3 text-lg font-bold text-blue-700">Thanh toán tài liệu</div>}
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        width={600}
        destroyOnClose
        className="overflow-hidden rounded-xl"
      >
        {checkoutData && (
          <div className="py-4">
            <div className="mb-4 rounded-lg bg-blue-50 p-4">
              <Text strong className="block text-blue-700">
                {resource.title}
              </Text>
              <Text className="text-2xl font-bold text-blue-600">{formatPrice(resource.price, resource.currency)}</Text>
            </div>
            {/* Payment form would be here */}
            <div className="py-8 text-center text-gray-400">
              <ShoppingCartOutlined className="mb-2 text-4xl" />
              <div>Đang chuyển đến trang thanh toán...</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Lightbox Modal */}
      <Modal
        open={showLightbox}
        onCancel={() => setShowLightbox(false)}
        footer={null}
        width={900}
        destroyOnClose
        className="resource-lightbox"
      >
        {resource.thumbnail && (
          <img src={resource.thumbnail} alt={resource.title} className="h-auto w-full rounded-lg" />
        )}
      </Modal>
    </div>
  );
};
