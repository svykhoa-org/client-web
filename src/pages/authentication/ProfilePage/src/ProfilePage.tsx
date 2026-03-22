import { useEffect, useState } from 'react';

import { EditOutlined, SaveOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input, Tabs, Typography, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

import { useAuth } from '@/hooks/useAuth';

import './ProfilePage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Khởi tạo form với thông tin user hiện tại
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.fullName,
        email: user.email,
        bio: user.bio || '',
      });

      if (user.avatarUrl) {
        setFileList([
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: user.avatarUrl,
          },
        ]);
      }
    }
  }, [user, form]);

  const handleFinish = (values: Record<string, unknown>) => {
    console.log('Submitted values:', values);
    message.success('Cập nhật thông tin thành công!');
    setIsEditing(false);
    // Ở đây bạn có thể thêm API call để lưu thông tin người dùng
  };

  const uploadProps: UploadProps = {
    beforeUpload: file => {
      // Kiểm tra file là image
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên file hình ảnh!');
        return Upload.LIST_IGNORE;
      }

      // Kiểm tra kích thước file (ví dụ: < 2MB)
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Hình ảnh phải nhỏ hơn 2MB!');
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    maxCount: 1,
  };

  return (
    <div className="container mx-auto py-8">
      <Title level={2} className="mb-6 text-center text-green-700">
        Thông tin cá nhân
      </Title>

      <div className="mx-auto max-w-4xl">
        <Card className="shadow-md">
          <Tabs defaultActiveKey="profile" className="mb-6">
            <TabPane tab="Thông tin cá nhân" key="profile">
              <div className="mb-8 flex flex-col items-center md:flex-row md:items-start">
                <div className="mb-6 flex flex-col items-center md:mr-8 md:mb-0">
                  <div className="mb-4 flex justify-center">
                    {isEditing ? (
                      <Upload
                        {...uploadProps}
                        listType="picture-circle"
                        className="avatar-uploader flex justify-center"
                      >
                        {fileList.length === 0 && (
                          <div className="flex flex-col items-center justify-center">
                            <UploadOutlined />
                            <div className="mt-2">Tải lên</div>
                          </div>
                        )}
                      </Upload>
                    ) : (
                      <Avatar
                        size={128}
                        icon={<UserOutlined />}
                        src={user?.avatarUrl}
                        className="border-4 border-green-200 bg-green-600"
                      />
                    )}
                  </div>
                  <Text strong className="text-lg">
                    {user?.fullName}
                  </Text>
                  <div className="text-sm text-gray-500">{user?.email}</div>

                  {!isEditing && (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
                      className="mt-4 border-green-600 bg-green-600 hover:bg-green-700"
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>

                <div className="w-full flex-1">
                  <Form form={form} layout="vertical" onFinish={handleFinish} disabled={!isEditing} className="w-full">
                    <Form.Item
                      name="name"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>

                    <Form.Item name="bio" label="Giới thiệu bản thân">
                      <Input.TextArea rows={4} />
                    </Form.Item>

                    {isEditing && (
                      <Form.Item className="text-right">
                        <Button onClick={() => setIsEditing(false)} className="mr-2">
                          Hủy
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          className="border-green-600 bg-green-600 hover:bg-green-700"
                        >
                          Lưu thay đổi
                        </Button>
                      </Form.Item>
                    )}
                  </Form>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Bài viết của tôi" key="posts">
              <div className="rounded-md bg-gray-50 p-4 text-center">
                <Text className="text-gray-500">Chức năng hiển thị bài viết của bạn sẽ được cập nhật sớm</Text>
              </div>
            </TabPane>
            <TabPane tab="Tài nguyên đã mua" key="resources">
              <div className="rounded-md bg-gray-50 p-4 text-center">
                <Text className="text-gray-500">Chức năng hiển thị tài nguyên đã mua sẽ được cập nhật sớm</Text>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
