import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import orderService from '../../services/orderService';
import './Topbar.css';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/products': 'Quản lý sản phẩm',
  '/categories': 'Quản lý danh mục',
  '/brands': 'Quản lý thương hiệu',
  '/orders': 'Quản lý đơn hàng',
  '/users': 'Quản lý người dùng',
  '/blogs': 'Quản lý bài viết',
  '/reviews': 'Quản lý đánh giá',
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const title = PAGE_TITLES[location.pathname] || 'Admin';

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Polling lấy số đơn hàng chưa xử lý mỗi 30s
    const fetchPending = async () => {
      try {
        const res = await orderService.getPendingCount();
        const data = res.data || res;
        setPendingCount(data.totalElements || data.length || 0);
      } catch (err) {}
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-notification" onClick={() => navigate('/orders')}>
          <Bell size={20} color="var(--text-secondary)" />
          {pendingCount > 0 && <span className="notification-badge">{pendingCount}</span>}
        </div>
        <div className="topbar-time">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
        <div className="topbar-user">
          <div className="topbar-avatar">{user?.username?.[0]?.toUpperCase() || 'A'}</div>
          <div>
            <div className="topbar-username">{user?.username || 'Admin'}</div>
            <div className="topbar-role">{user?.role || 'ADMIN'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
