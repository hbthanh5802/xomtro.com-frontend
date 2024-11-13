import LogoIcon from '@/assets/LogoIcon';
import SearchBar from '@/components/Header/SearchBar';
import history from '@/utils/history.helper';
import { Button, IconButton, Typography } from '@mui/joy';
import { Link } from 'react-router-dom';

const Header = () => {
  // const navigator = useNavigate();
  return (
    <header className='tw-sticky tw-top-0 tw-inset-x-0 red'>
      <div className='tw-w-screen tw-p-[12px] tw-px-[24px] tw-bg-white tw-flex tw-justify-between tw-items-center'>
        {/* Logo */}
        <Link to={'/'} className='tw-mr-[24px] tw-flex-1 tw-flex tw-items-center tw-gap-2 tw-select-none'>
          <IconButton variant='soft' color='primary' size='lg' sx={{ boxShadow: 'sx' }}>
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

        <div className='tw-space-x-[12px] tw-flex-1 tw-text-right'>
          <Button onClick={() => history.push('/auth/login')} size='lg' className='tw-ml-auto'>
            Đăng nhập
          </Button>
          <Button onClick={() => history.push('/auth/register')} variant='plain' size='lg'>
            Đăng ký
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
