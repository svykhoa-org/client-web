import type { Course } from '@/models/Course'

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

type CohortInput = Pick<
  Course,
  | 'isScheduled'
  | 'startDate'
  | 'registrationStart'
  | 'registrationEnd'
  | 'maxEnrollments'
  | 'currentEnrollments'
>

/**
 * Derive the cohort (scheduled-course) UI state. Mirrors the server gates:
 * registration window (BE-2 checkout gate), seat cap, and startDate learning gate
 * (BE-3). Non-scheduled courses are always open/learnable. The server remains the
 * real enforcement; this only drives proactive UI.
 */
export function getCohortState(course: CohortInput, now: Date = new Date()): CohortState {
  const {
    isScheduled,
    startDate,
    registrationStart,
    registrationEnd,
    maxEnrollments,
    currentEnrollments,
  } = course

  if (!isScheduled) {
    return {
      isScheduled: false,
      registrationStatus: 'open',
      canRegister: true,
      learningStarted: true,
      startDate,
      registrationStart,
      registrationEnd,
    }
  }

  let registrationStatus: RegistrationStatus = 'open'
  if (registrationStart && now < new Date(registrationStart)) {
    registrationStatus = 'not_open'
  } else if (registrationEnd && now > new Date(registrationEnd)) {
    registrationStatus = 'closed'
  } else if (maxEnrollments != null && currentEnrollments >= maxEnrollments) {
    registrationStatus = 'full'
  }

  return {
    isScheduled: true,
    registrationStatus,
    canRegister: registrationStatus === 'open',
    learningStarted: !startDate || now >= new Date(startDate),
    startDate,
    registrationStart,
    registrationEnd,
  }
}

export const REGISTRATION_STATUS_LABEL: Record<Exclude<RegistrationStatus, 'open'>, string> = {
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
