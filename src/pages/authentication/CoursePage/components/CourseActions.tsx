import { PlayCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface CourseActionsProps {
  isPaid: boolean;
  canAccess: boolean;
  price: number;
  onPayment?: () => void;
  onStartLearning?: () => void;
  isLoading?: boolean;
}

export const CourseActions = ({
  isPaid,
  canAccess,
  price,
  onPayment,
  onStartLearning,
  isLoading,
}: CourseActionsProps) => {
  return (
    <div className="mb-6 flex gap-3">
      {canAccess ? (
        <Button
          type="primary"
          size="large"
          icon={<PlayCircleOutlined />}
          onClick={onStartLearning}
          className="flex-1 md:flex-initial"
        >
          Học ngay
        </Button>
      ) : (
        <>
          {!isPaid && price > 0 && (
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={onPayment}
              className="flex-1 md:flex-initial"
              loading={isLoading}
            >
              Thanh toán - {price.toLocaleString('vi-VN')} đ
            </Button>
          )}
          {price === 0 && (
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={onStartLearning}
              className="flex-1 md:flex-initial"
            >
              Đăng ký học miễn phí
            </Button>
          )}
        </>
      )}
    </div>
  );
};
