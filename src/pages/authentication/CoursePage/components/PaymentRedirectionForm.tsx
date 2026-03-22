import React, { useEffect, useRef } from 'react';

import { SafetyCertificateOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Typography } from 'antd';

import type { CheckoutResponseData } from '@/services/Order/checkoutCourse';

interface PaymentRedirectionFormProps {
  checkoutData: CheckoutResponseData;
  autoSubmit?: boolean;
}

export const PaymentRedirectionForm: React.FC<PaymentRedirectionFormProps> = ({ checkoutData, autoSubmit = false }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { checkoutUrl, checkoutFields } = checkoutData;

  useEffect(() => {
    if (autoSubmit && formRef.current) {
      formRef.current.submit();
    }
  }, [autoSubmit]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(amount);
  };

  return (
    <Card
      title={
        <div className="text-center text-lg font-bold text-blue-600">
          <SafetyCertificateOutlined className="mr-2" />
          Cổng thanh toán an toàn
        </div>
      }
      className="w-full border-blue-100 shadow-lg"
      bordered={true}
    >
      <div className="mb-6 text-center">
        <Typography.Title level={4}>Xác nhận thanh toán</Typography.Title>
        <Typography.Text type="secondary">
          Vui lòng kiểm tra thông tin trước khi chuyển sang cổng thanh toán
        </Typography.Text>
      </div>

      <Descriptions bordered column={1} size="small" className="mb-6">
        <Descriptions.Item label="Mã đơn hàng">{checkoutFields.order_invoice_number}</Descriptions.Item>
        <Descriptions.Item label="Nội dung">
          {checkoutFields.order_description || 'Thanh toán đơn hàng'}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền" contentStyle={{ fontWeight: 'bold', color: '#cf1322', fontSize: '16px' }}>
          {formatCurrency(checkoutFields.order_amount, checkoutFields.currency)}
        </Descriptions.Item>
      </Descriptions>

      <form ref={formRef} action={checkoutUrl} method="POST" className="flex justify-center">
        {Object.keys(checkoutFields).map(field => (
          <input key={field} type="hidden" name={field} value={checkoutFields[field as keyof typeof checkoutFields]} />
        ))}

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<ShoppingCartOutlined />}
          className="h-12 w-full border-0 bg-gradient-to-r from-blue-500 to-blue-700 text-lg font-semibold transition-transform duration-200 hover:scale-105"
        >
          Thanh toán ngay
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
          Bạn sẽ được chuyển hướng đến cổng thanh toán SePay
        </Typography.Text>
      </div>
    </Card>
  );
};
