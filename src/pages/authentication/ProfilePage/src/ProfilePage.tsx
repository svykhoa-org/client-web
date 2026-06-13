import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import {
  CameraOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  IdcardOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
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
import RouteConfig from '@/constants/RouteConfig'
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
  desc: string
  icon: React.ReactNode
  group: 'learn' | 'account'
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'info',
    label: 'Thông tin cá nhân',
    desc: 'Cập nhật thông tin và ảnh đại diện của bạn',
    icon: <UserOutlined />,
    group: 'learn',
  },
  {
    key: 'medical',
    label: 'Thông tin hành nghề',
    desc: 'Học hàm, chuyên khoa và chứng chỉ hành nghề',
    icon: <IdcardOutlined />,
    group: 'learn',
  },
  {
    key: 'courses',
    label: 'Khoá học của tôi',
    desc: 'Theo dõi tiến độ các khoá học đã đăng ký',
    icon: <ReadOutlined />,
    group: 'learn',
  },
  {
    key: 'certs',
    label: 'Chứng chỉ',
    desc: 'Chứng chỉ bạn đã đạt được sau khi hoàn thành',
    icon: <SafetyCertificateOutlined />,
    group: 'learn',
  },
  {
    key: 'docs',
    label: 'Tài liệu đã mua',
    desc: 'Tài liệu bạn sở hữu và có thể tải xuống',
    icon: <FileTextOutlined />,
    group: 'learn',
  },
  {
    key: 'orders',
    label: 'Lịch sử đơn hàng',
    desc: 'Toàn bộ giao dịch mua khoá học và tài liệu',
    icon: <HistoryOutlined />,
    group: 'account',
  },
  {
    key: 'settings',
    label: 'Cài đặt & Bảo mật',
    desc: 'Quản lý mật khẩu và tuỳ chọn bảo mật',
    icon: <SettingOutlined />,
    group: 'account',
  },
]

const GROUP_LABEL: Record<NavItem['group'], string> = {
  learn: 'Học tập',
  account: 'Tài khoản',
}

// ─── Shared primitives ────────────────────────────────────────────────────────

/** Wrapper card — flat, consistent radius, light border */
const Section = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) => (
  <div
    className={cn('rounded-xl border border-neutral-3 bg-white p-6', className)}
    onClick={onClick}
  >
    {children}
  </div>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-neutral-5">{children}</p>
)

/** Compact count chip used in tab summary rows */
const SummaryChip = ({ value, label }: { value: number; label: string }) => (
  <div className="flex items-baseline gap-1.5 rounded-lg border border-neutral-3 bg-white px-3.5 py-2">
    <span className="text-lg font-semibold tabular-nums text-neutral-10">{value}</span>
    <span className="text-xs text-neutral-6">{label}</span>
  </div>
)

/** Definition row: fixed label column on the left, value on the right.
 *  Shares its grid with the edit form so view and edit modes line up. */
const DefRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-1 border-b border-neutral-2 py-3.5 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
    <span className="text-sm text-neutral-6">{label}</span>
    <div className="min-w-0 text-sm font-medium text-neutral-9">{children}</div>
  </div>
)

