import ModalLayout from '@/components/ModalLayout';
import postService from '@/services/post.service';
import { useAppStore } from '@/store/store';
import { PostCommentSelectSchemaType } from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import {
  Button,
  DialogActions,
  DialogTitle,
  Divider,
  Dropdown,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from '@mui/joy';
import React from 'react';
import { MdDeleteOutline, MdOutlineInfo, MdOutlineModeEdit, MdOutlineMoreHoriz } from 'react-icons/md';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

interface PostCommentActionButtonProps {
  data: PostCommentSelectSchemaType;
}

interface RemoveCommentModalProps {
  commentId: number;
  onSuccess?: () => void;
}
const RemoveCommentModal = (props: RemoveCommentModalProps) => {
  const { commentId, onSuccess } = props;
  const [loading, setLoading] = React.useState(false);

  const { postComments, setPostComments } = useAppStore(
    useShallow((state) => ({
      postComments: state.postComments,
      setPostComments: state.setPostComments,
    })),
  );

  const handleDelete = async () => {
    if (!commentId) return;
    setLoading(true);
    const toastId = toast.loading('Đang xoá bình luận, vui lòng chờ.');
    try {
      await postService.removePostComment(commentId);
      toast.success('Bình luận của bạn đã được xoá!', { id: toastId });
      const newPostCommentList = postComments.filter((comment) => comment.id !== commentId);
      setPostComments(newPostCommentList);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Không thành công! Có lỗi xảy ra, hãy thử lại sau.', { id: toastId });
      console.log(handleAxiosError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='tw-w-[400px]'>
        <DialogTitle>
          <span className='tw-flex tw-items-center tw-justify-center'>
            <MdOutlineInfo />
          </span>
          Xác nhận xoá bình luận
        </DialogTitle>
        <div className='tw-my-2'>
          <Divider />
        </div>
        <Typography level='body-md'>Hành động "Xác nhận" sẽ gỡ bỏ bình luận này.</Typography>
        <DialogActions>
          <Button variant='solid' color='danger' disabled={loading} loading={loading} onClick={handleDelete}>
            Xác nhận
          </Button>
          <Button variant='plain' color='neutral' onClick={onSuccess}>
            Trở lại
          </Button>
        </DialogActions>
      </div>
    </>
  );
};

const PostCommentActionButton = (props: PostCommentActionButtonProps) => {
  const { data } = props;
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);

  const { setSelectedPostComment, setPostCommentMode } = useAppStore(
    useShallow((state) => ({
      setSelectedPostComment: state.setSelectedPostComment,
      setPostCommentMode: state.setPostCommentMode,
    })),
  );

  const handleEditButtonClick = (commentData: PostCommentSelectSchemaType) => {
    setPostCommentMode('edit');
    setSelectedPostComment(commentData);
  };

  return (
    <div>
      <Dropdown>
        <MenuButton variant='plain' size='sm' sx={{ borderRadius: 99999, px: 0, py: 0, height: 0 }}>
          <MdOutlineMoreHoriz className='tw-text-[18px]' />
        </MenuButton>
        <Menu
          placement='bottom-end'
          size='sm'
          sx={{
            zIndex: '99999',
            p: 0.8,
            gap: 0.5,
            borderRadius: 'var(--joy-radius-md)',
            '--ListItem-radius': 'var(--joy-radius-sm)',
          }}
        >
          <MenuItem variant='plain'>
            <div className='tw-flex tw-items-center tw-gap-2' onClick={() => handleEditButtonClick(data)}>
              <MdOutlineModeEdit className='tw-flex tw-text-lg' />
              Chỉnh sửa
            </div>
          </MenuItem>
          <ListDivider />
          <MenuItem color='danger' onClick={() => setOpenRemoveModal(true)}>
            <div className='tw-flex tw-items-center tw-gap-2'>
              <MdDeleteOutline className='tw-flex tw-text-lg tw-text-red-500' />
              Xoá
            </div>
          </MenuItem>
        </Menu>
      </Dropdown>

      <>
        <ModalLayout isOpen={openRemoveModal} onCloseModal={() => setOpenRemoveModal(false)}>
          <RemoveCommentModal commentId={data.id} onSuccess={() => setOpenRemoveModal(false)} />
        </ModalLayout>
      </>
    </div>
  );
};

export default PostCommentActionButton;
