import { Avatar, Tag } from 'antd'
import dayjs from 'dayjs'
import type { FC } from 'react'

import type { Article } from '@/models/Article'
import { getTypefaceStack, LINE_WIDTH_PX, useArticleReaderStore } from '@/stores/articleReaderStore'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

import { ReaderSettingsPanel } from './ReaderSettingsPanel'
import { ShareRow } from './ShareRow'

const readingMinutes = (article: Article): number => {
  const words =
    article.wordCount ??
    (article.content || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ').length
  return Math.max(1, Math.round(words / 200))
}

export const ArticleReader: FC<{ article: Article }> = ({ article }) => {
  const { typefaceId, fontSize, lineHeight, lineWidth } = useArticleReaderStore()
  const fontStack = getTypefaceStack(typefaceId)
  const maxWidth = LINE_WIDTH_PX[lineWidth]
  const dateLabel = dayjs(article.publishedAt ?? article.createdAt).format('DD/MM/YYYY')

  return (
    <div className="article-reader mx-auto px-4" style={{ maxWidth, fontFamily: fontStack }}>
      {/* Floating reader-settings control */}
      <div className="mb-4 flex justify-end pt-2">
        <ReaderSettingsPanel />
      </div>

      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="mb-8 max-h-[440px] w-full rounded-xl object-cover"
        />
      )}

      {article.category && (
        <Tag color={article.category.color || 'blue'} className="mb-4">
          {article.category.name}
        </Tag>
      )}

      <h1
        className="mb-6 font-bold tracking-tight text-neutral-9"
        style={{
          fontFamily: fontStack,
          fontSize: `${Math.round(fontSize * 1.9)}px`,
          lineHeight: 1.15,
        }}
      >
        {article.title}
      </h1>

      {/* Meta row */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-3 pb-6">
        <div className="flex items-center gap-3">
          <Avatar size={44} src={article.authorAvatarUrl || undefined}>
            {article.authorName?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-semibold text-neutral-9">{article.authorName}</div>
            <div className="text-sm text-neutral-6">
              {[article.authorTitle, `${readingMinutes(article)} phút đọc`]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>
        </div>
        <div className="text-sm text-neutral-6">{dateLabel}</div>
      </div>

      {/* Content */}
      <div
        className="article-reader-content prose max-w-none"
        style={{ fontFamily: fontStack, fontSize: `${fontSize}px`, lineHeight }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
      />

      {/* Medical review trust badge */}
      {article.reviewedByUser?.fullName && (
        <div className="mt-10 flex items-center gap-2 rounded-lg bg-primary-1 px-4 py-3 text-sm text-neutral-8">
          <span className="text-primary-6">✓</span>
          <span>
            Đã kiểm duyệt y khoa bởi <strong>{article.reviewedByUser.fullName}</strong>
            {article.reviewedAt && ` · ${dayjs(article.reviewedAt).format('DD/MM/YYYY')}`}
          </span>
        </div>
      )}

      <ShareRow title={article.title} />
    </div>
  )
}
