import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@tanstack/react-query';
import { Alert, Modal, Spin, message } from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import { useDetailCourse } from '@/lib/tanstack-query/hooks/useCourseQueries';
import { type CheckoutResponseData, orderService } from '@/services/Order/checkoutCourse';

import { CourseActions } from './components/CourseActions';
import { CourseInfo } from './components/CourseInfo';
import { CourseModules } from './components/CourseModules';
import { PaymentRedirectionForm } from './components/PaymentRedirectionForm';

export const DetailCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutResponseData | null>(null);

  const { data, isLoading, isError } = useDetailCourse(id || '');

  const checkoutMutation = useMutation({
    mutationFn: (courseId: string) => orderService.checkoutCourse(courseId),
    onSuccess: response => {
      if (response.statusCode === 201) {
        setCheckoutData(response.data as CheckoutResponseData);
        setIsPaymentModalOpen(true);
      } else {
        message.error(response.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    },
    onError: () => {
      message.error('Không thể kết nối đến hệ thống thanh toán');
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin khóa học..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Alert
          message="Lỗi"
          description="Không thể tải thông tin khóa học. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Alert message="Không tìm thấy" description="Khóa học không tồn tại." type="warning" showIcon />
      </div>
    );
  }

  const { course, isPaid, canAccess } = data;

  const handlePayment = () => {
    if (course.id) {
      checkoutMutation.mutate(course.id);
    }
  };

  const handleStartLearning = () => {
    // TODO: Implement navigation to learning page
    console.log('Start learning clicked for course:', course.id);
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4">
        <CourseInfo course={course} />

        <CourseActions
          isPaid={isPaid}
          canAccess={canAccess}
          price={course.price}
          onPayment={handlePayment}
          onStartLearning={handleStartLearning}
          isLoading={checkoutMutation.isPending}
        />

        <CourseModules
          modules={course.modules}
          isAccess={canAccess}
          onLessonClick={lessonId => {
            if (!canAccess) {
              message.warning('Bạn cần mua khóa học để xem nội dung này');
              return;
            }
            navigate(RouteConfig.CourseLearningPage.getPath(course.id || '', lessonId));
          }}
        />
      </div>

      <Modal
        title="Thanh toán khóa học"
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {checkoutData && <PaymentRedirectionForm checkoutData={checkoutData} />}
      </Modal>
    </div>
  );
};
