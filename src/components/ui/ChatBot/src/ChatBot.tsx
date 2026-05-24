import { useState } from 'react'

import { IconChat } from '../../Icons/IconChatBot'
import ChatWindow from './components/ChatWindow'

const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen(prev => !prev)
  }

  return (
    <>
      <div
        className="fixed right-4 bottom-4 flex size-10 cursor-pointer items-center justify-center rounded-full border border-green-600 bg-white shadow-md hover:scale-105"
        onClick={toggleChat}
      >
        <IconChat className="text-2xl text-green-700" />
      </div>

      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}

export default ChatBot
