import { useEffect, useRef, useState } from 'react';

import { getChatbotResponse } from '@/services/chatbot';

interface Message {
  id: string;
  role: 'system' | 'user';
  content: string;
  rawResponse?: string;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedQuestions = [
  'Làm thế nào để phòng ngừa cảm lạnh?',
  'Tôi nên làm gì khi bị đau đầu dữ dội?',
  'Các triệu chứng của COVID-19 là gì?',
  'Bài tập tốt nhất cho người bị đau lưng mãn tính?',
];

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Xin chào! Tôi là trợ lý y tế. Tôi có thể giúp gì cho bạn hôm nay?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change or chat opens
    scrollToBottom();
  }, [messages, isOpen]);

  const handleMessageClick = (messageId: string) => {
    if (selectedMessageId === messageId) {
      setSelectedMessageId(null);
    } else {
      setSelectedMessageId(messageId);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(input);

      const systemResponse: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: response.text || 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
        rawResponse: response.rawResponse,
      };

      setMessages(prev => [...prev, systemResponse]);
    } catch {
      const errorResponse: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: 'Xin lỗi, đã xảy ra lỗi khi kết nối với dịch vụ chatbot.',
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      // Ensure scrolling to bottom after loading is complete with a slight delay
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleQuestionClick = async (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(question);

      const systemResponse: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: response.text || 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
        rawResponse: response.rawResponse,
      };

      setMessages(prev => [...prev, systemResponse]);
    } catch {
      const errorResponse: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: 'Xin lỗi, đã xảy ra lỗi khi kết nối với dịch vụ chatbot.',
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      // Ensure scrolling to bottom after loading is complete with a slight delay
      setTimeout(scrollToBottom, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-16 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-green-600 p-3 text-white">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">Trợ lý y tế</span>
        </div>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-green-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user' ? 'bg-green-100 text-green-900' : 'bg-gray-100 text-gray-900'
              }`}
              onClick={() => handleMessageClick(message.id)}
            >
              <p className="whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2 text-gray-900">
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* Suggested questions */}
      {messages.length < 3 && (
        <div className="border-t border-gray-200 p-3">
          <p className="mb-2 text-xs text-gray-500">Câu hỏi gợi ý:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs text-green-800 hover:bg-green-100"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center rounded-full border border-gray-300 bg-gray-50 px-3 py-2">
          <input
            type="text"
            placeholder="Nhập câu hỏi của bạn..."
            className="w-full bg-transparent focus:outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="ml-2 rounded-full p-1 text-green-600 hover:bg-green-100 disabled:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 rotate-90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
