import React from 'react';

import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Row, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

// Mock data cho đội ngũ chuyên gia
const experts = [
  {
    id: 1,
    name: 'PGS.TS Nguyễn Văn An',
    position: 'Trưởng khoa Tim mạch',
    hospital: 'Bệnh viện Chợ Rẫy',
    specialization: 'Tim mạch can thiệp',
    experience: '20+ năm kinh nghiệm',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    email: 'nva@choray.vn',
    phone: '0902-xxx-xxx',
    achievements: ['Tiến sĩ Y khoa - Đại học Y Hà Nội', 'Chứng chỉ Tim mạch can thiệp - Pháp'],
  },
  {
    id: 2,
    name: 'TS.BS Trần Thị Bích',
    position: 'Phó Giám đốc Y khoa',
    hospital: 'Bệnh viện Bạch Mai',
    specialization: 'Nội tiết - Đái tháo đường',
    experience: '15+ năm kinh nghiệm',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    email: 'ttb@bachmai.vn',
    phone: '0903-xxx-xxx',
    achievements: ['Tiến sĩ Y khoa - Đại học Y TP.HCM', 'Chuyên khoa II Nội tiết'],
  },
  {
    id: 3,
    name: 'PGS.TS Lê Minh Cường',
    position: 'Trưởng khoa Ngoại thần kinh',
    hospital: 'Bệnh viện Việt Đức',
    specialization: 'Ngoại thần kinh',
    experience: '25+ năm kinh nghiệm',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    email: 'lmc@vietduc.vn',
    phone: '0904-xxx-xxx',
    achievements: ['Phó Giáo sư - Đại học Y Hà Nội', 'Fellowship Ngoại thần kinh - Nhật Bản'],
  },
  {
    id: 4,
    name: 'TS.BS Phạm Hoài Nam',
    position: 'Trưởng khoa Nhi',
    hospital: 'Bệnh viện Nhi Trung ương',
    specialization: 'Tim mạch nhi khoa',
    experience: '18+ năm kinh nghiệm',
    avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
    email: 'phn@nhitrunguong.vn',
    phone: '0905-xxx-xxx',
    achievements: ['Tiến sĩ Y khoa - Đại học Y Hà Nội', 'Chuyên khoa II Tim mạch nhi'],
  },
  {
    id: 5,
    name: 'TS.BS Võ Thị Mai',
    position: 'Phó Trưởng khoa Sản',
    hospital: 'Bệnh viện Từ Dũ',
    specialization: 'Sản phụ khoa',
    experience: '12+ năm kinh nghiệm',
    avatar: 'https://images.unsplash.com/photo-1594824388531-2ad9b5d59cf9?w=150&h=150&fit=crop&crop=face',
    email: 'vtm@tudu.vn',
    phone: '0906-xxx-xxx',
    achievements: ['Tiến sĩ Y khoa - Đại học Y TP.HCM', 'Chuyên khoa I Sản phụ khoa'],
  },
  {
    id: 6,
    name: 'PGS.TS Đặng Quốc Tuấn',
    position: 'Giám đốc Trung tâm',
    hospital: 'Trung tâm Ung bướu K',
    specialization: 'Ung thư học',
    experience: '22+ năm kinh nghiệm',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
    email: 'dqt@benhvienk.vn',
    phone: '0907-xxx-xxx',
    achievements: ['Phó Giáo sư - Đại học Y Hà Nội', 'Fellowship Ung thư học - Mỹ'],
  },
];

export const ExpertTeam: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <Title level={2} className="mb-3 text-3xl font-bold text-gray-800">
            Đội ngũ chuyên gia
          </Title>
          <Paragraph className="mx-auto max-w-3xl text-base text-gray-600">
            Các chuyên gia y tế hàng đầu Việt Nam với nhiều năm kinh nghiệm và chuyên môn sâu trong từng lĩnh vực y khoa
          </Paragraph>
        </div>

        <Row gutter={[20, 24]}>
          {experts.map(expert => (
            <Col key={expert.id} xs={24} sm={12} lg={8}>
              <Card
                className="h-full overflow-hidden border-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                bodyStyle={{ padding: 0 }}
              >
                {/* Header with background */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                  <div className="flex flex-col items-center text-center">
                    <Avatar size={64} src={expert.avatar} className="mb-3 border-4 border-white" />
                    <Title level={5} className="mb-1 text-white">
                      {expert.name}
                    </Title>
                    <Text className="text-sm text-blue-100">{expert.position}</Text>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-3 space-y-1">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2 text-blue-600">🏥</span>
                      <Text className="text-xs">{expert.hospital}</Text>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2 text-green-600">🔬</span>
                      <Text className="text-xs">{expert.specialization}</Text>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2 text-orange-600">⏰</span>
                      <Text className="text-xs">{expert.experience}</Text>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="mb-3">
                    <Text strong className="mb-1 block text-sm text-gray-800">
                      Thành tích nổi bật:
                    </Text>
                    <ul className="space-y-1">
                      {expert.achievements.map((achievement, index) => (
                        <li key={index} className="text-xs text-gray-600">
                          • {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <div className="flex items-center text-gray-500">
                        <MailOutlined className="mr-1" />
                        <Text className="text-xs">{expert.email}</Text>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <PhoneOutlined className="mr-1" />
                        <Text className="text-xs">{expert.phone}</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};
