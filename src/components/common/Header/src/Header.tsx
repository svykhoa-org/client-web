import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import {
  BankOutlined,
  BookOutlined,
  CloseOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  MenuOutlined,
  MessageOutlined,
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Drawer, Dropdown, Menu } from 'antd'
import type { MenuProps } from 'antd'

import RouteConfig from '@/constants/RouteConfig'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

import './Header.css'
import { RoutePath } from '@/routes'

type NavMenuMode = 'horizontal' | 'vertical'

interface HeaderNavMenuProps {
  mode?: NavMenuMode
  onItemClick?: () => void
}

const HeaderNavMenu = ({ mode = 'horizontal', onItemClick }: HeaderNavMenuProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems: MenuProps['items'] = [
    {
      key: RouteConfig.HomePage.path,
      icon: mode === 'vertical' ? <HomeOutlined /> : null,
      label: 'Trang chủ',
    },
    {
      key: RouteConfig.ForumPage.path,
      icon: mode === 'vertical' ? <MessageOutlined /> : null,
      label: 'Diễn đàn',
    },
    {
      key: RouteConfig.CoursePage.path,
      icon: mode === 'vertical' ? <BookOutlined /> : null,
      label: 'E-Learning',
    },
    {
      key: RoutePath.DocumentListPage.path,
      icon: mode === 'vertical' ? <FileTextOutlined /> : null,
      label: 'Thư viện',
    },
    {
      key: RouteConfig.JobListPage.path,
      icon: mode === 'vertical' ? <BankOutlined /> : null,
      label: 'Tuyển dụng',
    },
  ]

  const menuRouteKeys = menuItems
    .map(item => item?.key)
    .filter((key): key is string => typeof key === 'string')

  const selectedMenuKey =
    [...menuRouteKeys]
      .filter(key => key !== '/')
      .sort((a, b) => b.length - a.length)
      .find(key => location.pathname.startsWith(key)) || location.pathname

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
    onItemClick?.()
  }

  return (
    <Menu
      mode={mode}
      selectedKeys={[selectedMenuKey]}
      onClick={handleMenuClick}
      className={cn(
        'sv-header-nav border-0 bg-transparent',
        mode === 'horizontal'
          ? 'sv-header-nav--horizontal flex justify-center'
          : 'sv-header-nav--vertical',
      )}
      theme="light"
      items={menuItems}
    />
  )
}

interface HeaderUserMenuProps {
  isAuthenticated: boolean
  userName?: string
  onLogin: () => void
  onRegister: () => void
  onLogout: () => void
  onProfile: () => void
  isMobile?: boolean
}

const HeaderUserMenu = ({
  isAuthenticated,
  userName,
  onLogin,
  onRegister,
  onLogout,
  onProfile,
  isMobile = false,
}: HeaderUserMenuProps) => {
  const navigate = useNavigate()
  const displayName = userName?.trim() || 'Tài khoản'

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined className="text-blue-600" />,
      onClick: onProfile,
    },
    {
      key: 'my-courses',
      label: 'Khóa học của tôi',
      icon: <BookOutlined className="text-emerald-600" />,
      onClick: () => navigate(RouteConfig.MyCoursesPage.path),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined className="text-red-600" />,
      onClick: onLogout,
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className={cn('flex', isMobile ? 'flex-col space-y-3' : 'flex-row space-x-3')}>
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
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 rounded-lg bg-slate-50 p-3">
          <Avatar size={40} icon={<UserOutlined />} className="bg-blue-600" />
          <div>
            <div className="font-medium text-slate-900">{displayName}</div>
            <div className="text-sm text-slate-500">Thành viên</div>
          </div>
        </div>
        <div className="space-y-2">
          <Button
            type="text"
            icon={<UserOutlined className="text-blue-600" />}
            onClick={onProfile}
            className="w-full justify-start text-left hover:bg-slate-100"
          >
            Thông tin cá nhân
          </Button>
          <Button
            type="text"
            icon={<BookOutlined className="text-emerald-600" />}
            onClick={() => navigate(RouteConfig.MyCoursesPage.path)}
            className="w-full justify-start text-left hover:bg-slate-100"
          >
            Khóa học của tôi
          </Button>
          <Button
            type="text"
            icon={<LogoutOutlined className="text-red-600" />}
            onClick={onLogout}
            className="w-full justify-start text-left text-red-600 hover:bg-slate-100"
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
      <div className="flex cursor-pointer items-center space-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md">
        <Avatar size="small" icon={<UserOutlined />} className="bg-blue-600" />
        <span className="hidden font-medium text-slate-700 sm:inline">{displayName}</span>
      </div>
    </Dropdown>
  )
}

interface HeaderLogoProps {
  onClick?: () => void
}

const HeaderLogo = ({ onClick }: HeaderLogoProps) => {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-3 rounded-md transition-all duration-200 hover:opacity-80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60',
      )}
      onClick={onClick}
      aria-label="Về trang chủ"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg">
        <MedicineBoxOutlined className="text-xl text-white" />
      </div>

      <div className="hidden sm:block">
        <h1 className="text-lg font-bold text-blue-700">SVYKHOA</h1>
      </div>
    </button>
  )
}

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const userName = user?.fullName?.trim() || user?.email || 'Tài khoản'
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigate = useNavigate()

  const buildRedirectUrl = (path: string) => {
    const currentPath = window.location.pathname
    return `${path}?redirect=${encodeURIComponent(currentPath)}`
  }

  const handleLogin = () => {
    setMobileMenuOpen(false)
    navigate(buildRedirectUrl(RouteConfig.LoginPage.path))
  }

  const handleRegister = () => {
    setMobileMenuOpen(false)
    navigate(buildRedirectUrl(RouteConfig.RegisterPage.path))
  }

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate(RouteConfig.HomePage.path)
  }

  const handleProfile = () => {
    setMobileMenuOpen(false)
    navigate(RouteConfig.ProfilePage.path)
  }

  const handleLogoClick = () => {
    navigate(RouteConfig.HomePage.path)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  return (
    <header
      className={cn(
        'sv-header sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="shrink-0">
            <HeaderLogo onClick={handleLogoClick} />
          </div>

          <div className="hidden flex-1 px-4 md:block">
            <HeaderNavMenu mode="horizontal" />
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <HeaderUserMenu
              isAuthenticated={isAuthenticated}
              userName={userName}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              onProfile={handleProfile}
            />
          </div>

          <div className="md:hidden">
            <Button
              type="text"
              icon={<MenuOutlined className="text-slate-600" />}
              onClick={toggleMobileMenu}
              aria-label="Mở menu điều hướng"
              className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
            />
          </div>
        </div>
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={toggleMobileMenu}
        open={isMobileMenuOpen}
        width={280}
        className="sv-header__drawer md:hidden"
        closeIcon={<CloseOutlined className="text-slate-600" />}
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 py-4">
            <HeaderNavMenu mode="vertical" onItemClick={toggleMobileMenu} />
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-4">
            <HeaderUserMenu
              isAuthenticated={isAuthenticated}
              userName={userName}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              onProfile={handleProfile}
              isMobile
            />
          </div>
        </div>
      </Drawer>
    </header>
  )
}

export default Header
