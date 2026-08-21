// Filter model + bounds cho Document list. Tách khỏi DocumentFilterDrawer để file
// component chỉ export component (tránh warning react-refresh/only-export-components).

// Bounds cố định cho slider — mang tính ước lượng (đủ phủ dải giá/số trang thực
// tế của tài liệu y khoa). Server filter bằng `between` nên không cần khớp tuyệt đối.
export const PRICE_MIN = 0
export const PRICE_MAX = 500_000
export const PRICE_STEP = 10_000
export const PAGES_MIN = 0
export const PAGES_MAX = 1000
export const PAGES_STEP = 10

// Năm gần đây cho badge chọn nhanh + mốc "Cũ hơn" (trước năm cũ nhất liệt kê).
export const RELEASE_YEARS = [2026, 2025, 2024, 2023, 2022] as const
export const OLDER_THAN_YEAR = RELEASE_YEARS[RELEASE_YEARS.length - 1]

export interface DocumentFilterValues {
  priceRange: [number, number]
  freeOnly: boolean
  years: number[]
  olderThan: boolean
  pagesRange: [number, number]
}

export const DEFAULT_FILTERS: DocumentFilterValues = {
  priceRange: [PRICE_MIN, PRICE_MAX],
  freeOnly: false,
  years: [],
  olderThan: false,
  pagesRange: [PAGES_MIN, PAGES_MAX],
}

/** Đếm số nhóm filter đang khác mặc định — hiển thị badge trên nút Filter. */
export const countActiveFilters = (filters: DocumentFilterValues): number => {
  let count = 0
  if (filters.freeOnly) count += 1
  else if (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) count += 1
  if (filters.years.length || filters.olderThan) count += 1
  if (filters.pagesRange[0] > PAGES_MIN || filters.pagesRange[1] < PAGES_MAX) count += 1
  return count
}
