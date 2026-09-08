import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { AsyncLoading } from '@/components/ui/AsyncLoading'
import { useAsyncState } from '@/hooks/useAsyncState'
import type { Article } from '@/models/Article'
import { getArticleBySlug } from '@/services/Article/getArticleBySlug'

import { ArticleReader } from './components/ArticleReader'

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
        <div className="mx-auto max-w-[760px]">
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
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
