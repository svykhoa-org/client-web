import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'

import { Alert, Button, Skeleton } from 'antd'
import dayjs from 'dayjs'
import {
  Banknote,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  UserRoundPlus,
} from 'lucide-react'

import { useDetail } from '@/hooks/useCRUD/useDetail'
import type { Job } from '@/models/Job'
import { getJobDetail } from '@/services/Job/jobService'

import { FormRegistration } from './components/FormRegistration'

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const registrationRef = useRef<HTMLDivElement>(null)
  const hasFetchedRef = useRef<string | null>(null)

  const {
    data: job,
    isLoadingDetail,
    error,
    handleGetDetail,
  } = useDetail<Job>({
    getDetail: id
      ? async () => {
          const result = await getJobDetail({ id })
          return result || null
        }
      : undefined,
  })

  useEffect(() => {
    if (id && hasFetchedRef.current !== id) {
      hasFetchedRef.current = id
      handleGetDetail()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToRegistration = () => {
    registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const formatSalary = (salaryRange?: [number, number]) => {
    if (!salaryRange) return 'Thỏa thuận'
    return `${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()} VND`
  }

  if (isLoadingDetail) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Alert
          message="Lỗi"
          description="Không thể tải thông tin công việc. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Alert
          message="Không tìm thấy"
          description="Công việc không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
        />
      </div>
    )
  }

  const isExpired = dayjs().isAfter(dayjs(job.expiresAt))
  const isOpen = job.status === 'open'

  return (
    <div className="bg-neutral-2 pb-12">
      {/* Job header */}
      <div className="border-b border-neutral-3/60 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              {/* Company avatar */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-1 text-xl font-bold text-primary-7">
                {job.company.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-9 sm:text-2xl">{job.title}</h1>
                <p className="mt-1 text-base text-neutral-6">{job.company}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <Button
                type="primary"
                size="large"
                icon={<UserRoundPlus className="h-4 w-4" />}
                onClick={scrollToRegistration}
                disabled={isExpired || !isOpen}
                className="flex items-center gap-1.5"
              >
                {isExpired || !isOpen ? 'Đã đóng tuyển' : 'Đăng ký ứng tuyển'}
              </Button>
              <span
                className={`flex items-center gap-1 text-xs ${isExpired ? 'text-error-3' : 'text-neutral-5'}`}
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Hạn nộp: {dayjs(job.expiresAt).format('DD/MM/YYYY')}
              </span>
            </div>
          </div>

          {/* Info chips */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="flex items-center gap-1.5 rounded-lg bg-neutral-2 px-3 py-1.5 text-sm text-neutral-7">
              <MapPin className="h-4 w-4 text-primary-5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-neutral-2 px-3 py-1.5 text-sm text-neutral-7">
              <Banknote className="h-4 w-4 text-success-3" />
              {formatSalary(job.salaryRange)}
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
                isOpen && !isExpired ? 'bg-success-1 text-success-3' : 'bg-error-1 text-error-3'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isOpen && !isExpired ? 'bg-success-3' : 'bg-error-3'}`}
              />
              {isOpen && !isExpired ? 'Đang tuyển dụng' : 'Đã đóng tuyển'}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-5 lg:col-span-2">
            {/* Description */}
            <div className="rounded-xl border border-neutral-3/60 bg-white p-6">
              <h2 className="mb-4 text-base font-semibold text-neutral-9">Mô tả công việc</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-7">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="rounded-xl border border-neutral-3/60 bg-white p-6">
                <h2 className="mb-4 text-base font-semibold text-neutral-9">Yêu cầu ứng viên</h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-7">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="rounded-xl border border-neutral-3/60 bg-white p-6">
                <h2 className="mb-4 text-base font-semibold text-neutral-9">Chế độ phúc lợi</h2>
                <ul className="space-y-2.5">
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-7">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-3" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact info */}
            <div className="rounded-xl border border-neutral-3/60 bg-white p-6">
              <h2 className="mb-4 text-base font-semibold text-neutral-9">Thông tin liên hệ</h2>
              <div className="space-y-4">
                {job.contactEmail && (
                  <div>
                    <p className="mb-1 text-xs text-neutral-5">Email liên hệ</p>
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="flex items-center gap-2 text-sm font-medium text-primary-6 hover:text-primary-7"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      {job.contactEmail}
                    </a>
                  </div>
                )}

                {job.contactPhone && (
                  <div>
                    <p className="mb-1 text-xs text-neutral-5">Số điện thoại</p>
                    <a
                      href={`tel:${job.contactPhone}`}
                      className="flex items-center gap-2 text-sm font-medium text-neutral-8 hover:text-primary-6"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {job.contactPhone}
                    </a>
                  </div>
                )}

                {job.applyLink && (
                  <div>
                    <p className="mb-1 text-xs text-neutral-5">Link ứng tuyển trực tiếp</p>
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-primary-6 hover:text-primary-7"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      Ứng tuyển trực tiếp
                    </a>
                  </div>
                )}

                {!job.contactEmail && !job.contactPhone && !job.applyLink && (
                  <p className="text-sm text-neutral-5">Chưa có thông tin liên hệ.</p>
                )}
              </div>
            </div>

            {/* Quick apply CTA */}
            {!isExpired && isOpen && (
              <div className="rounded-xl border border-primary-3/60 bg-primary-1 p-5 text-center">
                <p className="mb-3 text-sm text-neutral-7">
                  Quan tâm đến vị trí này? Nộp hồ sơ ngay hôm nay.
                </p>
                <Button
                  type="primary"
                  block
                  onClick={scrollToRegistration}
                  icon={<UserRoundPlus className="h-4 w-4" />}
                  className="flex items-center justify-center gap-1.5"
                >
                  Đăng ký ứng tuyển
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Registration form */}
        {!isExpired && isOpen && (
          <div
            ref={registrationRef}
            className="mt-6 rounded-xl border border-neutral-3/60 bg-white p-6"
          >
            <h2 className="mb-1 text-base font-semibold text-neutral-9">Đăng ký ứng tuyển</h2>
            <p className="mb-6 text-sm text-neutral-5">
              Điền đầy đủ thông tin bên dưới để gửi đơn ứng tuyển cho vị trí này.
            </p>
            <FormRegistration
              onSubmit={data => {
                console.log('Job application data:', { jobId: job.id, ...data })
              }}
              onSuccess={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}
