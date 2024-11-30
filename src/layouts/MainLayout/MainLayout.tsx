import Header from '@/components/Header';
import ScrollTopButton from '@/components/ScrollTopButton';
import useScrollToTop from '@/hooks/useScrollToTop';
import React from 'react';
import { Outlet } from 'react-router-dom';

const DefaultLayout: React.FC = () => {
  useScrollToTop();

  return (
    <div className='DefaultLayout'>
      <Header />
      <main className='tw-mt-[60px]'>
        <Outlet />
      </main>
      <ScrollTopButton />
      {/* <Footer /> */}
    </div>
  );
};

export default DefaultLayout;
