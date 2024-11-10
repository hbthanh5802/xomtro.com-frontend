import history from '@/utils/history.helper';
import { Button, IconButton, Input, Typography } from '@mui/joy';
import { IoIosSearch } from 'react-icons/io';

const Header = () => {
  // const navigator = useNavigate();
  return (
    <header className='tw-sticky tw-top-0 tw-inset-x-0 red'>
      <div className='tw-w-screen tw-p-[12px] tw-px-[24px] tw-bg-white tw-flex tw-justify-between tw-items-center'>
        <div className='tw-mr-[24px] tw-flex-1'>
          <Typography level='h3'>Logo</Typography>
        </div>
        {/* Search */}
        <Input
          size='lg'
          placeholder='Nhập thông tin tìm kiếm của bạn'
          endDecorator={
            <IconButton variant='solid' color='primary' sx={{ width: 60 }}>
              <IoIosSearch size={24} />
            </IconButton>
          }
          className='tw-flex-[2]'
        />
        <div className='tw-space-x-[12px] tw-flex-1 tw-text-right'>
          <Button onClick={() => history.push('/login')} size='lg' className='tw-ml-auto'>
            Đăng nhập
          </Button>
          <Button onClick={() => history.push('/register')} variant='plain' size='lg'>
            Đăng ký
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
