import LogoIcon from '@/assets/LogoIcon';
import Account from '@/components/Header/Account';
import SearchBar from '@/components/Header/SearchBar';
import { useAppStore } from '@/store/store';
import history from '@/utils/history.helper';
import { Button, Dropdown, IconButton, Menu, MenuButton, MenuItem, Typography } from '@mui/joy';
import React from 'react';
import { FaHandsHoldingCircle, FaHouseChimneyUser, FaHouseMedicalFlag, FaPlus } from 'react-icons/fa6';
import { IoHome } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
// Icons

const Header = () => {
  const navigate = useNavigate();
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
            <Dropdown>
              <MenuButton
                variant='solid'
                color='primary'
                size='md'
                startDecorator={<FaPlus />}
                // sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
              >
                Tạo bài viết
              </MenuButton>
              <Menu
                placement='bottom-end'
                size='md'
                sx={{
                  zIndex: '99999',
                  p: 1,
                  gap: 1,
                  '--ListItem-radius': 'var(--joy-radius-sm)',
                }}
              >
                {currentUser.role === 'renter' ? (
                  <React.Fragment>
                    <MenuItem onClick={() => {}}>
                      <div className='tw-flex tw-items-center tw-gap-2'>
                        <IoHome className='tw-flex tw-text-lg tw-text-slate-600' />
                        Tìm phòng trống
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div className='tw-flex tw-items-center tw-gap-2'>
                        <FaHouseChimneyUser className='tw-flex tw-text-lg tw-text-slate-600' />
                        Tìm người ở ghép
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div className='tw-flex tw-items-center tw-gap-2'>
                        <FaHandsHoldingCircle className='tw-flex tw-text-lg tw-text-slate-600' />
                        Pass đồ
                      </div>
                    </MenuItem>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <MenuItem onClick={() => navigate('/posts/rental/create')}>
                      <div className='tw-flex tw-items-center tw-gap-2'>
                        <FaHouseMedicalFlag className='tw-flex tw-text-lg tw-text-slate-600' />
                        Cho thuê phòng
                      </div>
                    </MenuItem>
                  </React.Fragment>
                )}
              </Menu>
            </Dropdown>
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
