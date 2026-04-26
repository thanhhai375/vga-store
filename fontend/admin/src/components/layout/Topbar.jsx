import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, AlertTriangle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { countNewOrders } from '../../utils/orderNewUtils';
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
  '/settings': 'Cài đặt',
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const title = PAGE_TITLES[location.pathname] || 'Admin';

  const [newOrderCount, setNewOrderCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNewOrders = useCallback(async () => {
    try {
      const res = await axiosClient.get('/admin/orders', { params: { page: 0, size: 50, sortBy: 'createdAt', direction: 'desc' } });
      const data = res?.data?.data || res?.data || res;
      const orders = Array.isArray(data) ? data : (data.content || []);
      
      const pendingNew = orders.filter(o => o.status === 'PENDING');
      setNewOrderCount(countNewOrders(pendingNew));

      // Build notifications list
      const recentNotifs = orders.filter(o => ['PENDING', 'CANCEL_REQUESTED', 'CANCELLED'].includes(o.status)).slice(0, 10);
      setNotifications(recentNotifs);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNewOrders();
    const interval = setInterval(fetchNewOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchNewOrders]);

  useEffect(() => {
    if (location.pathname === '/orders') {
      setTimeout(fetchNewOrders, 1000);
    }
  }, [location.pathname, fetchNewOrders]);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        {/* Notification bell and dropdown */}
        <div className="topbar-notification-container">
          <div
            className="topbar-notification"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Thông báo"
          >
            <Bell size={20} color={newOrderCount > 0 ? '#f59e0b' : 'var(--text-secondary)'} />
            {newOrderCount > 0 && (
              <span className="notification-badge notification-badge--pulse">{newOrderCount}</span>
            )}
          </div>
          
          {showNotifications && (
            <>
              <div className="notification-backdrop" onClick={() => setShowNotifications(false)}></div>
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Thông báo mới</h4>
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className="notification-item" 
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/orders', { state: { openOrderId: notif.id } });
                      }}
                    >
                      <div className="notification-icon">
                        {notif.status === 'PENDING' ? (
                          <ShoppingCart size={18} color="#2563eb" />
                        ) : (
                          <AlertTriangle size={18} color="#dc2626" />
                        )}
                      </div>
                      <div className="notification-content">
                        {notif.status === 'PENDING' ? (
                          <p>Tài khoản <strong>{notif.fullName || 'Khách'}</strong> vừa đặt đơn <strong>#{notif.orderCode}</strong></p>
                        ) : (
                          <p>Đơn hàng <strong>#{notif.orderCode}</strong> của <strong>{notif.fullName || 'Khách'}</strong> vừa bị hủy/yêu cầu hủy</p>
                        )}
                        <span className="notification-time">{new Date(notif.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="notification-empty">Không có thông báo nào</div>
                  )}
                </div>
                <div className="notification-footer" onClick={() => { setShowNotifications(false); navigate('/orders'); }}>
                  Xem tất cả đơn hàng
                </div>
              </div>
            </>
          )}
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
