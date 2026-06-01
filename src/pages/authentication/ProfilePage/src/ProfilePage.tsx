import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import {
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Form,
  Input,
  Progress,
  Select,
  Spin,
  Switch,
  Table,
  Tag,
  Upload,
  message,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { useRequest } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import axiosInstance from '@/lib/axios'
import { cn } from '@/lib/utils'
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

// ─── Local Types ─────────────────────────────────────────────────────────────

type Tab = 'info' | 'medical' | 'courses' | 'certs' | 'docs' | 'orders' | 'settings'

interface Enrollment {
  id: string
  courseId: string
  status: 'active' | 'completed' | 'expired' | 'refunded'
  enrolledAt: string
  expireAt: string | null
  completedAt: string | null
  progress: number
  pricePaid: number
  courseSnapshot: {
    title: string
    price: number
    thumbnail: string | null
    instructorIds: string[]
  }
}

interface MyCertificate {
  id: string
  certificateCode: string
  courseId: string
  courseSnapshot: { title: string; price: number; thumbnail: string | null }
  issuedAt: string
  digitalUrl: string | null
  physicalStatus: 'none' | 'pending' | 'shipped' | 'delivered'
}

interface MyOrder {
  id: string
  orderCode: string
  productType: 'COURSE' | 'DOCUMENT'
  productName: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  totalAmount: number
  paidAt: string | null
  createdAt: string
}

// ─── Inline Service Functions ─────────────────────────────────────────────────

const fetchMyEnrollments = async (): Promise<Enrollment[]> => {
  const res = await axiosInstance.get<{ data: Enrollment[] }>('/enrollments/my')
  return res.data.data ?? []
}

const fetchMyCertificates = async (): Promise<MyCertificate[]> => {
  const res = await axiosInstance.get<{ data: MyCertificate[] }>('/certificates/my')
  return Array.isArray(res.data.data) ? res.data.data : []
}

const fetchMyOrders = async (): Promise<MyOrder[]> => {
  const res = await axiosInstance.get<{ data: { items: MyOrder[] } }>('/orders/my')
  return res.data.data?.items ?? []
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateTime = (isoDate: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))

const formatDateVN = (isoDate: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate))

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + '₫'

// ─── Sidebar Config ───────────────────────────────────────────────────────────

interface NavItem {
  key: Tab
  label: string
  group: 'main' | 'account'
}

const NAV_ITEMS: NavItem[] = [
  { key: 'info', label: 'Thông tin cá nhân', group: 'main' },
  { key: 'medical', label: 'Thông tin hành nghề', group: 'main' },
  { key: 'courses', label: 'Khoá học của tôi', group: 'main' },
  { key: 'certs', label: 'Chứng chỉ', group: 'main' },
  { key: 'docs', label: 'Tài liệu đã mua', group: 'main' },
  { key: 'orders', label: 'Lịch sử đơn hàng', group: 'account' },
  { key: 'settings', label: 'Cài đặt & Bảo mật', group: 'account' },
]

// ─── Shared primitives ────────────────────────────────────────────────────────

/** Wrapper card — flat, consistent radius, light border */
const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('rounded-lg border border-slate-100 bg-white p-6', className)}>{children}</div>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-400">{children}</p>
)

