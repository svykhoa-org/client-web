export interface ChatbotResponse {
  text: string;
  rawResponse: string;
  success: boolean;
  error?: string;
}

/**
 * Extracts the assistant's answer from the raw AI response.
 * @param rawResponse - The raw response from the AI chatbot
 * @returns The extracted answer text
 */
export const extractAssistantResponse = (rawResponse: string): string => {
  // Find content between <answer> and </answer> tags
  const answerMatch = rawResponse.match(/<answer>([\s\S]*?)<\/answer>/);

  if (answerMatch && answerMatch[1]) {
    // Get the content inside the answer tags
    let answer = answerMatch[1].trim();

    // Remove the "# 💬 Câu trả lời" header and any following whitespace
    answer = answer.replace(/^# 💬 Câu trả lời\s*/i, '');

    return answer;
  }

  // If no answer tags found, return a default message
  return 'Xin lỗi, tôi không thể xử lý câu hỏi của bạn lúc này.';
};

/**
 * Fetches a response from the chatbot API
 * @param query - The user's question or input
 * @returns A promise resolving to the chatbot response
 */
export const getChatbotResponse = async (query: string): Promise<ChatbotResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_APT_CHAT_BOT;
    console.log('Connecting to chatbot API... URL:', apiUrl);

    const requestBody = {
      prompt: query,
      // max_new_tokens: 1024,
      // temperature: 0.1,
      // top_p: 0.9,
      // top_k: 50,
      // repetition_penalty: 1.0,
      // do_sample: true,
      // mode: 'normal',
      // module: 'search_local',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawResponse = await response.text();
    console.log('API response received successfully');

    // Extract the answer from the raw response
    const text = extractAssistantResponse(rawResponse);

    return {
      success: true,
      text,
      rawResponse,
    };
  } catch (error) {
    console.error('Error fetching chatbot response:', error);
    return {
      success: false,
      text: 'Không thể kết nối đến dịch vụ chatbot. Vui lòng thử lại sau.',
      rawResponse: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
