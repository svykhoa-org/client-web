import { useState } from 'react'

import { DownloadOutlined, FileTextOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Spin } from 'antd'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import { AppConfig } from '@/constants/AppConfig'
import { FileSize } from '@/models/enum/FileSize'
import { formatFileSize } from '@/utils/file/formatFileSize'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = AppConfig.API_FILE_URL.replace(/\/+$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

// ─── Zoom config ──────────────────────────────────────────────────────────────

const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]
const DEFAULT_ZOOM_INDEX = 2

// ─── Props ────────────────────────────────────────────────────────────────────

interface PdfViewerProps {
  url: string
  title?: string
  totalPages?: number | null
  fileSize?: number | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PdfViewer = ({ url, title, totalPages, fileSize }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState(0)
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const resolvedUrl = resolveUrl(url)
  const scale = ZOOM_LEVELS[zoomIndex]
  const zoomLabel = `${Math.round(scale * 100)}%`
  const pageCount = numPages || totalPages

  function handleLoadSuccess({ numPages: n }: { numPages: number }) {
    setNumPages(n)
    setIsLoading(false)
    setLoadError(false)
  }

  function handleLoadError() {
    setIsLoading(false)
    setLoadError(true)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top toolbar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        <FileTextOutlined className="shrink-0 text-green-600" />

        <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
          {title ?? 'Tài liệu'}
        </p>

        <div className="flex shrink-0 items-center gap-3 text-xs text-slate-400">
          {pageCount != null && pageCount > 0 && <span>{pageCount} trang</span>}
          {fileSize != null && (
            <span>{formatFileSize({ bytes: fileSize, toUnit: FileSize.MB })}</span>
          )}
        </div>

        <a href={resolvedUrl} download rel="noopener noreferrer">
          <Button
            size="small"
            icon={<DownloadOutlined />}
            className="shrink-0 rounded-lg border-slate-200 text-slate-600"
          >
            Tải xuống
          </Button>
        </a>
      </div>

      {/* Scrollable PDF area */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-200">
        {isLoading && !loadError && (
          <div className="flex items-center justify-center py-16">
            <Spin size="large" />
          </div>
        )}

        {loadError && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-red-500">
            <p>Không thể tải PDF. Vui lòng thử lại hoặc tải xuống trực tiếp.</p>
            <a href={resolvedUrl} download rel="noopener noreferrer">
              <Button icon={<DownloadOutlined />} size="small">
                Tải xuống
              </Button>
            </a>
          </div>
        )}

        <Document
          file={resolvedUrl}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
          loading={null}
          className="flex flex-col items-center gap-3 py-4"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              scale={scale}
              className="shadow-md"
              loading={null}
            />
          ))}
        </Document>
      </div>

      {/* Bottom toolbar — zoom controls */}
      <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-4 py-2">
        <div className="flex items-center gap-1">
          <Button
            size="small"
            icon={<MinusOutlined />}
            disabled={zoomIndex === 0}
            onClick={() => setZoomIndex(i => i - 1)}
            className="rounded-lg"
          />
          <span className="w-12 select-none text-center text-sm text-slate-600">{zoomLabel}</span>
          <Button
            size="small"
            icon={<PlusOutlined />}
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            onClick={() => setZoomIndex(i => i + 1)}
            className="rounded-lg"
          />
        </div>

        {pageCount != null && pageCount > 0 && (
          <span className="text-xs text-slate-400">{pageCount} trang</span>
        )}
      </div>
    </div>
  )
}
