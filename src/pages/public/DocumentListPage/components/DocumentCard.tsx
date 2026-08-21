import { Fragment, type ReactNode, type SyntheticEvent } from 'react'

import { Link } from 'react-router'

import { RightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import type { Document } from '@/models/Document'
import { RoutePath } from '@/routes'
import { formatCurrency } from '@/utils/currency/formatCurrency'
import { getPublicUrl } from '@/utils/getPublicUrl'

interface DocumentCardProps {
  document: Document
}

// Fallback bìa tài liệu — asset tĩnh trong public/, phục vụ khi document
// thiếu thumbnail hoặc ảnh lỗi. Đặt ở public root nên đường dẫn tuyệt đối.
const PLACEHOLDER_THUMBNAIL = '/document-placeholder.png'

const resolveThumbnail = (document: Document) =>
  getPublicUrl(document.thumbnail) ?? PLACEHOLDER_THUMBNAIL

const handleThumbnailError = (event: SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget
  if (img.dataset.fallback) return
  img.dataset.fallback = 'true'
  img.src = PLACEHOLDER_THUMBNAIL
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const href = RoutePath.DocumentDetailPage.getPath(document.id)
  const thumbnail = resolveThumbnail(document)
  const isFree = document.price === 0

  // Meta: Category · Số trang · Ngày — ngăn cách bằng line dọc (theo thiết kế).
  const metaItems: ReactNode[] = []
  if (document.category?.name) {
    metaItems.push(
      <span key="category" className="text-primary-8 font-medium">
        {document.category.name}
      </span>,
    )
  }
  if (document.totalPages) {
    metaItems.push(
      <span key="pages" className="tabular-nums">
        {document.totalPages} trang
      </span>,
    )
  }
  metaItems.push(
    <span key="date" className="tabular-nums">
      {dayjs(document.createdAt).format('DD/MM/YYYY')}
    </span>,
  )

  return (
    <article className="group shadow-primary-10/5 hover:border-primary-3 flex gap-4 rounded-xl border border-neutral-3 bg-white p-4 shadow-sm transition-colors sm:gap-5 sm:p-5">
      {/* Cover */}
      <Link to={href} aria-label={document.title} className="shrink-0">
        <div className="bg-primary-1 flex aspect-square w-20 items-center justify-center overflow-hidden rounded-lg sm:w-24">
          <img
            src={thumbnail}
            alt={`Bìa tài liệu ${document.title}`}
            onError={handleThumbnailError}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          to={href}
          className="hover:text-primary-8 line-clamp-2 text-base font-medium leading-snug text-neutral-10 transition-colors"
        >
          {document.title}
        </Link>

        {document.description ? (
          <p className="mt-1 line-clamp-2 text-sm font-light leading-relaxed text-neutral-5">
            {document.description}
          </p>
        ) : null}

        {/* Meta — line dọc ngăn cách */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-xs text-neutral-6">
          {metaItems.map((item, index) => (
            <Fragment key={index}>
              {index > 0 ? (
                <span className="h-3.5 w-px shrink-0 bg-neutral-3" aria-hidden="true" />
              ) : null}
              {item}
            </Fragment>
          ))}
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
