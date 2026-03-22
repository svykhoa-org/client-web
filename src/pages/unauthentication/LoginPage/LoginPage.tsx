import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin chuyển hướng từ query params
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';
  const postId = params.get('postId');

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);

      // Redirect back to the original page
      if (postId) {
        navigate(`/post/${postId}`);
      } else {
        navigate(redirect);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <Title level={2} className="mb-1">
            Đăng nhập
          </Title>
          <Text className="block text-gray-600">Chào mừng bạn trở lại với Medical Forum</Text>
        </div>

        {error && <Alert message="Lỗi đăng nhập" description={error} type="error" showIcon className="mt-4" />}

        <Form name="login" className="mt-8" initialValues={{ remember: true }} onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between">
              <span onClick={() => {}} className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                Quên mật khẩu?
              </span>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="h-10 w-full bg-green-600 hover:bg-green-700"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="mt-4 text-center">
            <Text className="text-gray-600">Bạn chưa có tài khoản? </Text>
            <span
              onClick={() => {
                navigate(
                  `${RouteConfig.RegisterPage.path}?redirect=${encodeURIComponent(redirect)}${postId ? `&postId=${postId}` : ''}`
                );
              }}
              className="cursor-pointer font-medium text-blue-600 hover:text-blue-800"
            >
              Đăng ký ngay
            </span>
          </div>
        </Form>
      </Card>
    </div>
  );
};
