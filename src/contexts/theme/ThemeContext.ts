import { createContext } from 'react'

export interface ThemeContextType {
  toggleTheme: () => void
  isDarkMode: boolean
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
