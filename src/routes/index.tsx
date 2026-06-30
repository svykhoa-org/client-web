import { createBrowserRouter } from 'react-router'

import RouteConfig from '@/constants/RouteConfig'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import { CourseLearningPage } from '@/pages/authentication/CourseLearningPage/CourseLearningPage'
import { DetailCoursePage } from '@/pages/authentication/CoursePage/DetailCoursePage'
import { ListCoursePage } from '@/pages/authentication/CoursePage/ListCoursePage'
// import { CoursePlayerPage } from '@/pages/authentication/CoursePlayerPage/CoursePlayerPage';
import CreatePostPage from '@/pages/authentication/CreatePostPage'
import { HomePage } from '@/pages/authentication/HomePage/HomePage'
import { MedicalSearchPage } from '@/pages/authentication/MedicalSearchPage/MedicalSearchPage'
import { MyCoursesPage } from '@/pages/authentication/MyCoursesPage/MyCoursesPage'
import { OrderCancelPage } from '@/pages/authentication/OrderPage/OrderCancelPage'
import { OrderErrorPage } from '@/pages/authentication/OrderPage/OrderErrorPage'
import { OrderSuccessPage } from '@/pages/authentication/OrderPage/OrderSuccessPage'
import { PaymentResultPage, PaymentTestPage } from '@/pages/authentication/PaymentTestPage'
import ProfilePage from '@/pages/authentication/ProfilePage'
import AboutPage from '@/pages/unauthentication/AboutPage'
import ArticleDetailPage from '@/pages/unauthentication/ArticleDetailPage'
import BulletinDetailPage from '@/pages/unauthentication/BulletinDetailPage'
// import { CoursePlayerPage } from '@/pages/unauthentication/CoursePlayerPage';
import FeaturedUserDetailPage from '@/pages/unauthentication/FeaturedUserDetailPage'
import FeaturedUsersPage from '@/pages/unauthentication/FeaturedUsersPage'
import { ForumPage } from '@/pages/unauthentication/ForumPage'
import { SubCategoryPage } from '@/pages/unauthentication/SubCategoryPage'
import { JobDetailPage } from '@/pages/unauthentication/JobPage/JobDetailPage'
import { JobListPage } from '@/pages/unauthentication/JobPage/JobListPage'
import { ForgotPasswordPage } from '@/pages/unauthentication/ForgotPasswordPage/ForgotPasswordPage'
import { LoginPage } from '@/pages/unauthentication/LoginPage/LoginPage'
import { NotFound } from '@/pages/unauthentication/NotFound/NotFound'
import PostDetailPage from '@/pages/unauthentication/PostDetailPage'
import PostsPage from '@/pages/unauthentication/PostsPage'
import RegisterPage from '@/pages/unauthentication/RegisterPage'
import { ResetPasswordPage } from '@/pages/unauthentication/ResetPasswordPage/ResetPasswordPage'
import { VerifyEmailPage } from '@/pages/unauthentication/VerifyEmailPage/VerifyEmailPage'
import { ComponentsPage } from '@/pages/public/ComponentsPage/ComponentsPage'

import { PublicPath, PublicRoute } from './PublicRoute'

// import ResourceListPage from '@/pages/unauthentication/ResourceListPage';

const router = createBrowserRouter([
  // STATUS
  {
    path: RouteConfig.NotFoundPage.path,
    element: <NotFound />,
  },
  // END STATUS

  {
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: RouteConfig.LoginPage.path,
        element: <LoginPage />,
      },
      {
        path: RouteConfig.RegisterPage.path,
        element: <RegisterPage />,
      },
      {
        path: RouteConfig.VerifyEmailPage.path,
        element: <VerifyEmailPage />,
      },
      {
        path: RouteConfig.ForgotPasswordPage.path,
        element: <ForgotPasswordPage />,
      },
      {
        path: RouteConfig.ResetPasswordPage.path,
        element: <ResetPasswordPage />,
      },
    ],
  },

  {
    path: RouteConfig.HomePage.path,
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: RouteConfig.PostsPage.path,
        element: <PostsPage />,
      },
      {
        path: RouteConfig.PostDetailPage.path,
        element: <PostDetailPage />,
      },
      {
        path: RouteConfig.CreatePostPage.path,
        element: <CreatePostPage />,
      },
      {
        path: RouteConfig.ProfilePage.path,
        element: <ProfilePage />,
      },
      {
        path: RouteConfig.FeaturedUsersPage.path,
        element: <FeaturedUsersPage />,
      },
      {
        path: RouteConfig.FeaturedUserDetailPage.path,
        element: <FeaturedUserDetailPage />,
      },
      // {
      //   path: RouteConfig.ResourceListPage.path,
      //   element: <ResourceListPage />,
      // },
      // {
      //   path: RouteConfig.ResourceDetailPage.path,
      //   element: <ResourceDetailPage />,
      // },
      {
        path: '/posts',
        element: <PostsPage />,
      },
      {
        path: RouteConfig.MedicalSearchPage.path,
        element: <MedicalSearchPage />,
      },
      {
        path: '/components',
        element: <ComponentsPage />,
      },
      {
        path: '/payment-test',
        element: <PaymentTestPage />,
      },
      {
        path: '/payment-test/result/:orderId',
        element: <PaymentResultPage />,
      },
      {
        path: RouteConfig.ArticleDetailPage.path,
        element: <ArticleDetailPage />,
      },
      {
        path: RouteConfig.BulletinDetailPage.path,
        element: <BulletinDetailPage />,
      },
      {
        path: RouteConfig.ForumPage.path,
        element: <ForumPage />,
      },
      {
        path: RouteConfig.ForumSubCategoryPage.path,
        element: <SubCategoryPage />,
      },

      // Tuyển dụng
      {
        path: RouteConfig.JobListPage.path,
        element: <JobListPage />,
      },
      {
        path: RouteConfig.JobDetailPage.path,
        element: <JobDetailPage />,
      },

      // E-Learning

      // Course - Trang danh sách khóa học
      {
        path: RouteConfig.CoursePage.path,
        element: <ListCoursePage />,
      },
      {
        path: RouteConfig.MyCoursesPage.path,
        element: <MyCoursesPage />,
      },

      // Detail Course
      {
        path: RouteConfig.CourseDetailPage.path,
        element: <DetailCoursePage />,
      },

      // Course Learning - Trang xem bài học trong khóa học
      {
        path: RouteConfig.CourseLearningPage.path,
        element: <CourseLearningPage />,
      },

      // Order Payment Results
      {
        path: RouteConfig.OrderSuccessPage.path,
        element: <OrderSuccessPage />,
      },
      {
        path: RouteConfig.OrderCancelPage.path,
        element: <OrderCancelPage />,
      },
      {
        path: RouteConfig.OrderErrorPage.path,
        element: <OrderErrorPage />,
      },

      ...PublicRoute,
    ],
  },
])

export const RoutePath = {
  ...PublicPath,
}

export default router
