import { AsyncLoading } from '@/components/ui/AsyncLoading'
import RouteConfig from '@/constants/RouteConfig'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useAuth } from '@/hooks/useAuth'
import { useLayout } from '@/hooks/useLayout'
import type { ForumCategoryGroup } from '@/models/Forum'
import { getForumHomepage } from '@/services/forum/forumService'
import {
  Clock,
  FileText,
  Flame,
  LayoutGrid,
  MessageCircleQuestion,
  Search,
  Stethoscope,
  Users,
} from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { CategoryGroupSection } from './components/CategoryGroupSection'
import { GlobalThreadList } from './components/GlobalThreadList'
import { MyThreadList } from './components/MyThreadList'
import { ForumComposer } from '@/components/forum/ForumComposer'
import { NewTopicButton } from '@/components/forum/NewTopicButton'

type ForumTab = 'categories' | 'hot' | 'new' | 'mine'

const TABS: { key: ForumTab; label: string; icon: typeof Flame }[] = [
  { key: 'categories', label: 'Danh mục', icon: LayoutGrid },
  { key: 'hot', label: 'Nổi bật', icon: Flame },
  { key: 'new', label: 'Mới nhất', icon: Clock },
]

const MY_POSTS_TAB: { key: ForumTab; label: string; icon: typeof Flame } = {
  key: 'mine',
  label: 'Bài viết của tôi',
  icon: FileText,
}

const ForumHero = () => {
  const navigate = useNavigate()

  const communityBenefits = [
    {
      icon: Stethoscope,
      title: 'Đúng chuyên khoa',
      description: 'Đi thẳng vào nhóm chuyên môn phù hợp với câu hỏi của bạn.',
    },
    {
      icon: MessageCircleQuestion,
      title: 'Sát thực hành',
      description: 'Trao đổi ca lâm sàng và kinh nghiệm từ công việc hằng ngày.',
    },
    {
      icon: Users,
      title: 'Cùng học hỏi',
      description: 'Kết nối người học và người làm y tế trong một cộng đồng chung.',
    },
  ]

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = String(new FormData(event.currentTarget).get('q') ?? '').trim()
    if (query.length < 2) return
    navigate(`${RouteConfig.ForumSearchPage.path}?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative overflow-hidden bg-primary-9 py-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-primary-4 blur-2xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-primary-6 blur-3xl" />
      </div>
      <div className="container relative mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <div>
          <p className="mb-3 text-sm font-semibold text-primary-2">Cộng đồng chuyên môn Y Dược</p>
          <h1 className="max-w-3xl text-3xl leading-tight font-bold tracking-tight text-white text-balance sm:text-4xl">
            Trao đổi chuyên môn. Chia sẻ kinh nghiệm. Cùng tìm câu trả lời.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
            Không gian dành cho người học và người làm y tế đặt câu hỏi, thảo luận ca lâm sàng và
            học hỏi từ kinh nghiệm thực hành.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex max-w-2xl items-center gap-2 rounded-lg bg-white p-1.5 shadow-sm"
          >
            <Search className="ml-2 h-5 w-5 shrink-0 text-neutral-5" />
            <input
              name="q"
              minLength={2}
              maxLength={200}
              placeholder="Tìm ca lâm sàng, chủ đề hoặc từ khóa chuyên môn"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-neutral-9 outline-none placeholder:text-neutral-5"
              aria-label="Tìm kiếm bài viết diễn đàn"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-lg bg-primary-7 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-8 active:translate-y-px"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        <div className="hidden gap-3 lg:grid">
          {communityBenefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-lg border border-white/15 bg-white/8 p-3.5 backdrop-blur-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary-2">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-white/65">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const ForumPage = () => {
  const { isAuthenticated } = useAuth()
  const { setLeftSidebar, setRightSidebar, setBanner } = useLayout()
  const forumState = useAsyncState<ForumCategoryGroup[]>()
  const [tab, setTab] = useState<ForumTab>('categories')
  const visibleTabs = isAuthenticated ? [...TABS, MY_POSTS_TAB] : TABS

  useEffect(() => {
    void forumState.execute(() => getForumHomepage().then(data => data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setBanner(<ForumHero />)
    setLeftSidebar(null)
    setRightSidebar(null)

    return () => {
      setBanner(null)
    }
  }, [setBanner, setLeftSidebar, setRightSidebar])

  useEffect(() => {
    if (!isAuthenticated && tab === 'mine') setTab('categories')
  }, [isAuthenticated, tab])

  return (
    <div className="bg-neutral-2 pb-8">
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-neutral-3">
          <div className="flex items-center gap-1">
            {visibleTabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === key
                    ? 'border-primary-7 text-primary-7'
                    : 'border-transparent text-neutral-5 hover:text-neutral-8'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          <div className="pb-1.5">
            <NewTopicButton />
          </div>
        </div>

        {tab === 'categories' ? (
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
        ) : tab === 'mine' ? (
          <MyThreadList />
        ) : (
          <GlobalThreadList sort={tab === 'hot' ? 'hot' : 'new'} />
        )}
      </div>
      <ForumComposer />
    </div>
  )
}
