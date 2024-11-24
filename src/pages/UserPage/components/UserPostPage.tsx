import { queryClient } from '@/App';
import PostCard from '@/components/PostCard';
import RHFSelect from '@/components/RHFSelect';
import useUrl from '@/hooks/useUrl.hook';
import postService from '@/services/post.service';
import { OrderConditionType, WhereConditionType } from '@/store/postFilterSlice';
import { useAppStore } from '@/store/store';
import { AssetSelectSchemaType, UserDetailSelectSchemaType } from '@/types/schema.type';
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Skeleton,
  Tab,
  TabList,
  Tabs,
  Typography,
  tabClasses,
} from '@mui/joy';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
// Icons
import { useOutletContext } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

interface PostTabProps {
  whereConditions: WhereConditionType;
  orderConditions: OrderConditionType;
  userData?: UserDetailSelectSchemaType;
  userAvatarData?: AssetSelectSchemaType;
}

function RentalPost(props: PostTabProps) {
  const { userId } = useUrl().params;
  const { whereConditions, orderConditions } = props;

  const handleFetchPosts = async ({ pageParam }: { pageParam: number }) => {
    const response = await postService.searchRentalPost({
      whereConditions: whereConditions,
      orderConditions: orderConditions,
      pagination: { page: pageParam, pageSize: 10 },
    });

    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['users', 'posts', 'rental', { userId: Number(userId) }],
    queryFn: handleFetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.canNext) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined; // Không còn trang tiếp theo
    },
  });

  return (
    <div className='tw-space-y-4'>
      {data?.pages.map((page, index) => (
        <div key={index} className='tw-space-y-[40px]'>
          {page.results.map((post) => (
            <PostCard key={post.post.id} data={post} />
          ))}
        </div>
      ))}
      {hasNextPage ? (
        <>
          {isFetchingNextPage ? (
            <div className='tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden tw-py-[24px]'>
              <header className='tw-p-[14px] tw-pt-0 tw-flex tw-justify-between tw-items-center'>
                <div className='tw-flex tw-items-center tw-gap-4'>
                  <Skeleton animation='wave' variant='circular' width={50} height={50} />
                  <div className='tw-space-y-2'>
                    <Skeleton animation='wave' variant='rectangular' width={200} height={18} />
                    <Skeleton animation='wave' variant='rectangular' width={100} height={16} />
                  </div>
                </div>
                <div className='tw-flex tw-items-center tw-gap-4'>
                  <Skeleton animation='wave' variant='rectangular' width={150} height={40} />
                </div>
              </header>
              <LinearProgress variant='solid' color='neutral' size='sm' />
              <main className='tw-mt-[24px]'>
                <div className='tw-px-[14px]'>
                  <Skeleton animation='wave' variant='rectangular' width={400} height={24} />
                  <div className='tw-mt-4 tw-flex tw-items-center tw-gap-2'>
                    <Skeleton animation='wave' variant='rectangular' width={100} height={16} />
                    <Skeleton animation='wave' variant='rectangular' width={400} height={16} />
                  </div>
                  <div className='tw-mt-4 tw-flex tw-items-center tw-gap-2'>
                    <Skeleton animation='wave' variant='rectangular' sx={{ height: '300px' }} />
                  </div>
                </div>
              </main>
            </div>
          ) : (
            <div className='tw-flex tw-justify-center'>
              <Button variant='plain' onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Hiển thị thêm
              </Button>
            </div>
          )}
        </>
      ) : (
        <Divider>
          <div className='tw-text-lg tw-font-semibold tw-text-slate-600'>Không còn bài đăng để hiển thị thêm</div>
        </Divider>
      )}
    </div>
  );
}
function WantedPost() {
  return <p>WantedPost</p>;
}

function JoinPost() {
  return <p>JoinPost</p>;
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
          {tabIndex === 0 && <RentalPost whereConditions={whereConditions} orderConditions={orderConditions} />}
        </div>
      )}

      {userData && userData?.role === 'renter' && (
        <div className='tw-mt-[40px]'>
          {tabIndex === 0 && <WantedPost />}
          {tabIndex === 1 && <JoinPost />}
          {tabIndex === 2 && <PassPost />}
        </div>
      )}
    </React.Fragment>
  );
};

export default UserPostPage;
