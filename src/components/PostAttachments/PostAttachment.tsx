import JoinPostAttachment from '@/components/PostAttachments/JoinPostAttachment';
import PassPostAttachment from '@/components/PostAttachments/PassPostAttachment';
import RentalPostAttachment from '@/components/PostAttachments/RentalPostAttachment';
import WantedPostAttachment from '@/components/PostAttachments/WantedPostAttachment';
import { OrderConditionType, WhereConditionType } from '@/store/postFilterSlice';
import { useAppStore } from '@/store/store';
import { Box, Skeleton, Tab, tabClasses, TabList, Tabs } from '@mui/joy';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

const PostAttachment = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const [orderConditions] = React.useState<OrderConditionType>({ createdAt: 'desc' });
  const [whereConditions, setWhereConditions] = React.useState<WhereConditionType>({
    ownerId: Number(currentUser?.userId),
    status: 'actived',
  });

  React.useEffect(() => {
    if (currentUser) {
      setWhereConditions((prev) => ({ ...prev, ownerId: currentUser.userId }));
    }
  }, [currentUser]);

  return (
    <div className='tw-p-[8px] tw-max-w-[100dvw] tw-min-w-fit tablet:tw-max-w-screen-tablet laptop:tw-max-w-screen-laptop'>
      <React.Fragment>
        <div className='tw-shadow-sm tw-rounded-lg tw-bg-white tw-overflow-hidden'>
          <Box sx={{ flexGrow: 1, overflowX: 'hidden', backgroundColor: 'background.body' }}>
            {currentUser ? (
              <Tabs aria-label='Pipeline' value={tabIndex} onChange={(_, value) => setTabIndex(value as number)}>
                <TabList
                  sx={{
                    justifyContent: 'center',
                    [`&& .${tabClasses.root}`]: {
                      flex: 'initial',
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: 'transparent',
                      },
                      [`&.${tabClasses.selected}`]: {
                        color: 'primary.plainColor',
                        '&::after': {
                          height: 2,
                          borderTopLeftRadius: 3,
                          borderTopRightRadius: 3,
                          bgcolor: 'primary.500',
                        },
                      },
                    },
                  }}
                >
                  {currentUser && currentUser?.role === 'landlord' && (
                    <>
                      <Tab indicatorInset>
                        Cho thuê{' '}
                        {/* <Chip size='sm' variant='soft' color={tabIndex === 0 ? 'primary' : 'neutral'}>
                        14
                      </Chip> */}
                      </Tab>
                      <Tab indicatorInset>
                        Pass đồ{' '}
                        {/* <Chip size='sm' variant='soft' color={tabIndex === 1 ? 'primary' : 'neutral'}>
                        8
                      </Chip> */}
                      </Tab>
                    </>
                  )}
                  {currentUser && currentUser?.role === 'renter' && (
                    <>
                      <Tab indicatorInset>
                        Tìm phòng{' '}
                        {/* <Chip size='sm' variant='soft' color={tabIndex === 0 ? 'primary' : 'neutral'}>
                        20
                      </Chip> */}
                      </Tab>
                      <Tab indicatorInset>
                        Pass đồ{' '}
                        {/* <Chip size='sm' variant='soft' color={tabIndex === 1 ? 'primary' : 'neutral'}>
                        8
                      </Chip> */}
                      </Tab>
                      <Tab indicatorInset>
                        Tìm người ở ghép{' '}
                        {/* <Chip size='sm' variant='soft' color={tabIndex === 2 ? 'primary' : 'neutral'}>
                        8
                      </Chip> */}
                      </Tab>
                    </>
                  )}
                </TabList>
              </Tabs>
            ) : (
              <div className='tw-p-[12px]'>
                <Skeleton animation='wave' variant='rectangular' height='24px' />
              </div>
            )}
          </Box>
        </div>

        {currentUser && currentUser?.role === 'landlord' && (
          <div className='tw-mt-[40px]'>
            {tabIndex === 0 && (
              <RentalPostAttachment whereConditions={whereConditions} orderConditions={orderConditions} />
            )}
            {tabIndex === 1 && (
              <PassPostAttachment whereConditions={whereConditions} orderConditions={orderConditions} />
            )}
          </div>
        )}

        {currentUser && currentUser?.role === 'renter' && (
          <div className='tw-mt-[40px]'>
            {tabIndex === 0 && (
              <WantedPostAttachment whereConditions={whereConditions} orderConditions={orderConditions} />
            )}
            {tabIndex === 1 && (
              <PassPostAttachment whereConditions={whereConditions} orderConditions={orderConditions} />
            )}
            {tabIndex === 2 && (
              <JoinPostAttachment whereConditions={whereConditions} orderConditions={orderConditions} />
            )}
          </div>
        )}
      </React.Fragment>
    </div>
  );
};

export default PostAttachment;
