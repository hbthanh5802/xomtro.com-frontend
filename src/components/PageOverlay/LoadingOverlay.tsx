import { useAppStore } from '@/store/store';
import history from '@/utils/history.helper';
import { Button } from '@mui/joy';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
// Icons
import LogoIcon from '@/assets/LogoIcon';
import Account from '@/components/Header/Account';
import React from 'react';

const LoadingOverlay = () => {
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      fetchUserAvatar: state.fetchUserAvatar,
    })),
  );
  return (
    <React.Fragment>
      <div className='background-pattern'>
        <header className='tw-sticky tw-top-0 tw-inset-x-0 red tw-z-[999]'>
          <div className='tw-w-screen tw-p-[12px] tw-px-[24px] tw-flex tw-justify-between tw-items-center'>
            {/* Logo */}
            <Link
              to={'/home/rental'}
              className='tw-mr-[24px] tw-font-writing tw-flex-1 tw-flex tw-items-center tw-gap-2 tw-select-none'
            >
              {/* <IconButton variant='soft' color='primary' size='md'> */}
              <LogoIcon size={32} />
              {/* <LogoIcon2 width={32} height={32} /> */}
              {/* </IconButton> */}
              <div className='tw-hidden tablet:tw-inline-block tw-font-writing tw-text-[24px] tw-primary-gradient-lightest tw-gradient-text'>
                Xóm trọ
              </div>
            </Link>
            {/* Search */}

            {currentUser ? (
              <div className='tw-gap-[12px] tw-flex-1 tw-flex tw-justify-end tw-text-right tw-items-center'>
                <Account />
              </div>
            ) : (
              <div className='tw-flex tw-flex-wrap tw-gap-[8px] tw-flex-1 tw-text-right tw-self-end tw-justify-end'>
                <Button onClick={() => history.push('/auth/login')} variant='soft' size='md' className='tw-ml-auto'>
                  Đăng nhập
                </Button>
                <Button
                  sx={(theme) => ({
                    [theme.breakpoints.down('md')]: {
                      display: 'none',
                    },
                  })}
                  onClick={() => history.push('/auth/register')}
                  size='md'
                >
                  Đăng ký
                </Button>
              </div>
            )}
          </div>
        </header>
        <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-screen tw-h-screen tw-gap-12 tw-py-8'>
          <div className='tw-text-white tw-text-center tw-pb-[200px] tw-space-y-4'>
            <div className='tw-flex tw-w-full tw-justify-center tw-animate-fade-left tw-animate-duration-500 tw-animate-delay-0 tw-animate-normal'>
              <LogoIcon size={48} />
            </div>
            {/* <p className='tw-bg-clip-text tw-text-transparent tw-bg-gradient-to-r tw-from-primaryColor tw-to-70% tw-to-orange-200 tw-text-[48px] tablet:tw-text-[50px] laptop:tw-text-[100px] tw-font-writing tw-animate-fade-left tw-animate-duration-500 tw-animate-delay-0 tw-animate-normal'>
              Vui lòng chờ...
            </p> */}
            <p className='tw-bg-clip-text tw-text-transparent tw-bg-gradient-to-r tw-from-orange-200 tw-to-70% tw-to-primaryColor tw-text-[24px] tablet:tw-text-[32px] laptop:tw-text-[48px] tw-font-medium tw-font-writing tw-animate-fade-right tw-animate-duration-500 tw-animate-delay-100 tw-animate-normal'>
              Xóm Trọ
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoadingOverlay;
