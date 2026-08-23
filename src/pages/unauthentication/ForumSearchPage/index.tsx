import type { ListResponseDataV2 } from '@/common/interface/ServiceResponse'
import { AsyncLoading } from '@/components/ui/AsyncLoading'
import RouteConfig from '@/constants/RouteConfig'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useLayout } from '@/hooks/useLayout'
import type { ForumThread } from '@/models/Forum'
import { searchForumThreads } from '@/services/forum/forumService'
import { Pagination } from 'antd'
import { CircleAlert, ChevronLeft, FolderOpen, RefreshCw, Search, SearchX } from 'lucide-react'
import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { SearchResultItem } from './SearchResultItem'

const PAGE_SIZE = 20

export const ForumSearchPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout()
  const resultsState = useAsyncState<ListResponseDataV2<ForumThread>>()
  const query = (searchParams.get('q') ?? '').trim()
  const parsedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const [searchValue, setSearchValue] = useState(query)

  const load = useCallback(() => {
    if (query.length < 2) return
    void resultsState.execute(() => searchForumThreads({ q: query, page, limit: PAGE_SIZE }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page])

  useEffect(() => {
    setSearchValue(query)
    load()
  }, [load, query])

  useEffect(() => {
    setLeftSidebar(null)
    setRightSidebar(null)
    setBanner(null)
  }, [setBanner, setLeftSidebar, setRightSidebar])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuery = searchValue.trim()
    if (nextQuery.length < 2) return
    setSearchParams({ q: nextQuery })
  }

  const setPage = (nextPage: number) => {
    setSearchParams({ q: query, page: String(nextPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const results = resultsState.state.data?.items ?? []
  const pagination = resultsState.state.data?.pagination

  return (
    <main className="min-h-[70vh] bg-neutral-2 pb-10">
      <div className="container mx-auto max-w-5xl px-4 pt-5">
        <button
          type="button"
          onClick={() => navigate(RouteConfig.ForumPage.path)}
          className="mb-4 flex items-center gap-1 rounded-lg py-1 text-sm font-medium text-neutral-5 transition-colors hover:text-neutral-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Diễn đàn
        </button>

        <section className="rounded-lg border border-neutral-3 bg-white p-5 sm:p-6">
          <p className="text-sm font-semibold text-primary-7">Tìm trong diễn đàn</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-9">
            Tìm câu hỏi và kinh nghiệm đã được chia sẻ
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-neutral-6">
            Nhập triệu chứng, ca lâm sàng, chuyên khoa hoặc một chủ đề bạn đang quan tâm.
          </p>

          <form onSubmit={submitSearch} className="mt-5 flex flex-col gap-2 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center rounded-lg border border-neutral-3 bg-neutral-1 px-3 transition-colors focus-within:border-primary-5 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary-2">
              <Search className="h-5 w-5 shrink-0 text-neutral-4" />
              <input
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
                minLength={2}
                maxLength={200}
                placeholder="Tìm ca lâm sàng, chủ đề hoặc từ khóa chuyên môn"
                className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-neutral-9 outline-none placeholder:text-neutral-5"
                aria-label="Tìm kiếm bài viết diễn đàn"
              />
            </div>
            <button
              type="submit"
              className="h-11 shrink-0 rounded-lg bg-primary-7 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-8 active:translate-y-px"
            >
              Tìm kiếm
            </button>
          </form>
        </section>

        {query.length >= 2 ? (
          <section className="mt-7">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-neutral-5">Kết quả tìm kiếm</p>
                <h2 className="mt-0.5 text-xl font-semibold text-neutral-9">“{query}”</h2>
                {pagination && (
                  <span className="mt-2 inline-flex rounded-md bg-neutral-3 px-2 py-1 text-xs font-medium text-neutral-7">
                    {pagination.totalItems.toLocaleString('vi-VN')} kết quả
                  </span>
                )}
              </div>
            </div>

            <AsyncLoading
              loading={resultsState.state.loading}
              type="skeleton"
              skeleton={{ rows: 8, title: true }}
            >
              {resultsState.state.error ? (
                <div className="rounded-lg border border-neutral-3 bg-white px-5 py-12 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-error-1 text-error-3">
                    <CircleAlert className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-base font-semibold text-neutral-9">
                    Không thể tìm kiếm lúc này
                  </p>
                  <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-neutral-5">
                    Kết nối đến máy chủ đang gặp sự cố. Vui lòng thử lại sau ít phút.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={load}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary-7 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-8"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Thử lại
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(RouteConfig.ForumPage.path)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-3 bg-white px-3.5 text-sm font-semibold text-neutral-7 transition-colors hover:bg-neutral-2"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      Xem danh mục
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {results.map(thread => (
                      <SearchResultItem key={thread.id} thread={thread} query={query} />
                    ))}
                    {results.length === 0 && !resultsState.state.loading && (
                      <div className="rounded-lg border border-neutral-3 bg-white px-5 py-12 text-center">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-2 text-neutral-5">
                          <SearchX className="h-5 w-5" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-neutral-8">
                          Chưa tìm thấy bài viết phù hợp
                        </p>
                        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-neutral-5">
                          Hãy thử từ khóa ngắn hơn, tên chuyên khoa hoặc một thuật ngữ liên quan.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate(RouteConfig.ForumPage.path)}
                          className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-3 bg-white px-3.5 text-sm font-semibold text-neutral-7 transition-colors hover:bg-neutral-2"
                        >
                          <FolderOpen className="h-3.5 w-3.5" />
                          Xem các danh mục
                        </button>
                      </div>
                    )}
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-7 flex justify-center">
                      <Pagination
                        current={page}
                        pageSize={PAGE_SIZE}
                        total={pagination.totalItems}
                        showSizeChanger={false}
                        onChange={setPage}
                      />
                    </div>
                  )}
                </>
              )}
            </AsyncLoading>
          </section>
        ) : (
          <section className="mt-6 rounded-lg border border-dashed border-neutral-4 bg-white/60 px-5 py-10 text-center">
            <Search className="mx-auto h-6 w-6 text-neutral-4" />
            <p className="mt-2 text-sm font-medium text-neutral-7">
              Nhập ít nhất 2 ký tự để bắt đầu tìm kiếm
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
