/**
 * Utility functions for displaying and formatting chatbot responses
 */

/**
 * Formats the raw chatbot response for display in the UI
 * Adds syntax highlighting classes for markdown elements
 *
 * @param rawText The raw text to format
 * @returns Formatted text with HTML classes for styling
 */
export const formatChatbotResponse = (rawText: string): string => {
  // This function could be expanded to add syntax highlighting, format markdown, etc.
  return rawText
    .replace(/<answer>([\s\S]*?)<\/answer>/g, '<div class="chatbot-answer">$1</div>')
    .replace(/<experting>([\s\S]*?)<\/experting>/g, '<div class="chatbot-expert-info">$1</div>')
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-2">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-1">$2</h2>')
    .replace(/\n- (.*)/g, '\n<li class="ml-4">$1</li>')
    .replace(/\n\d\. (.*)/g, '\n<li class="ml-4 list-decimal">$1</li>')
}

/**
 * Returns a debug-friendly version of the chatbot response
 *
 * @param rawResponse The raw response from the chatbot
 * @returns Object with parsed parts of the response
 */
export const debugChatbotResponse = (rawResponse: string) => {
  const expertMatch = rawResponse.match(/<experting>([\s\S]*?)<\/experting>/)
  const answerMatch = rawResponse.match(/<answer>([\s\S]*?)<\/answer>/)

  return {
    expert: expertMatch ? expertMatch[1].trim() : 'No expert information found',
    answer: answerMatch ? answerMatch[1].trim() : 'No answer found',
    raw: rawResponse,
  }
}
