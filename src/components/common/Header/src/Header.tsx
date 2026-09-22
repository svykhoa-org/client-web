import { useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'

import {
  BankOutlined,
  BookOutlined,
  CloseOutlined,
  DownOutlined,
  FacebookFilled,
  FileTextOutlined,
  GlobalOutlined,
  HomeOutlined,
  InstagramOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  MessageOutlined,
  PhoneOutlined,
  UserOutlined,
  YoutubeFilled,
} from '@ant-design/icons'
import { Avatar, Button, Drawer, Dropdown, Menu } from 'antd'
import type { MenuProps } from 'antd'

import fallbackLogo from '@/assets/images/logo.png'
import { BRAND_NAME } from '@/constants/brand'
import { PRIMARY_NAV_ITEMS } from '@/constants/nav'
import RouteConfig from '@/constants/RouteConfig'
import { useAuth } from '@/hooks/useAuth'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { cn } from '@/lib/utils'

import './Header.css'
import SearchBar from './SearchBar'
import { RoutePath } from '@/routes'
import { resolveUrl } from '@/utils/resolveUrl'

// Honest fallback tagline when site settings haven't set one yet.
const FALLBACK_TAGLINE = 'Nền tảng tri thức & đào tạo nha khoa'

type NavMenuMode = 'horizontal' | 'vertical'

interface HeaderNavMenuProps {
  mode?: NavMenuMode
  onItemClick?: () => void
}

const HeaderNavMenu = ({ mode = 'horizontal', onItemClick }: HeaderNavMenuProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Icons live here (header-only concern); labels/paths come from the shared
  // PRIMARY_NAV_ITEMS so the footer nav stays in sync. Icons show in vertical
  // (mobile drawer) mode only, matching the previous behavior.
  const navIcons: Record<string, ReactNode> = {
    [RouteConfig.HomePage.path]: <HomeOutlined />,
    [RouteConfig.ForumPage.path]: <MessageOutlined />,
    [RouteConfig.CoursePage.path]: <BookOutlined />,
    [RoutePath.DocumentListPage.path]: <FileTextOutlined />,
    [RouteConfig.JobListPage.path]: <BankOutlined />,
  }

  const menuItems: MenuProps['items'] = PRIMARY_NAV_ITEMS.map(item => ({
    key: item.path,
    icon: mode === 'vertical' ? navIcons[item.path] : null,
    label: item.label,
  }))

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
          ? 'sv-header-nav--horizontal flex justify-start'
          : 'sv-header-nav--vertical',
      )}
      theme="light"
      items={menuItems}
    />
  )
}

