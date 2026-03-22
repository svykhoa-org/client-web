import React from 'react';

import { CheckCircleFilled, CommentOutlined, FireFilled, HeartOutlined, TrophyOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';

import type { ActiveUser } from '@/mocks/activeUsers';

interface ActiveUserItemProps {
  user: ActiveUser;
}

const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ user }) => {
  const getLastActiveTime = (lastActiveDate: string) => {
    const lastActive = new Date(lastActiveDate);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    } else if (diffMinutes < 24 * 60) {
      return `${Math.floor(diffMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffMinutes / (60 * 24))} ngày trước`;
    }
  };

  return (
    <div className="shadow-neutral-4 mb-3 flex items-center rounded-md p-1 shadow transition-all hover:bg-gray-50">
      <div className="relative mr-3">
        <Avatar src={user.avatarUrl} size={40} className="bg-green-100" />
        {user.activity?.streak && user.activity.streak >= 30 && (
          <Tooltip title={`Hoạt động liên tục ${user.activity.streak} ngày`}>
            <FireFilled className="absolute -top-1 -right-1 text-sm text-orange-500" />
          </Tooltip>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center">
          <h4 className="mr-1 truncate text-sm font-medium text-gray-800">{user.fullName}</h4>
          {user.activity?.helpfulVotes && user.activity.helpfulVotes > 300 && (
            <Tooltip title="Người dùng có nhiều đóng góp hữu ích">
              <CheckCircleFilled className="text-xs text-green-500" />
            </Tooltip>
          )}
        </div>

        {/* <p className="truncate text-xs text-gray-500">{user.bio}</p> */}
        <span className="text-xs text-green-600">
          {user.activity?.lastActive && getLastActiveTime(user.activity.lastActive)}
        </span>

        <div className="flex items-center text-xs text-gray-500">
          {user.activity?.commentCount && (
            <Tooltip title={`${user.activity.commentCount} bình luận`}>
              <span className="mr-2 flex items-center">
                <CommentOutlined className="mr-1" />
                {user.activity.commentCount}
              </span>
            </Tooltip>
          )}

          {user.activity?.likeCount && (
            <Tooltip title={`${user.activity.likeCount} lượt thích`}>
              <span className="mr-2 flex items-center">
                <HeartOutlined className="mr-1" />
                {user.activity.likeCount}
              </span>
            </Tooltip>
          )}

          {user.activity?.badgeCount && (
            <Tooltip title={`${user.activity.badgeCount} huy hiệu`}>
              <span className="flex items-center">
                <TrophyOutlined className="mr-1" />
                {user.activity.badgeCount}
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveUserItem;
