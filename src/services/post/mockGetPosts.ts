import type { ListResponseData, SuccessResponse } from '@/common/interface/ServiceResponse'
import { allMockPosts } from '@/mocks/mockPosts'
import type { Post } from '@/models/Post'

export interface GetPostsParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  author?: string
}

export type GetPostsResponse = ListResponseData<Post>

export const getPosts = async (
  params: GetPostsParams = {},
): Promise<SuccessResponse<GetPostsResponse>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  const { page = 1, limit = 10, category, search, author } = params

  // Filter posts based on parameters
  let filteredPosts = [...allMockPosts]

  // Filter by category
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.categoryId === category)
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower)),
    )
  }

  // Filter by author
  if (author) {
    filteredPosts = filteredPosts.filter(post => post.authorId === author)
  }

  // Calculate pagination
  const total = filteredPosts.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  const response: SuccessResponse<GetPostsResponse> = {
    statusCode: 200,
    message: 'Posts retrieved successfully',
    data: {
      hits: paginatedPosts,
      metadata: {
        total,
        page,
        limit,
        totalPages,
      },
    },
    timestamp: new Date().toISOString(),
  }

  return response
}

export const getPostById = async (id: string): Promise<SuccessResponse<Post>> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const post = allMockPosts.find(p => p.id === id)

  if (!post) {
    throw new Error('Post not found')
  }

  return {
    statusCode: 200,
    message: 'Post retrieved successfully',
    data: post,
    timestamp: new Date().toISOString(),
  }
}
