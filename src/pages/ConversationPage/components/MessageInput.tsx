import conversationService from '@/services/conversation.service';
import { MessageSelectSchemaType } from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import * as React from 'react';

import { FaRegImage } from 'react-icons/fa6';
import { IoSend } from 'react-icons/io5';
import { TiDelete } from 'react-icons/ti';
import { toast } from 'sonner';

export type MessageInputProps = {
  selectedConversationId: number;
  onSendMessageSuccess?: (data: MessageSelectSchemaType) => void;
};

const MessageInput = (props: MessageInputProps) => {
  const { selectedConversationId, onSendMessageSuccess } = props;
  const fileInputId = React.useId();
  const [loading, setLoading] = React.useState(false);
  const [messageValue, setMessageValue] = React.useState('');
  const textAreaRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | ArrayBuffer | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if (!messageValue.trim() && !imagePreview) return;
    setLoading(true);
    const toastId = toast.loading('Đang gửi tin nhắn...', {
      position: 'top-center',
    });
    try {
      const formData = new FormData();
      formData.append('chatId', selectedConversationId.toString());
      formData.append('content', messageValue);
      if (imageFile) formData.append('image', imageFile);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await conversationService.createMessage(formData as any);
      if (onSendMessageSuccess) onSendMessageSuccess(response.data);
      toast.success('Tin nhắn đã được gửi!', { id: toastId });
      setMessageValue('');
      removeImage();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi tin nhắn', { id: toastId });
      console.log(handleAxiosError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: 2, pb: 3, pt: 1 }}>
      {imagePreview && (
        <div className='tw-mb-3 tw-flex tw-items-center tw-gap-2'>
          <div className='tw-relative'>
            <img
              src={imagePreview as string}
              alt='Preview'
              className='tw-w-20 tw-h-20 tw-object-cover tw-rounded tw-shadow'
            />
            <button
              onClick={removeImage}
              className='tw-absolute -tw-top-1.5 -tw-right-1.5 tw-rounded-full
              tw-flex tw-items-center tw-justify-center tw-bg-white tw-p-0  tw-shadow-sm'
              type='button'
            >
              <TiDelete className='tw-text-[24px] tw-text-red-500' />
            </button>
          </div>
        </div>
      )}
      <FormControl>
        <Textarea
          placeholder='Soạn nội dung tin nhắn ở đây...'
          aria-label='Message'
          ref={textAreaRef}
          onChange={(event) => {
            setMessageValue(event.target.value);
          }}
          value={messageValue}
          minRows={3}
          maxRows={10}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
            },
          }}
          endDecorator={
            <Stack
              direction='row'
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexGrow: 1,
                py: 1,
                pr: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <label
                htmlFor={fileInputId}
                className='tw-flex tw-items-center tw-gap-1 tw-text-[14px] tw-text-slate-800 tw-p-1 tw-px-2 tw-border tw-rounded tw-cursor-pointer tw-duration-150 hover:tw-bg-backgroundColor active:tw-border-primaryColor'
              >
                <input
                  id={fileInputId}
                  type='file'
                  accept='image/*'
                  className='tw-hidden'
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <FaRegImage /> Thêm ảnh
              </label>
              <Button
                disabled={loading}
                loading={loading}
                size='sm'
                color='primary'
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                endDecorator={<IoSend width={24} height={24} />}
                onClick={handleSendMessage}
              >
                Gửi
              </Button>
            </Stack>
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleSendMessage();
            }
          }}
        />
      </FormControl>
    </Box>
  );
};

export default React.memo(MessageInput);
