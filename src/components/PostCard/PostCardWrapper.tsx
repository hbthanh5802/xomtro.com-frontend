import { queryClient } from '@/App';
import ModalLayout from '@/components/ModalLayout';
import JoinDetail from '@/components/PostCard/components/JoinDetail';
import PostImages from '@/components/PostCard/components/PostImages';
import PostTime from '@/components/PostCard/components/PostTime';
import RentalDetail from '@/components/PostCard/components/RentalDetail';
import WantedDetail from '@/components/PostCard/components/WantedDetail';
import ShareButtons from '@/components/ShareButton/ShareButton';
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
import { FaRegEye, FaRegEyeSlash, FaRegImages } from 'react-icons/fa6';
import { IoIosShareAlt } from 'react-icons/io';
import { MdDeleteForever, MdEdit, MdOutlineInfo, MdOutlineMoreHoriz } from 'react-icons/md';
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

// export type PostCardDataType =
//   | {
//       post: PostSelectSchemaType & { type: 'rental' };
//       detail: RentalPostSelectSchemaType;
//       assets: AssetSelectSchemaType[];
//       distance?: number;
//     }
//   | {
//       post: PostSelectSchemaType & { type: 'join' };
//       detail: JoinPostSelectSchemaType;
//       assets: AssetSelectSchemaType[];
//       distance?: number;
//     }
//   | {
//       post: PostSelectSchemaType & { type: 'wanted' };
//       detail: WantedPostSelectSchemaType;
//       assets: AssetSelectSchemaType[];
//       distance?: number;
//     }
//   | {
//       post: PostSelectSchemaType & { type: 'pass' };
//       detail: PassPostSelectSchemaType;
//       assets: AssetSelectSchemaType[];
//       passItems: PassPostItemSelectSchemaType[];
//       distance?: number;
//     };

interface PostCardWrapperProps {
  data: PostCardDataType;
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
  const [openShare, setOpenShare] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { post, detail, assets } = props.data;
  const { ownerId } = post;
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
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
  };

  const handleChangePostStatusClick = async () => {
    setLoading(true);
    const toastId = toast.loading('Đang ẩn bài đăng, vui lòng chờ');
    try {
      await postService.togglePostStatus(post.id);
      queryClient.invalidateQueries({ queryKey: ['users', 'posts'] });
      toast.success('Thành công! Bài đăng của bạn đã được ẩn.', { duration: 1000, id: toastId });
    } catch (error) {
      toast.error('Có vẻ có lỗi xảy ra. Vui lòng thử lại sau.', { duration: 1500, id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className='tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden tw-pt-[24px]'>
        <header className='tw-p-[14px] tw-pt-0 tw-flex tw-justify-between tw-items-center'>
          <div className='tw-flex tw-gap-4 tw-items-start'>
            <Avatar
              size='lg'
              alt={`${userDetail?.firstName || ''} ${userDetail?.lastName || ''}`}
              src={userAvatar?.url}
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
          {currentUser?.userId === Number(ownerId) && (
            <div>
              <Dropdown>
                <MenuButton variant='plain' size='sm'>
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
                  <MenuItem onClick={handleChangePostStatusClick}>
                    <div className='tw-flex tw-items-center tw-gap-2'>
                      {post.status === 'actived' ? (
                        <FaRegEyeSlash className='tw-flex tw-text-lg tw-text-slate-600' />
                      ) : (
                        <FaRegEye className='tw-flex tw-text-lg tw-text-slate-600' />
                      )}
                      {post.status === 'actived' ? 'Tạm ẩn bài đăng' : 'Bỏ ẩn'}
                    </div>
                  </MenuItem>
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
        </header>
        {loading ? <LinearProgress variant='solid' /> : <Divider orientation='horizontal' />}
        <main className='tw-mt-[24px]'>
          {post.type === 'rental' && <RentalDetail data={props.data} />}
          {post.type === 'wanted' && <WantedDetail data={props.data} />}
          {post.type === 'join' && <JoinDetail data={props.data} />}

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
          <ButtonGroup size='lg' buttonFlex={1} aria-label='flex button group'>
            <Button color='primary' variant='solid'>
              One
            </Button>
            <Button>Two</Button>
            <Tooltip
              title={<ShareButtons onShareWindowClose={() => setOpenShare(false)} />}
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
        </footer>
      </div>

      {/* Modal */}
      <ModalLayout onCloseModal={handleCloseModal} isOpen={showDeleteModal}>
        <DeletePostDialog postId={post.id} onSuccess={handleCloseModal} />
      </ModalLayout>
    </React.Fragment>
  );
};

export default PostCardWrapper;
