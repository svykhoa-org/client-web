import React from 'react';

import { BookOutlined, BulbOutlined, GlobalOutlined, RocketOutlined } from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <BookOutlined style={{ fontSize: '2.5rem', color: '#3b82f6' }} />,
    title: 'Tài liệu học tập',
    description: 'Kho tài liệu y khoa phong phú với slide bài giảng, bài tập và tài liệu tham khảo cập nhật.',
  },
  {
    icon: <GlobalOutlined style={{ fontSize: '2.5rem', color: '#10b981' }} />,
    title: 'Cộng đồng sinh viên',
    description: 'Kết nối và trao đổi kiến thức với hàng nghìn sinh viên y khoa trên toàn quốc.',
  },
  {
    icon: <BulbOutlined style={{ fontSize: '2.5rem', color: '#f59e0b' }} />,
    title: 'Học tập thông minh',
    description: 'Phương pháp học tập hiệu quả với quiz, flashcard và hệ thống theo dõi tiến độ.',
  },
  {
    icon: <RocketOutlined style={{ fontSize: '2.5rem', color: '#8b5cf6' }} />,
    title: 'Phát triển sự nghiệp',
    description: 'Chuẩn bị cho tương lai với thông tin thực tập, nghiên cứu và cơ hội việc làm.',
  },
];

export const AboutUs: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Title level={2} className="mb-4 text-4xl font-bold text-gray-800">
            Về SVYKHOA
          </Title>
          <div className="mx-auto max-w-4xl">
            <Paragraph className="mb-6 text-lg leading-relaxed text-gray-700">
              <strong>SVYKHOA</strong> là nền tảng học tập trực tuyến dành riêng cho sinh viên y khoa, được tạo ra với
              mục tiêu giúp các bạn sinh viên có thể tìm kiếm thông tin, tài liệu và kiến thức y khoa một cách dễ dàng
              và hiệu quả.
            </Paragraph>
            <Paragraph className="text-lg leading-relaxed text-gray-700">
              Chúng tôi hiểu rằng việc học y khoa đòi hỏi sự chính xác, cập nhật và tiếp cận với nguồn tài liệu chất
              lượng. Vì vậy, SVYKHOA cam kết cung cấp một môi trường học tập toàn diện, hỗ trợ sinh viên trong suốt hành
              trình theo đuổi sự nghiệp y tế.
            </Paragraph>
          </div>
        </div>

        {/* Modern Features Grid */}
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card
                className="group h-full border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white hover:shadow-xl"
                bodyStyle={{ padding: '2rem 1.5rem' }}
              >
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 transition-all duration-300 group-hover:from-blue-50 group-hover:to-indigo-50">
                    {feature.icon}
                  </div>
                  <Title level={5} className="mb-3 text-gray-800 transition-colors group-hover:text-blue-600">
                    {feature.title}
                  </Title>
                  <Paragraph className="text-sm leading-relaxed text-gray-600">{feature.description}</Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};
