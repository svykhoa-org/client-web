import { Link, useParams } from 'react-router'

import {
  BankOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Button, Col, Result, Row, Spin, Tag } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { UserRole } from '@/models/User'
import { CourseItem } from '@/pages/authentication/CoursePage/components/CourseItem'
import { getPublicProfile } from '@/services/user'

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 text-base font-semibold text-neutral-10">{children}</h2>
)

const PublicProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: () => getPublicProfile(id as string),
    enabled: !!id,
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spin size="large" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <Result
        status="404"
        title="Không tìm thấy hồ sơ"
        subTitle="Hồ sơ này không tồn tại hoặc không được công khai."
        extra={
          <Link to={RouteConfig.HomePage.path}>
            <Button type="primary" className="rounded-lg">
              Về trang chủ
            </Button>
          </Link>
        }
      />
    )
  }

  const isInstructor = profile.role === UserRole.Instructor
  const verification = profile.verification

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <section className="flex flex-col items-center gap-4 rounded-xl border border-neutral-2 bg-neutral-1 p-6 shadow-sm sm:flex-row sm:items-start">
        <Avatar
          src={profile.avatar ?? undefined}
          icon={!profile.avatar && <UserOutlined />}
          size={96}
          className="bg-primary-9 ring-primary-1 shrink-0 text-white ring-4"
        />
        <div className="min-w-0 text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-neutral-10">{profile.fullName}</h1>
          {profile.headline && <p className="mt-1 text-neutral-6">{profile.headline}</p>}
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Tag color={isInstructor ? 'blue' : 'default'} className="rounded-lg">
              {isInstructor ? 'Giảng viên' : 'Thành viên'}
            </Tag>
            {verification && (
              <Tag color="success" icon={<SafetyCertificateOutlined />} className="rounded-lg">
                Bác sĩ đã xác minh
              </Tag>
            )}
          </div>
        </div>
      </section>

      {(profile.bio || verification) && (
        <Row gutter={[24, 24]}>
          {profile.bio && (
            <Col xs={24} md={verification ? 14 : 24}>
              <section className="h-full rounded-xl border border-neutral-2 bg-neutral-1 p-6 shadow-sm">
                <SectionHeading>Giới thiệu</SectionHeading>
                <p className="whitespace-pre-line text-neutral-8">{profile.bio}</p>
              </section>
            </Col>
          )}
          {verification && (
            <Col xs={24} md={profile.bio ? 10 : 24}>
              <section className="h-full rounded-xl border border-neutral-2 bg-neutral-1 p-6 shadow-sm">
                <SectionHeading>Thông tin chuyên môn (đã xác minh)</SectionHeading>
                <ul className="flex flex-col gap-3 text-neutral-8">
                  {verification.academicTitle && (
                    <li className="flex items-start gap-2">
                      <ReadOutlined className="text-primary-7 mt-1" />
                      <span>{verification.academicTitle}</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <SafetyCertificateOutlined className="text-primary-7 mt-1" />
                    <span>{verification.scopeOfPractice}</span>
                  </li>
                  {verification.workplace && (
                    <li className="flex items-start gap-2">
                      <BankOutlined className="text-primary-7 mt-1" />
                      <span>{verification.workplace}</span>
                    </li>
                  )}
                </ul>
              </section>
            </Col>
          )}
        </Row>
      )}

      {isInstructor && (
        <section>
          <SectionHeading>
            Khoá học đang giảng dạy
            <span className="ml-2 text-sm font-normal text-neutral-5">
              {profile.courses.length}
            </span>
          </SectionHeading>
          {profile.courses.length > 0 ? (
            <Row gutter={[16, 16]}>
              {profile.courses.map(course => (
                <Col key={course.id} xs={24} sm={12} lg={8}>
                  <CourseItem course={course} />
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-neutral-5">Chưa có khoá học nào được công khai.</p>
          )}
        </section>
      )}
    </div>
  )
}

export default PublicProfilePage
