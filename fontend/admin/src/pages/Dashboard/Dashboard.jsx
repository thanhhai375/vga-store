import React, { useEffect, useState } from 'react';
import { Package, Monitor, Users, Banknote } from 'lucide-react';
import './Dashboard.css';
import axiosClient from '../../api/axiosClient';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-body">
      <div className="stat-value">{value ?? '...'}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axiosClient.get('/admin/dashboard/stats'),
          axiosClient.get('/admin/orders?page=0&size=5'),
        ]);
        setStats(statsRes.data || statsRes);
        const orders = ordersRes.data || ordersRes;
        setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : orders.content?.slice(0, 5) || []);
      } catch {
        // Dùng dữ liệu mẫu nếu API chưa có
        setStats({ totalProducts: '--', totalOrders: '--', totalUsers: '--', totalRevenue: '--' });
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusBadge = (status) => {
    const map = {
      PENDING: ['badge-warning','Chờ xử lý'],
      PROCESSING: ['badge-info','Đang xử lý'],
      SHIPPED: ['badge-secondary','Đã gửi'],
      DELIVERED: ['badge-success','Hoàn thành'],
      CANCELLED: ['badge-danger','Đã hủy'],
    };
    const [cls, label] = map[status] || ['badge-secondary', status];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Tổng sản phẩm" value={stats?.totalProducts} icon={<Monitor size={24} />} color="purple" sub="Sản phẩm đang bán" />
        <StatCard label="Đơn hàng" value={stats?.totalOrders} icon={<Package size={24} />} color="blue" sub="Tổng đơn hàng" />
        <StatCard label="Người dùng" value={stats?.totalUsers} icon={<Users size={24} />} color="green" sub="Tài khoản đăng ký" />
        <StatCard label="Doanh thu" value={stats?.totalRevenue ? `${Number(stats.totalRevenue).toLocaleString('vi-VN')}đ` : '--'} icon={<Banknote size={24} />} color="yellow" sub="Tổng doanh thu" />
      </div>

      {/* Recent Orders */}
      <div className="card dashboard-orders">
        <div className="card-header">
          <div>
            <h2 className="card-title">Đơn hàng gần đây</h2>
            <p className="card-sub">5 đơn hàng mới nhất</p>
          </div>
          <a href="/orders" className="btn btn-ghost btn-sm">Xem tất cả →</a>
        </div>
        {loading ? (
          <div className="spinner"></div>
        ) : recentOrders.length === 0 ? (
          <p className="no-data">Chưa có dữ liệu đơn hàng</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.user?.username || o.customerName || '--'}</td>
                    <td>{o.totalAmount ? `${Number(o.totalAmount).toLocaleString('vi-VN')}đ` : '--'}</td>
                    <td>{statusBadge(o.status)}</td>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
