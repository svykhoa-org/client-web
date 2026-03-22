import React from 'react';
import { useNavigate } from 'react-router';

import { Button, Card, Result } from 'antd';

import RouteConfig from '@/constants/RouteConfig';

export const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle="Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ."
          extra={[
            <Button type="primary" key="courses" onClick={() => navigate(RouteConfig.CoursePage.path)}>
              Xem khóa học của tôi
            </Button>,
            <Button key="home" onClick={() => navigate(RouteConfig.HomePage.path)}>
              Về trang chủ
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
};
