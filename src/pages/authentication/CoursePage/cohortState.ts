import type { PolicySummary } from '@/types/course-api'

export type RegistrationStatus = 'open' | 'not_open' | 'closed' | 'full'

export interface CohortState {
  isScheduled: boolean
  registrationStatus: RegistrationStatus
  canRegister: boolean
  // Enrolled learners can only open content once the class opens (startDate).
  learningStarted: boolean
  startDate: string | null
  registrationStart: string | null
  registrationEnd: string | null
}

/**
 * Registration / class-start UI state from the server's policySummary. Mirrors the
 * server gates: the registration window and seat cap apply to every course that
 * sets them (not only scheduled ones); the startDate learning gate applies to
 * scheduled courses. The server remains the real enforcement; this only drives
 * proactive UI.
 */
export function getCohortState(policy: PolicySummary, now: Date = new Date()): CohortState {
  const { schedule, capacity } = policy
  const { isScheduled, startDate, registrationStart, registrationEnd } = schedule

  let registrationStatus: RegistrationStatus = 'open'
  if (registrationStart && now < new Date(registrationStart)) {
    registrationStatus = 'not_open'
  } else if (registrationEnd && now > new Date(registrationEnd)) {
    registrationStatus = 'closed'
  } else if (capacity.remaining !== null && capacity.remaining <= 0) {
    registrationStatus = 'full'
  }

  return {
    isScheduled,
    registrationStatus,
    canRegister: registrationStatus === 'open',
    learningStarted: !isScheduled || !startDate || now >= new Date(startDate),
    startDate,
    registrationStart,
    registrationEnd,
  }
}

export const REGISTRATION_STATUS_LABEL: Record<RegistrationStatus, string> = {
  open: 'Đang mở đăng ký',
  not_open: 'Chưa mở đăng ký',
  closed: 'Đã đóng đăng ký',
  full: 'Đã đủ số lượng',
}

export function formatCohortDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
