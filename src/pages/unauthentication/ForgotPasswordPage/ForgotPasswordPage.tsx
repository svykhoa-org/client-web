import { useState } from 'react'
import { useNavigate } from 'react-router'

import { MailOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, Typography } from 'antd'

import authImage from '@/assets/images/auth.jpg'
import RouteConfig from '@/constants/RouteConfig'
import { forgotPassword } from '@/services/auth/authService'

const { Title, Text } = Typography

interface ForgotPasswordFormValues {
  email: string
}

export const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true)
    setError(null)
    try {
      await forgotPassword({ email: values.email })
      setSubmittedEmail(values.email)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 lg:block">
        <img src={authImage} alt="SVYKHOA" className="h-full w-full object-cover" />
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {submitted ? (
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <MailOutlined className="text-5xl text-green-600" />
              </div>
              <Title level={3} className="mb-2">
                Kiểm tra email của bạn
              </Title>
              <Text className="mb-2 block text-gray-500">
                Nếu tài khoản tồn tại, chúng tôi đã gửi mã đặt lại mật khẩu đến
              </Text>
              <Text strong className="mb-6 block text-gray-700">
                {submittedEmail}
              </Text>
              <Button
                type="primary"
                size="large"
                className="mb-4 w-full bg-green-600 hover:bg-green-700"
                onClick={() =>
                  navigate(
                    `${RouteConfig.ResetPasswordPage.path}?email=${encodeURIComponent(submittedEmail)}`,
                  )
                }
              >
                Nhập mã đặt lại mật khẩu
              </Button>
              <div>
                <span
                  onClick={() => navigate(RouteConfig.LoginPage.path)}
                  className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                >
                  Quay lại đăng nhập
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <Title level={2} className="mb-1">
                  Quên mật khẩu?
                </Title>
                <Text className="text-gray-500">
                  Nhập email của bạn để nhận mã đặt lại mật khẩu
                </Text>
              </div>

              {error && <Alert message={error} type="error" showIcon className="mb-4" />}

              <Form name="forgot-password" onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="h-11 w-full bg-green-600 hover:bg-green-700"
                    loading={loading}
                    size="large"
                  >
                    Gửi mã xác nhận
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center">
                <span
                  onClick={() => navigate(RouteConfig.LoginPage.path)}
                  className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                >
                  Quay lại đăng nhập
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
