import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Button, Modal } from 'antd';
import type { ButtonProps } from 'antd';

import RouteConfig from '@/constants/RouteConfig';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedButtonProps extends ButtonProps {
  children: ReactNode;
  requireAuth?: boolean;
  modalTitle?: string;
  modalContent?: string;
  fallbackText?: string;
  onAuthRequired?: () => void;
}

export const ProtectedButton = ({
  children,
  requireAuth = true,
  modalTitle = 'Yêu cầu đăng nhập',
  modalContent = 'Bạn cần đăng nhập để sử dụng tính năng này.',
  fallbackText = 'Đăng nhập để tiếp tục',
  onAuthRequired,
  onClick,
  ...buttonProps
}: ProtectedButtonProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!requireAuth || isAuthenticated) {
    return (
      <Button {...buttonProps} onClick={onClick}>
        {children}
      </Button>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAuthRequired) {
      onAuthRequired();
    } else {
      Modal.confirm({
        title: modalTitle,
        content: modalContent,
        okText: 'Đăng nhập',
        cancelText: 'Hủy',
        onOk: () => {
          const currentPath = location.pathname;
          navigate(`${RouteConfig.LoginPage.path}?redirect=${encodeURIComponent(currentPath)}`);
        },
      });
    }
  };

  return (
    <Button {...buttonProps} onClick={handleClick}>
      {fallbackText}
    </Button>
  );
};
