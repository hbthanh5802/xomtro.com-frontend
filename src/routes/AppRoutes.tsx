import useUrl from '@/hooks/useUrl.hook';
import BlankLayout from '@/layouts/BlankLayout';
import MainLayout from '@/layouts/MainLayout';
import AuthPage from '@/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import { default as JoinHome } from '@/pages/HomePage/components/JoinHome';
import { default as PassHome } from '@/pages/HomePage/components/PassHome';
import { default as RentalHome } from '@/pages/HomePage/components/RentalHome';
import { default as WantedHome } from '@/pages/HomePage/components/WantedHome';
import React, { lazy } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

const NotFountPage = lazy(() => import('@/pages/NotFoundPage'));
const AboutUsPage = lazy(() => import('@/pages/AboutUsPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const VerifyPage = lazy(() => import('@/pages/VerifyPage'));
const RolePage = lazy(() => import('@/pages/RolePage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

const SettingPage = lazy(() => import('@/pages/UserPage/components/SettingPage'));
const UserPage = lazy(() => import('@/pages/UserPage'));
const ProfilePage = lazy(() => import('@/pages/UserPage/components/UserPostPage'));
const InterestedPosts = lazy(() => import('@/pages/UserPage/components/InterestedPosts'));
const AddressPage = lazy(() => import('@/pages/UserPage/components/AddressPage'));

const JoinPostPage = lazy(() => import('@/pages/PostPage/JoinPostPage'));
const PassPostPage = lazy(() => import('@/pages/PostPage/PassPostPage'));
const PostPageWrapper = lazy(() => import('@/pages/PostPage/PostPageWrapper'));
const RentalPostPage = lazy(() => import('@/pages/PostPage/RentalPostPage'));
const WantedPostPage = lazy(() => import('@/pages/PostPage/WantedPostPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ViewPostDetailPage = lazy(() => import('@/pages/ViewPostDetailPage'));

const ConversationPage = lazy(() => import('@/pages/ConversationPage'));

const AppRoutes: React.FC = () => {
  const { pathname } = useUrl();
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if (pathname === '/' || pathname === '/home') {
      navigate('/home/rental');
    }
  }, [pathname, navigate]);

  const routes = useRoutes([
    {
      path: '/auth',
      element: <BlankLayout />,
      children: [
        {
          path: 'register',
          element: (
            <AuthPage>
              <RegisterPage />
            </AuthPage>
          ),
        },
        {
          path: 'login',
          element: (
            <AuthPage>
              <LoginPage />
            </AuthPage>
          ),
        },
        {
          path: 'verify',
          element: (
            <AuthPage>
              <VerifyPage />
            </AuthPage>
          ),
        },
        {
          path: 'role',
          element: (
            <AuthPage>
              <RolePage />
            </AuthPage>
          ),
        },
        {
          path: 'forgot-password',
          element: (
            <AuthPage>
              <ForgotPasswordPage />
            </AuthPage>
          ),
        },
      ],
    },
    {
      element: <MainLayout />,
      children: [
        {
          path: 'users/:userId',
          element: <UserPage />,
          children: [
            { path: 'profile', element: <ProfilePage /> },
            { path: 'settings', element: <SettingPage /> },
            { path: 'addresses', element: <AddressPage /> },
            { path: 'interested', element: <InterestedPosts /> },
          ],
        },
        {
          path: 'posts/:postId/view',
          element: <ViewPostDetailPage />,
        },
        {
          path: 'posts',
          element: <PostPageWrapper />,
          children: [
            { path: 'rental/:mode', element: <RentalPostPage /> },
            { path: 'wanted/:mode', element: <WantedPostPage /> },
            { path: 'join/:mode', element: <JoinPostPage /> },
            { path: 'pass/:mode', element: <PassPostPage /> },
          ],
        },
        {
          path: '/home',
          element: <HomePage />,
          children: [
            { path: 'wanted', element: <WantedHome /> },
            { path: 'rental', element: <RentalHome /> },
            { path: 'pass', element: <PassHome /> },
            { path: 'join', element: <JoinHome /> },
          ],
        },
        {
          path: '/search',
          element: <SearchPage />,
        },
        {
          path: '/conversations/:conversationId',
          element: <ConversationPage />,
        },
        {
          path: '/about-us',
          element: <AboutUsPage />,
        },
      ],
    },
    {
      path: '/403',
      element: <ForbiddenPage />,
    },
    {
      path: '*',
      element: <NotFountPage />,
    },
  ]);

  return routes;
};

export default AppRoutes;
