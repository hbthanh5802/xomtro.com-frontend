import useUrl from '@/hooks/useUrl.hook';
import LocationTab from '@/pages/HomePage/components/LocationTab';
import { Button, Divider, Typography } from '@mui/joy';
import React from 'react';
import { FaChartPie, FaHandsHoldingCircle, FaHouseChimneyUser, FaHouseMedicalFlag } from 'react-icons/fa6';
import { IoHome } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { pathname } = useUrl();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (tabIndex: number, path: string) => {
    setTabIndex(tabIndex);
    navigate(path);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  React.useLayoutEffect(() => {
    if (['/', '/home', '/home/rental'].includes(pathname)) {
      setTabIndex(0);
      navigate('/home/rental');
    } else if (pathname === '/home/wanted' && tabIndex !== 1) {
      setTabIndex(1);
    } else if (pathname === '/home/join' && tabIndex !== 2) {
      setTabIndex(2);
    } else if (pathname === '/home/pass' && tabIndex !== 3) {
      setTabIndex(3);
    } else if (pathname === '/analytics' && tabIndex !== 4) {
      setTabIndex(4);
    }
  }, [pathname, navigate, tabIndex]);

  return (
    <div className='tw-h-[calc(100dvh-60px)] tw-overflow-y-auto'>
      {/* Nav Bar */}
      <div className='tw-bg-white/5 tw-rounded tw-shadow tw-m-2 tw-ml-[12px] tw-p-2'>
        <header className='tw-px-[4px] tw-pt-[6px] tw-pb-[12px]'>
          <Typography level='title-md'>Loại bài đăng:</Typography>
        </header>
        <div className='tw-flex tw-flex-col tw-justify-between'>
          <div className='tw-space-y-2'>
            <Button
              startDecorator={<FaHouseMedicalFlag className='tw-text-[20px]' />}
              fullWidth
              size='lg'
              onClick={() => handleTabChange(0, '/home/rental')}
              color={tabIndex === 0 ? 'primary' : 'neutral'}
              variant={tabIndex === 0 ? 'solid' : 'plain'}
              sx={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}
            >
              Cho thuê phòng trọ
            </Button>
            <Button
              startDecorator={<IoHome className='tw-text-[20px]' />}
              fullWidth
              size='lg'
              onClick={() => handleTabChange(1, '/home/wanted')}
              color={tabIndex === 1 ? 'primary' : 'neutral'}
              variant={tabIndex === 1 ? 'solid' : 'plain'}
              sx={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}
            >
              Tìm phòng cho thuê
            </Button>
            <Button
              startDecorator={<FaHouseChimneyUser className='tw-text-[20px]' />}
              fullWidth
              size='lg'
              onClick={() => handleTabChange(2, '/home/join')}
              color={tabIndex === 2 ? 'primary' : 'neutral'}
              variant={tabIndex === 2 ? 'solid' : 'plain'}
              sx={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}
            >
              Tìm người ở ghép
            </Button>
            <Button
              startDecorator={<FaHandsHoldingCircle className='tw-text-[20px]' />}
              fullWidth
              size='lg'
              onClick={() => handleTabChange(3, '/home/pass')}
              color={tabIndex === 3 ? 'primary' : 'neutral'}
              variant={tabIndex === 3 ? 'solid' : 'plain'}
              sx={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}
            >
              Góc pass đồ
            </Button>
            <Divider />
            <Button
              startDecorator={<FaChartPie className='tw-text-[20px]' />}
              fullWidth
              size='lg'
              onClick={() => handleTabChange(4, '/analytics')}
              color={tabIndex === 4 ? 'primary' : 'neutral'}
              variant={tabIndex === 4 ? 'solid' : 'plain'}
              sx={{ textAlign: 'left', display: 'flex', justifyContent: 'flex-start' }}
            >
              Thống kê bài đăng
            </Button>
          </div>
        </div>
      </div>
      <div className='tw-mt-4'>
        <LocationTab />
      </div>
    </div>
  );
};

export default NavBar;
