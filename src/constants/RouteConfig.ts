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
  ELearningPage: {
    path: '/e-learning',
  },
  CourseDetailPage: {
    path: '/courses/:id',
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
  ArticleDetailPage: {
    path: '/article/:slug',
  },
  BulletinDetailPage: {
    path: '/bulletin/:slug',
  },
  ForumPage: {
    path: '/forum',
  },
  ForumSubCategoryPage: {
    path: '/forum/sub-categories/:id',
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
