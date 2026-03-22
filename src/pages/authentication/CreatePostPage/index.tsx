import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select, Space, Spin, Tag, message } from 'antd';

import { RequireAuth } from '@/components/auth';
import Editor from '@/components/ui/Editor';
import RouteConfig from '@/constants/RouteConfig';
import { useAuth } from '@/hooks/useAuth';
import type { Category } from '@/models/Category';
import { PostStatus } from '@/models/Post';
import { getCategories } from '@/services/category/mockCategoryService';
import { createPost } from '@/services/post/postService';

const { Option } = Select;

interface FormData {
  title: string;
  categoryId: string;
  content: string;
}

interface CreatePostData {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  tags?: string[];
  status?: PostStatus;
}

const CreatePostPage = () => {
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [inputTag, setInputTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lấy danh sách categories từ server khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getCategories();
        if (response.data && 'hits' in response.data) {
          // Nếu là ListResponseData format
          setCategories(response.data.hits as Category[]);
        } else if (Array.isArray(response.data)) {
          // Nếu API trả về array trực tiếp
          setCategories(response.data as Category[]);
        } else {
          console.error('Unexpected API response format:', response);
          message.error('Định dạng dữ liệu không hợp lệ');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Không thể tải danh sách danh mục');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Xử lý upload ảnh cho Editor
  const handleImageUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
        message.success('Upload ảnh thành công!');
      };
      reader.onerror = () => {
        message.error('Lỗi upload ảnh!');
        reject(new Error('Upload failed'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (values: FormData) => {
    if (!user?._id) {
      message.error('Bạn cần đăng nhập để đăng bài!');
      return;
    }

    try {
      setLoading(true);

      // Chuẩn bị dữ liệu để tạo bài viết
      const createPostData: CreatePostData = {
        title: values.title,
        content: values.content,
        categoryId: values.categoryId,
        authorId: user._id, // Sử dụng user ID thực tế
        tags: tags, // Sử dụng tags từ state
        status: PostStatus.Published, // Mặc định là Published
      };

      // Gọi API tạo bài viết
      const response = await createPost({
        ...createPostData,
        _id: '', // Placeholder, sẽ được server tạo
        createdAt: '', // Placeholder, sẽ được server tạo
        updatedAt: '', // Placeholder, sẽ được server tạo
      } as Parameters<typeof createPost>[0]);

      console.log('Post created successfully:', response);

      form.resetFields();
      setTags([]);
      message.success('Đăng bài thành công!');

      // Chuyển hướng về diễn đàn sau khi đăng bài thành công
      navigate(RouteConfig.ForumPage.path);
    } catch (error) {
      console.error('Error creating post:', error);
      message.error('Có lỗi xảy ra khi đăng bài!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4 md:p-8">
      <Card title={<h1 className="text-2xl font-bold">Tạo bài viết mới</h1>} className="mx-auto w-4xl max-w-4xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: PostStatus.Draft,
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
            <Select
              placeholder="Chọn danh mục"
              loading={loadingCategories}
              notFoundContent={loadingCategories ? <Spin size="small" /> : 'Không tìm thấy danh mục'}
            >
              {categories.map(category => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết' }]}
          >
            <Editor placeholder="Nhập nội dung bài viết của bạn..." onImageUpload={handleImageUpload} />
          </Form.Item>

          <Form.Item label="Tags">
            <Row gutter={8}>
              <Col flex="auto">
                <Input
                  placeholder="Thêm tags (Enter để thêm)"
                  value={inputTag}
                  onChange={e => setInputTag(e.target.value)}
                  onPressEnter={handleAddTag}
                />
              </Col>
              <Col>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTag}>
                  Thêm
                </Button>
              </Col>
            </Row>
            <div className="mt-2">
              <Space size={[0, 'small']} wrap>
                {tags.map(tag => (
                  <Tag key={tag} closable onClose={() => handleRemoveTag(tag)} className="m-1">
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          </Form.Item>

          <Form.Item className="mt-6 flex justify-end">
            <Space>
              <Button type="default" htmlType="reset">
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đăng bài
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const ProtectedCreatePostPage = () => (
  <RequireAuth>
    <CreatePostPage />
  </RequireAuth>
);

export default ProtectedCreatePostPage;
