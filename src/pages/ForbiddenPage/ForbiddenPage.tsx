import { useAppStore } from '@/store/store';
import history from '@/utils/history.helper';
import { Button, Typography } from '@mui/joy';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
// Icons
import LogoIcon from '@/assets/LogoIcon';
import Account from '@/components/Header/Account';
import React from 'react';

const ForbiddenPage = () => {
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      fetchUserAvatar: state.fetchUserAvatar,
    })),
  );
  return (
    <React.Fragment>
      <header className='tw-sticky tw-top-0 tw-inset-x-0 red tw-z-[999]'>
        <div className='tw-w-screen tw-p-[12px] tw-px-[24px] tw-bg-primaryColor tw-flex tw-justify-between tw-items-center'>
          {/* Logo */}
          <Link to={'/home/rental'} className='tw-mr-[24px] tw-flex-1 tw-flex tw-items-center tw-gap-2 tw-select-none'>
            {/* <IconButton variant='soft' color='primary' size='md'> */}
            <LogoIcon size={32} />
            {/* <LogoIcon2 width={32} height={32} /> */}
            {/* </IconButton> */}
            <div className='tw-hidden tw-font-writing tablet:tw-inline-block'>
              <Typography level='h4' textColor='primary.100'>
                Xóm trọ
              </Typography>
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
      <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-screen tw-h-screen tw-gap-12 tw-py-8 tw-bg-primaryColor'>
        <div className='tw-text-white tw-text-center tw-pb-[200px] tw-space-y-2'>
          <p className='tw-bg-clip-text tw-text-transparent tw-bg-gradient-to-r tw-from-slate-200/0 tw-to-70% tw-to-orange-200 tw-text-[64px] tablet:tw-text-[100px] laptop:tw-text-[200px] tw-animate-fade-left tw-animate-duration-500 tw-animate-delay-0 tw-animate-normal'>
            403
          </p>
          <p className='tw-bg-clip-text tw-text-transparent tw-bg-gradient-to-r tw-from-orange-200 tw-to-70% tw-to-slate-200/50 tw-text-[24px] tablet:tw-text-[32px] laptop:tw-text-[48px] tw-font-semibold tw-animate-fade-right tw-animate-duration-500 tw-animate-delay-100 tw-animate-normal'>
            Bạn không được phép truy cập vào trang này!
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ForbiddenPage;
