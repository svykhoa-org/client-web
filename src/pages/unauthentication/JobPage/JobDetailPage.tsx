import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';

import {
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Divider, Row, Skeleton, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

import { useDetail } from '@/hooks/useCRUD/useDetail';
import type { Job } from '@/models/Job';
import { getJobDetail } from '@/services/Job/jobService';

import { FormRegistration } from './components/FormRegistration';

const { Title, Paragraph, Text } = Typography;

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const registrationRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef<string | null>(null); // Track đã fetch id nào chưa

  const {
    data: job,
    isLoadingDetail,
    error,
    handleGetDetail,
  } = useDetail<Job>({
    getDetail: id
      ? async () => {
          console.log('Fetching job detail for id:', id);

          const result = await getJobDetail({ id });
          return result || null;
        }
      : undefined,
  });

  useEffect(() => {
    // Chỉ fetch khi id thay đổi và chưa fetch id này
    if (id && hasFetchedRef.current !== id) {
      hasFetchedRef.current = id;
      handleGetDetail();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToRegistration = () => {
    registrationRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const formatSalary = (salaryRange?: [number, number]) => {
    if (!salaryRange) return 'Thỏa thuận';
    return `${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()} VND`;
  };

  if (isLoadingDetail) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <Alert
          message="Lỗi"
          description="Không thể tải thông tin công việc. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <Alert message="Không tìm thấy" description="Công việc không tồn tại hoặc đã bị xóa." type="warning" showIcon />
      </div>
    );
  }

  const isExpired = dayjs().isAfter(dayjs(job.expiresAt));

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Job Header */}
      <Card className="mb-6">
        <Row gutter={[24, 16]}>
          <Col xs={24} lg={16}>
            <Title level={1} className="mb-4 text-blue-600">
              {job.title}
            </Title>
            <Title level={4} className="mb-4 text-gray-600">
              {job.company}
            </Title>
          </Col>
          <Col xs={24} lg={8} className="text-right">
            <Space direction="vertical" size="middle" className="w-full">
              <Button
                type="primary"
                size="large"
                icon={<UserAddOutlined />}
                onClick={scrollToRegistration}
                disabled={isExpired}
                className="w-full"
              >
                {isExpired ? 'Đã hết hạn' : 'Đăng ký ứng tuyển'}
              </Button>
              <Space>
                <CalendarOutlined />
                <Text type={isExpired ? 'danger' : 'secondary'}>
                  Hết hạn: {dayjs(job.expiresAt).format('DD/MM/YYYY')}
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider />

        {/* Job Basic Info */}
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <Space>
              <div>
                <Text type="secondary" className="block text-xs">
                  <EnvironmentOutlined className="mr-2 text-blue-600" />
                  Địa điểm làm việc
                </Text>
                <Text strong>{job.location}</Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <div>
                <Text type="secondary" className="block text-xs">
                  <DollarOutlined className="mr-2 text-green-600" />
                  Mức lương
                </Text>
                <Text strong>{formatSalary(job.salaryRange)}</Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <div className="">
                <Text type="secondary" className="block text-xs">
                  <UserAddOutlined className="mr-2 text-blue-600" />
                  Trạng thái
                </Text>
                <Tag color={job.status === 'open' ? 'green' : 'red'}>
                  {job.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                </Tag>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Job Details */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="top-6 mb-6">
            {/* Description */}
            <div className="mb-8">
              <Title level={3} className="mb-4 text-gray-800">
                Mô tả công việc
              </Title>
              <Paragraph className="whitespace-pre-wrap text-gray-700">{job.description}</Paragraph>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8">
                <Title level={3} className="mb-4 text-gray-800">
                  Yêu cầu ứng viên
                </Title>
                <ul className="space-y-2 pl-0">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mt-2 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                      <Text className="flex-1">{requirement}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-0">
                <Title level={3} className="mb-4 text-gray-800">
                  Chế độ phúc lợi
                </Title>
                <ul className="space-y-2 pl-0">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mt-2 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-600"></span>
                      <Text className="flex-1">{benefit}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </Col>

        {/* Contact Info Sidebar */}
        <Col xs={24} lg={8}>
          <Card title="Thông tin liên hệ" className="sticky top-6">
            <Space direction="vertical" size="middle" className="w-full">
              {job.contactEmail && (
                <Space>
                  <div>
                    <Text type="secondary" className="block text-xs">
                      <MailOutlined className="mr-2 text-blue-600" />
                      Email
                    </Text>
                    <Text copyable>{job.contactEmail}</Text>
                  </div>
                </Space>
              )}

              {job.contactPhone && (
                <Space>
                  <div>
                    <Text type="secondary" className="block text-xs">
                      <PhoneOutlined className="mr-2 text-green-600" />
                      Điện thoại
                    </Text>
                    <Text copyable>{job.contactPhone}</Text>
                  </div>
                </Space>
              )}

              {job.applyLink && (
                <Space>
                  <div>
                    <Text type="secondary" className="block text-xs">
                      <LinkOutlined className="mr-2 text-purple-600" />
                      Link ứng tuyển
                    </Text>
                    <Button type="link" href={job.applyLink} target="_blank" className="p-0!">
                      Ứng tuyển trực tiếp
                    </Button>
                  </div>
                </Space>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Registration Form */}
      {!isExpired && (
        <div ref={registrationRef} className="mt-12">
          <Card title="Đăng ký ứng tuyển">
            <FormRegistration
              onSubmit={data => {
                console.log('Job application data:', { jobId: job._id, ...data });
                // Handle form submission here
              }}
              onSuccess={() => {
                // Handle success here
              }}
            />
          </Card>
        </div>
      )}
    </div>
  );
};
