import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router';

import {
  BookOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  EyeOutlined,
  FileTextOutlined,
  HeartOutlined,
  LeftOutlined,
  LinkedinOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
  TwitterOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  Rate,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

import { posts } from '@/mocks/posts';
import type { User } from '@/models/User';
import { getUserById } from '@/services/user';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mẫu bài viết giả cho chuyên gia (dùng mock data)
const userPosts = posts.slice(0, 3) as Array<{
  _id: string;
  title: string;
  createdAt: string;
  viewCount?: number;
  rating?: number;
  thumbnailUrl?: string;
  summary?: string;
  content?: string;
  tags?: string[];
}>;

const FeaturedUserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getUserById(id);
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <Skeleton avatar active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto flex h-64 items-center justify-center px-4 py-8">
        <div className="text-center">
          <Title level={3} className="text-gray-700">
            Không tìm thấy thông tin chuyên gia
          </Title>
          <Link to="/featured-users">
            <Button icon={<LeftOutlined />} type="primary" className="mt-4">
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb and Back Button */}
      <div className="mb-6">
        <Link to="/featured-users" className="text-green-600 hover:text-green-700">
          <Space>
            <LeftOutlined />
            <span>Quay lại danh sách chuyên gia</span>
          </Space>
        </Link>
      </div>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Left Sidebar with User Info */}
        <Col xs={24} md={8} className="mb-6 md:mb-0">
          <Card className="text-center shadow-md">
            {/* Avatar and Name */}
            <div className="relative mb-4 inline-block">
              <Avatar
                size={130}
                src={user.avatarUrl}
                icon={<UserOutlined />}
                className="border-4 border-green-100 bg-green-600"
              />
              <Tooltip title="Chuyên gia đã xác thực">
                <CheckCircleFilled className="absolute -right-1 bottom-1 text-2xl text-green-500" />
              </Tooltip>
            </div>

            <Title level={3} className="mb-1 text-gray-800">
              {user.fullName}
            </Title>
            <Tag color="green" className="mb-4 text-sm">
              {user.specialization}
            </Tag>

            {/* Stats */}
            <div className="my-4 grid grid-cols-3 gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="text-center">
                <div className="flex items-center justify-center text-green-600">
                  <BookOutlined className="mr-1" />
                  <span className="font-medium">{user.stats?.postCount || 0}</span>
                </div>
                <Text className="text-xs text-gray-500">Bài viết</Text>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-green-600">
                  <TeamOutlined className="mr-1" />
                  <span className="font-medium">{user.stats?.followerCount || 0}</span>
                </div>
                <Text className="text-xs text-gray-500">Người theo dõi</Text>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-green-600">
                  <EyeOutlined className="mr-1" />
                  <span className="font-medium">{user.stats?.viewCount || 0}</span>
                </div>
                <Text className="text-xs text-gray-500">Lượt xem</Text>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4 flex items-center justify-center">
              <Rate disabled defaultValue={user.stats?.rating || 0} allowHalf className="text-lg" />
              <Text className="ml-2 text-lg font-medium">{user.stats?.rating || 0}</Text>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button
                type="primary"
                icon={<HeartOutlined />}
                size="large"
                className="bg-green-600 hover:bg-green-700"
                block
              >
                Theo dõi
              </Button>
              <Button
                icon={<MailOutlined />}
                size="large"
                className="border-green-600 text-green-600 hover:border-green-700 hover:bg-green-50 hover:text-green-700"
                block
              >
                Liên hệ tư vấn
              </Button>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex justify-center space-x-3">
              <Button
                shape="circle"
                icon={<TwitterOutlined />}
                className="flex items-center justify-center text-blue-400 hover:bg-blue-50 hover:text-blue-500"
              />
              <Button
                shape="circle"
                icon={<LinkedinOutlined />}
                className="flex items-center justify-center text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              />
            </div>
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={24} md={16}>
          <Card className="shadow-md">
            <Tabs defaultActiveKey="about">
              {/* About Tab */}
              <TabPane
                tab={
                  <span>
                    <UserOutlined className="mr-1" />
                    Thông tin
                  </span>
                }
                key="about"
              >
                {/* Bio */}
                <div className="mb-6">
                  <Title level={4} className="mb-3 flex items-center text-green-700">
                    <UserOutlined className="mr-2" />
                    Giới thiệu
                  </Title>
                  <Paragraph className="whitespace-pre-line text-gray-700">{user.bio}</Paragraph>
                </div>

                <Divider />

                {/* Certificates */}
                <div className="mb-6">
                  <Title level={4} className="mb-3 flex items-center text-green-700">
                    <TrophyOutlined className="mr-2" />
                    Bằng cấp và chứng chỉ
                  </Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={user.certificates || []}
                    renderItem={certificate => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                          title={certificate}
                        />
                      </List.Item>
                    )}
                  />
                </div>

                <Divider />

                {/* Workplaces */}
                <div className="mb-6">
                  <Title level={4} className="mb-3 flex items-center text-green-700">
                    <MedicineBoxOutlined className="mr-2" />
                    Nơi công tác
                  </Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={user.workplaces || []}
                    renderItem={workplace => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<MedicineBoxOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                          title={workplace}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </TabPane>

              {/* Posts Tab */}
              <TabPane
                tab={
                  <span>
                    <BookOutlined className="mr-1" />
                    Bài viết ({user.stats?.postCount || 0})
                  </span>
                }
                key="posts"
              >
                {userPosts.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={userPosts}
                    renderItem={post => (
                      <List.Item
                        key={post._id}
                        extra={
                          post.thumbnailUrl && (
                            <img
                              width={272}
                              alt="post thumbnail"
                              src={post.thumbnailUrl}
                              className="h-32 rounded-md object-cover"
                            />
                          )
                        }
                      >
                        <List.Item.Meta
                          title={
                            <Link
                              to={`/post/${post._id}`}
                              className="text-lg font-medium text-gray-900 hover:text-green-700"
                            >
                              {post.title}
                            </Link>
                          }
                          description={
                            <Space split={<Divider type="vertical" />}>
                              <Text className="text-sm text-gray-500">
                                <CalendarOutlined className="mr-1" />
                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                              </Text>
                              <Text className="text-sm text-gray-500">
                                <EyeOutlined className="mr-1" />
                                {post.viewCount || 0} lượt xem
                              </Text>
                              <Text className="text-sm text-gray-500">
                                <StarOutlined className="mr-1" />
                                {post.rating?.toFixed(1) || 0} điểm
                              </Text>
                            </Space>
                          }
                        />
                        <Paragraph ellipsis={{ rows: 2 }} className="mt-2 text-gray-600">
                          {post.summary || post.content?.substring(0, 150) + '...'}
                        </Paragraph>
                        <div className="mt-3">
                          {post.tags?.map(tag => (
                            <Tag key={tag} className="mr-1 mb-1">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="py-12 text-center">
                    <BookOutlined className="text-4xl text-gray-300" />
                    <Paragraph className="mt-3 text-gray-500">Chưa có bài viết nào từ chuyên gia này</Paragraph>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FeaturedUserDetailPage;
