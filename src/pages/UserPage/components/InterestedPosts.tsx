import AddToInterestedButton from '@/components/PostCard/components/AddToInterestedButton';
import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import postService, { FullPostResponseType } from '@/services/post.service';
import { useAppStore } from '@/store/store';
import {
  JoinPostSelectSchemaType,
  PassPostSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from '@/types/schema.type';
import { formatCurrencyVND, handleAxiosError } from '@/utils/constants.helper';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { AspectRatio, Chip, Divider, LinearProgress, Skeleton, Typography } from '@mui/joy';
import { data } from '@remix-run/router';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

interface InterestedPostItemProps {
  postId: number;
}

const postType = {
  rental: 'Cho thuê phòng trọ',
  wanted: 'Tìm phòng trọ',
  join: 'Tìm người ở ghép',
  pass: 'Pass đồ',
};
const InterestedPostItem = (props: InterestedPostItemProps) => {
  const { postId } = props;
  const navigate = useNavigate();
  const [postData, setPostData] = React.useState<FullPostResponseType<
    RentalPostSelectSchemaType | WantedPostSelectSchemaType | JoinPostSelectSchemaType | PassPostSelectSchemaType
  > | null>(null);
  const { post, detail, assets } = postData ?? {};

  React.useEffect(() => {
    const handleGetFullPost = async (postId: number) => {
      try {
        const response = await postService.getFullPost(postId);
        setPostData(response.data[0]);
      } catch (error) {
        console.log(handleAxiosError(error));
      }
    };

    if (postId) handleGetFullPost(postId);
  }, [postId]);

  if (!postId) return <></>;
  return (
    <>
      {postData ? (
        <div
          className='tw-flex tw-items-start tw-gap-2 tw-cursor-pointer'
          onClick={() => navigate(`/posts/${postId}/view`)}
        >
          <Skeleton loading={!data} animation='wave'>
            <AspectRatio ratio='1/1' sx={{ width: 100, borderRadius: 'sm', boxShadow: 'sm' }}>
              <img src={assets?.[0].url} alt={post?.title} />
            </AspectRatio>
          </Skeleton>

          <div className='tw-ml-3 tw-space-y-1'>
            <div>
              <Typography level='title-md' noWrap>
                <Skeleton animation='wave' loading={!data}>
                  {post?.title}
                </Skeleton>
              </Typography>
            </div>
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography level='title-sm' noWrap>
                Cập nhật gần nhất:
              </Typography>
              <Typography level='body-sm' noWrap>
                <Skeleton animation='wave' loading={!data}>
                  {post?.updatedAt ? formatTimeForVietnamese(post.updatedAt, 'HH:mm:ss DD/MM/YYYY') : 'N/A'}
                </Skeleton>
              </Typography>
            </div>
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography level='title-sm' noWrap>
                Giá:
              </Typography>
              <Typography level='body-sm' variant='soft' color='success'>
                <Skeleton animation='wave' loading={!data}>
                  {post?.updatedAt ? formatTimeForVietnamese(post.updatedAt, 'HH:mm:ss DD/MM/YYYY') : 'N/A'}
                </Skeleton>
              </Typography>
              {detail?.priceEnd && detail?.priceEnd !== detail?.priceStart && (
                <>
                  <span>-</span>
                  <Typography level='body-sm' variant='soft' color='success'>
                    <Skeleton animation='wave' loading={!data}>
                      {`${formatCurrencyVND(detail.priceEnd)}${post?.type === 'pass' ? '' : '/tháng'}`}
                    </Skeleton>
                  </Typography>
                </>
              )}
            </div>
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography level='title-sm' noWrap>
                Loại bài đăng:
              </Typography>
              <Typography level='body-sm' color='primary' variant='soft' noWrap>
                <Skeleton animation='wave' loading={!data}>
                  {postType[post?.type as keyof typeof postType]}
                </Skeleton>
              </Typography>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Skeleton width={50} height={50} animation='wave' variant='rectangular' />
        </div>
      )}
    </>
  );
};

const InterestedPosts = () => {
  const {
    params: { userId },
  } = useUrl();
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      whereConditions: state.whereConditions,
    })),
  );

  const { data: UserInterestedPostsResponse, isFetching } = useUserApiHook.useUserInterestedPosts(
    Number(currentUser?.userId),
    {
      staleTime: 1000 * 60 * 15,
      gcTime: 1000 * 60 * 30,
    },
  );
  const interestedPosts = UserInterestedPostsResponse?.data;

  if (currentUser?.userId !== Number(userId)) {
    return <Navigate to={'/403'} />;
  }
  return (
    <>
      <div className='tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden tw-p-[24px]'>
        <div>
          <Typography
            endDecorator={
              <Chip color='primary' variant='solid' size='sm'>
                {interestedPosts?.length}
              </Chip>
            }
            level='h4'
          >
            Bài viết đã lưu
          </Typography>
        </div>
        <main className='tw-my-[24px] tw-space-y-[48px] tw-max-w-full tw-overflow-hidden'>
          {isFetching ? (
            <LinearProgress color='primary' size='sm' determinate={false} value={35} variant='soft' />
          ) : (
            <Divider sx={{ '--Divider-childPosition': `${0}%` }}></Divider>
          )}{' '}
          {interestedPosts?.length === 0 && <Typography>Chưa có bài viết nào được lưu lại</Typography>}
          <div className='tw-py-4 tw-space-y-4'>
            {interestedPosts?.map((item, index) => {
              return (
                <div
                  key={`address-${item.id}-${index}`}
                  className='tw-border tw-border-slate-50 tw-rounded tw-p-[12px] tw-flex tw-items-start tw-justify-between tw-gap-4 hover:tw-border-primaryColor hover:tw-bg-primaryColor/[.01] tw-duration-200'
                >
                  <div className='user-address-left-tab tw-flex tw-items-start tw-gap-4'>
                    <Chip size='sm'>{index + 1}</Chip>
                    <div className='tw-flex tw-flex-col tw-gap-2'>
                      <InterestedPostItem postId={Number(item.postId)} />
                    </div>
                  </div>
                  <div className='user-address-right-tab tw-flex tw-flex-col tw-items-end tw-gap-2'>
                    {/* {address.isDefault && (
                        <Chip color='success' size='sm'>
                          Mặc định
                        </Chip>
                      )} */}
                    <Typography level='body-xs'>
                      {formatTimeForVietnamese(new Date(item.createdAt!), 'HH:mm:ss DD/MM/YYYY')}
                    </Typography>
                    <AddToInterestedButton postId={Number(item.postId)} />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default InterestedPosts;
