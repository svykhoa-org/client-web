import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { CloudDownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Divider, Tag, message, notification } from 'antd';

import PaymentModal from '@/components/resource/PaymentModal';
import { AsyncLoading } from '@/components/ui/AsyncLoading';
import { useAsyncState } from '@/hooks/useAsyncState';
import { useAuth } from '@/hooks/useAuth';
import type { Resource } from '@/models/Resource';
import { checkPurchaseStatus, downloadResource, getResourceById } from '@/services/resource';

const ResourceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const resourceState = useAsyncState<Resource>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only fetch if we have an ID and either:
    // 1. We have no resource data yet, or
    // 2. The resource ID doesn't match the current URL ID
    if (id && (!resource || resource._id !== id)) {
      resourceState.execute(() =>
        getResourceById(id).then(response => {
          const resourceData = response.data as Resource;
          setResource(resourceData);
          return resourceData;
        })
      );
    }
  }, [id, resource, resourceState]);

  // Check purchase status when resource is loaded and user is authenticated
  useEffect(() => {
    const checkPurchase = async () => {
      if (id && isAuthenticated && resource && resource.price > 0) {
        try {
          const response = await checkPurchaseStatus(id);
          if (response.data && 'purchased' in response.data) {
            setIsPurchased((response.data as { purchased: boolean }).purchased || false);
          } else if (
            response.data &&
            'data' in response.data &&
            Array.isArray((response.data as { data: { purchased?: boolean }[] }).data) &&
            (response.data as { data: { purchased?: boolean }[] }).data.length > 0
          ) {
            setIsPurchased(Boolean((response.data as { data: { purchased?: boolean }[] }).data[0]?.purchased));
          } else {
            setIsPurchased(false);
          }
        } catch (error) {
          console.error('Error checking purchase status:', error);
          // Default to false if check fails
          setIsPurchased(false);
        }
      }
    };

    checkPurchase();
  }, [id, isAuthenticated, resource]);

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
    if (!bytes) return 'Không xác định';

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Handle download button click
  const handleDownload = async () => {
    if (!resource) return;

    // For free resources or already purchased resources, download directly
    if (resource.price === 0 || isPurchased) {
      await downloadFile();
    } else {
      // For paid resources, show payment modal
      setShowPaymentModal(true);
    }
  };

  // Handle actual file download
  const downloadFile = async () => {
    if (!id) return;

    try {
      setDownloading(true);
      const response = await downloadResource(id);

      // Handle both possible response types
      const data = response.data as unknown;
      let downloadUrl = '';

      if (data && typeof data === 'object' && 'downloadUrl' in data) {
        downloadUrl = (data as { downloadUrl: string }).downloadUrl;
      } else if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray((data as { data: unknown[] }).data) &&
        (data as { data: unknown[] }).data.length > 0 &&
        typeof (data as { data: unknown[] }).data[0] === 'object' &&
        (data as { data: { downloadUrl?: string }[] }).data[0].downloadUrl
      ) {
        downloadUrl = (data as { data: { downloadUrl: string }[] }).data[0].downloadUrl;
      }

      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      } else {
        message.error('Không thể tải tài liệu. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Download error:', error);
      message.error('Đã xảy ra lỗi khi tải tài liệu. Vui lòng thử lại sau.');
    } finally {
      setDownloading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = (downloadUrl: string) => {
    // Modal sẽ tự đóng khi người dùng nhấn nút tải xuống trong modal

    // Set purchase status - important for future visits
    setIsPurchased(true);

    // Chỉ hiển thị thông báo khi modal đóng và tài liệu đang được tải xuống
    notification.success({
      message: 'Thanh toán thành công!',
      description: 'Cảm ơn bạn đã mua tài liệu. Tài liệu đang được tải xuống.',
      duration: 5,
    });

    // Tải file khi được cung cấp URL (được gọi từ nút trong modal)
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }

    // Đóng modal khi hoàn tất thanh toán và bắt đầu tải xuống
    setShowPaymentModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <AsyncLoading
        loading={resourceState.state.loading}
        type="skeleton"
        skeleton={{ rows: 6, avatar: true, title: true }}
      >
        {resource ? (
          <div
            className={`bg-neutral-1 rounded-lg p-6 shadow-sm ${downloading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="flex items-center gap-4">
              <FileTextOutlined className="text-primary-500 text-4xl" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{resource.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                  <span>Đăng bởi: {resource.uploader?.fullName || 'Không xác định'}</span>
                  <span>•</span>
                  <span>Danh mục: {resource.category?.name || 'Không xác định'}</span>
                  <span>•</span>
                  <span>{new Date(resource.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <Divider />

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Mô tả</h3>
              <p className="whitespace-pre-line text-neutral-700">
                {resource.description || 'Không có mô tả cho tài liệu này.'}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Thông tin tài liệu</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="bg-neutral-2 flex items-center rounded-md p-3">
                  <span className="text-neutral-6 mr-2 w-32">Định dạng:</span>
                  <span className="font-medium">{resource.fileType || 'Không xác định'}</span>
                </div>
                <div className="bg-neutral-2 flex items-center rounded-md p-3">
                  <span className="text-neutral-6 mr-2 w-32">Kích thước:</span>
                  <span className="font-medium">{formatFileSize(resource.fileSize)}</span>
                </div>
                <div className="bg-neutral-2 flex items-center rounded-md p-3">
                  <span className="text-neutral-6 mr-2 w-32">Lượt tải:</span>
                  <span className="font-medium">{resource.downloadCount}</span>
                </div>
                <div className="bg-neutral-2 flex items-center rounded-md p-3">
                  <span className="text-neutral-6 mr-2 w-32">Giá:</span>
                  <Tag color={resource.price === 0 ? 'success' : 'blue'}>
                    {formatPrice(resource.price, resource.currency)}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                type="primary"
                size="large"
                icon={<CloudDownloadOutlined />}
                className="px-8"
                onClick={handleDownload}
                loading={downloading}
              >
                {resource.price === 0 ? 'Tải xuống' : isPurchased ? 'Tải xuống' : 'Mua ngay'}
              </Button>
            </div>

            {/* Payment Modal */}
            {resource && (
              <PaymentModal
                resource={resource}
                visible={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        ) : (
          <div className="bg-neutral-1 rounded-lg p-6 text-center">
            <h2 className="text-xl">Không tìm thấy tài liệu</h2>
            <p className="text-neutral-6 mt-2">Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          </div>
        )}
      </AsyncLoading>

      {resourceState.state.error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-center text-red-500">
          <p>{resourceState.state.error}</p>
        </div>
      )}
    </div>
  );
};

export default ResourceDetailPage;
