import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook t ng cun ln u trang khi chuyn link
export const useScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
};
