import LogoIcon from '@/assets/LogoIcon';
import SearchBar from '@/components/Header/SearchBar';
import { useAppStore } from '@/store/store';
import history from '@/utils/history.helper';
import { Button, IconButton, Typography } from '@mui/joy';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
// Icons
import Account from '@/components/Header/Account';

const Header = () => {
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      fetchUserAvatar: state.fetchUserAvatar,
    })),
  );

  return (
    <header
      className='tw-sticky tw-top-0 tw-inset-x-0 red tw-z-[999] tw-shadow-sm
     tw-border-b-[1px] tw-border-b-slate-100'
    >
      <div className='tw-w-screen tw-p-[12px] tw-px-[24px] tw-bg-white tw-flex tw-justify-between tw-items-center'>
        {/* Logo */}
        <Link to={'/'} className='tw-mr-[24px] tw-flex-1 tw-flex tw-items-center tw-gap-2 tw-select-none'>
          <IconButton variant='soft' color='primary' size='md' sx={{ boxShadow: 'sx' }}>
            <LogoIcon width='22px' color='#185EA5' />
          </IconButton>
          <Typography level='h4' textColor={'primary.600'}>
            Xóm trọ
          </Typography>
        </Link>
        {/* Search */}

        <div className='tw-flex-[2]'>
          <SearchBar />
        </div>

        {currentUser ? (
          <div className='tw-gap-[12px] tw-flex-1 tw-flex tw-justify-end tw-text-right tw-items-center'>
            <Account />
          </div>
        ) : (
          <div className='tw-flex tw-gap-[8px] tw-flex-1 tw-text-right tw-self-end tw-justify-end'>
            <Button onClick={() => history.push('/auth/login')} size='md' className='tw-ml-auto'>
              Đăng nhập
            </Button>
            <Button onClick={() => history.push('/auth/register')} variant='plain' size='md'>
              Đăng ký
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
