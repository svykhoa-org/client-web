import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { DownloadOutlined, HomeOutlined, PaperClipOutlined } from '@ant-design/icons'
import { Breadcrumb, Tag } from 'antd'
import dayjs from 'dayjs'

import RouteConfig from '@/constants/RouteConfig'
import { AsyncLoading } from '@/components/ui/AsyncLoading'
import { downloadFile } from '@/utils/downloadFile'
import { useAsyncState } from '@/hooks/useAsyncState'
import { BulletinImportance, type Bulletin, type BulletinAttachmentRef } from '@/models/Bulletin'
import { getBulletinBySlug } from '@/services/Bulletin/getBulletinBySlug'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

const fmtSize = (bytes?: number | null): string => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const AttachmentRow: React.FC<{ file: BulletinAttachmentRef }> = ({ file }) => (
  <button
    type="button"
    disabled={!file.url}
    onClick={() => file.url && downloadFile(file.url, file.originalName ?? undefined)}
    className="flex w-full items-center justify-between rounded-lg border border-neutral-3 px-3 py-2.5 text-left text-sm text-primary-7 transition-colors hover:bg-neutral-2 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <span className="flex items-center gap-2 truncate">
      <PaperClipOutlined /> {file.originalName || 'Tệp đính kèm'}
    </span>
    <span className="ml-3 flex items-center gap-2 whitespace-nowrap text-neutral-5">
      {fmtSize(file.size)}
      <DownloadOutlined className="text-primary-6" />
    </span>
  </button>
)

const BulletinDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const state = useAsyncState<Bulletin>()

  useEffect(() => {
    if (!slug) {
      navigate('/')
      return
    }
    void state.execute(() => getBulletinBySlug(slug))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const bulletin = state.state.data

  useEffect(() => {
    if (!bulletin) return
    const prev = document.title
    document.title = bulletin.title
    return () => {
      document.title = prev
    }
  }, [bulletin])

  const urgent = bulletin?.importance === BulletinImportance.URGENT
  // Accent color as an inline CSS var so the left border can use a token value.
  const accentClass = urgent ? 'border-l-danger-6' : 'border-l-primary-6'
  const dateLabel = bulletin
    ? dayjs(bulletin.publishedAt ?? bulletin.createdAt).format('DD/MM/YYYY')
    : ''

  return (
    <div className="min-h-screen bg-neutral-2 pb-16">
      <div className="container mx-auto px-4 pt-5">
        <div className="mx-auto max-w-[760px]">
          {/* Gap lives on a wrapper div — antd resets margin on .ant-breadcrumb,
              so a Tailwind margin class on <Breadcrumb> itself gets overridden. */}
          <div className="mb-3">
            <Breadcrumb
              items={[
                {
                  title: (
                    <Link to="/">
                      <HomeOutlined />
                    </Link>
                  ),
                },
                { title: <Link to={RouteConfig.BulletinListPage.path}>Văn bản pháp luật</Link> },
                // Clickable category → deep-links into the filtered list.
                ...(bulletin?.category
                  ? [
                      {
                        title: (
                          <Link
                            to={`${RouteConfig.BulletinListPage.path}?category=${bulletin.category.slug}`}
                          >
                            {bulletin.category.name}
                          </Link>
                        ),
                      },
                    ]
                  : []),
                {
                  title: (
                    <span className="line-clamp-1 max-w-[220px] align-bottom text-neutral-7 sm:max-w-[360px]">
                      {bulletin?.title ?? 'Chi tiết'}
                    </span>
                  ),
                },
              ]}
            />
          </div>

          <AsyncLoading
            loading={state.state.loading}
            type="skeleton"
            skeleton={{ rows: 8, title: true }}
          >
            {bulletin && (
              // Notice "phiếu" — sans font, importance accent, prominent date.
              <div
                className={`overflow-hidden rounded-xl border border-neutral-3 border-l-4 bg-white shadow-sm ${accentClass}`}
              >
                {/* Header band */}
                <div className="border-b border-neutral-3 px-6 pt-5 pb-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white ${
                        urgent ? 'bg-danger-6' : 'bg-primary-6'
                      }`}
                    >
                      {urgent ? 'Khẩn' : 'Văn bản'}
                    </span>
                    {bulletin.category && (
                      <Tag color={bulletin.category.color || 'blue'}>{bulletin.category.name}</Tag>
                    )}
                    <span className="ml-auto text-sm text-neutral-6">
                      Ngày phát hành: <strong className="text-neutral-8">{dateLabel}</strong>
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold leading-snug text-neutral-9">
                    {bulletin.title}
                  </h1>
                  {bulletin.summary && (
                    <p className="mt-2 text-sm text-neutral-6">{bulletin.summary}</p>
                  )}
                </div>

                {/* Body */}
                {bulletin.thumbnail && (
                  <img
                    src={bulletin.thumbnail}
                    alt={bulletin.title}
                    className="max-h-72 w-full object-cover"
                  />
                )}
                <div
                  className="rich-content prose max-w-none px-6 py-5 text-neutral-8"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(bulletin.content) }}
                />

                {/* Attachments */}
                {bulletin.attachments && bulletin.attachments.length > 0 && (
                  <div className="border-t border-neutral-3 px-6 py-5">
                    <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-neutral-7">
                      <PaperClipOutlined /> Tệp đính kèm ({bulletin.attachments.length})
                    </div>
                    <div className="flex flex-col gap-2">
                      {bulletin.attachments.map(file => (
                        <AttachmentRow key={file.id} file={file} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!bulletin && !state.state.loading && (
              <div className="py-20 text-center text-neutral-6">Không tìm thấy văn bản.</div>
            )}
          </AsyncLoading>
        </div>
      </div>
    </div>
  )
}

export default BulletinDetailPage
