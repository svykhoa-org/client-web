import { Link, useNavigate } from 'react-router'

import { PushpinFilled, RightOutlined } from '@ant-design/icons'
import { Skeleton, Spin } from 'antd'
import dayjs from 'dayjs'

import RouteConfig from '@/constants/RouteConfig'
import { useListing } from '@/hooks/useCRUD/useListing'
import { BulletinImportance, type Bulletin } from '@/models/Bulletin'
import { getBulletins } from '@/services/Bulletin/getBulletins'

const isPinned = (b: Bulletin) => !!b.pinnedUntil && dayjs(b.pinnedUntil).isAfter(dayjs())

export const ListBulletins = () => {
  const navigate = useNavigate()

  const { data, isLoading } = useListing<Bulletin>({
    getListService: async ({ page, limit }) => {
      const res = await getBulletins({ page, limit })
      return {
        data: res.items,
        totalItems: res.pagination.totalItems,
        totalPages: res.pagination.totalPages,
        page: res.pagination.page,
        limit: res.pagination.pageSize,
      }
    },
    defaultSearchParams: { page: 1, limit: 15 },
  })

  const handleClick = (bulletin: Bulletin) => {
    navigate(RouteConfig.BulletinDetailPage.path.replace(':slug', bulletin.slug))
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-primary-6" />
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Thông báo</h4>
        </div>
        <Link
          to={RouteConfig.BulletinListPage.path}
          className="text-primary-7 hover:text-primary-8 inline-flex items-center gap-1 text-xs font-medium"
        >
          Xem tất cả
          <RightOutlined className="text-[10px]" />
        </Link>
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
            {data.map(bulletin => {
              const urgent = bulletin.importance === BulletinImportance.URGENT
              const pinned = isPinned(bulletin)
              return (
                <li
                  key={bulletin.id}
                  className="flex cursor-pointer items-start gap-2 px-2 py-2 transition-colors duration-150 hover:bg-gray-50"
                  onClick={() => handleClick(bulletin)}
                >
                  {/* Marker wrapper matches the text's first-line height (18px) so the
                      dot/pin is vertically centered against the first line. */}
                  <span className="flex h-[18px] w-3 shrink-0 items-center justify-center">
                    {pinned ? (
                      <PushpinFilled className="text-[11px] text-primary-6" />
                    ) : (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${urgent ? 'bg-danger-6' : 'bg-primary-5'}`}
                      />
                    )}
                  </span>
                  <span className="flex-1 text-xs leading-[18px] text-gray-600 hover:text-primary-7">
                    {urgent && (
                      <span className="mr-1 rounded bg-danger-1 px-1 py-0.5 align-middle text-[10px] font-bold uppercase leading-none text-danger-6">
                        Khẩn
                      </span>
                    )}
                    {bulletin.title}
                  </span>
                </li>
              )
            })}
          </ul>
        </Spin>
      )}
    </div>
  )
}
