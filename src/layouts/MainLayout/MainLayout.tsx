import Header from '@/components/Header';
import ScrollTopButton from '@/components/ScrollTopButton';
import useScrollToTop from '@/hooks/useScrollToTop';
import useUrl from '@/hooks/useUrl.hook';
import React from 'react';
import { Outlet } from 'react-router-dom';

const DefaultLayout: React.FC = () => {
  const { pathname } = useUrl();
  useScrollToTop();

  const showScrollButton = !pathname.startsWith('/conversations') && !pathname.startsWith('/home');

  return (
    <div className='DefaultLayout'>
      <Header />
      <main className='tw-mt-[60px]'>
        <Outlet />
      </main>
      {showScrollButton && <ScrollTopButton />}
      {/* <Footer /> */}
    </div>
  );
};

export default DefaultLayout;
