import React from 'react';

/**
 * Hook để xử lý khi click bên ngoài một ref
 * @param ref React ref của phần tử cần lắng nghe
 * @param callback Hàm được gọi khi click outside
 */
const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
