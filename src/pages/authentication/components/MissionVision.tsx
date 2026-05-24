import React from 'react'

import {
  BookOutlined,
  BulbOutlined,
  GlobalOutlined,
  HeartOutlined,
  RocketOutlined,
  SafetyOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Col, Row, Typography } from 'antd'

const { Title, Paragraph } = Typography

export const MissionVision: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Title level={2} className="mb-4 text-4xl font-bold text-gray-800">
            Sứ mệnh và Tầm nhìn
          </Title>
          <Paragraph className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            Định hướng phát triển của SVYKHOA trong việc hỗ trợ sinh viên y khoa học tập và phát
            triển
          </Paragraph>
        </div>

        {/* Mission & Vision - Modern Grid Layout */}
        <div className="mb-20">
          <Row gutter={[32, 32]}>
            {/* Mission Section */}
            <Col xs={24} lg={12}>
              <div className="relative">
                <div className="mb-6 flex items-center space-x-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl shadow-md"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}
                  >
                    <BookOutlined className="text-lg" style={{ color: '#ffffff' }} />
                  </div>
                  <div>
                    <Title level={4} className="mb-0 text-xl font-bold text-gray-800">
                      Sứ mệnh
                    </Title>
                    <p className="text-xs text-gray-500">Những giá trị cốt lõi của chúng tôi</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="group rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start space-x-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}
                      >
                        <BookOutlined className="text-sm" style={{ color: '#ffffff' }} />
                      </div>
                      <div className="flex-1">
                        <Title
                          level={5}
                          className="mb-1 text-base font-semibold"
                          style={{ color: '#1e40af' }}
                        >
                          Hỗ trợ học tập hiệu quả
                        </Title>
                        <Paragraph className="mb-0 text-sm leading-relaxed text-gray-700">
                          Cung cấp tài liệu, bài giảng và nguồn học liệu chất lượng cao, giúp sinh
                          viên y khoa tiếp cận kiến thức một cách dễ dàng và hiệu quả.
                        </Paragraph>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start space-x-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}
                      >
                        <TeamOutlined className="text-sm" style={{ color: '#ffffff' }} />
                      </div>
                      <div className="flex-1">
                        <Title
                          level={5}
                          className="mb-1 text-base font-semibold"
                          style={{ color: '#1e40af' }}
                        >
                          Kết nối cộng đồng y khoa
                        </Title>
                        <Paragraph className="mb-0 text-sm leading-relaxed text-gray-700">
                          Tạo cầu nối giữa sinh viên y khoa trên toàn quốc, chia sẻ kinh nghiệm và
                          hỗ trợ nhau trong học tập cũng như phát triển nghề nghiệp.
                        </Paragraph>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start space-x-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}
                      >
                        <RocketOutlined className="text-sm" style={{ color: '#ffffff' }} />
                      </div>
                      <div className="flex-1">
                        <Title
                          level={5}
                          className="mb-1 text-base font-semibold"
                          style={{ color: '#1e40af' }}
                        >
                          Phát triển kỹ năng tương lai
                        </Title>
                        <Paragraph className="mb-0 text-sm leading-relaxed text-gray-700">
                          Hỗ trợ sinh viên phát triển kỹ năng chuyên môn và soft skills, chuẩn bị
                          tốt nhất cho sự nghiệp y tế trong tương lai.
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Vision Section */}
            <Col xs={24} lg={12}>
              <div className="relative">
                <div className="mb-6 flex items-center space-x-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl shadow-md"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
                  >
                    <TrophyOutlined className="text-lg" style={{ color: '#ffffff' }} />
                  </div>
                  <div>
                    <Title level={4} className="mb-0 text-xl font-bold text-gray-800">
                      Tầm nhìn
                    </Title>
                    <p className="text-xs text-gray-500">Hướng phát triển trong tương lai</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="group rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 p-4 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start space-x-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
                      >
                        <TrophyOutlined className="text-sm" style={{ color: '#ffffff' }} />
                      </div>
                      <div className="flex-1">
                        <Title
                          level={5}
                          className="mb-1 text-base font-semibold"
                          style={{ color: '#047857' }}
                        >
                          Nền tảng hàng đầu Việt Nam
                        </Title>
                        <Paragraph className="mb-0 text-sm leading-relaxed text-gray-700">
                          Trở thành nền tảng học tập trực tuyến số 1 cho sinh viên y khoa tại Việt
                          Nam, được tin tưởng và sử dụng rộng rãi.
                        </Paragraph>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 p-4 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start space-x-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
                      >
                        <GlobalOutlined className="text-sm" style={{ color: '#ffffff' }} />
                      </div>
                      <div className="flex-1">
                        <Title
                          level={5}
                          className="mb-1 text-base font-semibold"
                          style={{ color: '#047857' }}
                        >
                          Cộng đồng toàn diện và gắn kết
                        </Title>
                        <Paragraph className="mb-0 text-sm leading-relaxed text-gray-700">
                          Xây dựng một hệ sinh thái học tập hoàn chỉnh, nơi sinh viên y khoa có thể
                          học hỏi, chia sẻ và phát triển cùng nhau.
                        </Paragraph>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 p-4 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start space-x-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
                      >
                        <BulbOutlined className="text-sm" style={{ color: '#ffffff' }} />
                      </div>
                      <div className="flex-1">
                        <Title
                          level={5}
                          className="mb-1 text-base font-semibold"
                          style={{ color: '#047857' }}
                        >
                          Đổi mới giáo dục y khoa
                        </Title>
                        <Paragraph className="mb-0 text-sm leading-relaxed text-gray-700">
                          Tiên phong ứng dụng công nghệ hiện đại trong giáo dục y khoa, tạo ra những
                          trải nghiệm học tập tương tác và hiệu quả.
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Core Values - Modern Design */}
        <div className="text-center">
          <Title level={3} className="mb-12 text-3xl font-bold text-gray-800">
            Giá trị cốt lõi
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <div className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                >
                  <SafetyOutlined className="text-2xl" />
                </div>
                <Title level={4} className="mb-3 text-xl font-bold text-gray-800">
                  Đáng tin cậy
                </Title>
                <Paragraph className="leading-relaxed text-gray-600">
                  Cam kết cung cấp thông tin chính xác, được kiểm chứng bởi các chuyên gia y tế và
                  giảng viên.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' }}
                >
                  <BulbOutlined className="text-2xl" />
                </div>
                <Title level={4} className="mb-3 text-xl font-bold text-gray-800">
                  Đổi mới
                </Title>
                <Paragraph className="leading-relaxed text-gray-600">
                  Không ngừng cải tiến và áp dụng công nghệ mới để nâng cao trải nghiệm học tập của
                  sinh viên.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)' }}
                >
                  <HeartOutlined className="text-2xl" />
                </div>
                <Title level={4} className="mb-3 text-xl font-bold text-gray-800">
                  Tận tâm
                </Title>
                <Paragraph className="leading-relaxed text-gray-600">
                  Đặt sự thành công trong học tập và phát triển của sinh viên y khoa lên hàng đầu.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  )
}
