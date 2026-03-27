import React, { useState } from 'react';
import './TrackOrder.css';

const TrackOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Tất cả');

  // 1. STATE QUẢN LÝ TÌM KIẾM (Chuẩn bị sẵn cho Data thật sau này)
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Dữ liệu mẫu (Sau này sẽ được thay bằng dữ liệu fetch từ API)
  const mockOrders = [
    { id: 'VGA-240399', date: '24/03/2026', total: '55.000.000đ', status: 'Đang giao hàng', statusColor: '#3b82f6' },
    { id: 'VGA-180288', date: '18/02/2026', total: '12.490.000đ', status: 'Đã giao thành công', statusColor: '#10b981' },
    { id: 'VGA-050177', date: '05/01/2026', total: '850.000đ', status: 'Đã hủy', statusColor: '#ef4444' },
  ];

  const tabs = ['Tất cả', 'Đang giao hàng', 'Đã giao thành công', 'Đã hủy'];

  // Logic lọc theo Tab
  const filteredOrders = activeTab === 'Tất cả'
    ? mockOrders
    : mockOrders.filter(order => order.status === activeTab);

  // 2. HÀM XỬ LÝ KHI BẤM NÚT "KIỂM TRA"
  const handleSearch = (e) => {
    if (e) e.preventDefault();

    // Nếu để trống mà bấm tìm kiếm -> Quay về lịch sử
    if (!searchQuery.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    // Lọc data (Tìm mã ID có chứa ký tự vừa nhập, không phân biệt hoa thường)
    const results = mockOrders.filter(order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
    setHasSearched(true);
  };

  // 3. HÀM NÚT QUAY LẠI LỊCH SỬ (XÓA TÌM KIẾM)
  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setSearchResults([]);
  };

  // Quyết định xem sẽ render danh sách nào (Kết quả tìm kiếm hay Lịch sử tab)
  const displayOrders = hasSearched ? searchResults : filteredOrders;

  return (
    <div className="track-order-page container">
      <div className="track-order-layout">

        {/* KHỐI 1: TÌM KIẾM ĐƠN HÀNG */}
        <div className="track-search-section">
          <h2 className="track-title">Tra cứu trạng thái đơn hàng</h2>
          <p className="track-desc">Để kiểm tra tiến độ giao hàng, vui lòng nhập Mã đơn hàng hoặc Số điện thoại của bạn vào ô bên dưới.</p>

          <div className="track-search-box">
            <input
              type="text"
              placeholder="Nhập mã đơn hàng (VD: VGA-180288)..."
              className="track-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Nhấn Enter để tìm
            />
            <button className="track-btn" onClick={handleSearch}>KIỂM TRA</button>
          </div>
        </div>

        {/* KHỐI 2: KẾT QUẢ / LỊCH SỬ MUA HÀNG */}
        <div className="track-history-section">

          {/* HEADER CỦA BẢNG (Thay đổi linh hoạt) */}
          <div className="history-header-flex">
            <h3 className="history-title" style={{ margin: 0, border: 'none', padding: 0 }}>
              {hasSearched ? `Kết quả tìm kiếm cho: "${searchQuery}"` : 'Lịch sử đơn hàng gần đây'}
            </h3>

            {hasSearched && (
              <button className="clear-search-btn" onClick={clearSearch}>
                Quay lại Lịch sử
              </button>
            )}
          </div>
          <hr style={{ border: 'none', borderBottom: '1px solid #eaeaea', marginBottom: '20px' }}/>

          {/* THANH TABS (Chỉ hiện khi KHÔNG tìm kiếm) */}
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

          {/* BẢNG HIỂN THỊ */}
          <div className="history-table-wrapper">
            {displayOrders.length > 0 ? (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {displayOrders.map((order, index) => (
                    <tr key={index}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.date}</td>
                      <td><span className="order-price">{order.total}</span></td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: order.statusColor }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-orders">
                Không tìm thấy đơn hàng nào khớp với yêu cầu của bạn.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;