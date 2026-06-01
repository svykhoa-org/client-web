import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Col, Modal, Row, Skeleton, message } from 'antd'

import axiosInstance, { getAccessToken } from '@/lib/axios'
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

  const freeEnrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await axiosInstance.post('/enrollments', { courseId })
      return response.data
    },
    onSuccess: () => {
      void message.success('Đăng ký khoá học thành công!')
      void queryClient.invalidateQueries({ queryKey: ['enrollment'] })
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
      <div className="w-full">
        <Skeleton.Image active className="!mb-5 !h-56 !w-full sm:!h-72" />
        <Skeleton active paragraph={{ rows: 4 }} className="mb-6" />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
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

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="flex flex-col gap-6">
            <CourseInfo course={course} instructors={instructors} />
            <CourseModules curriculum={curriculum} />
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="lg:sticky lg:top-12">
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
              onFreeEnroll={() => freeEnrollMutation.mutate(course.id)}
              isPurchaseLoading={checkoutMutation.isPending}
              isFreeEnrollLoading={freeEnrollMutation.isPending}
              firstLessonId={firstLesson?.id ?? null}
            />
          </div>
        </Col>
      </Row>

      <Modal
        title="Thanh toán khoá học"
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {checkoutData && <CheckoutModalContent checkoutData={checkoutData} />}
      </Modal>
    </>
  )
}
