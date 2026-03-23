import { Link } from 'react-router'

import { FileTextOutlined } from '@ant-design/icons'
import { Tag } from 'antd'

import type { Document } from '@/models/Document'
import { RoutePath } from '@/routes'
import { formatFileSize } from '@/utils/file/formatFileSize'
import { formatCurrency } from '@/utils/currency/formatCurrency'
import { FileSize } from '@/models/enum/FileSize'

interface DocumentCardProps {
  document: Document
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  return (
    <article className="group w-full rounded-md border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-sky-500 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <Link
            to={RoutePath.DocumentDetailPage.getPath(document.id)}
            className="flex flex-wrap gap-2 w-fit"
          >
            <FileTextOutlined />
            <span className="font-bold text-lg">{document.title}</span>
          </Link>

          {/* Tác giả */}
          <p className="text-sm text-neutral-8">Tác giả: Nguyên Văn A</p>

          {/* Mô tả */}
          <p className="text-sm text-neutral-8">{document.description}</p>

          <div className="flex gap-2 mt-4">
            <Tag>{document.category?.name}</Tag>
            <Tag>
              {formatFileSize({
                bytes: document.fileSize,
                toUnit: FileSize.MB,
              })}
            </Tag>
            {document.totalPages ? <Tag>{document.totalPages} trang</Tag> : null}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-row items-center justify-between gap-2 md:mt-0 md:w-auto md:flex-col md:items-end">
          <div className="text-base font-bold text-slate-900">
            {formatCurrency({
              value: document.price,
            })}
          </div>
        </div>
      </div>
    </article>
  )
}
