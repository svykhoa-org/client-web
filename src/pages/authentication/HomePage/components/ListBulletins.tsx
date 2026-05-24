import { useNavigate } from 'react-router'

import { Spin } from 'antd'
import { Circle } from 'lucide-react'

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
    defaultSearchParams: {
      page: 1,
      limit: 15,
    },
  })

  const handleBulletinClick = (bulletin: Bulletin) => {
    navigate(RouteConfig.BulletinDetailPage.path.replace(':slug', bulletin.slug))
  }

  return (
    <Spin spinning={isLoading}>
      <h4 className="mb-4 rounded-xs bg-white py-1 text-center text-xl font-bold">Thông báo mới</h4>
      <ul className="bg-white px-3 py-4">
        {data.map(bulletin => (
          <li
            className="flex cursor-pointer items-start gap-1 border-b border-gray-200 py-2 text-sm hover:text-blue-800"
            key={bulletin.id}
            onClick={() => handleBulletinClick(bulletin)}
          >
            <Circle size={12} className="pt-1" />
            <span>{bulletin.title}</span>
          </li>
        ))}
      </ul>
    </Spin>
  )
}
