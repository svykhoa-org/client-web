import { Outlet } from 'react-router'

import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import ChatBot from '@/components/ui/ChatBot'
import { useLayout } from '@/hooks/useLayout'

const MainLayout = () => {
  const { leftSidebar, rightSidebar, banner } = useLayout()

  return (
    <div className="relative flex min-h-dvh flex-col">
      <Header />

      {/* Banner */}
      {banner && <div className="mb-4">{banner}</div>}

      <div className="container mx-auto flex-1">
        <div className="flex flex-col gap-4 py-4 md:flex-row">
          {leftSidebar && <aside className="order-2 md:order-1 md:w-1/5">{leftSidebar}</aside>}

          <main className="order-1 flex-1 md:order-2">
            <Outlet />
          </main>

          {rightSidebar && <aside className="order-3 md:order-3 md:w-1/5">{rightSidebar}</aside>}
        </div>

        {/* ChatBot */}
        <div className="fixed right-20 bottom-20">
          <ChatBot />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MainLayout
