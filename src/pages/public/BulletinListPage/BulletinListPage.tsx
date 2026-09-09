import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { PaperClipOutlined, PushpinFilled, SearchOutlined, SoundOutlined } from '@ant-design/icons'
import { Empty, Input, Pagination, Skeleton } from 'antd'
import dayjs from 'dayjs'

import { CategoryChips } from '@/components/common/CategoryChips'
import RouteConfig from '@/constants/RouteConfig'
import { useListing } from '@/hooks/useCRUD/useListing'
import { useListFilters } from '@/hooks/useListFilters'
import { BulletinImportance, type Bulletin, type BulletinCategoryRef } from '@/models/Bulletin'
import { getBulletinCategories } from '@/services/Bulletin/getBulletinCategories'
import { getBulletins } from '@/services/Bulletin/getBulletins'

const PAGE_SIZE = 15

const isPinned = (b: Bulletin) => !!b.pinnedUntil && dayjs(b.pinnedUntil).isAfter(dayjs())

export const BulletinListPage = () => {
  const navigate = useNavigate()
  const { categorySlug, setCategorySlug, searchInput, setSearchInput, debouncedSearch } =
    useListFilters()
  const [categories, setCategories] = useState<BulletinCategoryRef[]>([])

  // The URL carries a readable category slug; the API filters by id. Resolve
  // slug → id once categories load (empty until then, so no filter applied yet).
  const categoryId = useMemo(
    () => categories.find(c => c.slug === categorySlug)?.id ?? '',
    [categories, categorySlug],
  )

  const { data, totalItems, page, limit, isLoading, setSearchParams } = useListing<Bulletin>({
    // Seed the first fetch from the URL search (?q=). Category resolves after
    // categories load and is applied by the filter effect below.
    defaultSearchParams: {
      page: 1,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
    },
    getListService: async ({ page, limit, search, categoryId }) => {
      const res = await getBulletins({
        page: page || 1,
        limit: limit || PAGE_SIZE,
        search: search || undefined,
        categoryId: categoryId || undefined,
      })
      return {
        data: res.items,
        totalItems: res.pagination.totalItems,
        totalPages: res.pagination.totalPages,
        page: res.pagination.page,
        limit: res.pagination.pageSize,
      }
    },
  })

  useEffect(() => {
    getBulletinCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const didMountRef = useRef(false)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    setSearchParams({
      page: 1,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      categoryId: categoryId || undefined,
    })
  }, [debouncedSearch, categoryId, setSearchParams])

  const handlePageChange = (nextPage: number) => {
    setSearchParams({
      page: nextPage,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      categoryId: categoryId || undefined,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openBulletin = (bulletin: Bulletin) => {
    navigate(RouteConfig.BulletinDetailPage.path.replace(':slug', bulletin.slug))
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}
      <header className="mb-5 overflow-hidden rounded-xl border border-neutral-3 bg-white">
        <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-start gap-3.5">
            <span className="bg-primary-8 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-white shadow-sm">
              <SoundOutlined />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-10">Thông báo</h1>
              <p className="mt-0.5 text-sm text-neutral-6">
                Thông tin chính thức từ ban điều hành, cập nhật liên tục
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-primary-9 text-2xl font-bold leading-none tabular-nums">
              {totalItems}
            </div>
            <div className="mt-1 text-xs text-neutral-5">thông báo</div>
          </div>
        </div>

        <div className="space-y-3 border-t border-neutral-2 px-5 py-4 sm:px-6">
          <Input
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            prefix={<SearchOutlined className="text-neutral-5" />}
            placeholder="Tìm thông báo theo tiêu đề, nội dung..."
            className="rounded-lg"
            size="large"
            allowClear
          />
          {categories.length > 0 && (
            <CategoryChips
              categories={categories}
              value={categorySlug}
              onChange={setCategorySlug}
            />
          )}
        </div>
      </header>

      {/* Notice board */}
      {isLoading ? (
        <div className="divide-y divide-neutral-2 overflow-hidden rounded-xl border border-neutral-3 bg-white">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton active title={{ width: '55%' }} paragraph={{ rows: 1, width: '90%' }} />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-neutral-3 bg-white py-16">
          <Empty description="Không tìm thấy thông báo phù hợp" />
        </div>
      ) : (
        <>
          <div className="divide-y divide-neutral-2 overflow-hidden rounded-xl border border-neutral-3 bg-white">
            {data.map(bulletin => {
              const urgent = bulletin.importance === BulletinImportance.URGENT
              const pinned = isPinned(bulletin)
              const attachmentCount = bulletin.attachments?.length ?? 0
              return (
                <button
                  key={bulletin.id}
                  type="button"
                  onClick={() => openBulletin(bulletin)}
                  className={`hover:bg-neutral-1 flex w-full items-start gap-4 border-l-4 px-5 py-4 text-left transition-colors ${
                    urgent ? 'border-l-danger-6' : 'border-l-primary-5'
                  }`}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                    {pinned ? (
                      <PushpinFilled className="text-primary-6" />
                    ) : (
                      <span
                        className={`h-2 w-2 rounded-full ${urgent ? 'bg-danger-6' : 'bg-primary-5'}`}
                      />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {urgent && (
                        <span className="bg-danger-1 text-danger-6 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none">
                          Khẩn
                        </span>
                      )}
                      <h3 className="truncate font-semibold text-neutral-9">{bulletin.title}</h3>
                    </div>
                    {bulletin.summary && (
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-6">{bulletin.summary}</p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-5">
                      {bulletin.category && (
                        <span className="text-primary-7 font-medium">{bulletin.category.name}</span>
                      )}
                      {attachmentCount > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <PaperClipOutlined />
                          {attachmentCount} tệp đính kèm
                        </span>
                      )}
                    </div>
                  </div>

                  <time className="shrink-0 pt-0.5 text-xs font-medium text-neutral-6 tabular-nums">
                    {dayjs(bulletin.publishedAt ?? bulletin.createdAt).format('DD/MM/YYYY')}
                  </time>
                </button>
              )
            })}
          </div>
          {totalItems > limit && (
            <div className="mt-8 flex justify-center">
              <Pagination
                current={page}
                pageSize={limit}
                total={totalItems}
                showSizeChanger={false}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
