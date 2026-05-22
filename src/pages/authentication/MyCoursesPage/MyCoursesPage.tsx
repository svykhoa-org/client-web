import React from 'react'
import { useNavigate } from 'react-router'

import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb, Col, Empty, Row, Spin } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useMyCourses } from '@/lib/tanstack-query/hooks/useEnrollmentQueries'
import type { CourseApiItem } from '@/types/course-api'
import { CourseItem } from '@/pages/authentication/CoursePage/components/CourseItem'

export const MyCoursesPage: React.FC = () => {
  const { data, isLoading } = useMyCourses()
  const courses = (data as CourseApiItem[]) || []
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              title: <HomeOutlined />,
              onClick: () => navigate(RouteConfig.HomePage.path),
              className: 'cursor-pointer',
            },
            {
              title: 'Khóa học của tôi',
            },
          ]}
        />

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" tip="Đang tải danh sách khóa học..." />
          </div>
        ) : !courses || courses.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-sm">
            <Empty description="Bạn chưa đăng ký khóa học nào" image={Empty.PRESENTED_IMAGE_SIMPLE}>
              <a href={RouteConfig.CoursePage.path}>Khám phá các khóa học ngay</a>
            </Empty>
          </div>
        ) : (
          <Row gutter={[16, 24]}>
            {courses.map(course => (
              <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
                <CourseItem course={course} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  )
}

// Export default for router lazy loading if needed, but named export is consistent with project
export default MyCoursesPage
