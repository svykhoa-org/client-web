import React from 'react';
import { useNavigate } from 'react-router';

import { BookOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

import RouteConfig from '@/constants/RouteConfig';

interface UserMenuProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onProfile: () => void;
  isMobile?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({
  isAuthenticated,
  userName,
  onLogin,
  onRegister,
  onLogout,
  onProfile,
  isMobile = false,
}) => {
  const navigate = useNavigate();

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined style={{ color: '#2563eb' }} />,
      onClick: onProfile,
    },
    {
      key: 'my-courses',
      label: 'Khóa học của tôi',
      icon: <BookOutlined style={{ color: '#059669' }} />,
      onClick: () => navigate(RouteConfig.MyCoursesPage.path),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Đăng xuất',
      icon: <LogoutOutlined style={{ color: '#dc2626' }} />,
      onClick: onLogout,
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row space-x-3'}`}>
        <Button
          type="default"
          size={isMobile ? 'large' : 'middle'}
          onClick={onLogin}
          className="border-blue-500 text-blue-600 hover:border-blue-600 hover:bg-blue-50"
          block={isMobile}
        >
          Đăng nhập
        </Button>
        <Button
          type="primary"
          size={isMobile ? 'large' : 'middle'}
          onClick={onRegister}
          className="border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700"
          block={isMobile}
        >
          Đăng ký
        </Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
          <Avatar size={40} icon={<UserOutlined />} className="bg-blue-600" />
          <div>
            <div className="font-medium text-gray-900">{userName}</div>
            <div className="text-sm text-gray-500">Thành viên</div>
          </div>
        </div>
        <div className="space-y-2">
          <Button
            type="text"
            icon={<UserOutlined style={{ color: '#2563eb' }} />}
            onClick={onProfile}
            className="w-full justify-start text-left hover:bg-gray-100"
          >
            Thông tin cá nhân
          </Button>
          <Button
            type="text"
            icon={<BookOutlined style={{ color: '#059669' }} />}
            onClick={() => navigate(RouteConfig.MyCoursesPage.path)}
            className="w-full justify-start text-left hover:bg-gray-100"
          >
            Khóa học của tôi
          </Button>
          <Button
            type="text"
            icon={<LogoutOutlined style={{ color: '#dc2626' }} />}
            onClick={onLogout}
            className="w-full justify-start text-left text-red-600 hover:bg-gray-100"
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
      <div className="flex cursor-pointer items-center space-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md">
        <Avatar size="small" icon={<UserOutlined />} className="bg-blue-600" />
        <span className="hidden font-medium text-gray-700 sm:inline">{userName}</span>
      </div>
    </Dropdown>
  );
};

export default UserMenu;
