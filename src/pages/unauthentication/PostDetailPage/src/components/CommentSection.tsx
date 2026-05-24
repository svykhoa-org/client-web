import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { AsyncLoading } from '@/components/ui/AsyncLoading'
import Card from '@/components/ui/Card'
import RouteConfig from '@/constants/RouteConfig'
import { useAsyncState } from '@/hooks/useAsyncState'
import { useAuth } from '@/hooks/useAuth'
import type { Comment } from '@/models/Comment'
import { createComment, getComments } from '@/services/comment/commentService'
import { buildCommentTree, getCommentCount } from '@/utils/commentTree'

import CommentItem from './CommentItem'

interface CommentSectionProps {
  postId: string
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null)

  // Comments state
  const commentsState = useAsyncState<Comment[]>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load comments function
  const loadComments = () => {
    commentsState.execute(() =>
      getComments({ postId, flat: true }).then(response => response.data?.hits as Comment[]),
    )
  }

  // Load comments
  useEffect(() => {
    loadComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const commentTree = commentsState.state.data ? buildCommentTree(commentsState.state.data) : []
  const totalComments = getCommentCount(commentTree)

  const handleReply = (parentId: string) => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để trả lời bình luận')
      return
    }

    // Find the comment to reply to
    const findCommentById = (comments: Comment[], id: string): Comment | null => {
      for (const comment of comments) {
        if (comment.id === id) return comment
      }
      return null
    }

    const parentComment = findCommentById(commentsState.state.data || [], parentId)
    if (parentComment) {
      setReplyTo({
        id: parentComment.id || '',
        name: parentComment.author?.fullName || 'Người dùng ẩn danh',
      })

      // Scroll to comment form
      const commentForm = document.getElementById('comment-form')
      if (commentForm) {
        commentForm.scrollIntoView({ behavior: 'smooth' })
        // Focus on textarea after scrolling
        setTimeout(() => {
          const textarea = commentForm.querySelector('textarea')
          if (textarea) {
            textarea.focus()
          }
        }, 500)
      }
    }
  }

  const handleLogin = () => {
    navigate(`${RouteConfig.LoginPage.path}?postId=${postId}`)
  }

  const handleRegister = () => {
    navigate(`${RouteConfig.RegisterPage.path}?postId=${postId}`)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để bình luận')
      return
    }
    if (!comment.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      const commentData = {
        content: comment.trim(),
        postId,
        ...(replyTo && { parentId: replyTo.id }),
      }

      await createComment(commentData)

      // Clear form
      setComment('')
      setReplyTo(null)

      // Reload comments to show the new comment
      loadComments()
    } catch (error) {
      console.error('Error creating comment:', error)
      alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      // Check conditions before submitting
      if (!isAuthenticated) {
        alert('Vui lòng đăng nhập để bình luận')
        return
      }
      if (!comment.trim()) {
        return
      }

      setIsSubmitting(true)
      try {
        const commentData = {
          content: comment.trim(),
          postId,
          ...(replyTo && { parentId: replyTo.id }),
        }

        await createComment(commentData)

        // Clear form
        setComment('')
        setReplyTo(null)

        // Reload comments to show the new comment
        loadComments()
      } catch (error) {
        console.error('Error creating comment:', error)
        alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const removeReplyTag = () => {
    setReplyTo(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Comment Form */}
      <Card>
        <div className="p-8" id="comment-form">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Bình luận</h3>

          {!isAuthenticated ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Vui lòng đăng nhập để bình luận
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleLogin()}
                      className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => handleRegister()}
                      className="rounded bg-yellow-800 px-3 py-1 text-sm text-white hover:bg-yellow-900"
                    >
                      Đăng ký
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitComment} className="space-y-4">
              {/* Reply Tag */}
              {replyTo && (
                <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  <span className="text-sm text-blue-700">
                    Đang trả lời <strong>{replyTo.name}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={removeReplyTag}
                    className="ml-auto text-blue-600 hover:text-blue-800"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmitting}
                  placeholder={replyTo ? `Trả lời ${replyTo.name}...` : 'Viết bình luận của bạn...'}
                  className="focus:border-primary-500 focus:ring-primary-500 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-100"
                  rows={4}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Nhấn Enter để gửi, Shift + Enter để xuống dòng
                </p>
              </div>
              <div className="flex justify-end gap-2">
                {replyTo && (
                  <button
                    type="button"
                    onClick={removeReplyTag}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Hủy trả lời
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!comment.trim() || isSubmitting}
                  className="bg-primary-6 hover:bg-primary-7 focus:ring-primary-5 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Đang gửi...' : replyTo ? 'Trả lời' : 'Gửi bình luận'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Card>

      {/* Existing Comments */}
      <Card>
        <div className="p-8">
          <h4 className="mb-6 font-semibold text-gray-900">Các bình luận ({totalComments})</h4>

          <AsyncLoading loading={commentsState.state.loading} type="skeleton">
            {commentTree.length > 0 ? (
              <div className="space-y-0">
                {commentTree.map(comment => (
                  <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p>Chưa có bình luận nào.</p>
                {!isAuthenticated && (
                  <p className="mt-1 text-sm">Hãy là người đầu tiên bình luận!</p>
                )}
              </div>
            )}
          </AsyncLoading>
        </div>
      </Card>
    </div>
  )
}

export default CommentSection
