import { type ReactNode, useState } from 'react'

import { LayoutContext } from './LayoutContext'

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [leftSidebar, setLeftSidebar] = useState<ReactNode>(null)
  const [rightSidebar, setRightSidebar] = useState<ReactNode>(null)
  const [banner, setBanner] = useState<ReactNode>(null)

  return (
    <LayoutContext.Provider
      value={{
        leftSidebar,
        rightSidebar,
        banner,
        setLeftSidebar,
        setRightSidebar,
        setBanner,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
