import React from 'react'

import './MarkdownRenderer.css'

interface MarkdownRendererProps {
  content: string
  showFullContent: boolean
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, showFullContent }) => {
  const renderLine = (line: string, index: number) => {
    // Handle markdown headers
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <h3 key={index} className="text-neutral-9 mt-6 mb-3 text-xl font-bold">
          {line.replace(/\*\*/g, '')}
        </h3>
      )
    }

    // Handle markdown lists
    if (line.startsWith('- ')) {
      return (
        <li key={index} className="mb-2 ml-4 list-disc">
          {line.substring(2)}
        </li>
      )
    }

    // Handle numbered lists
    if (/^\d+\./.test(line)) {
      return (
        <li key={index} className="mb-2 ml-4 list-decimal">
          {line.replace(/^\d+\.\s*/, '')}
        </li>
      )
    }

    // Handle table rows (simple implementation)
    if (line.includes('|') && line.includes('---')) {
      return null // Skip table separator lines
    }

    if (line.includes('|')) {
      const cells = line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell)

      if (cells.length > 1) {
        return (
          <div key={index} className="border-neutral-3 bg-neutral-1 mb-2 flex border-b py-2">
            {cells.map((cell, cellIndex) => (
              <div key={cellIndex} className="flex-1 px-3 font-medium">
                {cell}
              </div>
            ))}
          </div>
        )
      }
    }

    // Handle bold text inline
    const processInlineMarkdown = (text: string) => {
      return text.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIndex} className="font-semibold">
              {part.replace(/\*\*/g, '')}
            </strong>
          )
        }
        return part
      })
    }

    // Regular paragraphs
    if (line.trim()) {
      return (
        <p key={index} className="text-neutral-8 mb-4 leading-relaxed">
          {processInlineMarkdown(line)}
        </p>
      )
    }

    return <br key={index} />
  }

  const lines = content.split('\n')
  const displayLines = showFullContent ? lines : lines.slice(0, 15)

  return (
    <div className="post-content">
      {displayLines.map(renderLine)}
      {!showFullContent && lines.length > 15 && (
        <div className="text-neutral-6 mt-4">
          <p>... và còn nhiều nội dung khác</p>
        </div>
      )}
    </div>
  )
}

export default MarkdownRenderer
