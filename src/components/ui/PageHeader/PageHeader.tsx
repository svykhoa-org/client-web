import { ArrowLeftOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Typography, type BreadcrumbProps } from 'antd'

const { Title } = Typography

interface PageHeaderProps {
  title: string
  breadcrumbItems: BreadcrumbProps['items']
  showBackButton?: boolean
  onBack?: () => void
  backButtonText?: string
}

export const PageHeader = ({
  title,
  breadcrumbItems,
  showBackButton = false,
  onBack,
  backButtonText = 'Quay lại',
}: PageHeaderProps) => {
  return (
    <div className="mb-2">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 justify-between">
        <Breadcrumb items={breadcrumbItems} className="[&_a]:bg-transparent!" />

        {showBackButton ? (
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} size="small" type="text">
            {backButtonText}
          </Button>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Title level={2} className="mb-0!">
          {title}
        </Title>
      </div>
    </div>
  )
}

export type { PageHeaderProps }
