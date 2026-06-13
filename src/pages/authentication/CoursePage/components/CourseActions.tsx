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
import { Button } from 'antd'

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
          className="!bg-success-3 h-12 text-base font-semibold transition hover:!bg-success-3 hover:brightness-95"
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
      <span className="text-success-3 text-3xl font-bold">Miễn phí</span>
    ) : (
      <span className="text-3xl font-bold tabular-nums text-neutral-10">
        {course.price.toLocaleString('vi-VN')}
        <span className="ml-1 text-base font-normal text-neutral-5">đ</span>
      </span>
    )

  return (
    <div className="shadow-primary-10/10 rounded-xl border border-neutral-3 bg-white p-6 shadow-md">
      {!isEnrolled && <div className="mb-4 text-center">{priceDisplay}</div>}

      {isEnrolled && enrollment && (
        <div className="bg-success-1 mb-4 rounded-lg p-3 text-center">
          <CheckCircleOutlined className="text-success-3 text-lg" />
          <p className="text-success-3 mt-1 text-sm font-semibold">Bạn đã đăng ký khoá học này</p>
          <p className="text-success-3/80 text-xs tabular-nums">
            Tiến độ: {Math.round(enrollment.progress)}%
          </p>
        </div>
      )}

      <div className={isEnrollmentLoading ? 'pointer-events-none opacity-60' : ''}>
        {renderCTA()}
      </div>

      {!isEnrolled && course.price > 0 && (
        <p className="mt-2 text-center text-xs text-neutral-5">Thanh toán qua cổng SePay</p>
      )}

      <div className="my-5 h-px bg-neutral-2" />

      <ul className="space-y-2.5 text-sm text-neutral-7">
        <li className="flex items-center gap-2.5">
          <LaptopOutlined className="text-primary-6" />
          <span>Học trên mọi thiết bị</span>
        </li>
        {course.totalDurationMinutes && (
          <li className="flex items-center gap-2.5">
            <ClockCircleOutlined className="text-primary-6" />
            <span>{Math.round(course.totalDurationMinutes / 60)} giờ học</span>
          </li>
        )}
        <li className="flex items-center gap-2.5">
          <SafetyCertificateOutlined className="text-primary-6" />
          <span>
            {course.accessDurationDays
              ? `Truy cập ${course.accessDurationDays} ngày`
              : 'Truy cập vĩnh viễn'}
          </span>
        </li>
        {course.cmeCredits && (
          <li className="flex items-center gap-2.5">
            <CheckCircleOutlined className="text-primary-6" />
            <span>{course.cmeCredits} CME credits</span>
          </li>
        )}
      </ul>
    </div>
  )
}
