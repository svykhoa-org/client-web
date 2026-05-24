import React from 'react'

import { LoadingOutlined } from '@ant-design/icons'
import { Skeleton, Spin } from 'antd'

export interface AsyncLoadingProps {
  /** Loading state */
  loading: boolean
  /** Children to render when not loading */
  children: React.ReactNode
  /** Type of loading indicator */
  type?: 'spinner' | 'skeleton'
  /** Custom loading message */
  message?: string
  /** Size of the loading indicator */
  size?: 'small' | 'default' | 'large'
  /** Whether to show the loading overlay */
  overlay?: boolean
  /** Skeleton configuration when type is 'skeleton' */
  skeleton?: {
    /** Number of skeleton lines */
    rows?: number
    /** Whether to show avatar */
    avatar?: boolean
    /** Whether to show title */
    title?: boolean
  }
}

const customIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

export const AsyncLoading: React.FC<AsyncLoadingProps> = ({
  loading,
  children,
  type = 'spinner',
  message = 'Đang tải...',
  size = 'default',
  overlay = false,
  skeleton = { rows: 3, avatar: false, title: true },
}) => {
  if (!loading) {
    return <>{children}</>
  }

  if (type === 'skeleton') {
    return (
      <Skeleton
        loading={loading}
        active
        paragraph={{ rows: skeleton.rows }}
        avatar={skeleton.avatar}
        title={skeleton.title}
      >
        {children}
      </Skeleton>
    )
  }

  const spinContent = (
    <div className="flex min-h-[200px] flex-col items-center justify-center space-y-4">
      <Spin indicator={customIcon} size={size} />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  )

  if (overlay) {
    return (
      <div className="relative">
        {children}
        <div className="bg-opacity-70 absolute inset-0 z-10 flex items-center justify-center bg-white">
          <Spin indicator={customIcon} size={size} tip={message} />
        </div>
      </div>
    )
  }

  return spinContent
}
