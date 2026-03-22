import { useState } from 'react';
import { useNavigate } from 'react-router';

import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import { useAuth } from '@/hooks/useAuth';

import Logo from './Logo';
import NavMenu from './NavMenu';
import UserMenu from './UserMenu';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useAuth();
  const userName = user ? user.fullName : '';
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to login page with current path as redirect URL
    const currentPath = window.location.pathname;
    navigate(`${RouteConfig.LoginPage.path}?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleRegister = () => {
    // Navigate to register page with current path as redirect URL
    const currentPath = window.location.pathname;
    navigate(`${RouteConfig.RegisterPage.path}?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleLogout = async () => {
    try {
      console.log('Logout clicked');
      await logout();
      navigate(RouteConfig.HomePage.path);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfile = () => {
    console.log('Profile clicked');
    navigate(RouteConfig.ProfilePage.path);
  };

  const handleLogoClick = () => {
    console.log('Logo clicked');
    // Navigate to home page
    navigate(RouteConfig.HomePage.path);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo onClick={handleLogoClick} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden max-w-lg flex-1 md:block">
            <NavMenu mode="horizontal" />
          </div>

          {/* Desktop User Menu */}
          <div className="hidden items-center space-x-4 md:flex">
            <UserMenu
              isAuthenticated={isAuthenticated}
              userName={userName}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              onProfile={handleProfile}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: '#6b7280' }} />}
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={toggleMobileMenu}
        open={isMobileMenuOpen}
        width={280}
        className="md:hidden"
        closeIcon={<CloseOutlined style={{ color: '#6b7280' }} />}
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex h-full flex-col">
          {/* Navigation Menu */}
          <div className="flex-1 py-4">
            <NavMenu mode="vertical" onItemClick={toggleMobileMenu} />
          </div>

          {/* User Actions */}
          <div className="border-t border-gray-100 bg-gray-50 p-4">
            <UserMenu
              isAuthenticated={isAuthenticated}
              userName={userName}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              onProfile={handleProfile}
              isMobile={true}
            />
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
