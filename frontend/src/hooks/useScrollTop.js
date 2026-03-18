import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook tự động cuộn lên đầu trang khi chuyển link
export const useScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
};