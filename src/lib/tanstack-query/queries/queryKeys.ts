/**
 * Query keys cho TanStack Query
 * Pattern: [entity, action/filter, ...params]
 */

export const queryKeys = {
  // Courses
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.courses.lists(), filters] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    available: (filters: Record<string, unknown>) =>
      [...queryKeys.courses.all, 'available', filters] as const,
    upcoming: (filters: Record<string, unknown>) =>
      [...queryKeys.courses.all, 'upcoming', filters] as const,
    hot: () => [...queryKeys.courses.all, 'hot'] as const,
  },

  // Lessons
  lessons: {
    all: ['lessons'] as const,
    details: () => [...queryKeys.lessons.all, 'detail'] as const,
    detail: (courseId: string, lessonId: string) =>
      [...queryKeys.lessons.details(), courseId, lessonId] as const,
  },

  // LessonProgress
  lessonProgress: {
    all: ['lesson-progress'] as const,
    learning: (lessonId: string) =>
      [...queryKeys.lessonProgress.all, 'learning', lessonId] as const,
    progressMap: (enrollmentId: string) =>
      [...queryKeys.lessonProgress.all, 'progressMap', enrollmentId] as const,
  },

  // LessonNotes
  lessonNotes: {
    all: ['lesson-notes'] as const,
    list: (lessonId: string) => [...queryKeys.lessonNotes.all, 'list', lessonId] as const,
  },

  // // Posts
  // posts: {
  //   all: ['posts'] as const,
  //   lists: () => [...queryKeys.posts.all, 'list'] as const,
  //   list: (filters: Record<string, unknown>) => [...queryKeys.posts.lists(), filters] as const,
  //   details: () => [...queryKeys.posts.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  // },

  // // Articles
  // articles: {
  //   all: ['articles'] as const,
  //   lists: () => [...queryKeys.articles.all, 'list'] as const,
  //   list: (filters: Record<string, unknown>) => [...queryKeys.articles.lists(), filters] as const,
  //   details: () => [...queryKeys.articles.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.articles.details(), id] as const,
  // },

  // // Documents
  // documents: {
  //   all: ['documents'] as const,
  //   lists: () => [...queryKeys.documents.all, 'list'] as const,
  //   list: (filters: Record<string, unknown>) => [...queryKeys.documents.lists(), filters] as const,
  //   details: () => [...queryKeys.documents.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.documents.details(), id] as const,
  // },

  // // User
  // user: {
  //   all: ['user'] as const,
  //   profile: () => [...queryKeys.user.all, 'profile'] as const,
  //   enrollments: () => [...queryKeys.user.all, 'enrollments'] as const,
  // },

  // // Categories
  // categories: {
  //   all: ['categories'] as const,
  //   lists: () => [...queryKeys.categories.all, 'list'] as const,
  //   list: (filters: Record<string, unknown>) => [...queryKeys.categories.lists(), filters] as const,
  // },

  // // Comments
  // comments: {
  //   all: ['comments'] as const,
  //   lists: () => [...queryKeys.comments.all, 'list'] as const,
  //   list: (postId: string) => [...queryKeys.comments.lists(), postId] as const,
  // },
} as const