interface HeaderUserMenuProps {
  isAuthenticated: boolean
  user?: { fullName?: string; email?: string; role?: string; avatarUrl?: string } | null
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
        <div className="flex items-center space-x-3 gap-3 rounded-lg bg-slate-50 p-3">
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
            className="w-full justify-start  text-left hover:bg-slate-100"
          >
            <div className="w-full text-left">Thông tin cá nhân</div>
          </Button>
          <Button
            type="text"
            icon={<BookOutlined className="text-emerald-600" />}
            onClick={() => navigate(RouteConfig.MyCoursesPage.path)}
            className="w-full justify-start text-left hover:bg-slate-100"
          >
            <div className="w-full text-left">Khóa học của tôi</div>
          </Button>
          <Button
            type="text"
            icon={<LogoutOutlined className="text-red-600" />}
            onClick={onLogout}
            className="w-full justify-start text-left text-red-600 hover:bg-slate-100"
          >
            <div className="w-full text-left">Đăng xuất</div>
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
        <div className="shadow-primary-10/10 w-64 overflow-hidden rounded-xl border border-neutral-3 bg-white shadow-lg">
          {/* User info */}
          <div className="flex items-center gap-3 border-b border-neutral-2 px-4 py-3.5">
            <Avatar
              size={40}
              icon={<UserOutlined />}
              src={user?.avatarUrl}
              className="bg-primary-9 shrink-0"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-neutral-10">{displayName}</div>
              <div className="truncate text-xs text-neutral-5">{user?.email || ''}</div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            {[
              { label: 'Hồ sơ của tôi', icon: <UserOutlined />, onClick: onProfile },
              {
                label: 'Khoá học của tôi',
                icon: <BookOutlined />,
                onClick: () => navigate('/profile?tab=courses'),
              },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="hover:bg-primary-1 hover:text-primary-9 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-neutral-8 transition-colors"
              >
                <span className="text-base text-neutral-5">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="my-1.5 h-px bg-neutral-2" />

            <button
              onClick={onLogout}
              className="text-error-3 hover:bg-error-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors"
            >
              <span className="text-base">
                <LogoutOutlined />
              </span>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    >
      <button
        type="button"
        className="sv-user-btn hover:border-primary-4 flex h-9 items-center gap-2 rounded-full border border-neutral-3 bg-white pl-1 pr-3 transition-all"
        aria-label="Mở menu tài khoản"
      >
        <Avatar size={28} icon={<UserOutlined />} src={user?.avatarUrl} className="bg-primary-9" />
        <span className="max-w-24 truncate text-sm font-medium text-neutral-8">{displayName}</span>
        <DownOutlined className="text-[10px] text-neutral-5" />
      </button>
    </Dropdown>
  )
}

interface HeaderLogoProps {
  onClick?: () => void
  src?: string
}

const HeaderLogo = ({ onClick, src }: HeaderLogoProps) => {
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
      <img
        src={src}
        alt={BRAND_NAME}
        className="h-8 w-auto origin-left scale-[1.5] rounded-xl object-contain"
      />
    </button>
  )
}

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const { settings } = useSiteSettings()
  const logoSrc = resolveUrl(settings.logoUrl) ?? fallbackLogo
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

  // Relocated from the home hero (plan 0014): the medical search now lives in
  // the header. Same behavior — navigate to /search carrying the query in state.
  const handleSearch = (searchQuery: string) => {
    setMobileMenuOpen(false)
    navigate(RouteConfig.MedicalSearchPage.path, {
      state: { searchQuery },
    })
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  return (
    <>
      {/* Top utility bar — tagline + real contact/social from site settings +
          language (scrolls away, not sticky). All contact/social fields are
          conditional: they appear once configured in admin site settings. */}
      <div className="bg-primary-10 text-neutral-3 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-9 items-center justify-between gap-4 text-xs">
            {/* Left — tagline + contact */}
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-accent-3 truncate font-medium">
                {settings.tagline || FALLBACK_TAGLINE}
              </span>
              {settings.contactPhone && (
                <>
                  <span className="text-neutral-6 hidden sm:inline">|</span>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}
                    className="hidden items-center gap-1.5 transition-colors hover:text-white sm:flex"
                  >
                    <PhoneOutlined className="text-accent-3" />
                    <strong className="font-medium text-white">{settings.contactPhone}</strong>
                  </a>
                </>
              )}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hidden items-center gap-1.5 transition-colors hover:text-white lg:flex"
                >
                  <MailOutlined className="text-accent-3" />
                  {settings.contactEmail}
                </a>
              )}
            </div>

            {/* Right — socials + language */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden items-center gap-3 sm:flex">
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="transition-colors hover:text-white"
                  >
                    <FacebookFilled />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="transition-colors hover:text-white"
                  >
                    <YoutubeFilled />
                  </a>
                )}
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="transition-colors hover:text-white"
                  >
                    <InstagramOutlined />
                  </a>
                )}
                {settings.zaloUrl && (
                  <a
                    href={settings.zaloUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium transition-colors hover:text-white"
                  >
                    Zalo
                  </a>
                )}
                <span className="text-neutral-6">|</span>
              </div>
              {/* Language — only Vietnamese for now (more languages later). */}
              <div className="text-neutral-2 flex items-center gap-1.5">
                <GlobalOutlined className="text-neutral-4" />
                <span className="font-medium">Tiếng Việt</span>
                <DownOutlined className="text-neutral-5 text-[10px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sv-header sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm',
        )}
      >
        {/* Full-width, two-tier header (plan 0014 + feedback):
          row 1 = logo · search (grows) · user; row 2 = nav (left-aligned). */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center gap-4">
            {/* Left — logo (flex-1 mirrors the right so the search stays centered) */}
            <div className="flex flex-1 items-center">
              <div className="shrink-0">
                <HeaderLogo onClick={handleLogoClick} src={logoSrc} />
              </div>
            </div>

            {/* Center — search (desktop md+) */}
            <div className="hidden w-full max-w-2xl shrink-0 md:block">
              <SearchBar variant="header" onSearch={handleSearch} />
            </div>

            {/* Right — user (md+) or hamburger (mobile); flex-1 mirrors the left */}
            <div className="flex flex-1 items-center justify-end">
              <div className="hidden items-center md:flex">
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

          {/* Search — mobile row (below, when the inline search is hidden) */}
          <div className="pb-3 md:hidden">
            <SearchBar variant="header" onSearch={handleSearch} />
          </div>

          {/* Tier 2 — primary navigation, left-aligned (desktop md+) */}
          <div className="hidden border-t border-neutral-2 md:block">
            <HeaderNavMenu mode="horizontal" />
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
    </>
  )
}

export default Header
