import DrawerWrapper from '@/components/DrawerWrapper';
import { queryClient } from '@/configs/tanstackQuery.config';
import useTabCountdown from '@/hooks/useTabCountDown';
import FilterBar from '@/pages/HomePage/components/FilterBar';
import FilterSummary from '@/pages/HomePage/components/FilterSummary';
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
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const HomePage = () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)',
  });
  const [filterMobileOpen, setFilterMobileOpen] = React.useState(false);
  const [whereConditions, setWhereConditions] = React.useState<WhereConditionType>(defaultWhereFilter);
  const [orderConditions, setOrderConditions] = React.useState<OrderConditionType>(defaultOrderFilter);

  const handleSetWhereConditions = React.useCallback(setWhereConditions, [setWhereConditions]);
  const handleSetOrderConditions = React.useCallback(setOrderConditions, [setOrderConditions]);

  const { setGlobalWhereConditions, setGlobalOrderConditions, currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      setGlobalWhereConditions: state.setWhereConditionFilter,
      setGlobalOrderConditions: state.setOrderConditionFilter,
    })),
  );

  useTabCountdown({
    timeout: 5 * 60 * 1000,
    onTimeout: () => queryClient.invalidateQueries({ queryKey: ['home', 'posts'] }),
  });

  React.useEffect(() => {
    setGlobalWhereConditions(whereConditions);
  }, [whereConditions, setGlobalWhereConditions, setGlobalOrderConditions]);

  const { data: getUserDefaultAddressData } = addressService.getUserDefaultAddress(Number(currentUser?.userId), {
    gcTime: 30 * 60 * 1000,
    staleTime: 15 * 60 * 1000,
    enabled: !!currentUser,
  });
  const userDefaultAddress = getUserDefaultAddressData?.data;

  React.useEffect(() => {
    if (userDefaultAddress) {
      setWhereConditions((prev) => ({ ...prev, provinceName: userDefaultAddress.provinceName }));
    } else if (!userDefaultAddress && whereConditions.provinceName) {
      if (whereConditions.provinceName) setWhereConditions((prev) => ({ ...prev, provinceName: undefined }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDefaultAddress]);

  return (
    <React.Fragment>
      {/* Mobile Filter */}
      <DrawerWrapper open={filterMobileOpen} onClose={() => setFilterMobileOpen(false)}>
        <div className='tw-overflow-auto tw-scrollbar-none'>
          <FilterBar
            whereConditions={whereConditions}
            setWhereConditions={handleSetWhereConditions}
            setOrderConditions={handleSetOrderConditions}
          />
        </div>
      </DrawerWrapper>

      <div className='tw-relative tw-bg-backgroundColor tw-flex tw-h-[calc(100vh-var(--header-height))] tw-overflow-y-auto tw-scroll-pt-[var(--header-height)]'>
        <div className='tw-hidden laptop:tw-block tw-w-[360px] tw-sticky tw-top-0 tw-left-0 tw-z-50'>
          <NavBar />
        </div>
        {isMobile && (
          <div className='tw-hidden tablet:tw-block tw-sticky laptop:tw-hidden tw-top-0 tw-left-0 tw-z-50'>
            <NavBarMobile />
          </div>
        )}
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
          </div>
          <div>
            <RecommendPanel setWhereConditions={handleSetWhereConditions} />
            <div className='tw-mb-[12px]'>
              <FilterSummary whereConditions={whereConditions} />
            </div>
            <Outlet context={{ whereConditions, orderConditions }} />
          </div>
        </div>
        <div className='tw-hidden laptop:tw-block laptop:tw-sticky laptop:tw-w-[360px] tw-top-[8px]  tw-right-[0px] tw-z-50 tw-max-h-[calc(100dvh-60px)] tw-overflow-y-auto tw-scrollbar-none tw-m-2 tw-rounded'>
          <FilterBar
            whereConditions={whereConditions}
            setWhereConditions={handleSetWhereConditions}
            setOrderConditions={handleSetOrderConditions}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
