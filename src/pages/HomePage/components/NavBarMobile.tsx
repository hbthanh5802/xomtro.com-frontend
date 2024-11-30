import useUrl from '@/hooks/useUrl.hook';
import { IconButton } from '@mui/joy';
import React from 'react';
import { FaHandsHoldingCircle, FaHouseChimneyUser, FaHouseMedicalFlag } from 'react-icons/fa6';
import { IoHome } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const NavBarMobile = () => {
  const { pathname } = useUrl();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = React.useState(0);

  // const { currentUser } = useAppStore(
  //   useShallow((state) => ({
  //     currentUser: state.currentUser,
  //   })),
  // );

  const handleTabChange = (tabIndex: number, path: string) => {
    setTabIndex(tabIndex);
    navigate(path);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  React.useEffect(() => {
    if (['/', '/home', '/home/rental'].includes(pathname)) {
      setTabIndex(0);
      navigate('/home/rental');
    }
  }, [pathname, navigate]);

  return (
    <div className='tw-rounded tw-bg-white tw-shadow tw-p-2 tw-h-[calc(100dvh-60px)] tw-overflow-y-auto'>
      {/* <header className='tw-px-[4px] tw-pt-[6px] tw-pb-[12px]'>
        <Typography level='title-md'>Loại bài đăng:</Typography>
      </header> */}
      <div className='tw-flex tw-flex-col tw-justify-between'>
        <div className='tw-space-y-2 tw-flex tw-flex-col'>
          <IconButton
            size='lg'
            onClick={() => handleTabChange(0, '/home/rental')}
            color={tabIndex === 0 ? 'primary' : 'neutral'}
            variant={tabIndex === 0 ? 'solid' : 'plain'}
            // sx={{
            //   width: '40px',
            // }}
          >
            <FaHouseMedicalFlag className='tw-text-[20px]' />
          </IconButton>
          <IconButton
            size='lg'
            onClick={() => handleTabChange(1, '/home/wanted')}
            color={tabIndex === 1 ? 'primary' : 'neutral'}
            variant={tabIndex === 1 ? 'solid' : 'plain'}
          >
            {<IoHome className='tw-text-[20px]' />}
          </IconButton>
          <IconButton
            size='lg'
            onClick={() => handleTabChange(2, '/home/join')}
            color={tabIndex === 2 ? 'primary' : 'neutral'}
            variant={tabIndex === 2 ? 'solid' : 'plain'}
          >
            {<FaHouseChimneyUser className='tw-text-[20px]' />}
          </IconButton>
          <IconButton
            size='lg'
            onClick={() => handleTabChange(3, '/home/pass')}
            color={tabIndex === 3 ? 'primary' : 'neutral'}
            variant={tabIndex === 3 ? 'solid' : 'plain'}
          >
            {<FaHandsHoldingCircle className='tw-text-[20px]' />}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default NavBarMobile;