import React from 'react';
import { useLocation, useNavigate } from 'react-router';

import { BankOutlined, BookOutlined, FileTextOutlined, HomeOutlined, MessageOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

import RouteConfig from '@/constants/RouteConfig';

interface NavMenuProps {
  mode?: 'horizontal' | 'vertical';
  onItemClick?: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ mode = 'horizontal', onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const { pathname } = location;
    if (pathname === RouteConfig.HomePage.path) return 'home';
    if (pathname === RouteConfig.ForumPage.path) return 'forum';
    if (pathname.startsWith('/e-learning') || pathname.startsWith('/courses') || pathname.startsWith('/course-player'))
      return 'e-learning';
    if (pathname.startsWith('/documents') || pathname.startsWith('/document/')) return 'library';
    if (pathname.startsWith('/jobs') || pathname.startsWith('/job/')) return 'jobs';
    return '';
  };

  const handleMenuClick: MenuProps['onClick'] = e => {
    switch (e.key) {
      case 'home':
        navigate(RouteConfig.HomePage.path);
        break;
      case 'forum':
        navigate(RouteConfig.ForumPage.path);
        break;
      case 'e-learning':
        navigate(RouteConfig.CoursePage.path);
        break;
      case 'library':
        navigate(RouteConfig.ResourceListPage.path);
        break;
      case 'jobs':
        navigate(RouteConfig.JobListPage.path);
        break;
      default:
        break;
    }

    onItemClick?.();
  };

  const selectedKey = getSelectedKey();

  const getIconColor = (itemKey: string) => {
    return selectedKey === itemKey ? (mode === 'vertical' ? '#ffffff' : '#2563eb') : '#6b7280';
  };

  const menuItems = [
    {
      key: 'home',
      icon: mode === 'vertical' ? <HomeOutlined style={{ color: getIconColor('home') }} /> : null,
      label: 'Trang chủ',
    },
    {
      key: 'forum',
      icon: mode === 'vertical' ? <MessageOutlined style={{ color: getIconColor('forum') }} /> : null,
      label: 'Diễn đàn',
    },
    {
      key: 'e-learning',
      icon: mode === 'vertical' ? <BookOutlined style={{ color: getIconColor('e-learning') }} /> : null,
      label: 'E-Learning',
    },
    {
      key: 'library',
      icon: mode === 'vertical' ? <FileTextOutlined style={{ color: getIconColor('library') }} /> : null,
      label: 'Thư viện',
    },
    {
      key: 'jobs',
      icon: mode === 'vertical' ? <BankOutlined style={{ color: getIconColor('jobs') }} /> : null,
      label: 'Tuyển dụng',
    },
  ];

  return (
    <>
      <style>
        {`
          /* Desktop horizontal menu - chỉ đổi màu chữ */
          .ant-menu-horizontal .ant-menu-item-selected,
          .ant-menu-horizontal .ant-menu-item-selected:hover {
            background-color: transparent !important;
            color: #2563eb !important;
            border-bottom-color: #2563eb !important;
          }
          .ant-menu-horizontal .ant-menu-item-selected .ant-menu-title-content {
            color: #2563eb !important;
            font-weight: 600 !important;
          }
          
          /* Mobile vertical menu - đổi cả màu nền và chữ */
          .ant-menu-vertical .ant-menu-item-selected,
          .ant-menu-vertical .ant-menu-item-selected:hover {
            background-color: #2563eb !important;
            color: #ffffff !important;
            border-radius: 8px !important;
          }
          .ant-menu-vertical .ant-menu-item-selected .ant-menu-title-content {
            color: #ffffff !important;
            font-weight: 600 !important;
          }
          
          /* Hover effects */
          .ant-menu-horizontal .ant-menu-item:hover {
            color: #2563eb !important;
          }
          .ant-menu-vertical .ant-menu-item:hover {
            background-color: #f3f4f6 !important;
            border-radius: 8px !important;
          }
        `}
      </style>
      <Menu
        mode={mode}
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        className={mode === 'horizontal' ? 'flex justify-center border-0 bg-transparent' : 'border-0 bg-transparent'}
        style={{
          backgroundColor: 'transparent',
          color: '#374151',
        }}
        theme="light"
        items={menuItems}
      />
    </>
  );
};

export default NavMenu;
