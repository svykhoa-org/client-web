import type { ListResponseDataV2 } from '@/common/interface/ServiceResponse'
import { AsyncLoading } from '@/components/ui/AsyncLoading'
import RouteConfig from '@/constants/RouteConfig'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useLayout } from '@/hooks/useLayout'
import type { ForumThread } from '@/models/Forum'
import { searchForumThreads } from '@/services/forum/forumService'
import { ChevronLeft, Search } from 'lucide-react'
import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ThreadListItem } from '../SubCategoryPage/components/ThreadListItem'

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
  }

  const results = resultsState.state.data?.items ?? []
  const pagination = resultsState.state.data?.pagination

  return (
    <div className="min-h-[60vh] bg-neutral-2 pb-8">
      <div className="container mx-auto px-4 pt-4">
        <button
          onClick={() => navigate(RouteConfig.ForumPage.path)}
          className="mb-4 flex items-center gap-1 text-sm text-neutral-5 transition-colors hover:text-neutral-7"
        >
          <ChevronLeft className="h-4 w-4" />
          Diễn đàn
        </button>

        <div className="rounded-lg border border-neutral-3 bg-white p-4 shadow-sm">
          <form onSubmit={submitSearch} className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center rounded-lg border border-neutral-3 bg-white px-3 focus-within:border-primary-5">
              <Search className="h-5 w-5 shrink-0 text-neutral-4" />
              <input
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
                minLength={2}
                maxLength={200}
                placeholder="Tìm theo tiêu đề hoặc nội dung bài viết..."
                className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-neutral-9 outline-none placeholder:text-neutral-4"
                aria-label="Tìm kiếm bài viết diễn đàn"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-primary-7 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-8"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {query.length >= 2 ? (
          <div className="mt-5">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-neutral-9">Kết quả cho “{query}”</h1>
                {pagination && (
                  <p className="mt-1 text-sm text-neutral-5">
                    {pagination.totalItems.toLocaleString('vi-VN')} bài viết phù hợp
                  </p>
                )}
              </div>
            </div>

            <AsyncLoading
              loading={resultsState.state.loading}
              type="skeleton"
              skeleton={{ rows: 8, title: true }}
            >
              {resultsState.state.error ? (
                <div className="rounded-lg border border-error-1 bg-error-1 px-6 py-8 text-center">
                  <p className="text-sm text-error-3">{resultsState.state.error}</p>
                  <button onClick={load} className="mt-3 text-sm text-primary-7 underline">
                    Thử lại
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    {results.map(thread => (
                      <ThreadListItem key={thread.id} thread={thread} />
                    ))}
                    {results.length === 0 && !resultsState.state.loading && (
                      <div className="rounded-lg border border-neutral-3 bg-white py-12 text-center">
                        <p className="text-sm text-neutral-5">
                          Không tìm thấy bài viết phù hợp. Hãy thử từ khóa khác.
                        </p>
                      </div>
                    )}
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button
                        disabled={!pagination.hasPrevious}
                        onClick={() => setPage(page - 1)}
                        className="rounded-lg border border-neutral-3 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
                      >
                        Trước
                      </button>
                      <span className="text-sm text-neutral-5">
                        Trang {page} / {pagination.totalPages}
                      </span>
                      <button
                        disabled={!pagination.hasNext}
                        onClick={() => setPage(page + 1)}
                        className="rounded-lg border border-neutral-3 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </>
              )}
            </AsyncLoading>
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-neutral-3 bg-white py-12 text-center">
            <p className="text-sm text-neutral-5">Nhập ít nhất 2 ký tự để tìm bài viết.</p>
          </div>
        )}
      </div>
    </div>
  )
}
