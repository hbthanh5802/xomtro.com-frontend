import { FaRegClipboard } from 'react-icons/fa6';
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { toast } from 'sonner';

interface ShareButtonProps {
  url?: string;
  onShareWindowClose?: () => void;
}
const ShareButtons = (props: ShareButtonProps) => {
  const { url, onShareWindowClose = () => {} } = props;
  const shareUrl = url || 'https://www.google.com.vn/?hl=vi';

  const handleCopy = async () => {
    const toastId = toast.loading('Đang sao chép...');
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Sao chép thành công!', { duration: 1000, id: toastId });
      onShareWindowClose();
    } catch (err) {
      toast.error('Lỗi khi sao chép link!', { duration: 1500, id: toastId });
    }
  };

  return (
    <div className='tw-flex tw-flex-col tw-gap-[12px] tw-p-[4px]'>
      <button
        className='tw-flex tw-items-center tw-py-[8px] tw-px-[12px] tw-rounded tw-gap-2 hover:tw-bg-black/5 active:tw-bg-black/15 tw-text-[16px]'
        onClick={handleCopy}
      >
        <FaRegClipboard className='tw-text-[20px]' />
        Sao chép đường dẫn liên kết
      </button>

      <FacebookShareButton url={shareUrl} onShareWindowClose={onShareWindowClose}>
        <div className='tw-flex tw-items-center tw-py-[8px] tw-px-[12px] tw-rounded tw-gap-2 hover:tw-bg-black/5 active:tw-bg-black/15 tw-text-[16px]'>
          <FacebookIcon size={22} round />
          Chia sẻ lên Facebook
        </div>
      </FacebookShareButton>

      <FacebookMessengerShareButton appId={'2832337223606694'} url={shareUrl} onShareWindowClose={onShareWindowClose}>
        <div className='tw-flex tw-items-center tw-py-[8px] tw-px-[12px] tw-rounded tw-gap-2 hover:tw-bg-black/5 active:tw-bg-black/15 tw-text-[16px]'>
          <FacebookMessengerIcon size={22} round />
          Chia sẻ lên Messenger
        </div>
      </FacebookMessengerShareButton>

      <WhatsappShareButton url={shareUrl} onShareWindowClose={onShareWindowClose}>
        <div className='tw-flex tw-items-center tw-py-[8px] tw-px-[12px] tw-rounded tw-gap-2 hover:tw-bg-black/5 tw-text-[16px]'>
          <WhatsappIcon size={24} round />
          Chia sẻ lên Whatsapp
        </div>
      </WhatsappShareButton>

      <LineShareButton url={shareUrl} onShareWindowClose={onShareWindowClose}>
        <div className='tw-flex tw-items-center tw-py-[8px] tw-px-[12px] tw-rounded tw-gap-2 hover:tw-bg-black/5 tw-text-[16px]'>
          <LineIcon size={24} round />
          Chia sẻ lên Line
        </div>
      </LineShareButton>

      <TelegramShareButton url={shareUrl} onShareWindowClose={onShareWindowClose}>
        <div className='tw-flex tw-items-center tw-py-[8px] tw-px-[12px] tw-rounded tw-gap-2 hover:tw-bg-black/5 tw-text-[16px]'>
          <TelegramIcon size={24} round />
          Chia sẻ lên Telegram
        </div>
      </TelegramShareButton>
    </div>
  );
};

export default ShareButtons;
