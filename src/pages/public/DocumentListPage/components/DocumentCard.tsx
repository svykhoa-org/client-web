import { Link } from 'react-router'

import { FileTextOutlined, RightOutlined } from '@ant-design/icons'

import type { Document } from '@/models/Document'
import { FileSize } from '@/models/enum/FileSize'
import { RoutePath } from '@/routes'
import { formatCurrency } from '@/utils/currency/formatCurrency'
import { formatFileSize } from '@/utils/file/formatFileSize'
import { getPublicUrl } from '@/utils/getPublicUrl'

interface DocumentCardProps {
  document: Document
}

const resolveThumbnail = (document: Document) => {
  const thumb = document.thumbnail
  if (!thumb) return undefined
  if (thumb.url?.startsWith('http')) return thumb.url
  return getPublicUrl(thumb)
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const href = RoutePath.DocumentDetailPage.getPath(document.id)
  const thumbnail = resolveThumbnail(document)
  const isFree = document.price === 0

  return (
    <article className="group shadow-primary-10/5 hover:border-primary-3 flex gap-4 rounded-xl border border-neutral-3 bg-white p-4 shadow-sm transition-colors sm:gap-5 sm:p-5">
      {/* Cover */}
      <Link to={href} aria-label={document.title} className="shrink-0">
        <div className="bg-primary-1 flex aspect-square w-20 items-center justify-center overflow-hidden rounded-lg sm:w-24">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`Bìa tài liệu ${document.title}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <FileTextOutlined className="text-primary-5 text-2xl" />
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          to={href}
          className="hover:text-primary-8 line-clamp-2 text-base font-semibold leading-snug text-neutral-10 transition-colors"
        >
          {document.title}
        </Link>

        {document.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-6">
            {document.description}
          </p>
        ) : null}

        {/* Meta */}
        <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-3 text-xs text-neutral-5">
          {document.category?.name ? (
            <span className="bg-primary-1 text-primary-8 rounded-md px-2 py-0.5 font-medium">
              {document.category.name}
            </span>
          ) : null}
          <span className="tabular-nums">
            {formatFileSize({ bytes: document.fileSize ?? 0, toUnit: FileSize.MB })}
          </span>
          {document.totalPages ? (
            <>
              <span className="text-neutral-3">•</span>
              <span className="tabular-nums">{document.totalPages} trang</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Price + action */}
      <div className="flex shrink-0 flex-col items-end justify-between gap-3 text-right">
        {isFree ? (
          <span className="text-success-3 text-base font-bold">Miễn phí</span>
        ) : (
          <span className="text-primary-8 text-base font-bold tabular-nums">
            {formatCurrency({ value: document.price })}
          </span>
        )}
        <Link
          to={href}
          className="text-primary-7 hover:text-primary-8 inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium transition-colors"
        >
          Xem chi tiết
          <RightOutlined className="text-[10px]" />
        </Link>
      </div>
    </article>
  )
}
