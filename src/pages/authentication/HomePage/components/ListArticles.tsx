import { Pagination, Spin } from 'antd';

import { useListing } from '@/hooks/useCRUD/useListing';
import type { Article } from '@/models/Article';
import { getArticles } from '@/services/Article/getArticles';

import ArticleItem from './ArticleItem';

export const ListArticles = () => {
  const { data, totalItems, setSearchParams, page, limit, isLoading } = useListing<Article>({
    defaultSearchParams: { page: 1, limit: 6 },
    getListService: async ({ page, limit }) => {
      const response = await getArticles({
        page: page || 1,
        pageSize: limit || 6,
        searcher: {},
        sorter: {},
      });

      return {
        data: response.data.hits,
        totalItems: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        page: page || 1,
        limit: limit || 6,
      };
    },
  });

  return (
    <>
      <h4 className="mb-4 text-start text-xl font-bold">Tin nổi bật</h4>
      <Spin spinning={isLoading}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map(item => (
            <ArticleItem key={item._id} article={item} />
          ))}
          {data.length !== 0 && (
            <div className="col-span-full flex justify-center">
              <Pagination
                current={page}
                pageSize={limit}
                total={totalItems}
                onChange={page => {
                  setSearchParams({ page, limit });
                }}
              />
            </div>
          )}
        </div>
      </Spin>
    </>
  );
};
