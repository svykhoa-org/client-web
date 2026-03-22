import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import { CheckCircleOutlined, CloseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Card, Result } from 'antd';

export const PaymentResultPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    // Log thông tin callback từ Sepay
    console.log('Payment callback received:', {
      orderId,
      status: paymentStatus,
      allParams: Object.fromEntries(searchParams.entries()),
    });
  }, [orderId, paymentStatus, searchParams]);

  const getResultConfig = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          status: 'success' as const,
          title: 'Thanh toán thành công!',
          subTitle: `Đơn hàng ${orderId} đã được thanh toán thành công.`,
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          extra: [
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
            <Button key="test" onClick={() => navigate('/payment-test')}>
              Test lại
            </Button>,
          ],
        };
      case 'error':
        return {
          status: 'error' as const,
          title: 'Thanh toán thất bại!',
          subTitle: `Đơn hàng ${orderId} không thể thanh toán. Vui lòng thử lại.`,
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
          extra: [
            <Button type="primary" key="retry" onClick={() => navigate('/payment-test')}>
              Thử lại
            </Button>,
            <Button key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
          ],
        };
      case 'cancel':
        return {
          status: 'warning' as const,
          title: 'Đã hủy thanh toán',
          subTitle: `Bạn đã hủy thanh toán cho đơn hàng ${orderId}.`,
          icon: <StopOutlined style={{ color: '#faad14' }} />,
          extra: [
            <Button type="primary" key="retry" onClick={() => navigate('/payment-test')}>
              Thử lại
            </Button>,
            <Button key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
          ],
        };
      default:
        return {
          status: 'info' as const,
          title: 'Trạng thái không xác định',
          subTitle: `Không thể xác định trạng thái thanh toán cho đơn hàng ${orderId}.`,
          extra: [
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
          ],
        };
    }
  };

  const config = getResultConfig();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        <Result {...config} />

        <div className="mt-6 rounded bg-gray-50 p-4">
          <h4 className="mb-2 font-semibold">Thông tin callback từ Sepay:</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Mã đơn hàng:</strong> {orderId}
            </p>
            <p>
              <strong>Trạng thái:</strong> {paymentStatus}
            </p>
            {searchParams.size > 1 && (
              <div className="mt-3">
                <strong>Các tham số khác:</strong>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">
                  {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
