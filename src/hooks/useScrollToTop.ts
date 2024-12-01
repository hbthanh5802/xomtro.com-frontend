import useUrl from '@/hooks/useUrl.hook';
import React from 'react';

const useScrollToTop = () => {
  const { pathname, search } = useUrl();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
};

export default useScrollToTop;
