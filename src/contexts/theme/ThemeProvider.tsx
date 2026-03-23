import { type ReactNode, useMemo, useState } from 'react'

import { ConfigProvider, theme as antdTheme } from 'antd'
import type { ThemeConfig } from 'antd'

import { ThemeContext } from './ThemeContext'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  // Tạo theme config cho Ant Design từ system colors
  const theme = useMemo<ThemeConfig>(
    () => ({
      token: {
        colorPrimary: '#0e4174', // primary-6
        colorSuccess: '#52c41a', // success-3
        colorWarning: '#faad14', // warning-3
        colorError: '#f5222d', // error-3
        colorInfo: '#1677ff', // info-3

        // Màu nền
        colorBgBase: isDarkMode ? '#171717' : '#ffffff', // neutral-10 / white
        colorBgContainer: isDarkMode ? '#262626' : '#fafafa', // neutral-9 / neutral-1
        colorBgElevated: isDarkMode ? '#404040' : '#f5f5f5', // neutral-8 / neutral-2

        // Text colors
        colorText: isDarkMode ? '#e5e5e5' : '#171717', // neutral-3 / neutral-10
        colorTextSecondary: isDarkMode ? '#a3a3a3' : '#525252', // neutral-5 / neutral-7
        colorTextTertiary: isDarkMode ? '#737373' : '#737373', // neutral-6
        colorTextQuaternary: isDarkMode ? '#d4d4d4' : '#a3a3a3', // neutral-4 / neutral-5

        // Border colors
        colorBorder: isDarkMode ? '#525252' : '#e5e5e5', // neutral-7 / neutral-3
        colorBorderSecondary: isDarkMode ? '#404040' : '#f5f5f5', // neutral-8 / neutral-2

        // Padding và margin
        padding: 16,
        margin: 16,

        // Font và border radius
        borderRadius: 8,
        fontFamily: 'Be Vietnam Pro, sans-serif',
      },
      algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      components: {
        Button: {
          algorithm: true, // Sử dụng thuật toán theme
          colorPrimary: '#125495',
          colorPrimaryHover: '#0e4174',
          colorPrimaryActive: '#0e4174',
          colorPrimaryText: '#ffffff',
          defaultShadow: 'none',
          primaryShadow: 'none',

          controlOutline: '#0b3258',
          borderRadius: 8,
        },
        Input: {
          colorBgContainer: isDarkMode ? '#404040' : '#ffffff',
          colorBorder: isDarkMode ? '#525252' : '#d4d4d4',
          activeBorderColor: '#0e4174', // primary-6
          hoverBorderColor: '#0e4174', // primary-5
          activeShadow: '0 0 0 2px #0b3258', // primary-6 với alpha
        },
        Select: {
          colorBgContainer: isDarkMode ? '#404040' : '#ffffff',
          colorBorder: isDarkMode ? '#525252' : '#d4d4d4',
          optionSelectedBg: isDarkMode ? '#404040' : '#e8f1fb',
          optionSelectedColor: isDarkMode ? '#e5e5e5' : '#0e4174',
          optionActiveBg: isDarkMode ? '#525252' : '#f0f9ff',
        },
        Card: {
          colorBgContainer: isDarkMode ? '#262626' : '#ffffff',
          colorBorderSecondary: isDarkMode ? '#404040' : '#e5e5e5',
        },
        Menu: {
          itemSelectedColor: '#0b3258', // primary-6
          itemSelectedBg: '#1976d2', // primary-1
          itemActiveBg: '#1976d2', // primary-2
        },
        Table: {
          headerBg: isDarkMode ? '#262626' : '#f5f5f5',
          headerColor: isDarkMode ? '#e5e5e5' : '#171717',
          rowHoverBg: isDarkMode ? '#404040' : '#f0fdf4',
        },
        Tabs: {
          inkBarColor: '#0e4174', // primary-6
          itemSelectedColor: '#0e4174', // primary-6
          itemHoverColor: '#0b3258', // primary-5
        },
      },
    }),
    [isDarkMode],
  )

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme,
        isDarkMode,
      }}
    >
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  )
}
