import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const DefaultLayout: React.FC = () => {
  return (
    <div className='DefaultLayout'>
      <Header />
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default DefaultLayout;
