import { useEffect, useRef } from 'react';

interface UseTabCountdownProps {
  timeout?: number; // Thời gian chờ, đơn vị ms (mặc định: 5 phút)
  onTimeout?: () => void; // Callback khi đủ thời gian chờ
}

export default function useTabCountdown({ timeout = 5 * 60 * 1000, onTimeout }: UseTabCountdownProps): void {
  const timeoutRef = useRef<number | null>(null);
  const lastHiddenTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab bị ẩn, lưu thời gian hiện tại
        lastHiddenTimeRef.current = Date.now();

        // Bắt đầu đếm ngược
        timeoutRef.current = window.setTimeout(() => {
          lastHiddenTimeRef.current = null; // Reset trạng thái
        }, timeout);
      } else {
        // Tab được hiển thị lại
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current); // Hủy bỏ timeout nếu chưa hết thời gian
        }

        if (lastHiddenTimeRef.current) {
          const timeElapsed = Date.now() - lastHiddenTimeRef.current;

          if (timeElapsed >= timeout) {
            // Gọi callback nếu thời gian đủ
            onTimeout?.();
          }
        }

        // Reset trạng thái
        lastHiddenTimeRef.current = null;
      }
    };

    // Lắng nghe sự kiện visibilitychange
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout, onTimeout]);
}
