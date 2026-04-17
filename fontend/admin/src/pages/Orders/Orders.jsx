import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';
import axiosClient from '../../api/axiosClient'; // Bắt buộc import để gọi API chi tiết
import './Orders.css';

const STATUS_MAP = {
  PENDING: { label: 'Chờ xử lý', cls: 'badge-warning' },
  CONFIRMED: { label: 'Đã xác nhận', cls: 'badge-info' },
  SHIPPING: { label: 'Đang giao', cls: 'badge-primary' },
  DELIVERED: { label: 'Hoàn thành', cls: 'badge-success' },
  CANCEL_REQUESTED: { label: 'Khách Yêu Cầu Hủy', cls: 'badge-danger' },
  CANCELLED: { label: 'Đã hủy', cls: 'badge-dark' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');

  // 🌟 State cho Modal Chi Tiết
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const SIZE = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAll({ page, size: SIZE, status: filter || undefined });
      const data = res.data || res;
      if (data.content) {
        setOrders(data.content);
        setTotal(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setOrders(data);
        setTotal(1);
      }
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, filter]);

  const handleStatusChange = async (id, status) => {
    if (status === 'CANCELLED') {
      if (!window.confirm('Duyệt HỦY đơn hàng này? Số lượng sản phẩm sẽ được tự động hoàn về kho.')) return;
    }
    if (status === 'PENDING') {
      if (!window.confirm('Từ chối yêu cầu hủy? Đơn hàng sẽ quay về trạng thái Chờ xử lý.')) return;
    }

    try {
      await orderService.updateStatus(id, status);
      if (status === 'CANCELLED') alert('Đã duyệt Hủy đơn hàng và hoàn kho!');
      fetchOrders();
      if (isModalOpen) setIsModalOpen(false);
    } catch { alert('Cập nhật thất bại!'); }
  };

  // 🌟 HÀM MỞ POPUP VÀ TẢI CHI TIẾT
  const viewOrderDetails = async (id) => {
    setIsModalOpen(true);
    setSelectedOrder({ loading: true, id });
    try {
      const res = await axiosClient.get(`/admin/orders/${id}`);
      const data = res.data?.data || res.data || res;
      setSelectedOrder(data);
    } catch (err) {
      alert("Không thể tải chi tiết đơn hàng");
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Đơn hàng</h1>
          <p className="page-subtitle">Theo dõi và xử lý đơn hàng</p>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <select className="form-control" style={{ width: 'auto' }} value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#MÃ ĐƠN</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Không có đơn hàng</td></tr>
                ) : orders.map(o => {
                  const st = STATUS_MAP[o.status] || { label: o.status, cls: 'badge-secondary' };
                  return (
                    <tr key={o.orderId || o.id} onClick={() => viewOrderDetails(o.orderId || o.id)} style={{ cursor: 'pointer' }}>
                      <td><strong style={{ color: '#2563eb' }}>{o.orderCode || `#${o.orderId}`}</strong></td>
                      <td>{o.fullName || o.user?.username || '--'}</td>
                      <td>{o.phone || o.phoneNumber || '--'}</td>
                      <td>{o.totalAmount ? `${Number(o.totalAmount).toLocaleString('vi-VN')}đ` : '--'}</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '--'}</td>
                      <td onClick={e => e.stopPropagation()}>
                        {o.status === 'CANCEL_REQUESTED' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <button onClick={() => handleStatusChange(o.orderId || o.id, 'CANCELLED')} className="btn-approve">✓ Duyệt Hủy</button>
                            <button onClick={() => handleStatusChange(o.orderId || o.id, 'PENDING')} className="btn-reject">✕ Từ chối</button>
                          </div>
                        ) : (
                          <select
                            className="form-control status-select"
                            value={o.status}
                            onChange={e => handleStatusChange(o.orderId || o.id, e.target.value)}
                            disabled={o.status === 'CANCELLED' || o.status === 'DELIVERED'}
                          >
                            {Object.entries(STATUS_MAP).filter(([k]) => k !== 'CANCEL_REQUESTED').map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 🌟 MODAL CHI TIẾT ĐƠN HÀNG 🌟 */}
        {isModalOpen && selectedOrder && (
          <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>Chi tiết đơn hàng {selectedOrder.orderCode ? `#${selectedOrder.orderCode}` : ''}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
              </div>

              <div className="admin-modal-body">
                {selectedOrder.loading ? (
                  <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</p>
                ) : (
                  <>
                    {/* Nếu có lý do hủy, bôi đỏ nổi bật */}
                    {selectedOrder.note && selectedOrder.note.includes('[LÝ DO HỦY]') && (
                      <div className="admin-cancel-reason">
                        <strong>Lý do khách yêu cầu hủy:</strong> {selectedOrder.note.split('[LÝ DO HỦY]:')[1]}
                      </div>
                    )}

                    <div className="admin-info-grid">
                      <div className="admin-info-box">
                        <h4>Thông tin Khách hàng</h4>
                        <p><strong>Tên:</strong> {selectedOrder.fullName || 'N/A'}</p>
                        <p><strong>SĐT:</strong> {selectedOrder.phone || 'N/A'}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
                        {selectedOrder.note && !selectedOrder.note.includes('[LÝ DO HỦY]') && (
                          <p><strong>Ghi chú:</strong> {selectedOrder.note}</p>
                        )}
                      </div>
                    </div>

                    <h4>Danh sách Sản phẩm</h4>
                    <table className="admin-items-table">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>SL</th>
                          <th>Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.productName || item.name}</td>
                            <td>{item.quantity || 1}</td>
                            <td>{item.price ? `${Number(item.price).toLocaleString('vi-VN')}đ` : '0đ'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="admin-modal-total">
                      Tổng tiền: <span>{selectedOrder.totalAmount ? `${Number(selectedOrder.totalAmount).toLocaleString('vi-VN')}đ` : '0đ'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;