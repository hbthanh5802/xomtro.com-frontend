import LogoIcon2 from '@/assets/LogoIcon2';
import DrawerWrapper from '@/components/DrawerWrapper';
import Account from '@/components/Header/Account';
import SearchBar from '@/components/Header/SearchBar';
import MobileSearchBar from '@/components/MobileSearchBar/MobileSearchBar';
import NavBar from '@/pages/HomePage/components/NavBar';
import { useAppStore } from '@/store/store';
import history from '@/utils/history.helper';
import { Button, Dropdown, IconButton, Menu, MenuButton, MenuItem } from '@mui/joy';
import React from 'react';
import { FaHandsHoldingCircle, FaHouseChimneyUser, FaHouseMedicalFlag, FaPlus } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { IoHome } from 'react-icons/io5';
import { PiList } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
// Icons

const Header = () => {
  const navigate = useNavigate();
  const [navSideOpen, setNavSideOpen] = React.useState(false);
  const [searchNavOpen, setSearchNavOpen] = React.useState(false);

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      fetchUserAvatar: state.fetchUserAvatar,
    })),
  );

  const handleSetSearchNavOpen = React.useCallback(setSearchNavOpen, [setSearchNavOpen]);

  return (
    <header
      className='tw-h-[var(--header-height)] tw-max-h-[var(--header-height)] tw-min-h-[var(--header-height)] tw-flex tw-items-center tw-fixed tw-top-0 tw-inset-x-0 tw-z-[999] tw-bg-white tw-shadow-sm
     tw-border-b-[1px] tw-border-b-slate-100'
    >
      {/* Mobile Nav */}
      <DrawerWrapper open={navSideOpen} closeButton onClose={() => setNavSideOpen(false)}>
        <NavBar />
      </DrawerWrapper>
      {/* Search Nav */}
      <DrawerWrapper
        open={searchNavOpen}
        title='Tìm kiếm'
        anchor='top'
        closeButton
        onClose={() => setSearchNavOpen(false)}
        slotProps={{
          content: {
            sx: {
              height: 'fit-content',
              maxHeight: '80dvh',
            },
          },
        }}
      >
        <div className='tw-p-[24px]'>
          <MobileSearchBar setSearchNavOpen={handleSetSearchNavOpen} />
        </div>
      </DrawerWrapper>

      <div className='tw-w-screen tw-px-[12px] laptop:tw-px-[24px] tw-flex tw-justify-between tw-items-center'>
        {/* Mobile Nav */}
        <div className='tw-inline-block tablet:tw-hidden'>
          <IconButton variant='plain' color='neutral' onClick={() => setNavSideOpen(true)}>
            <PiList className='tw-text-slate-800 tw-text-[24px]' />
          </IconButton>
          <IconButton color='primary' onClick={() => setSearchNavOpen(true)}>
            <IoIosSearch size={24} />
          </IconButton>
        </div>

        {/* Logo */}
        <div className='tw-flex tw-justify-center tablet:tw-justify-start tw-flex-1'>
          <Link to={'/home/rental'} className='tw-mr-[24px] tw-inline-flex tw-items-center tw-gap-2 tw-select-none'>
            {/* <LogoIcon width='22px' color='#185EA5' /> */}
            <LogoIcon2 width={32} height={32} />
            <div className='tw-hidden laptop:tw-inline-block tw-text-[24px] tw-font-bold tw-text-primaryColor'>
              Xóm trọ
            </div>
          </Link>
          {/* Search */}
          <div className='tw-hidden tablet:tw-block tw-max-w-[600px] tablet:tw-flex-[2]'>
            <SearchBar />
          </div>
        </div>

        {currentUser ? (
          <div className='tw-ml-[40px]'>
            <div className='tw-hidden tablet:tw-flex tw-gap-[12px] tw-flex-1 tw-justify-end tw-text-right tw-items-center'>
              <Dropdown>
                <MenuButton
                  variant='solid'
                  color='primary'
                  size='md'
                  startDecorator={<FaPlus />}
                  sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: {
                      display: 'none',
                    },
                  })}
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
                      <MenuItem onClick={() => navigate('/posts/wanted/create')}>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <IoHome className='tw-flex tw-text-lg tw-text-slate-600' />
                          Tìm phòng cho thuê
                        </div>
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/posts/join/create')}>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <FaHouseChimneyUser className='tw-flex tw-text-lg tw-text-slate-600' />
                          Tìm người ở ghép
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div
                          onClick={() => navigate('/posts/pass/create')}
                          className='tw-flex tw-items-center tw-gap-2'
                        >
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
                      <MenuItem>
                        <div
                          onClick={() => navigate('/posts/pass/create')}
                          className='tw-flex tw-items-center tw-gap-2'
                        >
                          <FaHandsHoldingCircle className='tw-flex tw-text-lg tw-text-slate-600' />
                          Pass đồ
                        </div>
                      </MenuItem>
                    </React.Fragment>
                  )}
                </Menu>
              </Dropdown>
              <Account />
            </div>
            <div className='tablet:tw-hidden tw-gap-[12px] tw-flex-1 tw-flex tw-justify-end tw-text-right tw-items-center'>
              <Dropdown>
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{ root: { variant: 'solid', color: 'primary' } }}
                  sx={(theme) => ({
                    [theme.breakpoints.up('sm')]: {
                      display: 'none',
                    },
                  })}
                >
                  <FaPlus />
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
                      <MenuItem onClick={() => navigate('/posts/wanted/create')}>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <IoHome className='tw-flex tw-text-lg tw-text-slate-600' />
                          Tìm phòng cho thuê
                        </div>
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/posts/join/create')}>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <FaHouseChimneyUser className='tw-flex tw-text-lg tw-text-slate-600' />
                          Tìm người ở ghép
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div
                          onClick={() => navigate('/posts/pass/create')}
                          className='tw-flex tw-items-center tw-gap-2'
                        >
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
                      <MenuItem>
                        <div
                          onClick={() => navigate('/posts/pass/create')}
                          className='tw-flex tw-items-center tw-gap-2'
                        >
                          <FaHandsHoldingCircle className='tw-flex tw-text-lg tw-text-slate-600' />
                          Pass đồ
                        </div>
                      </MenuItem>
                    </React.Fragment>
                  )}
                </Menu>
              </Dropdown>
              <Account />
            </div>
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
