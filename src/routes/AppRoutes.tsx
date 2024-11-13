import BlankLayout from '@/layouts/BlankLayout';
import MainLayout from '@/layouts/MainLayout';
import AuthPage from '@/pages/AuthPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RolePage from '@/pages/RolePage';
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
      children: [{ path: '/', element: <HomePage /> }],
    },
    {
      path: '*',
      element: <NotFountPage />,
    },
  ]);

  return routes;
};

export default AppRoutes;
