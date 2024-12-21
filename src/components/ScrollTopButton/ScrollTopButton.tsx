import React from 'react';
import { IoArrowUpOutline } from 'react-icons/io5';

const ScrollTopButton = () => {
  const [visible, setVisible] = React.useState(true);

  const toggleVisibility = React.useCallback(() => {
    const scrollY = window.scrollY;
    const threshold = document.documentElement.scrollHeight / 3;
    setVisible(scrollY > threshold);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  React.useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
    <>
      <div className='tw-fixed tw-z-[99999] tw-bottom-6 tw-right-6'>
        {visible && (
          <button
            className='tw-group tw-flex tw-justify-center tw-items-center tw-outline-none tw-size-[40px] tw-rounded-full tw-bg-black hover:tw-bg-primaryColor tw-duration-150 tw-shadow-xl tw-animate-fade tw-animate-duration-250'
            onClick={scrollToTop}
          >
            <IoArrowUpOutline className='tw-text-white tw-text-[24px] tw-duration-150 group-hover:tw-translate-y-2' />
          </button>
        )}
      </div>
    </>
  );
};

export default ScrollTopButton;
