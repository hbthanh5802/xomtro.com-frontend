import BlankLayout from '@/layouts/BlankLayout';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import React, { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const NotFountPage = lazy(() => import('@/pages/NotFoundPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));

const AppRoutes: React.FC = () => {
  const routes = useRoutes([
    {
      element: <MainLayout />,
      children: [{ path: '/', element: <HomePage /> }],
    },
    {
      element: <BlankLayout />,
      children: [{ path: 'register', element: <RegisterPage /> }],
    },
    {
      path: '*',
      element: <NotFountPage />,
    },
  ]);

  return routes;
};

export default AppRoutes;
