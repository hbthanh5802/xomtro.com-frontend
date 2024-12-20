import PostAttachmentItem from '@/components/PostAttachments/PostAttachmentItem';
import PostCommentActionButton from '@/components/PostComments/PostCommentActionButton';
import { useFullPostQuery } from '@/hooks/usePostQuery';
import useUserApiHook from '@/hooks/useUserApi.hook';
import { PostAttachmentType } from '@/store/postCommentSlice';
import { useAppStore } from '@/store/store';
import { PostCommentSelectSchemaType } from '@/types/schema.type';
import { getTimeAgo } from '@/utils/time.helper';
import { Avatar, Divider, Skeleton, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

interface PostCommentItemProps {
  data: PostCommentSelectSchemaType;
}
const PostCommentItem = (props: PostCommentItemProps) => {
  const { data } = props;
  const navigate = useNavigate();
  const { ownerId, content, createdAt, tags } = data;

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const { data: UserAvatarResponse, isFetching: fetchingUserAvatar } = useUserApiHook.useUserAvatar(Number(ownerId), {
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  const userAvatar = UserAvatarResponse?.data;
  const { data: UserDetailResponse, isFetching: fetchingUserDetail } = useUserApiHook.useUserDetail(Number(ownerId), {
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  const userDetail = UserDetailResponse?.data;

  const postAttachmentId = tags ? tags.split('@post=')[1] : undefined;
  const { data: getFullPostAttachmentResponse, isFetching: getFullPostAttachmentFetching } = useFullPostQuery(
    Number(postAttachmentId),
  );

  if (!data) {
    return <></>;
  }
  return (
    <div className='PostComment_item tw-relative tw-inline-flex tw-items-start tw-gap-2'>
      <Avatar
        size='sm'
        src={userAvatar?.url}
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate(`/users/${ownerId}/profile`)}
      >
        <Skeleton loading={fetchingUserAvatar} />
      </Avatar>

      <div className='tw-flex tw-flex-col tw-items-start tw-space-y-1'>
        <div className='tw-py-[4px] tw-px-[8px] tw-bg-slate-100 tw-rounded-lg'>
          <Typography
            level='title-sm'
            sx={{ cursor: 'pointer', width: 'fit-content' }}
            onClick={() => navigate(`/users/${ownerId}/profile`)}
          >
            <Skeleton loading={fetchingUserDetail}>{`${userDetail?.firstName ?? ''} ${userDetail?.lastName}`}</Skeleton>
          </Typography>

          <Typography letterSpacing={0.1} sx={{ color: '#333' }} level='title-sm'>
            {content}
          </Typography>

          {getFullPostAttachmentFetching ? (
            <div className='tw-flex tw-gap-2'>
              <Skeleton variant='rectangular' animation='wave' height={100} width={100} />
              <Skeleton variant='rectangular' animation='wave' height={100} sx={{ flex: 1 }} />
            </div>
          ) : (
            <>
              {postAttachmentId && getFullPostAttachmentResponse && (
                <div className='tw-relative tw-max-w-[95%]'>
                  <Divider>Bài viết đính kèm</Divider>
                  <div
                    onClick={() => navigate(`/posts/${getFullPostAttachmentResponse?.data[0].post.id}/view`)}
                    className='tw-cursor-pointer'
                  >
                    <PostAttachmentItem
                      data={getFullPostAttachmentResponse?.data[0] as unknown as PostAttachmentType}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className='tw-flex tw-justify-between tw-gap-2'>
          {/* <Typography level='body-xs'>{formatTimeForVietnamese(createdAt!, 'HH:mm:ss DD/MM/YYYY')}</Typography> */}
          <Typography letterSpacing={0.2} level='body-xs'>
            {getTimeAgo(createdAt!)}
          </Typography>
          {currentUser?.userId !== ownerId && (
            <div
              onClick={() => {}}
              className='tw-cursor-pointer tw-duration-150 tw-px-1 tw-rounded-lg hover:tw-bg-slate-100'
            >
              <Typography letterSpacing={0.2} level='body-xs'>
                Phản hồi
              </Typography>
            </div>
          )}
        </div>
      </div>
      {currentUser?.userId === ownerId && (
        <div className='tw-absolute tw-right-0 -tw-bottom-[4px]'>
          <PostCommentActionButton data={data} />
        </div>
      )}
    </div>
  );
};

export default PostCommentItem;
