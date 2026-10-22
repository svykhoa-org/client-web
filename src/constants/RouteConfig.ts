const RouteConfig = {
  // STATUS
  NotFoundPage: {
    path: '/404',
  },
  // END STATUS

  // AUTH
  LoginPage: {
    path: '/login',
  },
  RegisterPage: {
    path: '/register',
  },
  VerifyEmailPage: {
    path: '/verify-email',
  },
  ForgotPasswordPage: {
    path: '/forgot-password',
  },
  ResetPasswordPage: {
    path: '/reset-password',
  },
  // END AUTH

  HomePage: {
    path: '/',
  },
  PostsPage: {
    path: '/posts',
  },
  PostDetailPage: {
    path: '/post/:id',
  },
  AuthPage: {
    path: '/auth',
  },
  CreatePostPage: {
    path: '/post/create',
  },
  ProfilePage: {
    path: '/profile',
  },
  FeaturedUsersPage: {
    path: '/featured-users',
  },
  FeaturedUserDetailPage: {
    path: '/featured-user/:id',
  },
  PublicProfilePage: {
    path: '/u/:id',
    getPath: (id: string) => `/u/${id}`,
  },
  ELearningPage: {
    path: '/e-learning',
  },
  CourseDetailPage: {
    path: '/courses/:id',
    getPath: (id: string) => `/courses/${id}`,
  },
  CoursePlayerPage: {
    path: '/course-player/:id',
  },
  MedicalSearchPage: {
    path: '/search',
  },
  LibraryPage: {
    path: '/library',
  },
  ArticleListPage: {
    path: '/articles',
  },
  ArticleDetailPage: {
    path: '/article/:slug',
  },
  BulletinListPage: {
    path: '/bulletins',
  },
  BulletinDetailPage: {
    path: '/bulletin/:slug',
  },
  ForumPage: {
    path: '/forum',
  },
  ForumSearchPage: {
    path: '/forum/search',
  },
  ForumSubCategoryPage: {
    path: '/forum/sub-categories/:id',
  },
  ForumThreadDetailPage: {
    path: '/forum/threads/:id',
  },
  CreateThreadPage: {
    path: '/forum/threads/create',
  },
  // Tuyển dụng
  JobListPage: {
    path: '/jobs',
  },
  JobDetailPage: {
    path: '/job/:id',
  },

  // E-Learning

  // Course
  CoursePage: {
    path: '/courses',
  },
  MyCoursesPage: {
    path: '/my-courses',
  },

  // Course Learning
  CourseLearningPage: {
    path: '/course/:courseId/learning/:lessonId',
    getPath: (courseId: string, lessonId: string) => {
      return `/course/${courseId}/learning/${lessonId}`
    },
    paramKey: {
      courseId: 'courseId',
      lessonId: 'lessonId',
    },
  },
  // Order Pages
  OrderSuccessPage: {
    path: '/order/success',
  },
  OrderCancelPage: {
    path: '/order/cancel',
  },
  OrderErrorPage: {
    path: '/order/error',
  },
}

export default RouteConfig
