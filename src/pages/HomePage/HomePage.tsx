import DrawerWrapper from '@/components/DrawerWrapper';
import FilterBar from '@/pages/HomePage/components/FilterBar';
import NavBar from '@/pages/HomePage/components/NavBar';
import NavBarMobile from '@/pages/HomePage/components/NavBarMobile';
import RecommendPanel from '@/pages/HomePage/components/RecommendPanel';
import addressService from '@/services/address.service';
import {
  OrderConditionType,
  WhereConditionType,
  defaultOrderFilter,
  defaultWhereFilter,
} from '@/store/postFilterSlice';
import { useAppStore } from '@/store/store';
import { Button } from '@mui/joy';
import React from 'react';
import { MdFilterAlt } from 'react-icons/md';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const HomePage = () => {
  const [filterMobileOpen, setFilterMobileOpen] = React.useState(false);
  const [whereConditions, setWhereConditions] = React.useState<WhereConditionType>(defaultWhereFilter);
  const [orderConditions, setOrderConditions] = React.useState<OrderConditionType>(defaultOrderFilter);

  const handleSetWhereConditions = React.useCallback(setWhereConditions, [setWhereConditions]);
  const handleSetOrderConditions = React.useCallback(setOrderConditions, [setOrderConditions]);

  const { setGlobalWhereConditions, setGlobalOrderConditions, currentUser, setUserAddress, userAddress } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      userAddress: state.userAddress,
      setUserAddress: state.setUserAddress,
      setGlobalWhereConditions: state.setWhereConditionFilter,
      setGlobalOrderConditions: state.setOrderConditionFilter,
    })),
  );

  React.useEffect(() => {
    setGlobalWhereConditions(whereConditions);
    // if (orderConditions) {
    //   setGlobalOrderConditions(orderConditions);
    // }
  }, [whereConditions, setGlobalWhereConditions, setGlobalOrderConditions]);

  const { data: getUserDefaultAddressData } = addressService.getUserDefaultAddress(Number(currentUser?.userId), {
    gcTime: 30 * 60 * 1000,
    staleTime: 15 * 60 * 1000,
    enabled: !!Number(currentUser?.userId) && !userAddress,
  });

  React.useEffect(() => {
    if (getUserDefaultAddressData?.data) {
      setUserAddress(getUserDefaultAddressData.data);
    }
  }, [getUserDefaultAddressData, setUserAddress]);

  React.useEffect(() => {
    if (userAddress) {
      setWhereConditions((prev) => ({ ...prev, provinceName: userAddress.provinceName }));
    } else if (!userAddress && whereConditions.provinceName) {
      if (whereConditions.provinceName) setWhereConditions((prev) => ({ ...prev, provinceName: undefined }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  return (
    <React.Fragment>
      {/* Mobile Filter */}
      <DrawerWrapper open={filterMobileOpen} onClose={() => setFilterMobileOpen(false)}>
        <div className='tw-overflow-auto tw-scrollbar-none'>
          <FilterBar setWhereConditions={handleSetWhereConditions} setOrderConditions={handleSetOrderConditions} />
        </div>
      </DrawerWrapper>

      <div className='tw-relative tw-bg-backgroundColor tw-flex tw-h-[calc(100vh-var(--header-height))] tw-overflow-y-auto tw-scroll-pt-[var(--header-height)]'>
        <div className='tw-hidden laptop:tw-block tw-w-[360px] tw-sticky tw-top-0 tw-left-0 tw-z-50'>
          <NavBar />
        </div>
        <div className='tw-hidden tablet:tw-block tw-sticky laptop:tw-hidden tw-top-0 tw-left-0 tw-z-50'>
          <NavBarMobile />
        </div>
        <div className='tw-relative tw-px-2 tw-flex-1 tw-w-0 laptop:tw-flex-none laptop:tw-px-2 tablet:tw-w-[680px] tabletLg:tw-w-[700px] laptop:tw-w-[800px] tw-mt-[8px] tw-mx-auto'>
          <div className='tw-fixed tw-block laptop:tw-hidden tw-right-[-4px] tw-top-[var(--header-height)] tw-z-50'>
            <Button
              variant='solid'
              color='primary'
              sx={{ boxShadow: 'sm' }}
              onClick={() => setFilterMobileOpen(true)}
              startDecorator={<MdFilterAlt className='tw-text-[16px]' />}
            >
              Bộ lọc
            </Button>
            {/* <IconButton variant='solid' color='primary'>
              <MdFilterAlt />
            </IconButton> */}
          </div>
          <div>
            <RecommendPanel setWhereConditions={handleSetWhereConditions} />
            <Outlet context={{ whereConditions, orderConditions }} />
          </div>
        </div>
        <div className='tw-hidden laptop:tw-block laptop:tw-sticky laptop:tw-w-[360px] tw-top-[8px]  tw-right-[0px] tw-z-50 tw-max-h-[calc(100dvh-60px)] tw-overflow-y-auto tw-scrollbar-none tw-m-2 tw-rounded'>
          <FilterBar setWhereConditions={handleSetWhereConditions} setOrderConditions={handleSetOrderConditions} />
        </div>
      </div>
    </React.Fragment>
    // <div className='tw-relative tw-bg-backgroundColor tw-flex tw-justify-center'>
    //   <div className='tw-hidden laptop:tw-block tw-w-[300px] laptop:tw-[360px] laptop:tw-fixed tw-top-[60px] tw-left-[0px] tw-z-50'>
    //     <NavBar />
    //   </div>
    //   <div className='tw-block tablet:tw-hidden tablet:tw-left-0 tw-z-10'>
    //     <NavBarMobile />
    //   </div>
    //   <div className='tw-px-2 tw-max-w-full laptop:tw-px-0 laptop:tw-w-[680px] tw-mx-auto tw-mt-[40px] tw-min-h-screen'>
    //     <Outlet context={{ whereConditions, orderConditions }} />
    //   </div>
    //   <div className='tw-hidden laptop:tw-block laptop:tw-fixed laptop:tw-w-[360px] tw-right-[0px] tw-top-[60px] tw-z-50'>
    //     <FilterBar setWhereConditions={handleSetWhereConditions} setOrderConditions={handleSetOrderConditions} />
    //   </div>
    // </div>
  );
};

export default HomePage;
