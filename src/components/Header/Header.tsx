import LogoIcon2 from '@/assets/LogoIcon2';
import DrawerWrapper from '@/components/DrawerWrapper';
import Account from '@/components/Header/Account';
import MessageButton from '@/components/Header/MessageButton';
import NotificationButton from '@/components/Header/NotificationButton';
import SearchBar from '@/components/Header/SearchBar';
import MobileSearchBar from '@/components/MobileSearchBar/MobileSearchBar';
import { queryClient } from '@/configs/tanstackQuery.config';
import useUrl from '@/hooks/useUrl.hook';
import NavBar from '@/pages/HomePage/components/NavBar';
import { useAppStore } from '@/store/store';
import { handleAxiosError } from '@/utils/constants.helper';
import history from '@/utils/history.helper';
import { Button, Dropdown, IconButton, Menu, MenuButton, MenuItem } from '@mui/joy';
import React from 'react';
import { FaHandsHoldingCircle, FaHouseChimneyUser, FaHouseMedicalFlag, FaPlus } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { IoHome } from 'react-icons/io5';
import { PiList } from 'react-icons/pi';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
// Icons

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useUrl();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [navSideOpen, setNavSideOpen] = React.useState(false);
  const [searchNavOpen, setSearchNavOpen] = React.useState(false);
  const isMobile = useMediaQuery({
    query: '(max-width: 640px)',
  });

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      fetchUserAvatar: state.fetchUserAvatar,
    })),
  );

  const isShowRefreshButton = pathname.startsWith('/home');

  const handleSetSearchNavOpen = React.useCallback(setSearchNavOpen, [setSearchNavOpen]);
  const handleRenewPage = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.refetchQueries({ queryKey: ['home', 'posts'] });
      toast.info('Đã làm mới trang', { position: isMobile ? 'top-center' : 'bottom-right' });
    } catch (error) {
      console.log(handleAxiosError(error));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className='tw-h-[var(--header-height)] tw-max-h-[var(--header-height)] tw-min-h-[var(--header-height)] tw-flex tw-items-center tw-fixed tw-top-0 tw-inset-x-0 tw-z-[999] tw-backdrop-filter tw-backdrop-blur-[20px] tw-bg-white/80 tw-shadow-sm'>
      {isShowRefreshButton && (
        <div className='tw-absolute tw-top-full tw-z-10 tw-left-1/2 -tw-translate-x-1/2'>
          <Button
            sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, opacity: 0.85 }}
            size='sm'
            color='primary'
            variant='solid'
            onClick={handleRenewPage}
            disabled={isRefreshing}
            loading={isRefreshing}
          >
            Làm mới trang
          </Button>
        </div>
      )}

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
              width: '100vw !important',
              height: 'fit-content',
              maxHeight: '80dvh',
            },
          },
        }}
      >
        <div className='tw-p-[12px] tw-pb-[24px]'>
          <MobileSearchBar setSearchNavOpen={handleSetSearchNavOpen} />
        </div>
      </DrawerWrapper>

      <div className='tw-w-screen tw-px-[12px] laptop:tw-px-[24px] tw-flex tw-justify-between tw-items-center'>
        {isMobile && (
          <div className='tw-inline-flex tw-items-center tw-gap-2'>
            <Link to={'/home/rental'} className='tw-inline-flex tw-items-center tw-gap-2 tw-select-none'>
              <LogoIcon2 width={32} height={32} />
            </Link>
            <IconButton variant='plain' color='neutral' onClick={() => setNavSideOpen(true)}>
              <PiList className='tw-text-slate-800 tw-text-[24px]' />
            </IconButton>
            <IconButton color='primary' onClick={() => setSearchNavOpen(true)}>
              <IoIosSearch size={24} />
            </IconButton>
          </div>
        )}
        {!isMobile && (
          <div className='tw-flex tw-justify-center tablet:tw-justify-start tw-flex-1 tw-shrink-0'>
            <Link to={'/home/rental'} className='tw-mr-[24px] tw-inline-flex tw-items-center tw-gap-2 tw-select-none'>
              <LogoIcon2 width={32} height={32} />
              <div className='tw-hidden laptop:tw-inline-block tw-text-[24px] tw-font-writing tw-text-primaryColor tw-text-nowrap tw-line-clamp-1'>
                Xóm trọ
              </div>
            </Link>
            {/* Search */}
            <div className='tw-hidden tablet:tw-block tw-max-w-[600px] tablet:tw-flex-[2]'>
              <SearchBar />
            </div>
          </div>
        )}
        {currentUser ? (
          <div className='tw-ml-[40px]'>
            {!isMobile && (
              <div className='tw-hidden tablet:tw-flex tw-gap-[12px] tw-flex-1 tw-justify-end tw-text-right tw-items-center'>
                <Dropdown>
                  <MenuButton
                    variant='solid'
                    color='primary'
                    size='md'
                    startDecorator={<FaPlus />}
                    sx={(theme) => ({
                      borderRadius: '40px',
                      [theme.breakpoints.down('md')]: {
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
                {/*  */}
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'solid', color: 'primary' } }}
                    sx={(theme) => ({
                      [theme.breakpoints.up('md')]: {
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
                <div className='tw-flex tw-items-center tw-gap-1 tw-pr-[12px]'>
                  <NotificationButton />
                  <MessageButton />
                </div>
                <Account />
              </div>
            )}
            {isMobile && (
              <div className='tablet:tw-hidden tw-gap-[12px] tw-flex-1 tw-flex tw-justify-end tw-text-right tw-items-center'>
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'solid', color: 'primary' } }}
                    sx={(theme) => ({
                      [theme.breakpoints.up('md')]: {
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
                <div className='tw-flex tw-items-center tw-gap-0'>
                  <NotificationButton />
                  <MessageButton />
                </div>
                <Account />
              </div>
            )}
          </div>
        ) : (
          <div className='tw-flex tw-flex-wrap tw-gap-[8px] tw-flex-1 tw-text-right tw-self-end tw-justify-end'>
            <Button onClick={() => history.push('/auth/login')} size='md' className='tw-ml-auto'>
              Đăng nhập
            </Button>
            <Button
              sx={(theme) => ({
                [theme.breakpoints.down('md')]: {
                  display: 'none',
                },
              })}
              onClick={() => history.push('/auth/register')}
              variant='plain'
              size='md'
            >
              Đăng ký
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
