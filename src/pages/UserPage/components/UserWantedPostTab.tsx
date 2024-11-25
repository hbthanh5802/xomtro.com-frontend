import PostCard from '@/components/PostCard';
import useUrl from '@/hooks/useUrl.hook';
import { PostTabProps } from '@/pages/UserPage/components/UserPostPage';
import postService from '@/services/post.service';
import { Button, Divider, LinearProgress, Skeleton } from '@mui/joy';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function UserWantedPostTab(props: PostTabProps) {
  const { userId } = useUrl().params;
  const { whereConditions, orderConditions } = props;

  const handleFetchPosts = async ({ pageParam }: { pageParam: number }) => {
    const response = await postService.searchWantedPost({
      whereConditions: whereConditions,
      orderConditions: orderConditions,
      pagination: { page: pageParam, pageSize: 10 },
    });

    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['users', 'posts', 'wanted', { userId: Number(userId) }],
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
