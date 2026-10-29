import type { ReactNode } from 'react'

import {
  CalendarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  LaptopOutlined,
  OrderedListOutlined,
  PauseCircleOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'

import type { PolicySummary } from '@/types/course-api'
import { formatDurationMinutes } from '@/utils/formatDuration'

import { formatCohortDate } from '../cohortState'

interface CoursePolicyCardProps {
  policy: PolicySummary
  totalDurationMinutes: number | null
  /** Show the registration window line (hidden once the learner is enrolled). */
  showRegistration?: boolean
}

const Row = ({
  icon,
  children,
  emphasis = false,
}: {
  icon: ReactNode
  children: ReactNode
  emphasis?: boolean
}) => (
  <li
    className={`flex items-start gap-2.5 ${
      emphasis ? 'rounded-lg border border-warning-2 bg-warning-1 px-2.5 py-2 text-neutral-9' : ''
    }`}
  >
    <span className="mt-0.5 shrink-0 text-primary-6">{icon}</span>
    <span className="min-w-0">{children}</span>
  </li>
)

function accessText(policy: PolicySummary): string {
  const { access, schedule } = policy
  if (access.mode === 'unlimited') return 'Học trọn đời'
  if (access.mode === 'until_course_end')
    return schedule.endDate
      ? `Học tới hết đợt (${formatCohortDate(schedule.endDate)})`
      : 'Học tới hết đợt'
  return schedule.isScheduled
    ? `Truy cập ${access.days} ngày từ ngày khai giảng`
    : `Truy cập ${access.days} ngày từ khi đăng ký`
}

const PROGRESSION_TEXT: Record<PolicySummary['progressionMode'], string> = {
  free: 'Học tự do, theo thứ tự bạn muốn',
  sequential: 'Học lần lượt từng bài',
  module_sequential: 'Học lần lượt từng chương',
}

/**
 * "Điều kiện khoá học": what a learner should know before buying, rendered from
 * the server's interpreted policySummary — never from raw config.
 */
export const CoursePolicyCard = ({
  policy,
  totalDurationMinutes,
  showRegistration = true,
}: CoursePolicyCardProps) => {
  const { schedule, capacity, proctoring, certificate } = policy
  const hasRegistrationWindow = !!(schedule.registrationStart || schedule.registrationEnd)

  return (
    <section aria-label="Điều kiện khoá học">
      <h3 className="mb-3 text-sm font-semibold text-neutral-9">Điều kiện khoá học</h3>
      <ul className="space-y-2.5 text-sm text-neutral-7">
        {proctoring.cameraRequired && (
          <Row icon={<CameraOutlined />} emphasis>
            <Tooltip title="Khi học video, hệ thống định kỳ yêu cầu chụp ảnh từ camera để xác nhận bạn đang học. Bài học chỉ được tính hoàn thành khi đủ ảnh xác nhận.">
              <span className="font-medium">
                Yêu cầu bật camera khi học video — hệ thống chụp ảnh xác nhận định kỳ
              </span>
            </Tooltip>
          </Row>
        )}
        {policy.requiresVerification && (
          <Row icon={<SafetyCertificateOutlined />}>Dành cho bác sĩ đã xác minh</Row>
        )}
        {schedule.isScheduled && schedule.startDate && (
          <Row icon={<CalendarOutlined />}>
            Khai giảng {formatCohortDate(schedule.startDate)}
            {schedule.endDate ? ` · kết thúc ${formatCohortDate(schedule.endDate)}` : ''}
          </Row>
        )}
        {showRegistration && hasRegistrationWindow && (
          <Row icon={<CalendarOutlined />}>
            Đăng ký: {formatCohortDate(schedule.registrationStart) || '—'}
            {' → '}
            {formatCohortDate(schedule.registrationEnd) || '—'}
          </Row>
        )}
        {capacity.max !== null && (
          <Row icon={<TeamOutlined />}>
            Còn {capacity.remaining ?? 0}/{capacity.max} chỗ
          </Row>
        )}
        <Row icon={<FieldTimeOutlined />}>{accessText(policy)}</Row>
        <Row icon={<OrderedListOutlined />}>{PROGRESSION_TEXT[policy.progressionMode]}</Row>
        <Row icon={<CheckCircleOutlined />}>
          Hoàn thành bài khi xem/đọc ≥ {policy.lessonThresholdPercent}%
        </Row>
        {proctoring.inactivityPause && (
          <Row icon={<PauseCircleOutlined />}>Video tạm dừng khi bạn không thao tác</Row>
        )}
        {totalDurationMinutes ? (
          <Row icon={<ClockCircleOutlined />}>
            {formatDurationMinutes(totalDurationMinutes)} học
          </Row>
        ) : null}
        <Row icon={<TrophyOutlined />}>
          {certificate.enabled
            ? [
                'Cấp chứng chỉ hoàn thành',
                certificate.cmeCredits ? `${certificate.cmeCredits} tín chỉ CME` : null,
                certificate.certifyingOrganization,
              ]
                .filter(Boolean)
                .join(' · ')
            : 'Không cấp chứng chỉ'}
        </Row>
        <Row icon={<LaptopOutlined />}>Học trên mọi thiết bị</Row>
      </ul>
    </section>
  )
}
