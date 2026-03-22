import React from 'react';
import { useNavigate } from 'react-router';

import { Button, Card, Result } from 'antd';

import RouteConfig from '@/constants/RouteConfig';

export const OrderCancelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <Result
          status="warning"
          title="Đã hủy thanh toán"
          subTitle="Giao dịch đã bị ủy. Nếu bạn gặp vấn đề khi thanh toán, vui lòng thử lại."
          extra={[
            <Button type="primary" key="retry" onClick={() => navigate(RouteConfig.CoursePage.path)}>
              Thử lại
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
