import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cancelOrder, updateOrderAddress } from '../../redux/orderSlice';
import './TrackOrder.css';

const TrackOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Tất cả');
  const tabs = ['Tất cả', 'Chờ duyệt', 'Đang xử lý', 'Đang giao hàng', 'Đã giao thành công', 'Yêu cầu hủy', 'Đã hủy'];

  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // STATE CHO POPUP CHI TIẾT
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressValue, setEditAddressValue] = useState('');

  // STATE CHO POPUP LÝ DO HỦY ĐƠN
  const [cancelModalData, setCancelModalData] = useState({ isOpen: false, orderId: null });
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  // 🌟 STATE CHO THÔNG BÁO HIỆN GÓC MÀN HÌNH (TOAST)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const dispatch = useDispatch();
  const mockOrders = useSelector(state => state.order.orders);

  const filteredOrders = activeTab === 'Tất cả'
    ? mockOrders
    : mockOrders.filter(order => order.status === activeTab);

  // HÀM HIỂN THỊ THÔNG BÁO XỊN XÒ
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }
    const results = mockOrders.filter(order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setSearchResults([]);
  };

  const openCancelModal = (orderId, e) => {
    e.stopPropagation();
    setCancelModalData({ isOpen: true, orderId });
    setCancelReason('');
    setOtherReason('');
    setSelectedOrder(null);
  };

  const submitCancelRequest = () => {
    if (!cancelReason) {
      showToast('Vui lòng chọn một lý do hủy đơn!', 'error');
      return;
    }
    const finalReason = cancelReason === 'Khác' ? otherReason : cancelReason;

    if (cancelReason === 'Khác' && !finalReason.trim()) {
      showToast('Vui lòng nhập lý do cụ thể của bạn!', 'error');
      return;
    }

    dispatch(cancelOrder({ orderId: cancelModalData.orderId, reason: finalReason }));

    showToast(`Đã gửi yêu cầu hủy đơn hàng ${cancelModalData.orderId} cho Admin!`, 'success');
    setCancelModalData({ isOpen: false, orderId: null });
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsEditingAddress(false);
    setEditAddressValue(order.customerInfo?.address || '');
  };

  const saveNewAddress = () => {
    if (!editAddressValue.trim()) {
      showToast("Địa chỉ không được để trống!", "error");
      return;
    }
    dispatch(updateOrderAddress({ orderId: selectedOrder.id, newAddress: editAddressValue }));

    setSelectedOrder({
      ...selectedOrder,
      customerInfo: { ...selectedOrder.customerInfo, address: editAddressValue }
    });
    setIsEditingAddress(false);
    showToast("Cập nhật địa chỉ thành công!", "success");
  };

  const displayOrders = hasSearched ? searchResults : filteredOrders;
  const formatPriceNum = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

  const getStatusClass = (status) => {
    switch (status) {
      case 'Chờ duyệt': return 'status-pending';
      case 'Đang xử lý': return 'status-processing';
      case 'Đang giao hàng': return 'status-delivering';
      case 'Đã giao thành công': return 'status-success';
      case 'Yêu cầu hủy': return 'status-cancel-request';
      case 'Đã hủy': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const cancelReasonsList = [
    "Muốn thay đổi địa chỉ / Số điện thoại nhận hàng",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Thay đổi ý định, không muốn mua nữa",
    "Thời gian giao hàng dự kiến quá lâu",
    "Khác"
  ];

  return (
    <>
      {/* 🌟 GIAO DIỆN THÔNG BÁO GÓC PHẢI */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' ? '✓' : '⚠'}
          </div>
          {toast.message}
        </div>
      )}

      <div className="track-order-page">
        <div className="track-order-layout">

          <div className="track-search-section">
            <h2 className="track-title">Tra cứu trạng thái đơn hàng</h2>
            <p className="track-desc">Để kiểm tra tiến độ giao hàng, vui lòng nhập Mã đơn hàng của bạn vào ô bên dưới.</p>
            <div className="track-search-box">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng (VD: VGA-180288)..."
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
                {hasSearched ? `Kết quả tìm kiếm cho: "${searchQuery}"` : 'Lịch sử đơn hàng gần đây'}
              </h3>
              {hasSearched && (
                <button className="clear-search-btn" onClick={clearSearch}>Quay lại Lịch sử</button>
              )}
            </div>

            <hr className="history-divider" />

            {!hasSearched && (
              <div className="order-tabs">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    className={`order-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            <div className="history-table-wrapper">
              {displayOrders.length > 0 ? (
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
                    {displayOrders.map((order, index) => (
                      <tr key={index} onClick={() => openOrderDetail(order)} className="clickable-row">
                        <td><strong className="order-id-link">{order.id}</strong></td>
                        <td>{order.date}</td>
                        <td><span className="order-price">{order.total}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {order.status === 'Chờ duyệt' ? (
                            <button onClick={(e) => openCancelModal(order.id, e)} className="btn-cancel-sm">
                              Hủy đơn
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#888' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-orders">Không tìm thấy đơn hàng nào khớp với yêu cầu của bạn.</div>
              )}
            </div>
          </div>
        </div>

        {cancelModalData.isOpen && (
          <div className="order-detail-overlay">
            <div className="cancel-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="cancel-modal-header">
                <h3>Yêu cầu hủy đơn hàng <span className="text-red">{cancelModalData.orderId}</span></h3>
                <button className="close-modal" onClick={() => setCancelModalData({ isOpen: false, orderId: null })}>✕</button>
              </div>
              <div className="cancel-modal-body">
                <p className="cancel-warning">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Vui lòng chọn lý do hủy để chúng tôi hỗ trợ bạn tốt hơn. Yêu cầu của bạn sẽ được Admin xét duyệt.
                </p>

                <div className="cancel-reasons-list">
                  {cancelReasonsList.map((reason, idx) => (
                    <label key={idx} className={`reason-radio-card ${cancelReason === reason ? 'active' : ''}`}>
                      <input
                        type="radio" name="cancelReason" value={reason}
                        checked={cancelReason === reason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                {cancelReason === 'Khác' && (
                  <textarea
                    className="other-reason-input"
                    placeholder="Vui lòng nhập lý do hủy cụ thể..." rows="3"
                    value={otherReason} onChange={(e) => setOtherReason(e.target.value)}
                  />
                )}
              </div>
              <div className="cancel-modal-footer">
                <button className="btn-cancel-action outline" onClick={() => setCancelModalData({ isOpen: false, orderId: null })}>Quay lại</button>
                <button className="btn-cancel-action primary" onClick={submitCancelRequest}>Gửi Yêu Cầu Hủy</button>
              </div>
            </div>
          </div>
        )}

        {selectedOrder && !cancelModalData.isOpen && (
          <div className="order-detail-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi tiết đơn hàng: <span style={{ color: '#2563eb' }}>{selectedOrder.id}</span></h3>
                <button className="close-modal" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div className="modal-body">
                <div className="detail-status-box">
                  <span style={{ fontWeight: 600, color: '#333' }}>Trạng thái hiện tại:</span>
                  <span className={`status-badge ${getStatusClass(selectedOrder.status)}`} style={{ fontSize: '13px' }}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="detail-customer-box">
                  <h4>Thông tin giao hàng</h4>
                  <p><strong>Người nhận:</strong> {selectedOrder.customerInfo?.fullName || 'N/A'}</p>
                  <p><strong>Điện thoại:</strong> {selectedOrder.customerInfo?.phone || 'N/A'}</p>

                  <div className="address-section">
                    <strong>Địa chỉ: </strong>
                    {isEditingAddress ? (
                      <div className="edit-address-form">
                        <input type="text" value={editAddressValue} onChange={(e) => setEditAddressValue(e.target.value)} className="edit-address-input" />
                        <div className="edit-actions">
                          <button onClick={saveNewAddress} className="btn-save-address">Lưu</button>
                          <button onClick={() => setIsEditingAddress(false)} className="btn-cancel-address">Hủy</button>
                        </div>
                      </div>
                    ) : (
                      <span className="current-address">
                        {selectedOrder.customerInfo?.address || 'N/A'}
                        {selectedOrder.status === 'Chờ duyệt' && (
                          <button onClick={() => setIsEditingAddress(true)} className="btn-edit-address">✎ Sửa</button>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-items-box">
                  <h4>Sản phẩm đã đặt</h4>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <ul className="detail-item-list">
                      {selectedOrder.items.map((item, idx) => (
                        <li key={idx}>
                          <div className="item-name">{item.name} <b>x{item.cartQuantity}</b></div>
                          <div className="item-price">{formatPriceNum(item.price * item.cartQuantity)}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có thông tin sản phẩm.</p>
                  )}
                  <div className="detail-total-row">
                    <span>Tổng thanh toán:</span>
                    <span className="total-red">{selectedOrder.total}</span>
                  </div>
                </div>

                {selectedOrder.status === 'Chờ duyệt' && (
                  <button className="btn-cancel-lg" onClick={(e) => openCancelModal(selectedOrder.id, e)}>
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