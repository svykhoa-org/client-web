import { Card as AntdCard } from 'antd'
import type { CardProps as AntdCardProps } from 'antd/es/card'

import { cn } from '@/lib/utils'

type CardProps = AntdCardProps

const Card = ({ className, ...props }: CardProps) => {
  return (
    <AntdCard
      className={cn('rounded-lg border-none shadow-sm transition-all hover:shadow-md', className)}
      {...props}
    />
  )
}

export default Card
