import type { MyVerification, UserVerificationStatus } from '@/models/DoctorVerification'
import { getMyVerification, submitVerification, uploadLicenseFile } from '@/services/Verification'
import { InboxOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, DatePicker, Form, Input, Modal, Spin, Upload, message } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const STATUS_META: Record<
  UserVerificationStatus,
  { type: 'info' | 'success' | 'warning' | 'error'; label: string; desc: string }
> = {
  none: {
    type: 'info',
    label: 'Chưa xác minh',
    desc: 'Khai báo thông tin hành nghề để được duyệt và mở khoá các khoá học dành cho bác sĩ.',
  },
  pending: {
    type: 'warning',
    label: 'Đang chờ duyệt',
    desc: 'Hồ sơ của bạn đã được gửi và đang chờ quản trị viên duyệt.',
  },
  verified: {
    type: 'success',
    label: 'Đã xác minh',
    desc: 'Bạn đã được xác minh là bác sĩ và có thể tham gia các khoá học dành riêng.',
  },
  rejected: {
    type: 'error',
    label: 'Bị từ chối',
    desc: 'Hồ sơ bị từ chối. Vui lòng xem lý do, chỉnh sửa và gửi lại.',
  },
  expired: {
    type: 'error',
    label: 'Giấy phép đã hết hạn',
    desc: 'Xác minh đã hết hạn theo ngày hết hạn giấy phép. Vui lòng nộp giấy phép mới.',
  },
}

interface FormShape {
  fullNameOnLicense: string
  personalId: string
  licenseNumber: string
  scopeOfPractice: string
  issuingAuthority: string
  issuedDate: dayjs.Dayjs
  expiryDate: dayjs.Dayjs
  workplace?: string
  academicTitle?: string
  phone?: string
}

