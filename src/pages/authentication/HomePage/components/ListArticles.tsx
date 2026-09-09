import { Link } from 'react-router'

import { RightOutlined } from '@ant-design/icons'
import { Pagination, Skeleton, Spin } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useListing } from '@/hooks/useCRUD/useListing'
import type { Article } from '@/models/Article'
import { getArticles } from '@/services/Article/getArticles'

import ArticleItem from './ArticleItem'

export const ListArticles = () => {
  const { data, totalItems, setSearchParams, page, limit, isLoading } = useListing<Article>({
    defaultSearchParams: { page: 1, limit: 6 },
    getListService: async ({ page, limit }) => {
      const response = await getArticles({
        page: page || 1,
        limit: limit || 6,
      })

      return {
        data: response.items,
        totalItems: response.pagination.totalItems,
        totalPages: response.pagination.totalPages,
        page: page || 1,
        limit: limit || 6,
      }
    },
  })

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-start text-xl font-bold">Tin nổi bật</h4>
        <Link
          to={RouteConfig.ArticleListPage.path}
          className="text-primary-7 hover:text-primary-8 inline-flex items-center gap-1 text-sm font-medium"
        >
          Xem tất cả
          <RightOutlined className="text-xs" />
        </Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white p-4">
              <Skeleton.Image active className="!h-44 !w-full rounded-lg" />
              <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2 }} className="mt-3" />
            </div>
          ))}
        </div>
      ) : (
        <Spin spinning={false}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map(item => (
              <ArticleItem key={item.id} article={item} />
            ))}
            {data.length !== 0 && (
              <div className="col-span-full flex justify-center">
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={totalItems}
                  onChange={page => {
                    setSearchParams({ page, limit })
                  }}
                />
              </div>
            )}
          </div>
        </Spin>
      )}
    </>
  )
}
