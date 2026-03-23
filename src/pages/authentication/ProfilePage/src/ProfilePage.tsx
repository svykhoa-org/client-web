import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  CalendarOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Spin,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd'
import type { TabsProps, UploadFile, UploadProps } from 'antd'

import { useRequest } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import { FileSize } from '@/models/enum/FileSize'
import { RoutePath } from '@/routes'
import {
  getDocumentDownloadUrl,
  listMyDocuments,
  type PurchasedDocument,
} from '@/services/Document'
import { formatFileSize } from '@/utils/file/formatFileSize'
import { getPublicUrl } from '@/utils/getPublicUrl'

import './ProfilePage.css'

const { Title, Text } = Typography

const formatDateTime = (isoDate: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<string | null>(null)

  const {
    data: purchasedDocuments,
    isLoading: isLoadingPurchasedDocuments,
    execute: fetchPurchasedDocuments,
  } = useRequest(listMyDocuments)

  useEffect(() => {
    void fetchPurchasedDocuments()
  }, [fetchPurchasedDocuments])

  useEffect(() => {
    if (!user) return

    form.setFieldsValue({
      name: user.fullName,
      email: user.email,
      bio: user.bio || '',
    })

    if (user.avatarUrl) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: user.avatarUrl,
        },
      ])
    }
  }, [user, form])

  const handleFinish = (values: Record<string, unknown>) => {
    console.log('Submitted values:', values)
    message.success('Cập nhật thông tin thành công!')
    setIsEditing(false)
  }

  const uploadProps: UploadProps = {
    beforeUpload: file => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên file hình ảnh!')
        return Upload.LIST_IGNORE
      }

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Hình ảnh phải nhỏ hơn 2MB!')
        return Upload.LIST_IGNORE
      }

      return false
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList)
    },
    maxCount: 1,
  }

  const handleDownloadDocument = async (documentId: string) => {
    try {
      setDownloadingDocumentId(documentId)
      const response = await getDocumentDownloadUrl({ documentId })

      if (!response.downloadUrl) {
        message.warning('Không nhận được đường dẫn tải xuống tài liệu.')
        return
      }

      window.open(response.downloadUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Không thể tải xuống tài liệu lúc này.'
      message.error(errorMessage)
    } finally {
      setDownloadingDocumentId(null)
    }
  }

  const renderPurchasedDocumentCard = (item: PurchasedDocument) => {
    const document = item.document

    return (
      <Card key={item.licenseId} className="rounded-sm border-slate-200 shadow-sm!">
        <div className="mb-3 overflow-hidden rounded-sm border border-slate-200">
          {getPublicUrl(document.thumbnail) ? (
            <img
              src={getPublicUrl(document.thumbnail)}
              alt={document.title}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="flex h-40 items-center justify-center bg-slate-100">
              <FileTextOutlined className="text-3xl text-slate-400" />
            </div>
          )}
        </div>

        <div className="mb-2 flex items-start justify-between gap-2">
          <Title level={5} className="mb-0! line-clamp-2">
            {document.title}
          </Title>
          <Tag color="blue" className="mr-0 rounded-sm">
            {item.downloadCount} lượt tải
          </Tag>
        </div>

        <Text className="mb-3 block min-h-10 text-sm text-slate-500">
          {document.description || 'Tài liệu chuyên môn dành cho bạn'}
        </Text>

        <div className="mb-3 space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CalendarOutlined />
            <span>Mua lúc: {formatDateTime(item.purchasedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DownloadOutlined />
            <span>
              Dung lượng: {formatFileSize({ bytes: document.fileSize || 0, toUnit: FileSize.MB })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            className="rounded-md!"
            icon={<DownloadOutlined />}
            onClick={() => void handleDownloadDocument(document.id)}
            loading={downloadingDocumentId === document.id}
          >
            Tải xuống
          </Button>
          <Button
            type="primary"
            className="rounded-md!"
            icon={<EyeOutlined />}
            onClick={() => navigate(RoutePath.DocumentDetailPage.getPath(document.id))}
          >
            Xem chi tiết
          </Button>
        </div>
      </Card>
    )
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      children: (
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <Card className="rounded-sm border-slate-200 shadow-sm">
            <div className="flex flex-col items-center">
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
                    size={124}
                    icon={<UserOutlined />}
                    src={user?.avatarUrl}
                    className="border-4 border-blue-100 bg-blue-600"
                  />
                )}
              </div>

              <Title level={4} className="mb-1! text-center">
                {user?.fullName || 'Người dùng'}
              </Title>
              <Text className="mb-4 text-slate-500">{user?.email}</Text>

              {!isEditing && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  className="mt-4 w-full rounded-md!"
                  size="large"
                >
                  Chỉnh sửa hồ sơ
                </Button>
              )}
            </div>
          </Card>

          <Card className="rounded-sm border-slate-200 shadow-sm">
            <Title level={4} className="mb-4!">
              Thông tin liên hệ
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              disabled={!isEditing}
              className="w-full"
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input size="large" className="rounded-sm" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input size="large" className="rounded-sm" disabled />
              </Form.Item>

              <Form.Item name="bio" label="Giới thiệu bản thân">
                <Input.TextArea rows={5} className="rounded-sm" />
              </Form.Item>

              {isEditing && (
                <Form.Item className="mb-0 text-right">
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="mr-2 rounded-md!"
                    size="large"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    className="rounded-md!"
                    size="large"
                  >
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Card>
        </div>
      ),
    },
    {
      key: 'posts',
      label: 'Bài viết của tôi',
      children: (
        <Card className="rounded-sm border-slate-200 text-center shadow-sm">
          <Text className="text-slate-500">
            Chức năng hiển thị bài viết của bạn sẽ được cập nhật sớm
          </Text>
        </Card>
      ),
    },
    {
      key: 'documents',
      label: 'Tài liệu đã mua',
      children: (
        <div>
          {isLoadingPurchasedDocuments ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : purchasedDocuments && purchasedDocuments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {purchasedDocuments.map(renderPurchasedDocumentCard)}
            </div>
          ) : (
            <Card className="rounded-sm border-slate-200 shadow-sm!">
              <Empty description="Bạn chưa mua tài liệu nào" />
            </Card>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
      <Title level={2} className="mb-2!">
        Hồ sơ cá nhân
      </Title>

      <Tabs defaultActiveKey="profile" items={tabItems} />
    </div>
  )
}

export default ProfilePage
