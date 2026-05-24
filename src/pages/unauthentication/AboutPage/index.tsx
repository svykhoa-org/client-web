import { useEffect } from 'react'

import { useLayout } from '@/hooks/useLayout'

const AboutPage = () => {
  const { setLeftSidebar, setRightSidebar } = useLayout()

  useEffect(() => {
    setLeftSidebar(<div className="bg-red-400">Left Sidebar About</div>)
    setRightSidebar(<div className="bg-yellow-400">Right Sidebar About</div>)

    return () => {
      setLeftSidebar(null)
      setRightSidebar(null)
    }
  })

  return <div>About Page</div>
}

export default AboutPage
