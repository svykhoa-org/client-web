import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import {
  BankOutlined,
  BookOutlined,
  CloseOutlined,
  DownOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Drawer, Dropdown, Menu } from 'antd'
import type { MenuProps } from 'antd'

import logoImage from '@/assets/images/logo.png'
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
  user?: { fullName?: string; email?: string; role?: string } | null
  userName?: string
  onLogin: () => void
  onRegister: () => void
  onLogout: () => void
  onProfile: () => void
  isMobile?: boolean
}

const HeaderUserMenu = ({
  isAuthenticated,
  user,
  userName,
  onLogin,
  onRegister,
  onLogout,
  onProfile,
  isMobile = false,
}: HeaderUserMenuProps) => {
  const navigate = useNavigate()
  const displayName = user?.fullName || user?.email || userName?.trim() || 'Tài khoản'

  if (!isAuthenticated) {
    return (
      <div
        className={cn('flex', isMobile ? 'flex-col space-y-3' : 'flex-row items-center space-x-2')}
      >
        <Button
          type="text"
          size={isMobile ? 'large' : 'middle'}
          onClick={onLogin}
          className="sv-btn-login font-medium"
          block={isMobile}
        >
          Đăng nhập
        </Button>
        <Button
          type="primary"
          size={isMobile ? 'large' : 'middle'}
          onClick={onRegister}
          className="sv-btn-register font-semibold"
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
    <Dropdown
      placement="bottomRight"
      trigger={['click']}
      dropdownRender={() => (
        <div className="w-56 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-md">
          {/* User info */}
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="truncate text-sm font-semibold text-slate-900">{displayName}</div>
            <div className="truncate text-xs text-slate-400">{user?.email || ''}</div>
          </div>

          {/* Menu items */}
          <div className="p-1">
            {[
              { label: 'Hồ sơ cá nhân', onClick: onProfile },
              { label: 'Khoá học của tôi', onClick: () => navigate('/profile?tab=courses') },
              { label: 'Chứng chỉ của tôi', onClick: () => navigate('/profile?tab=certs') },
              { label: 'Lịch sử đơn hàng', onClick: () => navigate('/profile?tab=orders') },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                {item.label}
              </button>
            ))}

            <div className="my-1 border-t border-slate-100" />

            <button
              onClick={onLogout}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    >
      <button
        type="button"
        className="sv-user-btn flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-3 transition-all"
        aria-label="Mở menu tài khoản"
      >
        <Avatar size={28} icon={<UserOutlined />} className="bg-blue-600" />
        <span className="max-w-24 truncate text-sm font-medium text-slate-700">{displayName}</span>
        <DownOutlined className="text-[10px] text-slate-400" />
      </button>
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
      <img src={logoImage} alt="SVYKHOA" className="h-10 w-auto scale-150 object-contain" />
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
              user={user}
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
              user={user}
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
