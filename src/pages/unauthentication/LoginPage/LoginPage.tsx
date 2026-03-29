import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, Typography } from 'antd'
import { isAxiosError } from 'axios'

import authImage from '@/assets/images/auth.jpg'
import RouteConfig from '@/constants/RouteConfig'
import { useAuth } from '@/hooks/useAuth'

const { Title, Text } = Typography

interface LoginFormValues {
  email: string
  password: string
}

export const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Lấy thông tin chuyển hướng từ query params
  const params = new URLSearchParams(location.search)
  const redirect = params.get('redirect') || '/'
  const postId = params.get('postId')

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true)
    setError(null)
    try {
      await login(values.email, values.password)

      // Redirect back to the original page
      if (postId) {
        navigate(`/post/${postId}`)
      } else {
        navigate(redirect)
      }
    } catch (err) {
      console.error('Login failed:', err)
      const status = isAxiosError(err) ? err.response?.status : undefined
      const message: string = isAxiosError(err) ? (err.response?.data?.message ?? '') : ''
      if (status === 403 && message.toLowerCase().includes('verify')) {
        navigate(`${RouteConfig.VerifyEmailPage.path}?email=${encodeURIComponent(values.email)}`)
        return
      }
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: image */}
      <div className="hidden w-1/2 lg:block">
        <img src={authImage} alt="SVYKHOA" className="h-full w-full object-cover" />
      </div>

      {/* Right: form */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Title level={2} className="mb-1">
              Đăng nhập
            </Title>
            <Text className="text-gray-500">Chào mừng bạn trở lại với SVYKHOA</Text>
          </div>

          {error && (
            <Alert
              message="Lỗi đăng nhập"
              description={error}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end">
                <span
                  onClick={() => navigate(RouteConfig.ForgotPasswordPage.path)}
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                >
                  Quên mật khẩu?
                </span>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-11 w-full bg-green-600 hover:bg-green-700"
                loading={loading}
                size="large"
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text className="text-gray-500">Bạn chưa có tài khoản? </Text>
              <span
                onClick={() => {
                  navigate(
                    `${RouteConfig.RegisterPage.path}?redirect=${encodeURIComponent(redirect)}${postId ? `&postId=${postId}` : ''}`,
                  )
                }}
                className="cursor-pointer font-medium text-blue-600 hover:text-blue-800"
              >
                Đăng ký ngay
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