export const DoctorVerificationSection = () => {
  const queryClient = useQueryClient()
  const [form] = Form.useForm<FormShape>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  // Existing asset id when editing without re-uploading a file.
  const [existingAssetId, setExistingAssetId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<MyVerification>({
    queryKey: ['verification', 'me'],
    queryFn: getMyVerification,
  })

  useEffect(() => {
    if (!data?.verification) return
    const v = data.verification
    form.setFieldsValue({
      fullNameOnLicense: v.fullNameOnLicense,
      personalId: v.personalId,
      licenseNumber: v.licenseNumber,
      scopeOfPractice: v.scopeOfPractice,
      issuingAuthority: v.issuingAuthority,
      issuedDate: dayjs(v.issuedDate),
      expiryDate: dayjs(v.expiryDate),
      workplace: v.workplace ?? undefined,
      academicTitle: v.academicTitle ?? undefined,
      phone: v.phone ?? undefined,
    })
    setExistingAssetId(v.licenseFileAssetId)
  }, [data, form])

  const mutation = useMutation({
    mutationFn: async (values: FormShape) => {
      let assetId = existingAssetId
      if (fileList[0]?.originFileObj) {
        assetId = await uploadLicenseFile(fileList[0].originFileObj as File)
      }
      if (!assetId) throw new Error('Vui lòng tải lên ảnh giấy phép hành nghề')
      return submitVerification({
        fullNameOnLicense: values.fullNameOnLicense,
        personalId: values.personalId,
        licenseNumber: values.licenseNumber,
        scopeOfPractice: values.scopeOfPractice,
        issuingAuthority: values.issuingAuthority,
        issuedDate: values.issuedDate.format('YYYY-MM-DD'),
        expiryDate: values.expiryDate.format('YYYY-MM-DD'),
        licenseFileAssetId: assetId,
        workplace: values.workplace,
        academicTitle: values.academicTitle,
        phone: values.phone,
      })
    },
    onSuccess: () => {
      void message.success('Đã gửi hồ sơ, vui lòng chờ quản trị viên duyệt')
      void queryClient.invalidateQueries({ queryKey: ['verification', 'me'] })
      setFileList([])
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error).message ||
        'Có lỗi xảy ra'
      void message.error(msg)
    },
  })

  const status = data?.status ?? 'none'
  const meta = STATUS_META[status]

  const handleSubmit = (values: FormShape) => {
    // Editing an already-submitted profile resets it to pending — warn first.
    if (status === 'verified' || status === 'pending') {
      Modal.confirm({
        title: 'Gửi lại hồ sơ xác minh?',
        content:
          'Chỉnh sửa sẽ đưa hồ sơ về trạng thái chờ duyệt và bạn tạm mất quyền xác minh cho tới khi được duyệt lại. Các khoá học đang học không bị ảnh hưởng.',
        okText: 'Gửi lại',
        cancelText: 'Huỷ',
        onOk: () => mutation.mutate(values),
      })
      return
    }
    mutation.mutate(values)
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Spin />
      </div>
    )
  }

  return (
    <div>
      <Alert
        className="mb-6 rounded-lg"
        type={meta.type}
        showIcon
        message={meta.label}
        description={meta.desc}
      />
      {status === 'rejected' && data?.verification?.rejectionReason && (
        <Alert
          className="mb-6 rounded-lg"
          type="error"
          showIcon
          message="Lý do từ chối"
          description={data.verification.rejectionReason}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark>
        <div className="grid gap-x-6 sm:grid-cols-2 pt-4">
          <Form.Item
            label="Họ tên trên giấy phép"
            name="fullNameOnLicense"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Họ và tên như trên giấy phép" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Số CCCD / định danh cá nhân"
            name="personalId"
            rules={[{ required: true, message: 'Vui lòng nhập số CCCD' }]}
          >
            <Input placeholder="Số CCCD" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Số giấy phép hành nghề (CCHN)"
            name="licenseNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số giấy phép' }]}
          >
            <Input placeholder="Số giấy phép hành nghề" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Phạm vi hành nghề / chuyên môn"
            name="scopeOfPractice"
            rules={[{ required: true, message: 'Vui lòng nhập phạm vi hành nghề' }]}
          >
            <Input placeholder="VD: Nội khoa" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Nơi cấp"
            name="issuingAuthority"
            rules={[{ required: true, message: 'Vui lòng nhập nơi cấp' }]}
          >
            <Input placeholder="Bộ Y tế / Sở Y tế…" className="rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              label="Ngày cấp"
              name="issuedDate"
              rules={[{ required: true, message: 'Chọn ngày cấp' }]}
            >
              <DatePicker className="w-full rounded-lg" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="Ngày hết hạn"
              name="expiryDate"
              rules={[{ required: true, message: 'Chọn ngày hết hạn' }]}
            >
              <DatePicker className="w-full rounded-lg" format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <Form.Item label="Nơi công tác (tuỳ chọn)" name="workplace">
            <Input placeholder="Tên bệnh viện / phòng khám" className="rounded-lg" />
          </Form.Item>

          <Form.Item label="Học hàm / học vị (tuỳ chọn)" name="academicTitle">
            <Input placeholder="VD: BS, ThS, TS…" className="rounded-lg" />
          </Form.Item>

          <Form.Item label="Số điện thoại (tuỳ chọn)" name="phone">
            <Input placeholder="Số điện thoại liên hệ" className="rounded-lg" />
          </Form.Item>
        </div>

        <Form.Item
          label="Ảnh giấy phép hành nghề"
          required
          extra={existingAssetId ? 'Đã có ảnh. Tải lên ảnh mới nếu muốn thay thế.' : undefined}
        >
          <Upload.Dragger
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
            accept="image/*,application/pdf"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả hoặc bấm để tải ảnh/PDF giấy phép</p>
          </Upload.Dragger>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={mutation.isPending}
          className="rounded-lg"
        >
          {status === 'none' || status === 'rejected' || status === 'expired'
            ? 'Gửi hồ sơ xác minh'
            : 'Gửi lại hồ sơ'}
        </Button>
      </Form>
    </div>
  )
}
