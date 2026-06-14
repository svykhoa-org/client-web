import { useNavigate } from 'react-router'

import { Skeleton, Spin } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useListing } from '@/hooks/useCRUD/useListing'
import type { Bulletin } from '@/models/Bulletin'
import { getBulletins } from '@/services/Bulletin/getBulletins'

export const ListBulletins = () => {
  const navigate = useNavigate()

  const { data, isLoading } = useListing<Bulletin>({
    getListService: async ({ page, limit }) => {
      const response = await getBulletins({ page, limit })
      if (response.code === 200) {
        return {
          data: response.data.items,
          totalItems: response.data.pagination.totalItems,
          totalPages: response.data.pagination.totalPages,
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
        }
      } else {
        throw new Error(response.message)
      }
    },
    defaultSearchParams: { page: 1, limit: 15 },
  })

  const handleBulletinClick = (bulletin: Bulletin) => {
    navigate(RouteConfig.BulletinDetailPage.path.replace(':slug', bulletin.slug))
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h4 className="text-sm font-semibold text-gray-800">Thông báo mới</h4>
      </div>
      {isLoading ? (
        <ul className="divide-y divide-gray-50 px-4 py-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="py-3">
              <Skeleton active title={false} paragraph={{ rows: 1, width: '100%' }} />
            </li>
          ))}
        </ul>
      ) : (
        <Spin spinning={false}>
          <ul className="divide-y divide-gray-50 px-2 py-1">
            {data.map(bulletin => (
              <li
                key={bulletin.id}
                className="flex cursor-pointer items-start gap-2 px-2 py-2.5 transition-colors duration-150 hover:bg-gray-50"
                onClick={() => handleBulletinClick(bulletin)}
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
                <span className="text-xs leading-snug text-gray-600 hover:text-teal-700">
                  {bulletin.title}
                </span>
              </li>
            ))}
          </ul>
        </Spin>
      )}
    </div>
  )
}
