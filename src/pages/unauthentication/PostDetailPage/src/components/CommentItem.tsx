import React, { useState } from 'react';

// import ReactMarkdown from 'react-markdown';

import dayjs from 'dayjs';

import type { CommentNode } from '@/utils/commentTree';

interface CommentItemProps {
  comment: CommentNode;
  onReply?: (parentId: string) => void;
  maxDepth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, maxDepth = 2 }) => {
  const [showReplies, setShowReplies] = useState(true);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).locale('vi').format('HH:mm DD/MM/YYYY');
  };

  const getIndentClass = (level: number) => {
    if (level === 0) return '';
    if (level === 1) return 'ml-8';
    if (level === 2) return 'ml-16';
    if (level === 3) return 'ml-24';
    return 'ml-32'; // Max depth
  };

  const getBorderClass = (level: number) => {
    if (level === 0) return '';
    return 'border-l-2 border-gray-100 pl-4';
  };

  return (
    <div className={`${getIndentClass(comment.level)} ${getBorderClass(comment.level)}`}>
      <div className="py-2">
        {/* Comment Header */}
        <div className="mb-1 flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {comment.author?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{comment.author?.fullName || 'Người dùng ẩn danh'}</span>
              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
              {comment.isEdited && <span className="text-xs text-gray-400 italic">(đã chỉnh sửa)</span>}
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <div className="mb-1">
          <div className="prose prose-sm max-w-none text-gray-700">
            {/* <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2">{children}</p>,
                strong: ({ children }) => <strong>{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
                code: ({ children }) => (
                  <code className="rounded bg-gray-100 px-1 text-sm">
                    {children}
                  </code>
                ),
                a: ({ children, href }) => (
                  <a href={href} className="text-blue-600 hover:underline">
                    {children}
                  </a>
                ),
              }}
            >
              {comment.content}
            </ReactMarkdown> */}
            <span>{comment.content}</span>
          </div>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4 text-sm">
          {comment.level < maxDepth && (
            <button
              onClick={() => onReply?.(comment._id || '')}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              <span>Trả lời</span>
            </button>
          )}

          {comment.children.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <svg
                className={`h-4 w-4 transform transition-transform ${showReplies ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>
                {showReplies ? 'Ẩn' : 'Hiện'} {comment.children.length} phản hồi
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {showReplies &&
        comment.children.map(childComment => (
          <CommentItem key={childComment._id} comment={childComment} onReply={onReply} maxDepth={maxDepth} />
        ))}
    </div>
  );
};

export default CommentItem;
