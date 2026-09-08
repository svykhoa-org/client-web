import type { FC } from 'react'
import { useNavigate } from 'react-router'

import dayjs from 'dayjs'

import RouteConfig from '@/constants/RouteConfig'
import type { Article } from '@/models/Article'

type Props = {
  article: Article
}

const ArticleItem: FC<Props> = ({ article }) => {
  const navigate = useNavigate()

  const handleViewDetail = () => {
    navigate(RouteConfig.ArticleDetailPage.path.replace(':slug', article.slug))
  }

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-xl bg-white transition-shadow duration-200 hover:shadow-lg"
      onClick={handleViewDetail}
    >
      <div className="h-44 overflow-hidden bg-neutral-2">
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-teal-50 to-neutral-2 text-teal-700/40">
            <span className="text-4xl font-bold">{article.title.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-gray-800 group-hover:text-teal-700">
          {article.title}
        </h4>
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">{article.summary}</p>
        <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-400">
          <span>{article.authorName}</span>
          <span>{dayjs(article.publishedAt ?? article.createdAt).format('DD/MM/YYYY')}</span>
        </div>
      </div>
    </article>
  )
}

export default ArticleItem
