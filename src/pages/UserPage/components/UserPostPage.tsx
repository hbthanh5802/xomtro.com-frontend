import { queryClient } from '@/App';
import RHFSelect from '@/components/RHFSelect';
import useUrl from '@/hooks/useUrl.hook';
import UserJoinPostTab from '@/pages/UserPage/components/UserJoinPostTab';
import UserRentalPostTab from '@/pages/UserPage/components/UserRentalPostTab';
import UserWantedPostTab from '@/pages/UserPage/components/UserWantedPostTab';
import { OrderConditionType, WhereConditionType } from '@/store/postFilterSlice';
import { useAppStore } from '@/store/store';
import { AssetSelectSchemaType, UserDetailSelectSchemaType } from '@/types/schema.type';
import { Box, Chip, Divider, Skeleton, Tab, TabList, Tabs, Typography, tabClasses } from '@mui/joy';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
// Icons
import { useOutletContext } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

export interface PostTabProps {
  whereConditions: WhereConditionType;
  orderConditions: OrderConditionType;
  userData?: UserDetailSelectSchemaType;
  userAvatarData?: AssetSelectSchemaType;
}

function PassPost() {
  return <p>PassPost</p>;
}

interface UserPostPageFilterProps {
  setWhereConditions: React.Dispatch<React.SetStateAction<WhereConditionType>>;
  setOrderConditions: React.Dispatch<React.SetStateAction<OrderConditionType>>;
}
const UserPostPageFilter = React.memo((props: UserPostPageFilterProps) => {
  const { userId } = useUrl().params;
  const { setWhereConditions, setOrderConditions } = props;
  const methods = useForm<WhereConditionType & OrderConditionType>({
    defaultValues: {
      status: 'actived',
      createdAt: 'desc',
    },
  });
  const { watch, control } = methods;

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  React.useEffect(() => {
    const sub = watch((value, { name }) => {
      if (name === 'status') {
        setWhereConditions((prev) => ({ ...prev, status: value[name] }));
      }
      if (name === 'createdAt') {
        setOrderConditions((prev) => ({ ...prev, createdAt: value[name] }));
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  return (
    <FormProvider {...methods}>
      <form className='tw-flex tw-gap-2'>
        <RHFSelect<OrderConditionType>
          control={control}
          name='createdAt'
          label='Thời điểm:'
          options={[
            { label: 'Mới nhất', value: 'desc' },
            { label: 'Cũ nhất', value: 'asc' },
          ]}
        />
        {currentUser?.userId === Number(userId) && (
          <RHFSelect<WhereConditionType>
            control={control}
            name='status'
            label='Trạng thái:'
            options={[
              { label: 'Còn hiệu lục', value: 'actived' },
              { label: 'Đã ẩn', value: 'unactived' },
            ]}
          />
        )}
      </form>
    </FormProvider>
  );
});

const UserPostPage: React.FC = () => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const { userId } = useUrl().params;
  const { userData, userAvatarData } = useOutletContext() as {
    userData: UserDetailSelectSchemaType;
    userAvatarData: AssetSelectSchemaType;
  };
  const [orderConditions, setOrderConditions] = React.useState<OrderConditionType>({ createdAt: 'desc' });
  const [whereConditions, setWhereConditions] = React.useState<WhereConditionType>({
    ownerId: Number(userId),
    status: 'actived',
  });

  // Sử dụng useCallback để ngăn hàm bị tạo mới
  const handleSetWhereConditions = React.useCallback(setWhereConditions, []);
  const handleSetOrderConditions = React.useCallback(setOrderConditions, []);

  useEffect(() => {
    if (userData) {
      setWhereConditions((prev) => ({ ...prev, ownerId: userData.userId }));
    }
  }, [userData?.userId, userId]);

  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['users', 'posts'] });
  }, [orderConditions, whereConditions]);

  return (
    <React.Fragment>
      <div className='tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden'>
        <Box sx={{ flexGrow: 1, overflowX: 'hidden', backgroundColor: 'background.body' }}>
          <div className='tw-p-[24px] tw-space-y-4'>
            <div className='tw-flex tw-justify-between tw-items-center'>
              <Typography
                level='h4'
                endDecorator={
                  <Chip size='sm' variant='solid' color='primary'>
                    20
                  </Chip>
                }
              >
                Bài đăng
              </Typography>
              <div className='UserPost__post-filter'>
                <UserPostPageFilter
                  setWhereConditions={handleSetWhereConditions}
                  setOrderConditions={handleSetOrderConditions}
                />
              </div>
            </div>
            <Divider orientation='horizontal'>
              <Chip variant='soft' color='primary' size='sm'>
                Loại bài đăng
              </Chip>
            </Divider>
          </div>
          {userData ? (
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
                {userData && userData?.role === 'landlord' && (
                  <Tab indicatorInset>
                    Cho thuê{' '}
                    <Chip size='sm' variant='soft' color={tabIndex === 0 ? 'primary' : 'neutral'}>
                      14
                    </Chip>
                  </Tab>
                )}
                {userData && userData?.role === 'renter' && (
                  <>
                    <Tab indicatorInset>
                      Tìm phòng{' '}
                      <Chip size='sm' variant='soft' color={tabIndex === 0 ? 'primary' : 'neutral'}>
                        20
                      </Chip>
                    </Tab>
                    <Tab indicatorInset>
                      Tìm người ở ghép{' '}
                      <Chip size='sm' variant='soft' color={tabIndex === 1 ? 'primary' : 'neutral'}>
                        8
                      </Chip>
                    </Tab>
                    <Tab indicatorInset>
                      Pass đồ{' '}
                      <Chip size='sm' variant='soft' color={tabIndex === 2 ? 'primary' : 'neutral'}>
                        8
                      </Chip>
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

      {userData && userData?.role === 'landlord' && (
        <div className='tw-mt-[40px]'>
          {tabIndex === 0 && <UserRentalPostTab whereConditions={whereConditions} orderConditions={orderConditions} />}
        </div>
      )}

      {userData && userData?.role === 'renter' && (
        <div className='tw-mt-[40px]'>
          {tabIndex === 0 && <UserWantedPostTab whereConditions={whereConditions} orderConditions={orderConditions} />}
          {tabIndex === 1 && <UserJoinPostTab whereConditions={whereConditions} orderConditions={orderConditions} />}
          {tabIndex === 2 && <PassPost />}
        </div>
      )}
    </React.Fragment>
  );
};

export default UserPostPage;
