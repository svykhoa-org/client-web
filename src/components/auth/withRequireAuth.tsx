import type { ReactNode } from 'react'

import { RequireAuth } from './RequireAuth'

interface RequireAuthProps {
  children: ReactNode
  fallback?: ReactNode
  showModal?: boolean
  modalTitle?: string
  modalContent?: string
  redirectTo?: string
}

// Higher-order component for pages that require authentication
export const withRequireAuth = <T extends object>(
  Component: React.ComponentType<T>,
  options?: Omit<RequireAuthProps, 'children'>,
) => {
  return (props: T) => (
    <RequireAuth {...options}>
      <Component {...props} />
    </RequireAuth>
  )
}
