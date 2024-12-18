import PostAttachmentItem from '@/components/PostAttachments/PostAttachmentItem';
import PostCardSkeleton from '@/components/PostCardSkeleton';
import { PostTabProps } from '@/pages/UserPage/components/UserPostPage';
import postService from '@/services/post.service';
import { PostAttachmentType } from '@/store/postCommentSlice';
import { useAppStore } from '@/store/store';
import { Button, Divider, LinearProgress, Skeleton } from '@mui/joy';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

export default function RentalPostAttachment(props: PostTabProps) {
  const { whereConditions, orderConditions } = props;

  const { currentUser, setOpenSelectedPostAttachment, setSelectedPostAttachment } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      setOpenSelectedPostAttachment: state.setOpenSelectedPostAttachment,
      setSelectedPostAttachment: state.setSelectedPostAttachment,
    })),
  );

  const handleFetchPosts = async ({ pageParam }: { pageParam: number }) => {
    const response = await postService.searchRentalPost({
      whereConditions: { ...whereConditions, ownerId: Number(currentUser?.userId) },
      orderConditions: orderConditions,
      pagination: { page: pageParam, pageSize: 10 },
    });

    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['users', 'posts', 'rental', { userId: Number(currentUser?.userId) }],
    queryFn: handleFetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.canNext) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined; // Không còn trang tiếp theo
    },
  });

  const handleClickPostAttachment = (postData: PostAttachmentType) => {
    setSelectedPostAttachment(postData);
    setOpenSelectedPostAttachment(false);
  };

  return (
    <div className='tw-space-y-4'>
      {!data && <PostCardSkeleton />}
      {data?.pages.map((page, index) => (
        <div key={index} className='tw-space-y-[18px]'>
          {page.results.map((post) => (
            <div
              key={post.post.id}
              className='tw-cursor-pointer tw-rounded tw-p-[4px] hover:tw-bg-slate-200'
              onClick={() => handleClickPostAttachment(post as unknown as PostAttachmentType)}
            >
              <PostAttachmentItem data={post as PostAttachmentType} />
            </div>
          ))}
        </div>
      ))}
      {hasNextPage ? (
        <>
          <div className='tw-flex tw-justify-center tw-py-[24px]'>
            <Button variant='outlined' onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              Hiển thị thêm
            </Button>
          </div>
        </>
      ) : (
        <div className='tw-pb-[24px]'>
          <Divider>
            <div className='tw-text-md tw-font-semibold tw-text-slate-600'>Không còn bài đăng để hiển thị thêm</div>
          </Divider>
        </div>
      )}
      {isFetching && (
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
      )}
    </div>
  );
}
