import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Col, Drawer, Modal, Row, Skeleton, message } from 'antd'

import { getAccessToken } from '@/lib/axios'
import { useCourseWithCurriculum } from '@/lib/tanstack-query/hooks/useCourseQueries'
import { useMyEnrollment } from '@/lib/tanstack-query/hooks/useEnrollmentQueries'
import { CheckoutModalContent, type CheckoutData } from '@/components/payment'
import { orderService } from '@/services/Order/checkoutCourse'
import RouteConfig from '@/constants/RouteConfig'

import { CourseActions } from './components/CourseActions'
import { CourseInfo } from './components/CourseInfo'
import { CourseModules } from './components/CourseModules'

export const DetailCoursePage = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false)
  const queryClient = useQueryClient()

  const isLoggedIn = !!getAccessToken()

  const { data, isLoading, isError } = useCourseWithCurriculum(id ?? '')
  const { data: enrollment, isLoading: isEnrollmentLoading } = useMyEnrollment(id ?? '')

  const checkoutMutation = useMutation({
    mutationFn: (courseId: string) => orderService.checkoutCourse(courseId),
    onSuccess: response => {
      if (response.statusCode === 201) {
        setCheckoutData(response.data)
        setIsPaymentModalOpen(true)
      } else {
        void message.error(response.message || 'Có lỗi xảy ra khi tạo đơn hàng')
      }
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error ? error.message : 'Không thể kết nối đến hệ thống thanh toán'
      void message.error(msg)
    },
  })

  // Khoá học 0đ: mở popup thanh toán; khi xác nhận sẽ ghi nhận order + đăng ký ngay.
  const openFreeModal = (courseTitle: string) => {
    setCheckoutData({
      checkoutUrl: '',
      checkoutFields: { order_description: courseTitle, order_amount: 0, currency: 'VND' },
      free: true,
    })
    setIsPaymentModalOpen(true)
  }

  const confirmFreeMutation = useMutation({
    mutationFn: (courseId: string) => orderService.checkoutCourse(courseId),
    onSuccess: response => {
      if (response.statusCode !== 201) {
        void message.error(response.message || 'Không thể đăng ký khoá học')
        return
      }
      setIsPaymentModalOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['enrollment'] })
      void message.success('Đăng ký khoá học thành công')
      const firstLesson = data?.curriculum[0]?.lessons[0]
      if (data && firstLesson) {
        navigate(RouteConfig.CourseLearningPage.getPath(data.course.id, firstLesson.id))
      }
    },
    onError: () => {
      void message.error('Không thể đăng ký khoá học. Vui lòng thử lại.')
    },
  })

  // Auto-redirect to learning page when navigated from My Courses with ?learn=1
  useEffect(() => {
    if (searchParams.get('learn') !== '1') return
    if (isLoading || isEnrollmentLoading) return
    if (!data || !enrollment) return
    const isEnrolled = enrollment.status === 'active' || enrollment.status === 'completed'
    const firstLesson = data.curriculum[0]?.lessons[0]
    if (isEnrolled && firstLesson) {
      navigate(RouteConfig.CourseLearningPage.getPath(data.course.id, firstLesson.id), {
        replace: true,
      })
    }
  }, [searchParams, isLoading, isEnrollmentLoading, data, enrollment, navigate])

  if (isLoading) {
    return (
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Skeleton.Image active className="!mb-5 !h-56 !w-full !rounded-xl sm:!h-72" />
          <div className="rounded-xl border border-neutral-3 bg-white p-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div className="rounded-xl border border-neutral-3 bg-white p-6">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </Col>
      </Row>
    )
  }

  if (isError) {
    return (
      <Alert
        message="Không thể tải thông tin khoá học"
        description="Vui lòng thử lại sau hoặc kiểm tra đường dẫn."
        type="error"
        showIcon
        action={
          <Button size="small" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
            Quay lại
          </Button>
        }
      />
    )
  }

  if (!data) {
    return (
      <Alert
        message="Không tìm thấy khoá học"
        description="Khoá học này không tồn tại hoặc đã bị xoá."
        type="warning"
        showIcon
      />
    )
  }

  const { course, curriculum, instructors = [] } = data
  const firstLesson = curriculum[0]?.lessons[0] ?? null
  const isEnrolled = enrollment?.status === 'active' || enrollment?.status === 'completed'

  return (
    <div className="pb-16 lg:pb-0">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="hover:text-primary-8 focus-visible:ring-primary-5/60 mb-4 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-neutral-6 transition-colors focus-visible:outline-none focus-visible:ring-2"
      >
        <ArrowLeftOutlined className="text-xs" />
        Quay lại danh sách
      </button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="flex flex-col gap-6">
            <CourseInfo course={course} instructors={instructors} />
            <CourseModules curriculum={curriculum} />
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="hidden lg:block lg:sticky lg:top-20">
            <CourseActions
              course={{
                id: course.id,
                price: course.price,
                totalDurationMinutes: course.totalDurationMinutes,
                accessDurationDays: course.accessDurationDays,
                cmeCredits: course.cmeCredits,
              }}
              enrollment={enrollment}
              isEnrollmentLoading={isEnrollmentLoading}
              isLoggedIn={isLoggedIn}
              onPurchase={() => checkoutMutation.mutate(course.id)}
              onFreeEnroll={() => openFreeModal(course.title)}
              isPurchaseLoading={checkoutMutation.isPending}
              isFreeEnrollLoading={confirmFreeMutation.isPending}
              firstLessonId={firstLesson?.id ?? null}
            />
          </div>
        </Col>
      </Row>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center gap-3 border-t border-neutral-3 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileModulesOpen(true)}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-neutral-3 px-3 text-sm text-neutral-7 transition-colors hover:bg-neutral-2"
        >
          <UnorderedListOutlined className="text-xs" />
          Chương trình
        </button>
        <div className="flex-1">
          {isEnrollmentLoading ? (
            <Button block disabled loading className="h-10 font-semibold" />
          ) : isEnrolled ? (
            <Button
              type="primary"
              block
              icon={<PlayCircleOutlined />}
              disabled={!firstLesson}
              onClick={() =>
                firstLesson &&
                navigate(RouteConfig.CourseLearningPage.getPath(course.id, firstLesson.id))
              }
              className="h-10 font-semibold"
            >
              Vào học ngay
            </Button>
          ) : course.price === 0 ? (
            <Button
              type="primary"
              block
              onClick={
                isLoggedIn
                  ? () => openFreeModal(course.title)
                  : () => navigate(RouteConfig.LoginPage.path)
              }
              loading={confirmFreeMutation.isPending}
              className="!bg-success-3 h-10 font-semibold"
            >
              {isLoggedIn ? 'Đăng ký miễn phí' : 'Đăng nhập để đăng ký'}
            </Button>
          ) : (
            <Button
              type="primary"
              block
              icon={<ShoppingCartOutlined />}
              onClick={
                isLoggedIn
                  ? () => checkoutMutation.mutate(course.id)
                  : () => navigate(RouteConfig.LoginPage.path)
              }
              loading={checkoutMutation.isPending}
              className="h-10 font-semibold"
            >
              {isLoggedIn
                ? `${course.price.toLocaleString('vi-VN')}đ · Đăng ký`
                : 'Đăng nhập để đăng ký'}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile curriculum sheet */}
      <Drawer
        open={mobileModulesOpen}
        onClose={() => setMobileModulesOpen(false)}
        placement="bottom"
        height="80vh"
        className="lg:hidden"
        title="Chương trình học"
        styles={{ body: { padding: 0, overflowY: 'auto' } }}
      >
        <CourseModules curriculum={curriculum} />
      </Drawer>

      <Modal
        title="Thanh toán khoá học"
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {checkoutData && (
          <CheckoutModalContent
            checkoutData={checkoutData}
            onConfirmFree={() => confirmFreeMutation.mutate(course.id)}
            confirmingFree={confirmFreeMutation.isPending}
          />
        )}
      </Modal>
    </div>
  )
}
