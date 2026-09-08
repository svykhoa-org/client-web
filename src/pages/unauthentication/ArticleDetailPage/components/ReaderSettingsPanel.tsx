import { Button, Popover } from 'antd'
import type { FC } from 'react'

import {
  READER_TYPEFACES,
  useArticleReaderStore,
  type LineWidth,
} from '@/stores/articleReaderStore'

const lineWidthLabel: Record<LineWidth, string> = {
  narrow: 'Hẹp',
  medium: 'Vừa',
  wide: 'Rộng',
}

const Stepper: FC<{
  label: string
  value: string
  onDec: () => void
  onInc: () => void
}> = ({ label, value, onDec, onInc }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-neutral-7">{label}</span>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDec}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-3 text-neutral-7 hover:bg-neutral-2"
      >
        −
      </button>
      <span className="min-w-14 text-center text-sm text-neutral-9">{value}</span>
      <button
        type="button"
        onClick={onInc}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-3 text-neutral-7 hover:bg-neutral-2"
      >
        +
      </button>
    </div>
  </div>
)

const PanelContent: FC = () => {
  const {
    typefaceId,
    fontSize,
    lineHeight,
    lineWidth,
    setTypeface,
    incFontSize,
    incLineHeight,
    incLineWidth,
  } = useArticleReaderStore()

  const serif = READER_TYPEFACES.filter(t => t.kind === 'serif')
  const sans = READER_TYPEFACES.filter(t => t.kind === 'sans')

  const renderGroup = (title: string, list: typeof READER_TYPEFACES) => (
    <div className="mb-2">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-5">{title}</div>
      <div className="flex flex-col">
        {list.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTypeface(t.id)}
            className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-neutral-2 ${
              typefaceId === t.id ? 'bg-neutral-2' : ''
            }`}
            style={{ fontFamily: t.stack }}
          >
            <span className="text-neutral-9">{t.label}</span>
            {typefaceId === t.id && <span className="text-primary-6">✓</span>}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-64">
      {renderGroup('Serif', serif)}
      {renderGroup('Sans-serif', sans)}
      <div className="mt-1 border-t border-neutral-3 pt-1">
        <Stepper
          label="Cỡ chữ"
          value={`${fontSize}px`}
          onDec={() => incFontSize(-1)}
          onInc={() => incFontSize(1)}
        />
        <Stepper
          label="Giãn dòng"
          value={lineHeight.toFixed(1)}
          onDec={() => incLineHeight(-0.1)}
          onInc={() => incLineHeight(0.1)}
        />
        <Stepper
          label="Độ rộng"
          value={lineWidthLabel[lineWidth]}
          onDec={() => incLineWidth(-1)}
          onInc={() => incLineWidth(1)}
        />
      </div>
    </div>
  )
}

export const ReaderSettingsPanel: FC = () => (
  <Popover content={<PanelContent />} trigger="click" placement="bottomRight">
    <Button shape="circle" className="!h-10 !w-10 !border-neutral-3 !font-semibold">
      Aa
    </Button>
  </Popover>
)
