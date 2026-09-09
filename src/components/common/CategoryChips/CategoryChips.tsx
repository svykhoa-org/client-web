import { useCallback, useEffect, useRef, useState } from 'react'

import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'

interface CategoryChipOption {
  id: string
  name: string
  slug: string
  color?: string | null
}

interface CategoryChipsProps {
  categories: CategoryChipOption[]
  /** Selected category slug, or '' for "all". */
  value: string
  onChange: (categorySlug: string) => void
  /** Label for the reset chip (default "Tất cả"). */
  allLabel?: string
}

// Horizontal, scrollable row of category filters shared by the article and
// bulletin list pages. A single source of truth so both filter rows stay in
// sync (convention: extend, don't fork — see workspace GUIDELINES §1.1).
// The native scrollbar is hidden; scrollability is signalled by edge fades and
// chevron buttons that appear only when there is more to scroll in that
// direction.
export const CategoryChips = ({
  categories,
  value,
  onChange,
  allLabel = 'Tất cả',
}: CategoryChipsProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    // 1px tolerance to avoid flicker from sub-pixel rounding.
    setCanLeft(el.scrollLeft > 1)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateEdges()
    const el = scrollerRef.current
    if (!el) return
    const ro = new ResizeObserver(updateEdges)
    ro.observe(el)
    return () => ro.disconnect()
  }, [updateEdges, categories.length])

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * Math.max(200, el.clientWidth * 0.6), behavior: 'smooth' })
  }

  const chipClass = (active: boolean) =>
    `shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
      active
        ? 'border-primary-6 bg-primary-6 text-white shadow-sm hover:bg-primary-7 hover:border-primary-7'
        : 'border-neutral-3 bg-white text-neutral-7 hover:border-primary-4 hover:bg-primary-1 hover:text-primary-7'
    }`

  return (
    <div className="relative">
      {/* Left affordance */}
      {canLeft && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent" />
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Xem danh mục trước đó"
            className="border-neutral-3 text-neutral-6 hover:text-primary-7 hover:border-primary-4 absolute left-0 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
          >
            <DoubleLeftOutlined className="text-xs" />
          </button>
        </>
      )}

      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="hide-scrollbar flex gap-2 overflow-x-auto scroll-smooth"
      >
        <button type="button" onClick={() => onChange('')} className={chipClass(value === '')}>
          {allLabel}
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.slug)}
            className={chipClass(value === category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Right affordance */}
      {canRight && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Xem thêm danh mục"
            className="border-neutral-3 text-neutral-6 hover:text-primary-7 hover:border-primary-4 absolute right-0 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
          >
            <DoubleRightOutlined className="text-xs" />
          </button>
        </>
      )}
    </div>
  )
}
