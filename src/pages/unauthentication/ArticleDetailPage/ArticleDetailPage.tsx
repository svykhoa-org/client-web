import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { AsyncLoading } from '@/components/ui/AsyncLoading'
import { useAsyncState } from '@/hooks/useAsyncState'
import type { Article } from '@/models/Article'
import { getArticleBySlug } from '@/services/Article/getArticleBySlug'

import { ArticleReader } from './components/ArticleReader'
import { ReaderSettingsPanel } from './components/ReaderSettingsPanel'

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const articleState = useAsyncState<Article>()

  useEffect(() => {
    if (!slug) {
      navigate('/')
      return
    }
    void articleState.execute(() => getArticleBySlug(slug))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const article = articleState.state.data

  // Minimal SEO: reflect the article's meta title in the document title.
  useEffect(() => {
    if (!article) return
    const previous = document.title
    document.title = article.metaTitle || article.title
    return () => {
      document.title = previous
    }
  }, [article])

  return (
    <div className="min-h-screen bg-neutral-1 pb-16">
      <div className="container mx-auto px-4 pt-5">
        {/* Breadcrumb + reader settings share one row (settings aligned right). */}
        <div className="mx-auto mb-3 flex max-w-[760px] items-center justify-between gap-3">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to="/">
                    <HomeOutlined />
                  </Link>
                ),
              },
              { title: <Link to={RouteConfig.ArticleListPage.path}>Bài viết</Link> },
              // Clickable category → deep-links into the filtered list.
              ...(article?.category
                ? [
                    {
                      title: (
                        <Link
                          to={`${RouteConfig.ArticleListPage.path}?category=${article.category.slug}`}
                        >
                          {article.category.name}
                        </Link>
                      ),
                    },
                  ]
                : []),
              {
                title: (
                  <span className="line-clamp-1 max-w-[220px] align-bottom text-neutral-7 sm:max-w-[360px]">
                    {article?.title ?? 'Chi tiết'}
                  </span>
                ),
              },
            ]}
          />
          <ReaderSettingsPanel />
        </div>

        <AsyncLoading
          loading={articleState.state.loading}
          type="skeleton"
          skeleton={{ rows: 10, title: true }}
        >
          {article && <ArticleReader article={article} />}
          {!article && !articleState.state.loading && (
            <div className="mx-auto max-w-[680px] py-20 text-center text-neutral-6">
              Không tìm thấy bài viết.
            </div>
          )}
        </AsyncLoading>
      </div>
    </div>
  )
}

export default ArticleDetailPage
