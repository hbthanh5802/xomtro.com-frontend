import Header from '@/components/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const DefaultLayout: React.FC = () => {
  return (
    <div className='DefaultLayout'>
      <Header />
      <main className='tw-mt-[60px]'>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default DefaultLayout;
