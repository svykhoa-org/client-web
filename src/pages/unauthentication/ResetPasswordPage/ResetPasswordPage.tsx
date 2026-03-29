import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, Typography } from 'antd'
import type { FormInstance } from 'antd'

import authImage from '@/assets/images/auth.jpg'
import RouteConfig from '@/constants/RouteConfig'
import { forgotPassword, resetPassword } from '@/services/auth/authService'
import { ApiError } from '@/services/httpClient'

const { Title, Text } = Typography

interface ResetPasswordFormValues {
  email: string
  code: string
  newPassword: string
  confirmPassword: string
}

export const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [success, setSuccess] = useState(false)
  const formRef = useRef<FormInstance>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const initialEmail = params.get('email') || ''

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    setLoading(true)
    setError(null)
    setErrorCode(null)
    try {
      await resetPassword({
        email: values.email,
        code: values.code.trim().toUpperCase(),
        newPassword: values.newPassword,
      })
      setSuccess(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorCode(err.errorCode ?? null)
        if (err.errorCode === 'OTP_EXPIRED') {
          setError('Mã xác thực đã hết hạn. Vui lòng gửi lại mã.')
        } else if (err.errorCode === 'OTP_ALREADY_USED') {
          setError('Mã xác thực đã được sử dụng.')
        } else if (err.errorCode === 'OTP_INVALID') {
          setError('Mã xác thực không hợp lệ.')
        } else {
          setError(err.message)
        }
      } else {
        setError(err instanceof Error ? err.message : 'Đặt lại mật khẩu thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async (email: string) => {
    if (!email) return
    setResendLoading(true)
    setResendSuccess(false)
    setError(null)
    setErrorCode(null)
    try {
      await forgotPassword({ email })
      setResendSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi lại mã thất bại')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 lg:block">
        <img src={authImage} alt="SVYKHOA" className="h-full w-full object-cover" />
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center">
              <div className="mb-4 text-5xl">✅</div>
              <Title level={3} className="mb-2">
                Đặt lại mật khẩu thành công!
              </Title>
              <Text className="mb-6 block text-gray-500">
                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
              </Text>
              <Button
                type="primary"
                size="large"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate(RouteConfig.LoginPage.path)}
              >
                Đăng nhập
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <Title level={2} className="mb-1">
                  Đặt lại mật khẩu
                </Title>
                <Text className="text-gray-500">
                  Nhập mã xác nhận từ email và mật khẩu mới của bạn
                </Text>
              </div>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  className="mb-4"
                  action={
                    errorCode === 'OTP_EXPIRED' ? (
                      <Button
                        size="small"
                        loading={resendLoading}
                        onClick={() => {
                          const emailVal = formRef.current?.getFieldValue('email') || initialEmail
                          handleResend(emailVal)
                        }}
                      >
                        Gửi lại mã
                      </Button>
                    ) : undefined
                  }
                />
              )}

              {resendSuccess && (
                <Alert
                  message="Mã xác nhận mới đã được gửi. Vui lòng kiểm tra email."
                  type="success"
                  showIcon
                  className="mb-4"
                />
              )}

              <Form
                ref={formRef}
                name="reset-password"
                initialValues={{ email: initialEmail }}
                onFinish={handleSubmit}
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
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="code"
                  label="Mã xác nhận"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã xác nhận!' },
                    { len: 6, message: 'Mã xác nhận gồm 6 ký tự!' },
                  ]}
                >
                  <Input
                    placeholder="Nhập mã 6 ký tự"
                    size="large"
                    maxLength={6}
                    className="text-center font-mono text-xl tracking-widest"
                    style={{ letterSpacing: '0.3em' }}
                  />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Mật khẩu mới"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  dependencies={['newPassword']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Xác nhận mật khẩu mới"
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
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center">
                <span
                  onClick={() => navigate(RouteConfig.ForgotPasswordPage.path)}
                  className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                >
                  Yêu cầu mã mới
                </span>
                <span className="mx-2 text-gray-300">|</span>
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
