import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { logout } from '../../redux/authSlice';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'info'
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Chờ duyệt': return { bg: '#fff7ed', color: '#c2410c' };
      case 'Đang xử lý': return { bg: '#eff6ff', color: '#1d4ed8' };
      case 'Đã giao thành công': return { bg: '#f0fdf4', color: '#15803d' };
      case 'Đã hủy': return { bg: '#fef2f2', color: '#b91c1c' };
      default: return { bg: '#f8fafc', color: '#475569' };
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page container">
      <div className="profile-layout">
        
        {/* SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="sidebar-user-card">
            <div className="user-avatar-large">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <h3 className="user-display-name">{user.username}</h3>
            <p className="user-display-role">{user.role || 'Thành viên'} của VGA Store</p>
          </div>
          
          <nav className="profile-nav">
            <button 
              className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Lịch sử đơn hàng
            </button>
            <button 
              className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              👤 Thông tin cá nhân
            </button>
            <button className="nav-btn logout-nav-btn" onClick={handleLogout}>
              🚪 Đăng xuất
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="profile-content">
          {activeTab === 'orders' ? (
            <div className="orders-section">
              <h2 className="section-title">Lịch sử đơn hàng ({orders.length})</h2>
              
              {loading ? (
                <div className="profile-loading">Đang tải danh sách đơn hàng...</div>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <p>Bạn chưa có đơn hàng nào.</p>
                  <button className="btn-shop-now" onClick={() => navigate('/products')}>SẮM VGA NGAY</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => {
                    const style = getStatusStyle(order.status);
                    return (
                      <div key={order.id} className="order-card-item">
                        <div className="order-item-header">
                          <div className="order-id-group">
                            <span className="order-label">Mã đơn hàng</span>
                            <span className="order-id">#{order.id}</span>
                          </div>
                          <span 
                            className="order-status-badge"
                            style={{ backgroundColor: style.bg, color: style.color }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="order-item-body">
                          <div className="order-info-col">
                            <span className="order-label">Ngày đặt</span>
                            <span className="order-val">{order.createdAt || order.date || '---'}</span>
                          </div>
                          <div className="order-info-col">
                            <span className="order-label">Tổng thanh toán</span>
                            <span className="order-val price-val">{formatPrice(order.totalAmount || order.total)}</span>
                          </div>
                        </div>
                        <div className="order-item-footer">
                          <button 
                            className="btn-view-order-detail"
                            onClick={() => navigate(`/track-order`)} // Hoặc mở popup chi tiết
                          >
                            Chi tiết đơn hàng →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="info-section">
              <h2 className="section-title">Thông tin tài khoản</h2>
              <div className="info-grid">
                <div className="info-group">
                  <label>Tên người dùng</label>
                  <input type="text" value={user.username} disabled />
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <input type="email" value={user.email || 'N/A'} disabled />
                </div>
                <div className="info-group">
                  <label>Số điện thoại</label>
                  <input type="text" placeholder="Chưa cập nhật" />
                </div>
                <div className="info-group">
                  <label>Địa chỉ mặc định</label>
                  <textarea placeholder="Chưa cập nhật địa chỉ giao hàng"></textarea>
                </div>
              </div>
              <button className="btn-save-profile">Cập nhật thông tin</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
