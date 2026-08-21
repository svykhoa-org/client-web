import { useEffect, useState } from 'react'

import {
  CalendarOutlined,
  CloseOutlined,
  DollarOutlined,
  FileTextOutlined,
  ReloadOutlined,
  TagOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Slider, Switch } from 'antd'

import { formatCurrency } from '@/utils/currency/formatCurrency'

import {
  DEFAULT_FILTERS,
  type DocumentFilterValues,
  PAGES_MAX,
  PAGES_MIN,
  PAGES_STEP,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  RELEASE_YEARS,
} from './documentFilters'

interface FilterSectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

const FilterSection = ({ icon, title, children }: FilterSectionProps) => (
  <section className="border-b border-neutral-2 py-6 first:pt-0 last:border-b-0">
    <h3 className="text-neutral-9 mb-5 flex items-center gap-2 text-[15px] font-semibold">
      <span className="text-primary-6 text-lg leading-none">{icon}</span>
      {title}
    </h3>
    {children}
  </section>
)

interface DocumentFilterDrawerProps {
  open: boolean
  value: DocumentFilterValues
  onClose: () => void
  onApply: (next: DocumentFilterValues) => void
  onReset: () => void
}

export const DocumentFilterDrawer = ({
  open,
  value,
  onClose,
  onApply,
  onReset,
}: DocumentFilterDrawerProps) => {
  // Draft cục bộ: chỉ commit khi bấm "Áp dụng" (không filter theo từng thao tác).
  const [draft, setDraft] = useState<DocumentFilterValues>(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const toggleYear = (year: number) => {
    setDraft(prev => ({
      ...prev,
      years: prev.years.includes(year) ? prev.years.filter(y => y !== year) : [...prev.years, year],
    }))
  }

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS)
    onReset()
  }

  return (
    <Drawer
      title="Bộ lọc tài liệu"
      placement="right"
      width={360}
      open={open}
      onClose={onClose}
      closable={false}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} aria-label="Đóng" />}
      footer={
        <div className="flex items-center gap-2">
          <Button icon={<ReloadOutlined />} onClick={handleReset} aria-label="Đặt lại bộ lọc" />
          <Button type="primary" block className="flex-1" onClick={() => onApply(draft)}>
            Áp dụng
          </Button>
        </div>
      }
    >
      {/* Giá tiền */}
      <FilterSection icon={<DollarOutlined />} title="Giá tiền">
        <Slider
          range
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          disabled={draft.freeOnly}
          value={draft.priceRange}
          onChange={next => setDraft(prev => ({ ...prev, priceRange: next as [number, number] }))}
          tooltip={{ formatter: val => formatCurrency({ value: val ?? 0 }) }}
        />
        <div className="mt-1 flex justify-between text-xs text-neutral-6 tabular-nums">
          <span>{formatCurrency({ value: draft.priceRange[0] })}</span>
          <span>{formatCurrency({ value: draft.priceRange[1] })}</span>
        </div>

        <label className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-neutral-7">
            <TagOutlined className="text-primary-6" />
            Chỉ tài liệu miễn phí
          </span>
          <Switch
            checked={draft.freeOnly}
            onChange={checked => setDraft(prev => ({ ...prev, freeOnly: checked }))}
          />
        </label>
      </FilterSection>

      {/* Năm phát hành */}
      <FilterSection icon={<CalendarOutlined />} title="Năm phát hành">
        <div className="flex flex-wrap gap-2">
          {RELEASE_YEARS.map(year => {
            const active = draft.years.includes(year)
            return (
              <button
                key={year}
                type="button"
                onClick={() => toggleYear(year)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-primary-4 bg-primary-1 text-primary-8'
                    : 'border-neutral-3 text-neutral-7 hover:border-primary-3 hover:text-primary-7'
                }`}
              >
                {year}
                {active ? <CloseOutlined className="text-[10px]" /> : null}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setDraft(prev => ({ ...prev, olderThan: !prev.olderThan }))}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              draft.olderThan
                ? 'border-primary-4 bg-primary-1 text-primary-8'
                : 'border-neutral-3 text-neutral-7 hover:border-primary-3 hover:text-primary-7'
            }`}
          >
            Cũ hơn
            {draft.olderThan ? <CloseOutlined className="text-[10px]" /> : null}
          </button>
        </div>
      </FilterSection>

      {/* Số trang */}
      <FilterSection icon={<FileTextOutlined />} title="Số trang">
        <Slider
          range
          min={PAGES_MIN}
          max={PAGES_MAX}
          step={PAGES_STEP}
          value={draft.pagesRange}
          onChange={next => setDraft(prev => ({ ...prev, pagesRange: next as [number, number] }))}
        />
        <div className="mt-1 flex justify-between text-xs text-neutral-6 tabular-nums">
          <span>{draft.pagesRange[0]} trang</span>
          <span>{draft.pagesRange[1]} trang</span>
        </div>
      </FilterSection>
    </Drawer>
  )
}
