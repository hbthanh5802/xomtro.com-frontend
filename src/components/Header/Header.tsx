import LogoIcon from '@/assets/LogoIcon';
import history from '@/utils/history.helper';
import { Button, IconButton, Input, Typography } from '@mui/joy';
import { IoIosSearch } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Header = () => {
  // const navigator = useNavigate();
  return (
    <header className='tw-sticky tw-top-0 tw-inset-x-0 red'>
      <div className='tw-w-screen tw-p-[12px] tw-px-[24px] tw-bg-white tw-flex tw-justify-between tw-items-center'>
        <Link to={'/'} className='tw-mr-[24px] tw-flex-1 tw-flex tw-items-center tw-gap-2 tw-select-none'>
          <IconButton variant='soft' color='primary' size='md'>
            <LogoIcon width='22px' color='#185EA5' />
          </IconButton>
          <Typography level='h4'>Xóm trọ</Typography>
        </Link>
        {/* Search */}
        <Input
          size='md'
          placeholder='Nhập thông tin tìm kiếm của bạn'
          endDecorator={
            <IconButton variant='solid' color='primary' sx={{ width: 60 }}>
              <IoIosSearch size={22} />
            </IconButton>
          }
          className='tw-flex-[2]'
        />
        <div className='tw-space-x-[12px] tw-flex-1 tw-text-right'>
          <Button onClick={() => history.push('/auth/login')} size='md' className='tw-ml-auto'>
            Đăng nhập
          </Button>
          <Button onClick={() => history.push('/auth/register')} variant='plain' size='md'>
            Đăng ký
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
