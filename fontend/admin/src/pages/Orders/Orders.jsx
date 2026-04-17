import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';
import './Orders.css';

const STATUS_MAP = {
  PENDING: { label: 'Chờ xử lý', cls: 'badge-warning' },
  PROCESSING: { label: 'Đang xử lý', cls: 'badge-info' },
  SHIPPED: { label: 'Đã gửi', cls: 'badge-secondary' },
  DELIVERED: { label: 'Hoàn thành', cls: 'badge-success' },
  CANCELLED: { label: 'Đã hủy', cls: 'badge-danger' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
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
    try {
      await orderService.updateStatus(id, status);
      fetchOrders();
    } catch { alert('Cập nhật thất bại!'); }
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
          <select className="form-control" style={{width:'auto'}} value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}>
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
                  <th>#ID</th>
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
                  <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Không có đơn hàng</td></tr>
                ) : orders.map(o => {
                  const st = STATUS_MAP[o.status] || { label: o.status, cls: 'badge-secondary' };
                  return (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.user?.username || o.customerName || '--'}</td>
                      <td>{o.phoneNumber || '--'}</td>
                      <td>{o.totalAmount ? `${Number(o.totalAmount).toLocaleString('vi-VN')}đ` : '--'}</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '--'}</td>
                      <td>
                        <select
                          className="form-control status-select"
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                        >
                          {Object.entries(STATUS_MAP).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {total > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: Math.min(total, 7) }, (_, i) => (
              <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page >= total - 1} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
