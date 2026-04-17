import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import './TrackOrder.css';

// Map trạng thái từ BE enum sang tiếng Việt
const STATUS_MAP = {
  PENDING: 'Chờ duyệt',
  CONFIRMED: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao thành công',
  CANCELLED: 'Đã hủy',
  CANCEL_REQUESTED: 'Yêu cầu hủy',
};

const STATUS_CLASS_MAP = {
  PENDING: 'status-pending',
  CONFIRMED: 'status-processing',
  SHIPPING: 'status-delivering',
  DELIVERED: 'status-success',
  CANCELLED: 'status-cancelled',
  CANCEL_REQUESTED: 'status-cancel-request',
};

const TABS = ['Tất cả', 'Chờ duyệt', 'Đang xử lý', 'Đang giao hàng', 'Đã giao thành công', 'Yêu cầu hủy', 'Đã hủy'];

const formatPrice = (num) => {
  if (!num) return '0₫';
  return new Intl.NumberFormat('vi-VN').format(num) + '₫';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
};

const TrackOrder = () => {
  const { isAuthenticated } = useSelector((state) => state.auth) || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalData, setCancelModalData] = useState({ isOpen: false, orderId: null });
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Load đơn hàng từ API
  const loadOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Lọc theo tab
  const tabFilteredOrders = activeTab === 'Tất cả'
    ? orders
    : orders.filter(o => STATUS_MAP[o.status] === activeTab || o.status === activeTab);

  const displayOrders = hasSearched ? searchResults : tabFilteredOrders;

  const handleSearch = () => {
    if (!searchQuery.trim()) { setHasSearched(false); setSearchResults([]); return; }
    const results = orders.filter(o =>
      (o.orderCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(o.orderId || '').includes(searchQuery)
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => { setSearchQuery(''); setHasSearched(false); setSearchResults([]); };

  const openCancelModal = (orderId, e) => {
    if (e) e.stopPropagation();
    setCancelModalData({ isOpen: true, orderId });
    setCancelReason(''); setOtherReason('');
    setSelectedOrder(null);
  };

  const submitCancelRequest = async () => {
    if (!cancelReason) { showToast('Vui lòng chọn một lý do hủy đơn!', 'error'); return; }
    const finalReason = cancelReason === 'Khác' ? otherReason : cancelReason;
    if (cancelReason === 'Khác' && !finalReason.trim()) {
      showToast('Vui lòng nhập lý do cụ thể!', 'error'); return;
    }
    setCancelLoading(true);
    try {
      await orderService.cancelOrder(cancelModalData.orderId);
      showToast('Đã gửi yêu cầu hủy đơn hàng thành công!', 'success');
      setCancelModalData({ isOpen: false, orderId: null });
      loadOrders(); // Reload để cập nhật status
    } catch (err) {
      showToast(err?.response?.data?.message || 'Không thể hủy đơn. Vui lòng thử lại.', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const openOrderDetail = (order) => { setSelectedOrder(order); };

  const getStatusLabel = (status) => STATUS_MAP[status] || status;
  const getStatusClass = (status) => STATUS_CLASS_MAP[status] || 'status-default';

  const cancelReasonsList = [
    "Muốn thay đổi địa chỉ / Số điện thoại nhận hàng",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Thay đổi ý định, không muốn mua nữa",
    "Thời gian giao hàng dự kiến quá lâu",
    "Khác"
  ];

  if (!isAuthenticated) {
    return (
      <div className="track-order-page">
        <div className="track-order-layout">
          <div className="track-login-prompt">
            <svg viewBox="0 0 24 24" fill="none" stroke="#d8282e" strokeWidth="1.5" style={{ width: 60, marginBottom: 16 }}>
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>
            <Link to="/" className="btn-login-prompt">Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="toast-icon">{toast.type === 'success' ? '✓' : '⚠'}</div>
          {toast.message}
        </div>
      )}

      <div className="track-order-page">
        <div className="track-order-layout">

          <div className="track-search-section">
            <h2 className="track-title">Tra cứu trạng thái đơn hàng</h2>
            <p className="track-desc">Nhập Mã đơn hàng để kiểm tra tiến độ giao hàng.</p>
            <div className="track-search-box">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng (VD: ORD-00001)..."
                className="track-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="track-btn" onClick={handleSearch}>KIỂM TRA</button>
            </div>
          </div>

          <div className="track-history-section">
            <div className="history-header-flex">
              <h3 className="history-title">
                {hasSearched ? `Kết quả cho: "${searchQuery}"` : 'Lịch sử đơn hàng'}
              </h3>
              {hasSearched && <button className="clear-search-btn" onClick={clearSearch}>Quay lại</button>}
            </div>
            <hr className="history-divider" />

            {!hasSearched && (
              <div className="order-tabs">
                {TABS.map(tab => (
                  <button key={tab} className={`order-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab}
                  </button>
                ))}
              </div>
            )}

            <div className="history-table-wrapper">
              {loading ? (
                <div className="empty-orders">Đang tải đơn hàng...</div>
              ) : displayOrders.length > 0 ? (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Ngày đặt</th>
                      <th>Tổng tiền</th>
                      <th style={{ textAlign: 'center' }}>Trạng thái</th>
                      <th style={{ textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayOrders.map((order) => (
                      <tr key={order.orderId || order.id} onClick={() => openOrderDetail(order)} className="clickable-row">
                        <td><strong className="order-id-link">{order.orderCode || `#${order.orderId}`}</strong></td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td><span className="order-price">{formatPrice(order.totalAmount)}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {order.status === 'PENDING' ? (
                            <button onClick={(e) => openCancelModal(order.orderId || order.id, e)} className="btn-cancel-sm">
                              Hủy đơn
                            </button>
                          ) : <span style={{ fontSize: '12px', color: '#888' }}>-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-orders">
                  {hasSearched ? 'Không tìm thấy đơn hàng khớp.' : 'Bạn chưa có đơn hàng nào.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* POPUP HỦY ĐƠN */}
        {cancelModalData.isOpen && (
          <div className="order-detail-overlay">
            <div className="cancel-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="cancel-modal-header">
                <h3>Yêu cầu hủy đơn hàng</h3>
                <button className="close-modal" onClick={() => setCancelModalData({ isOpen: false, orderId: null })}>✕</button>
              </div>
              <div className="cancel-modal-body">
                <p className="cancel-warning">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Vui lòng chọn lý do hủy để chúng tôi hỗ trợ bạn tốt hơn.
                </p>
                <div className="cancel-reasons-list">
                  {cancelReasonsList.map((reason, idx) => (
                    <label key={idx} className={`reason-radio-card ${cancelReason === reason ? 'active' : ''}`}>
                      <input type="radio" name="cancelReason" value={reason} checked={cancelReason === reason} onChange={(e) => setCancelReason(e.target.value)} />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                {cancelReason === 'Khác' && (
                  <textarea className="other-reason-input" placeholder="Nhập lý do cụ thể..." rows="3" value={otherReason} onChange={(e) => setOtherReason(e.target.value)} />
                )}
              </div>
              <div className="cancel-modal-footer">
                <button className="btn-cancel-action outline" onClick={() => setCancelModalData({ isOpen: false, orderId: null })}>Quay lại</button>
                <button className="btn-cancel-action primary" onClick={submitCancelRequest} disabled={cancelLoading}>
                  {cancelLoading ? 'Đang xử lý...' : 'Gửi Yêu Cầu Hủy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POPUP CHI TIẾT ĐƠN HÀNG */}
        {selectedOrder && !cancelModalData.isOpen && (
          <div className="order-detail-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi tiết đơn hàng: <span style={{ color: '#2563eb' }}>{selectedOrder.orderCode || `#${selectedOrder.orderId}`}</span></h3>
                <button className="close-modal" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="detail-status-box">
                  <span style={{ fontWeight: 600 }}>Trạng thái:</span>
                  <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div className="detail-customer-box">
                  <h4>Thông tin giao hàng</h4>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
                  <p><strong>Điện thoại:</strong> {selectedOrder.phone || 'N/A'}</p>
                  {selectedOrder.note && <p><strong>Ghi chú:</strong> {selectedOrder.note}</p>}
                </div>
                <div className="detail-items-box">
                  <h4>Sản phẩm đã đặt</h4>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <ul className="detail-item-list">
                      {selectedOrder.items.map((item, idx) => (
                        <li key={idx}>
                          <div className="item-name">{item.productName || item.name} <b>x{item.quantity || item.cartQuantity}</b></div>
                          <div className="item-price">{formatPrice((item.price || 0) * (item.quantity || item.cartQuantity || 1))}</div>
                        </li>
                      ))}
                    </ul>
                  ) : <p>Không có thông tin sản phẩm.</p>}
                  <div className="detail-total-row">
                    <span>Tổng thanh toán:</span>
                    <span className="total-red">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
                {selectedOrder.status === 'PENDING' && (
                  <button className="btn-cancel-lg" onClick={(e) => openCancelModal(selectedOrder.orderId || selectedOrder.id, e)}>
                    Yêu cầu hủy đơn hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrackOrder;