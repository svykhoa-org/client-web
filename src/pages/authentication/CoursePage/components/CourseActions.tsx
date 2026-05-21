// src/pages/authentication/CoursePage/components/CourseActions.tsx
import { useNavigate } from 'react-router'

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  PlayCircleOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { Button, Card, Divider } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import type { Enrollment } from '@/models/Enrollment'

interface CourseActionsProps {
  course: {
    id: string
    price: number
    totalDurationMinutes: number | null
    accessDurationDays: number | null
    cmeCredits: number | null
  }
  enrollment: Enrollment | null | undefined
  isEnrollmentLoading: boolean
  isLoggedIn: boolean
  onPurchase: () => void
  onFreeEnroll: () => void
  isPurchaseLoading: boolean
  isFreeEnrollLoading: boolean
  firstLessonId: string | null
}

export const CourseActions = ({
  course,
  enrollment,
  isEnrollmentLoading,
  isLoggedIn,
  onPurchase,
  onFreeEnroll,
  isPurchaseLoading,
  isFreeEnrollLoading,
  firstLessonId,
}: CourseActionsProps) => {
  const navigate = useNavigate()
  const isEnrolled = enrollment?.status === 'active' || enrollment?.status === 'completed'

  const handleStartLearning = () => {
    if (!firstLessonId) return
    navigate(RouteConfig.CourseLearningPage.getPath(course.id, firstLessonId))
  }

  const renderCTA = () => {
    if (isEnrolled) {
      return (
        <Button
          type="primary"
          size="large"
          icon={<PlayCircleOutlined />}
          onClick={handleStartLearning}
          disabled={!firstLessonId}
          block
          className="h-12 text-base font-semibold"
        >
          Vào học ngay
        </Button>
      )
    }

    if (course.price === 0) {
      return (
        <Button
          type="primary"
          size="large"
          icon={<CheckCircleOutlined />}
          onClick={isLoggedIn ? onFreeEnroll : () => navigate(RouteConfig.LoginPage.path)}
          loading={isFreeEnrollLoading}
          block
          className="h-12 bg-green-600 text-base font-semibold hover:bg-green-700"
        >
          {isLoggedIn ? 'Đăng ký miễn phí' : 'Đăng nhập để đăng ký'}
        </Button>
      )
    }

    return (
      <Button
        type="primary"
        size="large"
        icon={<ShoppingCartOutlined />}
        onClick={isLoggedIn ? onPurchase : () => navigate(RouteConfig.LoginPage.path)}
        loading={isPurchaseLoading}
        block
        className="h-12 text-base font-semibold"
      >
        {isLoggedIn ? 'Đăng ký học' : 'Đăng nhập để đăng ký'}
      </Button>
    )
  }

  const priceDisplay =
    course.price === 0 ? (
      <span className="text-3xl font-bold text-green-600">Miễn phí</span>
    ) : (
      <span className="text-3xl font-bold text-gray-900">
        {course.price.toLocaleString('vi-VN')}
        <span className="ml-1 text-base font-normal text-gray-400">đ</span>
      </span>
    )

  return (
    <Card className="shadow-md">
      {!isEnrolled && <div className="mb-4 text-center">{priceDisplay}</div>}

      {isEnrolled && enrollment && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-center">
          <CheckCircleOutlined className="text-lg text-green-600" />
          <p className="mt-1 text-sm font-medium text-green-700">Bạn đã đăng ký khoá học này</p>
          <p className="text-xs text-green-600">Tiến độ: {Math.round(enrollment.progress)}%</p>
        </div>
      )}

      <div className={isEnrollmentLoading ? 'pointer-events-none opacity-60' : ''}>
        {renderCTA()}
      </div>

      {!isEnrolled && course.price > 0 && (
        <p className="mt-2 text-center text-xs text-gray-400">Thanh toán qua cổng SePay</p>
      )}

      <Divider className="my-4" />

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <LaptopOutlined className="text-gray-400" />
          <span>Học trên mọi thiết bị</span>
        </div>
        {course.totalDurationMinutes && (
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-gray-400" />
            <span>{Math.round(course.totalDurationMinutes / 60)} giờ học</span>
          </div>
        )}
        {course.accessDurationDays ? (
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-gray-400" />
            <span>Truy cập {course.accessDurationDays} ngày</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-gray-400" />
            <span>Truy cập vĩnh viễn</span>
          </div>
        )}
        {course.cmeCredits && (
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-gray-400" />
            <span>{course.cmeCredits} CME credits</span>
          </div>
        )}
      </div>
    </Card>
  )
}
