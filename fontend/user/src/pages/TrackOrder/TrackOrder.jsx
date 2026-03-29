import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cancelOrder, updateOrderAddress } from '../../redux/orderSlice';
import './TrackOrder.css';

const TrackOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // STATE CHO POPUP CHI TIẾT
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressValue, setEditAddressValue] = useState('');

  const dispatch = useDispatch();
  const mockOrders = useSelector(state => state.order.orders);

  const tabs = ['Tất cả', 'Chờ duyệt', 'Đang xử lý', 'Đang giao hàng', 'Đã giao thành công', 'Đã hủy'];

  const filteredOrders = activeTab === 'Tất cả'
    ? mockOrders
    : mockOrders.filter(order => order.status === activeTab);

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

  const handleCancelOrder = (orderId, e) => {
    e.stopPropagation(); // Ngăn click lan ra row để không mở popup
    if(window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId} không?`)) {
      dispatch(cancelOrder(orderId));
      setSelectedOrder(null); // Đóng popup nếu đang mở
    }
  };

  // Mở popup chi tiết
  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsEditingAddress(false);
    setEditAddressValue(order.customerInfo?.address || '');
  };

  // Lưu địa chỉ mới
  const saveNewAddress = () => {
    if(!editAddressValue.trim()) return alert("Địa chỉ không được để trống!");
    dispatch(updateOrderAddress({ orderId: selectedOrder.id, newAddress: editAddressValue }));

    // Cập nhật lại UI popup tạm thời
    setSelectedOrder({
      ...selectedOrder,
      customerInfo: { ...selectedOrder.customerInfo, address: editAddressValue }
    });
    setIsEditingAddress(false);
    alert("Cập nhật địa chỉ thành công!");
  };

  const displayOrders = hasSearched ? searchResults : filteredOrders;

  const formatPriceNum = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

  return (
    <div className="track-order-page container">
      <div className="track-order-layout">

        {/* KHỐI 1: TÌM KIẾM */}
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

        {/* KHỐI 2: LỊCH SỬ MUA HÀNG */}
        <div className="track-history-section">
          <div className="history-header-flex">
            <h3 className="history-title" style={{ margin: 0, border: 'none', padding: 0 }}>
              {hasSearched ? `Kết quả tìm kiếm cho: "${searchQuery}"` : 'Lịch sử đơn hàng gần đây'}
            </h3>
            {hasSearched && (
              <button className="clear-search-btn" onClick={clearSearch}>Quay lại Lịch sử</button>
            )}
          </div>
          <hr style={{ border: 'none', borderBottom: '1px solid #eaeaea', marginBottom: '20px' }}/>

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
                    <th>Trạng thái</th>
                    <th style={{textAlign: 'center'}}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {displayOrders.map((order, index) => (
                    <tr key={index} onClick={() => openOrderDetail(order)} className="clickable-row">
                      <td><strong style={{color: '#ed1b24', cursor: 'pointer'}}>{order.id}</strong></td>
                      <td>{order.date}</td>
                      <td><span className="order-price">{order.total}</span></td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: order.statusColor }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{textAlign: 'center'}}>
                        {order.status === 'Chờ duyệt' ? (
                          <button
                            onClick={(e) => handleCancelOrder(order.id, e)}
                            className="btn-cancel-sm"
                          >
                            Hủy đơn
                          </button>
                        ) : (
                          <span style={{fontSize: '12px', color: '#888'}}>-</span>
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

      {/* POPUP CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div className="order-detail-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng: {selectedOrder.id}</h3>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Box Trạng thái */}
              <div className="detail-status-box">
                <span>Trạng thái hiện tại:</span>
                <span className="status-badge" style={{ backgroundColor: selectedOrder.statusColor, fontSize: '14px' }}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Box Thông tin khách hàng */}
              <div className="detail-customer-box">
                <h4>Thông tin giao hàng</h4>
                <p><strong>Người nhận:</strong> {selectedOrder.customerInfo?.fullName || 'N/A'}</p>
                <p><strong>Điện thoại:</strong> {selectedOrder.customerInfo?.phone || 'N/A'}</p>

                <div className="address-section">
                  <strong>Địa chỉ: </strong>

                  {isEditingAddress ? (
                    <div className="edit-address-form">
                      <input
                        type="text"
                        value={editAddressValue}
                        onChange={(e) => setEditAddressValue(e.target.value)}
                        className="edit-address-input"
                      />
                      <div className="edit-actions">
                        <button onClick={saveNewAddress} className="btn-save-address">Lưu</button>
                        <button onClick={() => setIsEditingAddress(false)} className="btn-cancel-address">Hủy</button>
                      </div>
                    </div>
                  ) : (
                    <span className="current-address">
                      {selectedOrder.customerInfo?.address || 'N/A'}
                      {/* CHỈ HIỆN NÚT SỬA NẾU ĐƠN CHỜ DUYỆT */}
                      {selectedOrder.status === 'Chờ duyệt' && (
                        <button onClick={() => setIsEditingAddress(true)} className="btn-edit-address">
                          ✎ Sửa
                        </button>
                      )}
                    </span>
                  )}
                </div>
                {selectedOrder.customerInfo?.note && (
                  <p><strong>Ghi chú:</strong> {selectedOrder.customerInfo.note}</p>
                )}
              </div>

              {/* Box Sản phẩm */}
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

              {/* Nút dưới cùng */}
              {selectedOrder.status === 'Chờ duyệt' && (
                <button
                  className="btn-cancel-lg"
                  onClick={(e) => handleCancelOrder(selectedOrder.id, e)}
                >
                  Hủy đơn hàng này
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;