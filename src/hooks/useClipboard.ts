import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

interface useClipboardProps {
  showMessage?: boolean;
  loadingMessage?: ReactNode;
  successMessage?: ReactNode;
  errorMessage?: ReactNode;
  resetTimeout?: number;
  onSuccess?: () => void;
  onError?: () => void;
}
export const useClipboard = (props?: useClipboardProps) => {
  const {
    showMessage = true,
    loadingMessage,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    resetTimeout = 2000,
  } = props ?? {};
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (copyContent: string) => {
    let toastId: string | number | undefined;
    if (showMessage) {
      toastId = toast.loading(loadingMessage ?? 'Đang sao chép...');
    }
    try {
      if (!navigator.clipboard) {
        toast.error('Trình duyệt hiện chưa được hỗ trợ sao chép.', { id: toastId, duration: 1500 });
        return false;
      }
      await navigator.clipboard.writeText(copyContent);
      if (showMessage) {
        toast.success(successMessage ?? 'Đã sao chép!', { id: toastId, duration: 1000 });
      }
      setIsCopied(true);
      if (onSuccess) onSuccess();

      setTimeout(() => setIsCopied(false), resetTimeout);
      return true;
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast.error(errorMessage ?? 'Sao chép không thành công!', { id: toastId, duration: 1500 });
      if (onError) onError();
      return false;
    }
  };

  return { isCopied, copyToClipboard };
};
