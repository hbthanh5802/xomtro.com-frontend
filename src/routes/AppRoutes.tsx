import BlankLayout from '@/layouts/BlankLayout';
import MainLayout from '@/layouts/MainLayout';
import AuthPage from '@/pages/AuthPage';
import ForbiddenPage from '@/pages/ForbiddenPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RolePage from '@/pages/RolePage';
import UserPage from '@/pages/UserPage';
import AddressPage from '@/pages/UserPage/components/AddressPage';
import ProfilePage from '@/pages/UserPage/components/ProfilePage';
import SettingPage from '@/pages/UserPage/components/SettingPage';
import VerifyPage from '@/pages/VerifyPage';
import React, { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const NotFountPage = lazy(() => import('@/pages/NotFoundPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));

const AppRoutes: React.FC = () => {
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
        { path: '/', element: <HomePage /> },
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
