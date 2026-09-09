import { useEffect, useMemo, useRef, useState } from 'react'

import { ReadOutlined, SearchOutlined } from '@ant-design/icons'
import { Empty, Input, Pagination, Skeleton } from 'antd'

import { CategoryChips } from '@/components/common/CategoryChips'
import { useListing } from '@/hooks/useCRUD/useListing'
import { useListFilters } from '@/hooks/useListFilters'
import type { Article, ArticleCategoryRef } from '@/models/Article'
import { getArticleCategories } from '@/services/Article/getArticleCategories'
import { getArticles } from '@/services/Article/getArticles'

import ArticleItem from '@/pages/authentication/HomePage/components/ArticleItem'

const PAGE_SIZE = 12

export const ArticleListPage = () => {
  const { categorySlug, setCategorySlug, searchInput, setSearchInput, debouncedSearch } =
    useListFilters()
  const [categories, setCategories] = useState<ArticleCategoryRef[]>([])

  // The URL carries a readable category slug; the API filters by id. Resolve
  // slug → id once categories load (empty until then, so no filter applied yet).
  const categoryId = useMemo(
    () => categories.find(c => c.slug === categorySlug)?.id ?? '',
    [categories, categorySlug],
  )

  const { data, totalItems, page, limit, isLoading, setSearchParams } = useListing<Article>({
    // Seed the first fetch from the URL search (?q=). Category resolves after
    // categories load and is applied by the filter effect below.
    defaultSearchParams: {
      page: 1,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
    },
    getListService: async ({ page, limit, search, categoryId }) => {
      const res = await getArticles({
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
    getArticleCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // Re-query from page 1 whenever a filter changes. Skip the initial render so
  // we don't duplicate the mount fetch that useListing already fires.
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

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <header className="mb-5 overflow-hidden rounded-xl border border-neutral-3 bg-white">
        <div className="from-primary-1 flex items-start justify-between gap-4 bg-gradient-to-br to-white px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-start gap-3.5">
            <span className="bg-primary-9 shadow-primary-10/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-white shadow-sm">
              <ReadOutlined />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-10">Bài viết</h1>
              <p className="mt-0.5 text-sm text-neutral-6">
                Kiến thức y khoa được biên tập, cập nhật thường xuyên
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-primary-9 text-2xl font-bold leading-none tabular-nums">
              {totalItems}
            </div>
            <div className="mt-1 text-xs text-neutral-5">bài viết</div>
          </div>
        </div>

        <div className="space-y-3 border-t border-neutral-2 px-5 py-4 sm:px-6">
          <Input
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            prefix={<SearchOutlined className="text-neutral-5" />}
            placeholder="Tìm bài viết theo tiêu đề, nội dung..."
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

      {/* List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white p-4">
              <Skeleton.Image active className="!h-44 !w-full rounded-lg" />
              <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2 }} className="mt-3" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-neutral-3 bg-white py-16">
          <Empty description="Không tìm thấy bài viết phù hợp" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map(article => (
              <ArticleItem key={article.id} article={article} />
            ))}
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
