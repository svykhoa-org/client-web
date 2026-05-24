import type { Comment } from '@/models/Comment'

export interface CommentNode extends Comment {
  children: CommentNode[]
  level: number
}

/**
 * Build a comment tree from flat list of comments
 * @param comments - Flat array of comments
 * @returns Array of root comment nodes with nested children
 */
export const buildCommentTree = (comments: Comment[]): CommentNode[] => {
  // Create a map for quick lookup
  const commentMap = new Map<string, CommentNode>()
  const rootComments: CommentNode[] = []

  // First pass: create all comment nodes
  comments.forEach(comment => {
    commentMap.set(comment?.id || '', {
      ...comment,
      children: [],
      level: 0,
    })
  })

  // Second pass: build the tree structure
  comments.forEach(comment => {
    const commentNode = commentMap.get(comment?.id || '')
    if (!commentNode) return

    if (comment.parentId) {
      // This is a child comment
      const parentNode = commentMap.get(comment.parentId)
      if (parentNode) {
        commentNode.level = parentNode.level + 1
        parentNode.children.push(commentNode)
      } else {
        // Parent not found, treat as root comment
        rootComments.push(commentNode)
      }
    } else {
      // This is a root comment
      rootComments.push(commentNode)
    }
  })

  // Sort comments by creation date (newest first for root, oldest first for replies)
  const sortComments = (comments: CommentNode[]) => {
    comments.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      // For root comments, show newest first
      if (a.level === 0 && b.level === 0) {
        return dateB - dateA
      }
      // For replies, show oldest first
      return dateA - dateB
    })

    comments.forEach(comment => {
      if (comment.children.length > 0) {
        sortComments(comment.children)
      }
    })
  }

  sortComments(rootComments)

  return rootComments
}

/**
 * Get total count of comments including nested replies
 * @param comments - Array of comment nodes
 * @returns Total comment count
 */
export const getCommentCount = (comments: CommentNode[]): number => {
  let count = 0

  const countRecursive = (nodes: CommentNode[]) => {
    nodes.forEach(node => {
      count++
      if (node.children.length > 0) {
        countRecursive(node.children)
      }
    })
  }

  countRecursive(comments)
  return count
}
