import { type ReactNode, createContext } from 'react';

export interface LayoutContextType {
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
  banner: ReactNode;
  setLeftSidebar: (sidebar: ReactNode) => void;
  setRightSidebar: (sidebar: ReactNode) => void;
  setBanner: (banner: ReactNode) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);
