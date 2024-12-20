import PostCard from '@/components/PostCard';
import PostCardSkeleton from '@/components/PostCardSkeleton';
import { queryClient } from '@/configs/tanstackQuery.config';
import postService from '@/services/post.service';
import { OrderConditionType, WhereConditionType } from '@/store/postFilterSlice';
import { Button, Divider, LinearProgress, Skeleton } from '@mui/joy';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

interface SearchPostTabProps {
  whereConditions: WhereConditionType;
  orderConditions: OrderConditionType;
}

const SearchJoinPost = (props: SearchPostTabProps) => {
  const { whereConditions, orderConditions } = props;

  const handleFetchPosts = async ({ pageParam }: { pageParam: number }) => {
    const response = await postService.searchJoinPost({
      whereConditions: { ...whereConditions, status: 'actived' },
      orderConditions: { updatedAt: 'desc', ...orderConditions },
      pagination: { page: pageParam, pageSize: 10 },
    });

    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['search', 'posts', 'join'],
    queryFn: handleFetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.canNext) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    placeholderData: keepPreviousData,
    enabled: !!whereConditions.nearest,
  });

  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['search', 'posts', 'join'] });
  }, [whereConditions, orderConditions]);

  return (
    <div className='tw-space-y-[40px]'>
      {!data && <PostCardSkeleton />}
      {data?.pages.map((page, index) => (
        <div key={index} className='tw-space-y-[40px]'>
          {page.results.map((post) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <PostCard key={post.post.id} data={post as any} />
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
            <div className='tw-flex tw-justify-center tw-py-[24px]'>
              <Button variant='outlined' onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Hiển thị thêm
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className='tw-pb-[24px]'>
          <Divider>
            <div className='tw-text-lg tw-font-semibold tw-text-slate-600'>Không còn bài đăng để hiển thị thêm</div>
          </Divider>
        </div>
      )}
    </div>
  );
};

export default SearchJoinPost;
