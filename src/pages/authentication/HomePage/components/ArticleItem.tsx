import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from 'antd'
import dayjs from 'dayjs'
import { User2 } from 'lucide-react'

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
    <div className="overflow-hidden rounded-sm bg-white shadow-md">
      <img src={article.thumbnail} alt={article.title} className="mb-2 h-28 w-full object-cover" />
      <div className="space-y-1.5 px-2 py-3">
        <h4
          className="line-clamp-2 cursor-pointer text-start text-base font-semibold hover:text-blue-800"
          onClick={handleViewDetail}
        >
          {article.title}
        </h4>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center gap-1">
            <User2 size={12} />
            <span className="text-xs">{article.author.fullName}</span>
          </div>
          <span className="text-xs">{dayjs(article.createdAt).format('hh:mm MMM D, YYYY')}</span>
        </div>
        <p className="line-clamp-3 text-start text-xs">{article.summary}</p>
        <div className="my-2 text-center">
          <Button size="small" onClick={handleViewDetail}>
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ArticleItem
