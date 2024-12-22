import ModalLayout from '@/components/ModalLayout';
import AddToInterested from '@/components/PostCard/components/AddToInterestedButton';
import CommentButton from '@/components/PostCard/components/CommentButton';
import JoinDetail from '@/components/PostCard/components/JoinDetail';
import PassDetail from '@/components/PostCard/components/PassDetail';
import PostImages from '@/components/PostCard/components/PostImages';
import PostTime from '@/components/PostCard/components/PostTime';
import RenewPostForm from '@/components/PostCard/components/RenewPostForm';
import RentalDetail from '@/components/PostCard/components/RentalDetail';
import WantedDetail from '@/components/PostCard/components/WantedDetail';
import PostComments from '@/components/PostComments';
import ShareButtons from '@/components/ShareButton/ShareButton';
import { queryClient } from '@/configs/tanstackQuery.config';
import useClickOutside from '@/hooks/useClickOutside';
import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import postService from '@/services/post.service';
import { useAppStore } from '@/store/store';
import {
  AssetSelectSchemaType,
  JoinPostSelectSchemaType,
  PassPostItemSelectSchemaType,
  PassPostSelectSchemaType,
  PostSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from '@/types/schema.type';
import { getTimeAgo } from '@/utils/time.helper';
import {
  Avatar,
  Button,
  ButtonGroup,
  Chip,
  DialogActions,
  DialogTitle,
  Divider,
  Dropdown,
  LinearProgress,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/joy';
import React from 'react';
import { FaEye, FaRegEye, FaRegEyeSlash, FaRegImages } from 'react-icons/fa6';
import { IoIosShareAlt, IoMdInformationCircleOutline } from 'react-icons/io';
import { MdAutorenew, MdDeleteForever, MdEdit, MdOutlineInfo, MdOutlineMoreHoriz } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export type PostCardDataType = {
  post: PostSelectSchemaType;
  detail: RentalPostSelectSchemaType & JoinPostSelectSchemaType & WantedPostSelectSchemaType & PassPostSelectSchemaType;
  assets: AssetSelectSchemaType[];
  passItems?: PassPostItemSelectSchemaType[];
  distance?: number;
};

interface PostCardWrapperProps {
  data: PostCardDataType;
  isPreview?: boolean;
}

function DeletePostDialog(props: { postId: number; onSuccess?: () => void }) {
  const { postId, onSuccess = () => {} } = props;
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const toastId = toast.loading('Đang xoá bài đăng. Vui lòng chờ...');
    try {
      await postService.removePost(postId);
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] });
      toast.success('Xoá bài đăng thành công!', { duration: 1000, id: toastId });
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Xoá bài đăng không thành công. Vui lòng thử lại sau!', { duration: 1500, id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='tw-w-[400px]'>
      <DialogTitle>
        <span className='tw-flex tw-items-center tw-justify-center'>
          <MdOutlineInfo />
        </span>
        Xác nhận xoá bài đăng?
      </DialogTitle>
      <div className='tw-my-2'>
        <Divider />
      </div>
      <Typography level='body-md'>Hành động "Xác nhận" sẽ xoá vĩnh viễn bài đăng của bạn.</Typography>
      <DialogActions>
        <Button variant='solid' color='danger' disabled={loading} loading={loading} onClick={handleDelete}>
          Xác nhận
        </Button>
        <Button variant='plain' color='neutral' onClick={onSuccess}>
          Trở lại
        </Button>
      </DialogActions>
    </div>
  );
}

