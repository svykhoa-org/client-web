import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Modal } from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import { useAuth } from '@/hooks/useAuth';

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
  showModal?: boolean;
  modalTitle?: string;
  modalContent?: string;
  redirectTo?: string;
}

export const RequireAuth = ({
  children,
  fallback,
  showModal = false,
  modalTitle = 'Yêu cầu đăng nhập',
  modalContent = 'Bạn cần đăng nhập để truy cập tính năng này.',
  redirectTo,
}: RequireAuthProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    if (showModal) {
      Modal.confirm({
        title: modalTitle,
        content: modalContent,
        okText: 'Đăng nhập',
        cancelText: 'Hủy',
        onOk: () => {
          const currentPath = redirectTo || location.pathname;
          navigate(`${RouteConfig.LoginPage.path}?redirect=${encodeURIComponent(currentPath)}`);
        },
        onCancel: () => {
          // Do nothing or navigate back
        },
      });
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    // Redirect to login with current path as redirect
    const currentPath = redirectTo || location.pathname;
    navigate(`${RouteConfig.LoginPage.path}?redirect=${encodeURIComponent(currentPath)}`);
    return null;
  }

  return <>{children}</>;
};
