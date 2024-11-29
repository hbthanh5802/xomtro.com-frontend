import useUrl from '@/hooks/useUrl.hook';
import BlankLayout from '@/layouts/BlankLayout';
import MainLayout from '@/layouts/MainLayout';
import AuthPage from '@/pages/AuthPage';
import ForbiddenPage from '@/pages/ForbiddenPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import HomePage from '@/pages/HomePage';
import JoinSearch from '@/pages/HomePage/components/JoinSearch';
import PassSearch from '@/pages/HomePage/components/PassSearch';
import RentalSearch from '@/pages/HomePage/components/RentalSearch';
import WantedSearch from '@/pages/HomePage/components/WantedSearch';
import LoginPage from '@/pages/LoginPage';
import JoinPostPage from '@/pages/PostPage/JoinPostPage';
import PassPostPage from '@/pages/PostPage/PassPostPage';
import PostPageWrapper from '@/pages/PostPage/PostPageWrapper';
import RentalPostPage from '@/pages/PostPage/RentalPostPage';
import WantedPostPage from '@/pages/PostPage/WantedPostPage';
import RolePage from '@/pages/RolePage';
import SearchPage from '@/pages/SearchPage';
import UserPage from '@/pages/UserPage';
import AddressPage from '@/pages/UserPage/components/AddressPage';
import SettingPage from '@/pages/UserPage/components/SettingPage';
import ProfilePage from '@/pages/UserPage/components/UserPostPage';
import VerifyPage from '@/pages/VerifyPage';
import React, { lazy } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

const NotFountPage = lazy(() => import('@/pages/NotFoundPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));

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
      element: <BlankLayout></BlankLayout>,
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
          ],
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
            { path: 'wanted', element: <WantedSearch /> },
            { path: 'rental', element: <RentalSearch /> },
            { path: 'pass', element: <PassSearch /> },
            { path: 'join', element: <JoinSearch /> },
          ],
        },
        {
          path: '/search',
          element: <SearchPage />,
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