// ─── Component ────────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTab = (searchParams.get('tab') as Tab | null) ?? 'info'
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<string | null>(null)
  const [twoFA, setTwoFA] = useState(false)
  const [loginNotif, setLoginNotif] = useState(true)
  const [studyReminder, setStudyReminder] = useState(false)

  const {
    data: purchasedDocuments,
    isLoading: isLoadingPurchasedDocuments,
    execute: fetchPurchasedDocuments,
  } = useRequest(listMyDocuments)

  const {
    data: enrollments,
    isLoading: isLoadingEnrollments,
    execute: executeEnrollments,
  } = useRequest(fetchMyEnrollments)

  const {
    data: certificates,
    isLoading: isLoadingCertificates,
    execute: executeCertificates,
  } = useRequest(fetchMyCertificates)

  const {
    data: orders,
    isLoading: isLoadingOrders,
    execute: executeOrders,
  } = useRequest(fetchMyOrders)

  useEffect(() => {
    void fetchPurchasedDocuments()
  }, [fetchPurchasedDocuments])
  useEffect(() => {
    if (activeTab === 'courses') void executeEnrollments()
  }, [activeTab, executeEnrollments])
  useEffect(() => {
    if (activeTab === 'certs') void executeCertificates()
  }, [activeTab, executeCertificates])
  useEffect(() => {
    if (activeTab === 'orders') void executeOrders()
  }, [activeTab, executeOrders])

  useEffect(() => {
    if (!user) return
    form.setFieldsValue({ name: user.fullName, email: user.email, bio: user.bio || '' })
    if (user.avatarUrl) {
      setFileList([{ uid: '-1', name: 'avatar.png', status: 'done', url: user.avatarUrl }])
    }
  }, [user, form])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  const uploadProps: UploadProps = {
    beforeUpload: file => {
      if (!file.type.startsWith('image/')) {
        message.error('Chỉ hỗ trợ file hình ảnh')
        return Upload.LIST_IGNORE
      }
      if (file.size / 1024 / 1024 >= 2) {
        message.error('Hình ảnh phải nhỏ hơn 2MB')
        return Upload.LIST_IGNORE
      }
      return false
    },
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    maxCount: 1,
  }

  const handleDownloadDocument = async (documentId: string) => {
    try {
      setDownloadingDocumentId(documentId)
      const response = await getDocumentDownloadUrl({ documentId })
      if (!response.downloadUrl) {
        message.warning('Không nhận được đường dẫn tải xuống.')
        return
      }
      window.open(response.downloadUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Không thể tải xuống tài liệu.')
    } finally {
      setDownloadingDocumentId(null)
    }
  }

  // ─── Tab: Thông tin cá nhân ──────────────────────────────────────────────

  const renderTabInfo = () => (
    <div className="space-y-4">
      {/* Avatar + basic info */}
      <Section>
        <div className="flex items-center gap-5">
          {isEditing ? (
            <Upload {...uploadProps} listType="picture-circle" showUploadList={false}>
              <Avatar
                size={72}
                icon={<UserOutlined />}
                src={fileList[0]?.url}
                className="cursor-pointer bg-slate-200 text-slate-500"
              />
            </Upload>
          ) : (
            <Avatar
              size={72}
              icon={<UserOutlined />}
              src={user?.avatarUrl}
              className="bg-slate-200 text-slate-500"
            />
          )}
          <div>
            <p className="text-base font-semibold text-slate-900">
              {user?.fullName || 'Người dùng'}
            </p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="ml-auto rounded-lg">
              Chỉnh sửa
            </Button>
          )}
        </div>
      </Section>

      {/* Form */}
      <Section>
        <SectionTitle>Thông tin liên hệ</SectionTitle>
        <Form
          form={form}
          layout="vertical"
          onFinish={() => {
            message.success('Cập nhật thông tin thành công!')
            setIsEditing(false)
          }}
          disabled={!isEditing}
        >
          <div className="grid gap-x-6 sm:grid-cols-2">
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input size="large" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true }, { type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input size="large" className="rounded-lg" disabled />
            </Form.Item>
          </div>

          <Form.Item name="bio" label="Giới thiệu bản thân">
            <Input.TextArea rows={4} className="rounded-lg" />
          </Form.Item>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsEditing(false)} className="rounded-lg">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                className="rounded-lg"
              >
                Lưu thay đổi
              </Button>
            </div>
          )}
        </Form>
      </Section>
    </div>
  )

  // ─── Tab: Thông tin hành nghề ────────────────────────────────────────────

  const renderTabMedical = () => (
    <div className="space-y-4">
      <Alert
        message="Tính năng đang phát triển"
        description="Thông tin hành nghề sẽ được kích hoạt trong phiên bản tiếp theo."
        type="info"
        showIcon={false}
        className="rounded-lg border-slate-200 bg-slate-50 text-slate-600"
      />
      <Section>
        <SectionTitle>Thông tin chuyên môn</SectionTitle>
        <Form layout="vertical" disabled>
          <div className="grid gap-x-6 sm:grid-cols-2">
            <Form.Item label="Học hàm / Học vị">
              <Select placeholder="Chọn học hàm/học vị" className="rounded-lg">
                <Select.Option value="BS">BS – Bác sĩ</Select.Option>
                <Select.Option value="BSCKI">BSCKI – Bác sĩ chuyên khoa I</Select.Option>
                <Select.Option value="BSCKII">BSCKII – Bác sĩ chuyên khoa II</Select.Option>
                <Select.Option value="ThS">ThS – Thạc sĩ</Select.Option>
                <Select.Option value="TS">TS – Tiến sĩ</Select.Option>
                <Select.Option value="PGS">PGS – Phó Giáo sư</Select.Option>
                <Select.Option value="GS">GS – Giáo sư</Select.Option>
                <Select.Option value="DN">Điều dưỡng</Select.Option>
                <Select.Option value="DS">Dược sĩ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Chuyên khoa chính">
              <Select placeholder="Chọn chuyên khoa">
                <Select.Option value="noi">Nội khoa</Select.Option>
                <Select.Option value="ngoai">Ngoại khoa</Select.Option>
                <Select.Option value="sanphu">Sản phụ khoa</Select.Option>
                <Select.Option value="nhi">Nhi khoa</Select.Option>
                <Select.Option value="tim">Tim mạch</Select.Option>
                <Select.Option value="than">Thần kinh</Select.Option>
                <Select.Option value="da">Da liễu</Select.Option>
                <Select.Option value="mat">Nhãn khoa</Select.Option>
                <Select.Option value="tai">Tai mũi họng</Select.Option>
                <Select.Option value="rang">Răng hàm mặt</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Số chứng chỉ hành nghề (CCHN)">
              <Input placeholder="Nhập số CCHN" className="rounded-lg" />
            </Form.Item>

            <Form.Item label="Nơi công tác">
              <Input placeholder="Tên bệnh viện / phòng khám" className="rounded-lg" />
            </Form.Item>

            <Form.Item label="Khoa / Phòng ban" className="sm:col-span-2">
              <Input placeholder="Tên khoa hoặc phòng ban" className="rounded-lg" />
            </Form.Item>
          </div>
        </Form>
      </Section>
    </div>
  )

  // ─── Tab: Khoá học ───────────────────────────────────────────────────────

  const renderTabCourses = () => {
    const statusConfig: Record<Enrollment['status'], { color: string; label: string }> = {
      active: { color: 'green', label: 'Đang học' },
      completed: { color: 'blue', label: 'Hoàn thành' },
      expired: { color: 'red', label: 'Hết hạn' },
      refunded: { color: 'default', label: 'Đã hoàn tiền' },
    }

    if (isLoadingEnrollments)
      return (
        <div className="flex justify-center py-16">
          <Spin />
        </div>
      )

    if (!enrollments?.length) {
      return (
        <Section>
          <Empty description="Bạn chưa đăng ký khoá học nào" />
        </Section>
      )
    }

    return (
      <div className="space-y-3">
        {enrollments.map(enrollment => {
          const { color, label } = statusConfig[enrollment.status]
          return (
            <Section key={enrollment.id} className="p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
                  {enrollment.courseSnapshot.thumbnail ? (
                    <img
                      src={enrollment.courseSnapshot.thumbnail}
                      alt={enrollment.courseSnapshot.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileTextOutlined className="text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {enrollment.courseSnapshot.title}
                    </p>
                    <Tag color={color} className="mr-0 shrink-0 rounded-md text-xs">
                      {label}
                    </Tag>
                  </div>
                  <Progress
                    percent={enrollment.progress}
                    size="small"
                    showInfo={false}
                    className="mb-1"
                  />
                  <p className="text-xs text-slate-400">{enrollment.progress}% hoàn thành</p>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {enrollment.status === 'active' && (
                    <Button type="primary" size="small" className="rounded-lg">
                      Tiếp tục
                    </Button>
                  )}
                  {enrollment.status === 'completed' && (
                    <Button
                      size="small"
                      className="rounded-lg"
                      onClick={() => handleTabChange('certs')}
                    >
                      Xem chứng chỉ
                    </Button>
                  )}
                  {enrollment.status === 'expired' && (
                    <Button danger size="small" className="rounded-lg">
                      Gia hạn
                    </Button>
                  )}
                </div>
              </div>
            </Section>
          )
        })}
      </div>
    )
  }

  // ─── Tab: Chứng chỉ ─────────────────────────────────────────────────────

  const renderTabCerts = () => {
    const physicalLabel: Record<MyCertificate['physicalStatus'], string> = {
      none: 'Chưa yêu cầu',
      pending: 'Đang xử lý',
      shipped: 'Đang giao',
      delivered: 'Đã nhận',
    }
    const physicalColor: Record<MyCertificate['physicalStatus'], string> = {
      none: 'default',
      pending: 'processing',
      shipped: 'blue',
      delivered: 'green',
    }

    if (isLoadingCertificates)
      return (
        <div className="flex justify-center py-16">
          <Spin />
        </div>
      )

    if (!certificates?.length) {
      return (
        <Section>
          <Empty description="Bạn chưa có chứng chỉ nào" />
        </Section>
      )
    }

    return (
      <div className="space-y-3">
        {certificates.map(cert => (
          <Section key={cert.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-sm font-medium text-slate-800 line-clamp-2">
                  {cert.courseSnapshot.title}
                </p>
                <p className="mb-2 font-mono text-xs text-slate-400">{cert.certificateCode}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    Cấp ngày: {formatDateVN(cert.issuedAt)}
                  </span>
                  <Tag
                    color={physicalColor[cert.physicalStatus]}
                    className="mr-0 rounded-md text-xs"
                  >
                    {physicalLabel[cert.physicalStatus]}
                  </Tag>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                {cert.digitalUrl && (
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    className="rounded-lg"
                    onClick={() => window.open(cert.digitalUrl!, '_blank', 'noopener,noreferrer')}
                  >
                    Tải PDF
                  </Button>
                )}
                {cert.physicalStatus === 'none' && (
                  <Button
                    size="small"
                    className="rounded-lg"
                    onClick={() => message.info('Tính năng đang hoàn thiện')}
                  >
                    Yêu cầu bằng giấy
                  </Button>
                )}
              </div>
            </div>
          </Section>
        ))}
      </div>
    )
  }

  // ─── Tab: Tài liệu đã mua ────────────────────────────────────────────────

  const renderDocumentRow = (item: PurchasedDocument) => {
    const document = item.document
    return (
      <Section key={item.licenseId} className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
            {getPublicUrl(document.thumbnail) ? (
              <img
                src={getPublicUrl(document.thumbnail)}
                alt={document.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <FileTextOutlined className="text-slate-300" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-0.5 truncate text-sm font-medium text-slate-800">{document.title}</p>
            <p className="text-xs text-slate-400">
              {formatFileSize({ bytes: document.fileSize || 0, toUnit: FileSize.MB })} &middot; Mua
              lúc {formatDateTime(item.purchasedAt)}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              className="rounded-lg"
              onClick={() => void handleDownloadDocument(document.id)}
              loading={downloadingDocumentId === document.id}
            >
              Tải xuống
            </Button>
            <Button
              size="small"
              type="primary"
              icon={<EyeOutlined />}
              className="rounded-lg"
              onClick={() => navigate(RoutePath.DocumentDetailPage.getPath(document.id))}
            >
              Xem
            </Button>
          </div>
        </div>
      </Section>
    )
  }

  const renderTabDocs = () => {
    if (isLoadingPurchasedDocuments)
      return (
        <div className="flex justify-center py-16">
          <Spin />
        </div>
      )
    if (!purchasedDocuments?.length) {
      return (
        <Section>
          <Empty description="Bạn chưa mua tài liệu nào" />
        </Section>
      )
    }
    return <div className="space-y-3">{purchasedDocuments.map(renderDocumentRow)}</div>
  }

  // ─── Tab: Lịch sử đơn hàng ───────────────────────────────────────────────

  const renderTabOrders = () => {
    const statusConfig: Record<MyOrder['status'], { color: string; label: string }> = {
      COMPLETED: { color: 'green', label: 'Hoàn thành' },
      PENDING: { color: 'warning', label: 'Chờ xử lý' },
      CANCELLED: { color: 'red', label: 'Đã huỷ' },
      REFUNDED: { color: 'volcano', label: 'Đã hoàn tiền' },
    }

    const columns: ColumnsType<MyOrder> = [
      {
        title: 'Mã đơn',
        dataIndex: 'orderCode',
        render: (code: string) => <span className="font-mono text-sm">{code}</span>,
      },
      {
        title: 'Sản phẩm',
        dataIndex: 'productName',
        render: (name: string) => (
          <span className="line-clamp-2 text-sm text-slate-700">{name}</span>
        ),
      },
      {
        title: 'Loại',
        dataIndex: 'productType',
        render: (type: MyOrder['productType']) => (
          <Tag className="rounded-md">{type === 'COURSE' ? 'Khoá học' : 'Tài liệu'}</Tag>
        ),
      },
      {
        title: 'Ngày mua',
        dataIndex: 'createdAt',
        render: (date: string) => (
          <span className="text-sm text-slate-500">{formatDateVN(date)}</span>
        ),
      },
      {
        title: 'Số tiền',
        dataIndex: 'totalAmount',
        render: (amount: number) => (
          <span className="text-sm font-medium">{formatCurrency(amount)}</span>
        ),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (status: MyOrder['status']) => {
          const { color, label } = statusConfig[status]
          return (
            <Tag color={color} className="rounded-md">
              {label}
            </Tag>
          )
        },
      },
    ]

    return (
      <Section className="p-0">
        <Table<MyOrder>
          columns={columns}
          dataSource={orders ?? []}
          rowKey="id"
          loading={isLoadingOrders}
          pagination={{ pageSize: 10, size: 'small' }}
          scroll={{ x: 700 }}
          className="rounded-lg overflow-hidden"
        />
      </Section>
    )
  }

  // ─── Tab: Cài đặt & Bảo mật ─────────────────────────────────────────────

  const renderTabSettings = () => (
    <div className="space-y-4">
      {/* Đổi mật khẩu */}
      <Section>
        <SectionTitle>Đổi mật khẩu</SectionTitle>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={() => message.info('Tính năng đang hoàn thiện')}
          className="max-w-md"
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
            ]}
          >
            <Input.Password size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                },
              }),
            ]}
          >
            <Input.Password size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" className="rounded-lg">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Section>

      {/* Bảo mật */}
      <Section>
        <SectionTitle>Bảo mật</SectionTitle>
        <div className="divide-y divide-slate-100">
          {[
            {
              label: 'Xác thực 2 bước (2FA)',
              desc: 'Thêm lớp bảo mật khi đăng nhập',
              value: twoFA,
              onChange: setTwoFA,
            },
            {
              label: 'Thông báo đăng nhập mới',
              desc: 'Nhận email khi có đăng nhập từ thiết bị lạ',
              value: loginNotif,
              onChange: setLoginNotif,
            },
            {
              label: 'Nhắc nhở học tập',
              desc: 'Thông báo nhắc nhở tiến độ học tập mỗi tuần',
              value: studyReminder,
              onChange: setStudyReminder,
            },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <Switch checked={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </Section>

      {/* Thông tin tài khoản */}
      <Section>
        <SectionTitle>Thông tin tài khoản</SectionTitle>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Ngày tham gia</span>
            <span className="text-slate-800">
              {user?.createdAt ? formatDateVN(user.createdAt) : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Vai trò</span>
            <Tag className="mr-0 rounded-md">{user?.role ?? 'Thành viên'}</Tag>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Trạng thái</span>
            <Tag color="green" className="mr-0 rounded-md">
              Đang hoạt động
            </Tag>
          </div>
        </div>
      </Section>
    </div>
  )

  // ─── Render ──────────────────────────────────────────────────────────────

  const tabContentMap: Record<Tab, () => React.ReactNode> = {
    info: renderTabInfo,
    medical: renderTabMedical,
    courses: renderTabCourses,
    certs: renderTabCerts,
    docs: renderTabDocs,
    orders: renderTabOrders,
    settings: renderTabSettings,
  }

  const mainItems = NAV_ITEMS.filter(n => n.group === 'main')
  const accountItems = NAV_ITEMS.filter(n => n.group === 'account')

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <div className="rounded-lg border border-slate-100 bg-white">
            {/* User summary */}
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  size={56}
                  icon={<UserOutlined />}
                  src={user?.avatarUrl}
                  className="mb-3 bg-slate-200 text-slate-500"
                />
                <p className="truncate text-sm font-semibold text-slate-900 w-full">
                  {user?.fullName || 'Người dùng'}
                </p>
                <p className="truncate text-xs text-slate-400 w-full">{user?.email}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="p-2">
              <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                Học tập
              </p>
              {mainItems.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleTabChange(item.key)}
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                    activeTab === item.key
                      ? 'bg-slate-100 font-medium text-slate-900'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                  )}
                >
                  {item.label}
                </button>
              ))}

              <p className="mt-3 px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                Tài khoản
              </p>
              {accountItems.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleTabChange(item.key)}
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                    activeTab === item.key
                      ? 'bg-slate-100 font-medium text-slate-900'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">{tabContentMap[activeTab]()}</main>
      </div>
    </div>
  )
}

export default ProfilePage
