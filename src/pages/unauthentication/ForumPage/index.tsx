import { AsyncLoading } from '@/components/ui/AsyncLoading'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useLayout } from '@/hooks/useLayout'
import type { ForumCategoryGroup } from '@/models/Forum'
import { getForumHomepage } from '@/services/forum/forumService'
import { useEffect } from 'react'
import { CategoryGroupSection } from './components/CategoryGroupSection'

export const ForumPage = () => {
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout()
  const forumState = useAsyncState<ForumCategoryGroup[]>()

  useEffect(() => {
    void forumState.execute(() => getForumHomepage().then(data => data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setBanner(
      <div className="relative overflow-hidden bg-linear-to-br from-primary-9 via-primary-7 to-primary-5 py-10">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-white" />
          <div className="absolute right-1/3 top-1/2 h-28 w-28 rounded-full bg-white" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">Diễn đàn Y dược Việt Nam</h1>
          <p className="text-base text-white/80">
            Nơi chia sẻ kiến thức và kinh nghiệm về y học hiện đại
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/65">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Hàng nghìn bài viết
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              50+ chuyên khoa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Cộng đồng y tế chuyên nghiệp
            </span>
          </div>
        </div>
      </div>,
    )
    setLeftSidebar(null)
    setRightSidebar(null)

    return () => {
      setBanner(null)
    }
  }, [setBanner, setLeftSidebar, setRightSidebar])

  return (
    <div className="bg-neutral-2 pb-8">
      <div className="container mx-auto px-4 pt-6">
        <AsyncLoading
          loading={forumState.state.loading}
          type="skeleton"
          skeleton={{ rows: 6, title: true }}
        >
          {forumState.state.error ? (
            <div className="rounded-lg border border-error-1 bg-error-1 px-6 py-8 text-center">
              <p className="text-sm text-error-3">{forumState.state.error}</p>
              <button
                onClick={() => void forumState.execute(() => getForumHomepage())}
                className="mt-3 text-sm text-primary-7 underline"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(forumState.state.data ?? []).map(group => (
                <CategoryGroupSection key={group.id} group={group} />
              ))}
            </div>
          )}
        </AsyncLoading>
      </div>
    </div>
  )
}