/** Editable counterpart of DefRow: same grid, label column hosts a form control */
const FieldRow = ({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) => (
  <div className="grid grid-cols-1 gap-1 border-b border-neutral-2 py-1.5 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
    <label className="text-sm text-neutral-6 sm:pt-2">
      {label}
      {required && <span className="text-error-3"> *</span>}
      {hint && <span className="mt-0.5 block text-xs text-neutral-4">{hint}</span>}
    </label>
    <div className="min-w-0">{children}</div>
  </div>
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

  const renderTabInfo = () => {
    // One layout for both modes — only the input border toggles, so nothing reflows.
    const readOnly = !isEditing
    const variant = readOnly ? 'borderless' : 'outlined'
    return (
      <Section className="p-0">
        {/* Header: avatar + identity + edit toggle */}
        <div className="flex items-center gap-5 border-b border-neutral-2 p-6">
          <div className="relative shrink-0">
            <Avatar
              size={72}
              icon={<UserOutlined />}
              src={fileList[0]?.url || user?.avatarUrl}
              className="bg-primary-9"
            />
            {isEditing && (
              <Upload
                {...uploadProps}
                showUploadList={false}
                className="absolute -bottom-1 -right-1"
              >
                <button
                  type="button"
                  aria-label="Đổi ảnh đại diện"
                  className="bg-primary-7 hover:bg-primary-8 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white shadow-sm transition-colors"
                >
                  <CameraOutlined className="text-xs" />
                </button>
              </Upload>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-neutral-10">
              {user?.fullName || 'Người dùng'}
            </p>
            <p className="truncate text-sm text-neutral-6">{user?.email}</p>
            <p
              className={cn(
                'mt-1 text-xs text-neutral-5 transition-opacity',
                isEditing ? 'opacity-100' : 'opacity-0',
              )}
            >
              Nhấn vào ảnh để thay đổi (tối đa 2MB)
            </p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="rounded-lg">
              Chỉnh sửa
            </Button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={() => {
              message.success('Đã cập nhật thông tin của bạn')
              setIsEditing(false)
            }}
          >
            <SectionTitle>Thông tin liên hệ</SectionTitle>

            <FieldRow label="Họ và tên" required={isEditing}>
              <Form.Item
                name="name"
                className="mb-0"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input
                  size="large"
                  variant={variant}
                  readOnly={readOnly}
                  className="rounded-lg"
                  placeholder="Chưa cập nhật"
                />
              </Form.Item>
            </FieldRow>

            <FieldRow label="Email" hint={isEditing ? 'Không thể thay đổi' : undefined}>
              <Form.Item
                name="email"
                className="mb-0"
                rules={[{ required: true }, { type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input size="large" variant={variant} readOnly className="rounded-lg" />
              </Form.Item>
            </FieldRow>

            <FieldRow label="Giới thiệu">
              <Form.Item name="bio" className="mb-0">
                <Input.TextArea
                  variant={variant}
                  readOnly={readOnly}
                  autoSize={{ minRows: 2, maxRows: 8 }}
                  className="rounded-lg"
                  showCount={isEditing}
                  maxLength={300}
                  placeholder="Chưa cập nhật"
                />
              </Form.Item>
            </FieldRow>

            {isEditing && (
              <div className="mt-6 flex justify-end gap-2">
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

          {/* Account info */}
          <div className="mt-8 border-t border-neutral-2 pt-6">
            <SectionTitle>Thông tin tài khoản</SectionTitle>
            <DefRow label="Ngày tham gia">
              <span className="tabular-nums">
                {user?.createdAt ? formatDateVN(user.createdAt) : '—'}
              </span>
            </DefRow>
            <DefRow label="Vai trò">
              <Tag className="mr-0 rounded-md">{user?.role ?? 'Thành viên'}</Tag>
            </DefRow>
            <DefRow label="Trạng thái">
              <Tag color="green" className="mr-0 rounded-md">
                Đang hoạt động
              </Tag>
            </DefRow>
          </div>
        </div>
      </Section>
    )
  }

  // ─── Tab: Thông tin hành nghề ────────────────────────────────────────────

  const renderTabMedical = () => (
    <Section>
      <div className="mb-6 flex items-start justify-between gap-4">
        <SectionTitle>Thông tin chuyên môn</SectionTitle>
        <span className="bg-warning-1 text-warning-3 shrink-0 rounded-md px-2 py-0.5 text-xs font-medium">
          Sắp ra mắt
        </span>
      </div>
      <p className="-mt-3 mb-6 text-sm text-neutral-6">
        Khai báo thông tin hành nghề để nhận chứng chỉ CME hợp lệ. Phần này sẽ mở trong bản cập nhật
        tới.
      </p>
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
  )

  // ─── Tab: Khoá học ───────────────────────────────────────────────────────

  const renderTabCourses = () => {
    const statusConfig: Record<
      Enrollment['status'],
      { dot: string; text: string; label: string; stroke: string }
    > = {
      active: { dot: 'bg-success-3', text: 'text-success-3', label: 'Đang học', stroke: '#1976d2' },
      completed: {
        dot: 'bg-primary-6',
        text: 'text-primary-7',
        label: 'Hoàn thành',
        stroke: '#52c41a',
      },
      expired: { dot: 'bg-error-3', text: 'text-error-3', label: 'Hết hạn', stroke: '#f5222d' },
      refunded: {
        dot: 'bg-neutral-4',
        text: 'text-neutral-5',
        label: 'Đã hoàn tiền',
        stroke: '#a3a3a3',
      },
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
          <Empty description="Bạn chưa đăng ký khoá học nào">
            <Button
              type="primary"
              className="rounded-lg"
              onClick={() => navigate(RouteConfig.CoursePage.path)}
            >
              Khám phá khoá học
            </Button>
          </Empty>
        </Section>
      )
    }

    const counts = {
      active: enrollments.filter(e => e.status === 'active').length,
      completed: enrollments.filter(e => e.status === 'completed').length,
      expired: enrollments.filter(e => e.status === 'expired').length,
    }

    return (
      <div className="space-y-5">
        {/* Summary */}
        <div className="flex flex-wrap gap-3">
          <SummaryChip value={enrollments.length} label="Tổng khoá học" />
          <SummaryChip value={counts.active} label="Đang học" />
          <SummaryChip value={counts.completed} label="Hoàn thành" />
        </div>

        {/* List */}
        <div className="space-y-3">
          {enrollments.map(enrollment => {
            const cfg = statusConfig[enrollment.status]
            const isOpenable = enrollment.status === 'active' || enrollment.status === 'completed'
            const openCourse = () =>
              navigate(
                `${RouteConfig.CourseDetailPage.path.replace(':id', enrollment.courseId)}?learn=1`,
              )
            return (
              <Section
                key={enrollment.id}
                className={cn(
                  'p-4',
                  isOpenable && 'hover:border-primary-3 cursor-pointer transition-colors',
                )}
                onClick={isOpenable ? openCourse : undefined}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-2">
                    {enrollment.courseSnapshot.thumbnail ? (
                      <img
                        src={enrollment.courseSnapshot.thumbnail}
                        alt={`Ảnh khoá học ${enrollment.courseSnapshot.title}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ReadOutlined className="text-lg text-neutral-4" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 truncate text-sm font-medium text-neutral-9">
                      {enrollment.courseSnapshot.title}
                    </p>
                    <div className="mb-2 flex items-center gap-1.5">
                      <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                      <span className={cn('text-xs font-medium', cfg.text)}>{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress
                        percent={enrollment.progress}
                        size="small"
                        showInfo={false}
                        strokeColor={cfg.stroke}
                        className="mb-0 flex-1"
                      />
                      <span className="shrink-0 text-xs tabular-nums text-neutral-6">
                        {enrollment.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0" onClick={e => e.stopPropagation()}>
                    {enrollment.status === 'active' && (
                      <Button
                        type="primary"
                        size="small"
                        className="rounded-lg"
                        onClick={openCourse}
                      >
                        Tiếp tục học
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
      </div>
    )
  }

  // ─── Tab: Chứng chỉ ─────────────────────────────────────────────────────

  const renderTabCerts = () => {
    const physicalConfig: Record<
      MyCertificate['physicalStatus'],
      { dot: string; text: string; label: string }
    > = {
      none: { dot: 'bg-neutral-4', text: 'text-neutral-5', label: 'Chưa yêu cầu bản giấy' },
      pending: { dot: 'bg-warning-3', text: 'text-warning-3', label: 'Bản giấy đang xử lý' },
      shipped: { dot: 'bg-primary-6', text: 'text-primary-7', label: 'Bản giấy đang giao' },
      delivered: { dot: 'bg-success-3', text: 'text-success-3', label: 'Đã nhận bản giấy' },
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
          <Empty description="Bạn chưa có chứng chỉ nào. Hoàn thành một khoá học để nhận chứng chỉ." />
        </Section>
      )
    }

    return (
      <div className="space-y-3">
        {certificates.map(cert => {
          const phys = physicalConfig[cert.physicalStatus]
          return (
            <Section key={cert.id} className="p-0">
              <div className="flex items-stretch gap-4">
                {/* Credential accent */}
                <div className="bg-primary-1 text-primary-7 flex w-16 shrink-0 items-center justify-center rounded-l-xl">
                  <SafetyCertificateOutlined className="text-2xl" />
                </div>

                <div className="flex min-w-0 flex-1 items-start justify-between gap-4 py-4 pr-4">
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 line-clamp-2 text-sm font-medium text-neutral-9">
                      {cert.courseSnapshot.title}
                    </p>
                    <p className="mb-2 font-mono text-xs text-neutral-5">{cert.certificateCode}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs text-neutral-6">
                        Cấp ngày {formatDateVN(cert.issuedAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className={cn('h-1.5 w-1.5 rounded-full', phys.dot)} />
                        <span className={cn('text-xs', phys.text)}>{phys.label}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    {cert.digitalUrl && (
                      <Button
                        size="small"
                        type="primary"
                        icon={<DownloadOutlined />}
                        className="rounded-lg"
                        onClick={() =>
                          window.open(cert.digitalUrl!, '_blank', 'noopener,noreferrer')
                        }
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
                        Yêu cầu bản giấy
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Section>
          )
        })}
      </div>
    )
  }

  // ─── Tab: Tài liệu đã mua ────────────────────────────────────────────────

  const renderDocumentRow = (item: PurchasedDocument) => {
    const document = item.document
    const thumb = getPublicUrl(document.thumbnail)
    return (
      <Section key={item.licenseId} className="hover:border-primary-3 p-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="bg-neutral-2 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            {thumb ? (
              <img
                src={thumb}
                alt={`Bìa tài liệu ${document.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <FileTextOutlined className="text-primary-5 text-xl" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-1 truncate text-sm font-medium text-neutral-9">{document.title}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-5">
              <span className="tabular-nums">
                {formatFileSize({ bytes: document.fileSize || 0, toUnit: FileSize.MB })}
              </span>
              <span className="text-neutral-3">•</span>
              <span>Mua lúc {formatDateTime(item.purchasedAt)}</span>
            </div>
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
          <Empty description="Bạn chưa mua tài liệu nào">
            <Button
              type="primary"
              className="rounded-lg"
              onClick={() => navigate(RoutePath.DocumentListPage.path)}
            >
              Khám phá thư viện
            </Button>
          </Empty>
        </Section>
      )
    }
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <SummaryChip value={purchasedDocuments.length} label="Tài liệu đã mua" />
        </div>
        {purchasedDocuments.map(renderDocumentRow)}
      </div>
    )
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
          <span className="line-clamp-2 text-sm text-neutral-8">{name}</span>
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
          <span className="text-sm text-neutral-6">{formatDateVN(date)}</span>
        ),
      },
      {
        title: 'Số tiền',
        dataIndex: 'totalAmount',
        align: 'right',
        render: (amount: number) => (
          <span className="text-sm font-medium tabular-nums text-neutral-9">
            {formatCurrency(amount)}
          </span>
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

    const totalSpent = (orders ?? [])
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <SummaryChip value={orders?.length ?? 0} label="Đơn hàng" />
          <div className="flex items-baseline gap-1.5 rounded-lg border border-neutral-3 bg-white px-3.5 py-2">
            <span className="text-lg font-semibold tabular-nums text-neutral-10">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-xs text-neutral-6">đã chi tiêu</span>
          </div>
        </div>
        <Section className="overflow-hidden p-0">
          <Table<MyOrder>
            columns={columns}
            dataSource={orders ?? []}
            rowKey="id"
            loading={isLoadingOrders}
            pagination={{ pageSize: 10, size: 'small', hideOnSinglePage: true }}
            scroll={{ x: 700 }}
          />
        </Section>
      </div>
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
        <div className="divide-y divide-neutral-2">
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
                <p className="text-sm font-medium text-neutral-9">{item.label}</p>
                <p className="text-xs text-neutral-5">{item.desc}</p>
              </div>
              <Switch checked={item.value} onChange={item.onChange} />
            </div>
          ))}
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

  const activeItem = NAV_ITEMS.find(n => n.key === activeTab)
  const groups = ['learn', 'account'] as const

  const renderNavButton = (item: NavItem) => {
    const isActive = activeTab === item.key
    return (
      <button
        key={item.key}
        type="button"
        onClick={() => handleTabChange(item.key)}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
          isActive
            ? 'bg-primary-1 text-primary-9 font-medium'
            : 'hover:bg-neutral-1 text-neutral-7 hover:text-neutral-9',
        )}
      >
        <span className={cn('text-base', isActive ? 'text-primary-7' : 'text-neutral-5')}>
          {item.icon}
        </span>
        {item.label}
      </button>
    )
  }

  return (
    <div className="bg-page min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8 lg:py-8">
        {/* Sidebar */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="space-y-3 lg:sticky lg:top-20">
            {/* Identity card */}
            <div className="flex items-center gap-3.5 rounded-xl border border-neutral-3 bg-white p-4">
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={user?.avatarUrl}
                className="bg-primary-9 shrink-0"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-10">
                  {user?.fullName || 'Người dùng'}
                </p>
                <p className="truncate text-xs text-neutral-5">{user?.email}</p>
              </div>
            </div>

            {/* Nav */}
            <nav aria-label="Mục hồ sơ" className="rounded-xl border border-neutral-3 bg-white p-2">
              {groups.map(group => (
                <div key={group} className="mb-1 last:mb-0">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-4">
                    {GROUP_LABEL[group]}
                  </p>
                  {NAV_ITEMS.filter(n => n.group === group).map(renderNavButton)}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <header className="mb-5">
            <h1 className="text-xl font-semibold text-neutral-10">{activeItem?.label}</h1>
            <p className="mt-1 text-sm text-neutral-5">{activeItem?.desc}</p>
          </header>
          {tabContentMap[activeTab]()}
        </main>
      </div>
    </div>
  )
}

export default ProfilePage
