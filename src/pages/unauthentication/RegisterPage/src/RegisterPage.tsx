import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin chuyển hướng từ query params
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';
  const postId = params.get('postId');

  const handleRegister = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      // Chuẩn bị dữ liệu đăng ký
      const registerData = {
        email: values.email,
        password: values.password,
        fullName: values.name,
      };

      // Gọi register service
      await register(registerData);

      // Chuyển hướng đến trang trước đó
      if (postId) {
        navigate(`/post/${postId}`);
      } else {
        navigate(redirect);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error instanceof Error ? error.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <Title level={2} className="mb-1">
            Đăng ký tài khoản
          </Title>
          <Text className="block text-gray-600">Tạo tài khoản để tham gia vào cộng đồng Medical Forum</Text>
        </div>

        {error && <Alert message="Lỗi đăng ký" description={error} type="error" showIcon className="mt-4" />}

        <Form
          name="register"
          className="mt-8"
          initialValues={{ remember: true }}
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Họ và tên" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="h-10 w-full bg-green-600 hover:bg-green-700"
              loading={loading}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="mt-4 text-center">
            <Text className="text-gray-600">Bạn đã có tài khoản? </Text>
            <span
              onClick={() => {
                navigate(
                  `${RouteConfig.LoginPage.path}?redirect=${encodeURIComponent(redirect)}${postId ? `&postId=${postId}` : ''}`
                );
              }}
              className="cursor-pointer font-medium text-blue-600 hover:text-blue-800"
            >
              Đăng nhập ngay
            </span>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
