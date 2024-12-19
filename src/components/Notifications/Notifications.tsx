import NotificationItem from '@/components/Notifications/NotificationItem';
import NotificationItemSkeleton from '@/components/Notifications/NotificationItemSkeleton';
import { queryClient } from '@/configs/tanstackQuery.config';
import notificationService from '@/services/notification.service';
import { useAppStore } from '@/store/store';
import { handleAxiosError } from '@/utils/constants.helper';
import { Button, Chip, Typography } from '@mui/joy';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const Notifications = () => {
  const notificationId = React.useId();

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const handleFetchUserNotifications = async ({ pageParam }: { pageParam: number }) => {
    const response = await notificationService.getUserNotifications({
      whereConditions: {},
      orderConditions: { createdAt: 'desc' },
      pagination: { page: pageParam, pageSize: 10 },
    });
    return response.data;
  };

  const handleClickSetReadAll = async () => {
    const toastId = toast.loading('Đang đánh dấu thông báo của bạn...');
    try {
      await notificationService.setReadAllNotifications();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Tất cả thông báo của bạn đã được đọc.', { id: toastId, duration: 500 });
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.', { id: toastId });
      console.log(handleAxiosError(error));
    }
  };

  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: handleFetchUserNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.canNext) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined; // Không còn trang tiếp theo
    },
    enabled: !!currentUser,
  });
  const pagination = notifications?.pages[0].pagination;

  return (
    <section className='Notification__popper tw-relative tw-max-w-[1000px]'>
      <div className='tw-flex tw-justify-between tw-py-2 tw-px-1 tw-bg-white tw-border-b'>
        <Typography
          level='title-md'
          endDecorator={
            <Chip component={'span'} size='sm' color='primary' variant='solid'>
              {pagination?.totalCount ?? 0}
            </Chip>
          }
        >
          Thông báo
        </Typography>

        <Button size='sm' variant='plain' onClick={handleClickSetReadAll}>
          Đánh dấu tất cả đã đọc
        </Button>
      </div>
      <div className='tw-flex tw-flex-col tw-gap-2 tw-py-2 tw-max-h-[50dvh] tw-overflow-auto'>
        {notifications?.pages.map((page, index) => {
          return (
            <div key={`Notification-${notificationId}-${index}`} className='tw-space-y-2'>
              {page.results.map((notification, index) => {
                return <NotificationItem key={`NotificationItem-${notificationId}-${index}`} data={notification} />;
              })}
            </div>
          );
        })}
        {hasNextPage && (
          <Button fullWidth size='sm' color='neutral' variant='plain' onClick={() => fetchNextPage()}>
            Xem thêm
          </Button>
        )}
        {isFetching || (isFetchingNextPage && <NotificationItemSkeleton />)}
      </div>

      <div className='tw-sticky tw-bottom-0'>
        <Button fullWidth size='sm' variant='plain'>
          Xem tất cả
        </Button>
      </div>
    </section>
  );
};

export default Notifications;