const PostCardWrapper = (props: PostCardWrapperProps) => {
  const navigate = useNavigate();
  const { origin } = useUrl();
  const [openShare, setOpenShare] = React.useState(false);
  const [openRenewModal, setOpenRenewModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { isPreview, data } = props;
  const { post, assets, distance } = data;
  const { ownerId } = post;
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [distanceOpen, setDistanceOpen] = React.useState(false);
  const distanceRef = React.useRef<HTMLDivElement | null>(null);
  const shareButtonRef = React.useRef(null);

  useClickOutside(shareButtonRef, () => setOpenShare(false));
  useClickOutside(distanceRef, () => setDistanceOpen(false));

  const { currentUser, whereConditions, resetPostCommentState } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      whereConditions: state.whereConditions,
      resetPostCommentState: state.resetPostCommentState,
    })),
  );
  const { data: UserDetailResponse } = useUserApiHook.useUserDetail(Number(ownerId), {
    staleTime: 1 * 60 * 1000,
  });
  const { data: UserAvatarResponse } = useUserApiHook.useUserAvatar(Number(ownerId), {
    staleTime: 3 * 60 * 1000,
  });
  const userDetail = UserDetailResponse?.data;
  const userAvatar = UserAvatarResponse?.data;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setOpenRenewModal(false);
  };

  const handleChangePostStatusClick = async () => {
    setLoading(true);
    const toastId = toast.loading('Đang ẩn bài đăng, vui lòng chờ');
    try {
      await postService.togglePostStatus(post.id);
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] });
      toast.success('Thành công! Bài đăng của bạn đã được ẩn.', { duration: 1000, id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Có vẻ có lỗi xảy ra. Vui lòng thử lại sau.', { duration: 1500, id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleRenewPostClick = async () => {
    setOpenRenewModal(true);
  };

  const handleViewDetailClick = () => {
    navigate(`/posts/${post.id}/view`);
  };

  React.useEffect(() => {
    resetPostCommentState();
    return () => {
      resetPostCommentState();
    };
  }, [resetPostCommentState]);

  return (
    <React.Fragment>
      <div className=' tw-relative tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden tw-pt-[18px]'>
        <header className='tw-p-[14px] tw-pt-0 tw-flex tw-justify-between tw-items-center'>
          <div
            className='tw-flex tw-gap-4 tw-items-center tw-cursor-pointer'
            onClick={() => navigate(`/users/${ownerId}/profile`)}
          >
            <Avatar
              size='lg'
              alt={`${userDetail?.firstName || ''} ${userDetail?.lastName || ''}`}
              src={userAvatar?.url}
              sx={(theme) => ({
                border: '1px #F2F4F7 black',
                boxShadow: 'sm',
                [theme.breakpoints.down('sm')]: {
                  width: 42,
                  height: 42,
                },
              })}
            />
            <div>
              <Typography level='title-md'>{`${userDetail?.firstName || ''} ${userDetail?.lastName || ''}`}</Typography>
              <Tooltip title={<PostTime data={props.data} />} arrow>
                <div className='tw-flex tw-items-center tw-gap-1'>
                  <Typography level='body-sm'>{getTimeAgo(post.createdAt!)}</Typography>
                  <MdOutlineInfo className='tw-text-slate-600' />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className='tw-flex tw-gap-1'>
            <div className='tw-flex tw-items-center tw-gap-1'>
              {distance && (
                <Tooltip
                  arrow
                  open={distanceOpen}
                  placement='bottom-end'
                  variant='outlined'
                  title={
                    <div ref={distanceRef} className='tw-flex tw-flex-col tw-gap-2 tw-max-w-[200px]'>
                      <Typography level='title-sm'>
                        Khoảng cách bán kính này chỉ mang tính chất tham khảo. Nếu bạn bạn muốn xem cụ thể:
                      </Typography>
                      <Button size='sm' variant='solid' onClick={() => navigate(`/posts/${post.id}/view#location`)}>
                        Xem chi tiết
                      </Button>
                    </div>
                  }
                >
                  <Chip
                    color='primary'
                    variant='solid'
                    endDecorator={<IoMdInformationCircleOutline className='tw-size-[18px]' />}
                    onClick={() => setDistanceOpen(true)}
                  >
                    {`~ ${distance.toPrecision(4)} km`}
                  </Chip>
                </Tooltip>
              )}
              {currentUser?.userId !== Number(post.ownerId) && <AddToInterested postId={post.id} />}
            </div>
            {currentUser?.userId === Number(ownerId) && (
              <div>
                <Dropdown>
                  <MenuButton variant='plain' size='sm' sx={{ borderRadius: 99999 }}>
                    <MdOutlineMoreHoriz className='tw-text-[24px]' />
                  </MenuButton>
                  <Menu
                    placement='bottom-end'
                    size='sm'
                    sx={{
                      zIndex: '99999',
                      p: 1,
                      gap: 1,
                      '--ListItem-radius': 'var(--joy-radius-sm)',
                    }}
                  >
                    <MenuItem onClick={() => navigate(`/posts/${post.type}/edit`, { state: { postData: props.data } })}>
                      <div className='tw-flex tw-items-center tw-gap-2'>
                        <MdEdit className='tw-flex tw-text-lg tw-text-slate-600' />
                        Chỉnh sửa bài viết
                      </div>
                    </MenuItem>
                    {post.status === 'actived' && (
                      <MenuItem color='neutral' variant='plain' onClick={() => handleChangePostStatusClick()}>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <FaRegEyeSlash className='tw-flex tw-text-lg tw-text-slate-600' />
                          Tạm ẩn bài viết
                        </div>
                      </MenuItem>
                    )}
                    {post.status === 'actived' && (
                      <MenuItem color='success' variant='plain' onClick={() => handleRenewPostClick()}>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <MdAutorenew className='tw-flex tw-text-lg ' />
                          Đăng lại bài viết
                        </div>
                      </MenuItem>
                    )}
                    {post.status === 'hidden' && (
                      <MenuItem color='neutral' variant='plain' onClick={() => handleChangePostStatusClick()}>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <FaRegEye className='tw-flex tw-text-lg ' />
                          Bỏ ẩn bài viết
                        </div>
                      </MenuItem>
                    )}
                    {post.status === 'unactived' && (
                      <MenuItem color='success' variant='plain' onClick={() => handleRenewPostClick()}>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <MdAutorenew className='tw-flex tw-text-lg ' />
                          Làm mới lại bài viết
                        </div>
                      </MenuItem>
                    )}
                    <ListDivider />
                    <MenuItem color='danger' onClick={handleDeleteClick}>
                      <div className='tw-flex tw-items-center tw-gap-2'>
                        <MdDeleteForever className='tw-flex tw-text-lg ' />
                        Xoá bài đăng
                      </div>
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </div>
            )}
          </div>
        </header>
        {loading ? <LinearProgress variant='solid' /> : <Divider orientation='horizontal' />}
        <main className='tw-mt-[12px]'>
          <div className='tw-px-[24px] tw-pb-[12px] tw-flex tw-items-center tw-flex-wrap tw-gap-2'>
            {post.addressProvince && (
              <Chip color='danger' variant={whereConditions.provinceName ? 'solid' : 'soft'}>
                {post.addressProvince}
              </Chip>
            )}
            {post.addressDistrict && (
              <Chip color='warning' variant={whereConditions.districtName ? 'solid' : 'soft'}>
                {post.addressDistrict}
              </Chip>
            )}
            {post.addressWard && (
              <Chip color='success' variant={whereConditions.wardName ? 'solid' : 'soft'}>
                {post.addressWard}
              </Chip>
            )}
          </div>
          {props.data && (
            <>
              {post.type === 'rental' && <RentalDetail data={props.data} />}
              {post.type === 'wanted' && <WantedDetail data={props.data} />}
              {post.type === 'join' && <JoinDetail data={props.data} />}
              {post.type === 'pass' && <PassDetail data={props.data} />}
            </>
          )}

          {/* Post Images */}
          {assets.length ? (
            <PostImages data={props.data} />
          ) : (
            // <TestLayout data={props.data} />
            <div className='tw-mt-2 tw-flex tw-items-start tw-gap-2 tw-flex-wrap tw-px-[24px]'>
              <Typography
                startDecorator={<FaRegImages className='tw-flex tw-text-lg tw-text-slate-600' />}
                level='title-md'
              >
                Hình ảnh:
              </Typography>
              <Typography level='body-md'>Người đăng chưa cung cấp hình ảnh!</Typography>
            </div>
          )}
        </main>

        <footer className='tw-p-[12px]'>
          <ButtonGroup size='md' buttonFlex={1} aria-label='flex button group'>
            <Button
              startDecorator={<FaEye className='tw-text-[16px]' />}
              color='primary'
              variant='solid'
              onClick={handleViewDetailClick}
            >
              Xem thêm
            </Button>
            {/* <Button
              onClick={() => navigate(`/posts/${post.id}/view#comments`)}
              startDecorator={<FaRegCommentDots className='tw-text-[18px]' />}
            >
              Bình luận
            </Button> */}
            {!isPreview && <CommentButton postId={post.id} />}
            <Tooltip
              title={
                <ShareButtons
                  ref={shareButtonRef}
                  url={`${origin}/posts/${post.id}/view`}
                  onShareWindowClose={() => setOpenShare(false)}
                />
              }
              variant='outlined'
              arrow
              open={openShare}
            >
              <Button
                color='primary'
                startDecorator={<IoIosShareAlt className='tw-text-[20px]' />}
                onClick={() => setOpenShare(!openShare)}
              >
                Chia sẻ
              </Button>
            </Tooltip>
          </ButtonGroup>
          {isPreview && (
            <section className='PostCard__comment'>
              <PostComments postId={post.id} />
            </section>
          )}
        </footer>
      </div>

      {/* Modal */}
      <ModalLayout onCloseModal={handleCloseModal} isOpen={showDeleteModal}>
        <DeletePostDialog postId={post.id} onSuccess={handleCloseModal} />
      </ModalLayout>

      <ModalLayout onCloseModal={handleCloseModal} isOpen={openRenewModal}>
        <RenewPostForm postId={post.id} onSuccess={handleCloseModal} />
      </ModalLayout>
    </React.Fragment>
  );
};

export default PostCardWrapper;
