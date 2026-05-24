import React from 'react'
import { Link } from 'react-router'

import {
  BookOutlined,
  CheckCircleFilled,
  EyeOutlined,
  StarFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Card, Tag, Tooltip } from 'antd'

import type { User } from '@/models/User'

interface FeaturedUserCardProps {
  user: User
}

const FeaturedUserCard: React.FC<FeaturedUserCardProps> = ({ user }) => {
  return (
    <Link to={`/featured-user/${user.id}`}>
      <Card
        hoverable
        className="h-full transition-all duration-300 hover:shadow-lg"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex flex-col items-center">
          {/* Avatar and Verification */}
          <div className="relative mb-4">
            <Avatar
              size={100}
              src={user.avatarUrl}
              icon={<UserOutlined />}
              className="border-4 border-green-100 bg-green-600"
            />
            <Tooltip title="Chuyên gia đã xác thực">
              <CheckCircleFilled className="absolute -right-1 bottom-1 text-xl text-green-500" />
            </Tooltip>
          </div>

          {/* Name and Specialization */}
          <h3 className="mb-1 text-center text-xl font-bold text-gray-800">{user.fullName}</h3>
          <div className="mb-4 text-center">
            <Tag color="green" className="text-sm">
              {user.specialization}
            </Tag>
          </div>

          {/* Bio - Short Version */}
          <p className="mb-4 line-clamp-3 text-center text-sm text-gray-600">{user.bio}</p>

          {/* Stats */}
          <div className="mt-auto grid w-full grid-cols-3 gap-2 border-t border-gray-100 pt-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 text-green-600">
                <BookOutlined />
                <span className="text-sm font-medium">{user.stats?.postCount || 0}</span>
              </div>
              <span className="text-xs text-gray-500">Bài viết</span>
            </div>

            <div className="flex flex-col items-center border-r border-l border-gray-100 text-center">
              <div className="flex items-center gap-1 text-green-600">
                <TeamOutlined />
                <span className="text-sm font-medium">{user.stats?.followerCount || 0}</span>
              </div>
              <span className="text-xs text-gray-500">Người theo dõi</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 text-green-600">
                <EyeOutlined />
                <span className="text-sm font-medium">{user.stats?.viewCount || 0}</span>
              </div>
              <span className="text-xs text-gray-500">Lượt xem</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-3 flex w-full items-center justify-center border-t border-gray-100 pt-3">
            <div className="flex items-center">
              <StarFilled className="mr-1 text-yellow-400" />
              <span className="font-medium">{user.stats?.rating || 0}</span>
              <span className="text-xs text-gray-500">/5</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default FeaturedUserCard
