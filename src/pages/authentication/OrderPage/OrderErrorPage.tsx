import React from 'react';
import { useNavigate } from 'react-router';

import { Button, Card, Result } from 'antd';

import RouteConfig from '@/constants/RouteConfig';

export const OrderErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <Result
          status="error"
          title="Thanh toán thất bại"
          subTitle="Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ."
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
