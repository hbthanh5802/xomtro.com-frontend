import conversationService from '@/services/conversation.service';
import { useAppStore } from '@/store/store';
import { handleAxiosError } from '@/utils/constants.helper';
import { Button, ButtonProps } from '@mui/joy';
import React from 'react';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

interface CreateConversationButtonProps {
  receiverId: number;
  label?: string;
}

const CreateConversationButton = (props: CreateConversationButtonProps & ButtonProps) => {
  const { receiverId, label, ...other } = props;
  const navigate = useNavigate();
  const [createConversationLoading, setCreateConversationLoading] = React.useState(false);

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const handleCreateIndividualConversation = async () => {
    const toastId = toast.loading('Vui lòng chờ. Bạn sẽ được chuyển hướng ngay sau đó!');
    if (!currentUser) {
      toast.info('Vui lòng đăng nhập trước để nhắn tin.', { id: toastId });
      return;
    }
    setCreateConversationLoading(true);
    try {
      const response = await conversationService.createIndividualConversation({
        members: [currentUser.userId, Number(receiverId)],
      });
      const conversationId = response.data.id;
      navigate(`/conversations/${conversationId}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Hãy thử lại liên hệ bằng những phương thức khác.', { id: toastId });
      console.log(handleAxiosError(error));
    } finally {
      toast.dismiss(toastId);
      setCreateConversationLoading(false);
    }
  };

  return (
    <div>
      <Button
        disabled={createConversationLoading}
        loading={createConversationLoading}
        onClick={handleCreateIndividualConversation}
        color='neutral'
        variant='outlined'
        size='lg'
        fullWidth
        startDecorator={<IoChatboxEllipsesOutline className='tw-text-[20px]' />}
        {...other}
      >
        {label ? label : 'Nhắn tin ngay'}
      </Button>
    </div>
  );
};

export default CreateConversationButton;
