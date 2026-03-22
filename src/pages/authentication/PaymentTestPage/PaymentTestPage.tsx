import { useState } from 'react';

import { Button, Card, Form, Input } from 'antd';

import { PaymentForm } from '@/components/payment';
import type { CreatePaymentCheckoutParams } from '@/services/payment';

export const PaymentTestPage = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentParams, setPaymentParams] = useState<CreatePaymentCheckoutParams>({});

  const handleStartPayment = (values: any) => {
    setPaymentParams({
      //   courseId: values.courseId,
      amount: values.amount ? parseFloat(values.amount) : undefined,
      currency: 'VND',
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    console.log('Payment initiated successfully');
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
  };

  if (showPayment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaymentForm params={paymentParams} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
        <div className="mt-4 text-center">
          <Button onClick={() => setShowPayment(false)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card title="Test Thanh Toán Sepay" className="mx-auto max-w-md">
        <Form
          layout="vertical"
          onFinish={handleStartPayment}
          initialValues={{
            courseId: '',
            amount: '10000',
          }}
        >
          <Form.Item label="Course ID (tùy chọn)" name="courseId">
            <Input placeholder="Nhập course ID" />
          </Form.Item>

          <Form.Item label="Số tiền (tùy chọn)" name="amount">
            <Input type="number" placeholder="10000" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Tạo thanh toán
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 rounded bg-gray-100 p-4">
          <h4 className="mb-2 font-semibold">Hướng dẫn:</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Bấm "Tạo thanh toán" để khởi tạo thanh toán</li>
            <li>Hệ thống sẽ gọi API: POST http://localhost:3000/api/v1/payment</li>
            <li>Sau khi nhận được response, form thanh toán sẽ hiển thị</li>
            <li>Bấm "Thanh toán ngay" để chuyển đến Sepay</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
