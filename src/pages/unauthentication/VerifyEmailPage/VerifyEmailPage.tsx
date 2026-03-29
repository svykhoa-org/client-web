import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { MailOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, Typography } from 'antd'

import authImage from '@/assets/images/auth.jpg'
import RouteConfig from '@/constants/RouteConfig'
import { resendVerifyEmail, verifyEmail } from '@/services/auth/authService'
import { ApiError } from '@/services/httpClient'

const { Title, Text } = Typography

interface VerifyEmailFormValues {
  code: string
}

export const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [verified, setVerified] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const email = params.get('email') || ''

  const handleVerify = async (values: VerifyEmailFormValues) => {
    if (!email) {
      setError('Không tìm thấy email. Vui lòng đăng ký lại.')
      return
    }
    setLoading(true)
    setError(null)
    setErrorCode(null)
    try {
      await verifyEmail({ email, code: values.code.trim().toUpperCase() })
      setVerified(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorCode(err.errorCode ?? null)
        if (err.errorCode === 'OTP_EXPIRED') {
          setError('Mã xác thực đã hết hạn. Vui lòng gửi lại mã.')
        } else if (err.errorCode === 'OTP_ALREADY_USED') {
          setError('Mã xác thực đã được sử dụng.')
        } else {
          setError('Mã xác thực không hợp lệ.')
        }
      } else {
        setError(err instanceof Error ? err.message : 'Xác thực thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    setResendLoading(true)
    setResendSuccess(false)
    setError(null)
    setErrorCode(null)
    try {
      await resendVerifyEmail({ email })
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
          {verified ? (
            <div className="text-center">
              <div className="mb-4 text-5xl">✅</div>
              <Title level={3} className="mb-2">
                Xác thực thành công!
              </Title>
              <Text className="mb-6 block text-gray-500">
                Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay.
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
                <div className="mb-3 flex justify-center">
                  <MailOutlined className="text-5xl text-green-600" />
                </div>
                <Title level={2} className="mb-1">
                  Xác thực Email
                </Title>
                <Text className="text-gray-500">
                  Chúng tôi đã gửi mã xác thực đến
                </Text>
                {email && (
                  <Text strong className="block text-gray-700">
                    {email}
                  </Text>
                )}
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
                        onClick={handleResend}
                      >
                        Gửi lại mã
                      </Button>
                    ) : undefined
                  }
                />
              )}

              {resendSuccess && (
                <Alert
                  message="Mã xác thực mới đã được gửi. Vui lòng kiểm tra email."
                  type="success"
                  showIcon
                  className="mb-4"
                />
              )}

              <Form name="verify-email" onFinish={handleVerify} layout="vertical">
                <Form.Item
                  name="code"
                  label="Mã xác thực"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã xác thực!' },
                    { len: 6, message: 'Mã xác thực gồm 6 ký tự!' },
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

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="h-11 w-full bg-green-600 hover:bg-green-700"
                    loading={loading}
                    size="large"
                  >
                    Xác thực
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center">
                <Text className="text-gray-500">Chưa nhận được mã? </Text>
                <span
                  onClick={handleResend}
                  className="cursor-pointer font-medium text-blue-600 hover:text-blue-800"
                >
                  {resendLoading ? 'Đang gửi...' : 'Gửi lại mã'}
                </span>
              </div>

              <div className="mt-4 text-center">
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
