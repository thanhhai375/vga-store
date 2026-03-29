import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/cartSlice';
import { addOrder } from '../../redux/orderSlice'; // <-- 1. IMPORT THÊM HÀNH ĐỘNG THÊM ĐƠN HÀNG
import './Checkout.css';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State lưu thông tin khách hàng điền
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  // STATE QUẢN LÝ POPUP THÀNH CÔNG
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Tính tổng tiền từ Redux
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  // Hàm bắt sự kiện gõ phím
  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  // Hàm xử lý khi bấm XÁC NHẬN ĐẶT HÀNG
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // 2. TẠO MÃ ĐƠN HÀNG VÀ NGÀY THÁNG ĐỂ LƯU VÀO LỊCH SỬ
    const randomId = 'VGA-' + Math.floor(100000 + Math.random() * 900000); // Tạo mã ngẫu nhiên VD: VGA-123456

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const newOrder = {
      id: randomId,
      date: formattedDate,
      total: formatPrice(totalAmount),
      status: 'Chờ duyệt', // <-- Mặc định mới đặt là Chờ duyệt
      statusColor: '#f59e0b',
      customerInfo: customerInfo, // <-- Lưu thông tin form
      items: cartItems // <-- Lưu danh sách VGA đã mua
    };
    // 3. ĐẨY ĐƠN HÀNG MỚI VÀO KHO REDUX (ORDER SLICE)
    dispatch(addOrder(newOrder));

    // Log data (để sau này gửi Backend)
    console.log("Thông tin người đặt:", customerInfo);
    console.log("Đơn hàng đã lưu vào Redux:", newOrder);

    // BẬT POPUP THÀNH CÔNG
    setShowSuccessPopup(true);
  };

  // Xử lý khi bấm nút trong Popup
  const handleFinishOrder = (path) => {
    dispatch(clearCart()); // Xóa sạch giỏ hàng
    navigate(path); // Chuyển trang (về Track Order hoặc Home)
  };

  // Nếu giỏ hàng trống và KHÔNG CÓ popup nào đang mở thì đuổi về trang chủ
  if (cartItems.length === 0 && !showSuccessPopup) {
    return (
      <div className="checkout-empty">
        <h2>Giỏ hàng của bạn đang trống!</h2>
        <Link to="/products">Quay lại mua sắm</Link>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-page container">
        <h2 className="checkout-title">THANH TOÁN</h2>

        <div className="checkout-content">
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <div className="checkout-form-section">
            <h3>Thông tin giao hàng</h3>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label>Họ và tên *</label>
                <input type="text" name="fullName" required placeholder="Nhập họ và tên" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input type="tel" name="phone" required placeholder="Nhập số điện thoại" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Địa chỉ nhận hàng *</label>
                <input type="text" name="address" required placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Ghi chú (Tùy chọn)</label>
                <textarea name="note" rows="3" placeholder="Ghi chú thêm về đơn hàng..." onChange={handleChange}></textarea>
              </div>

              <button type="submit" className="btn-place-order">XÁC NHẬN ĐẶT HÀNG</button>
            </form>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="checkout-summary-section">
            <h3>Đơn hàng của bạn ({cartItems.length} sản phẩm)</h3>

            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <div className="item-name-qty">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x {item.cartQuantity}</span>
                  </div>
                  <span className="item-price">{formatPrice(item.price * item.cartQuantity)}</span>
                </div>
              ))}
            </div>

            <hr />

            <div className="checkout-total-line">
              <span>Tạm tính</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="checkout-total-line">
              <span>Phí giao hàng</span>
              <span>Miễn phí</span>
            </div>
            <div className="checkout-total-line final">
              <span>Tổng cộng</span>
              <span className="final-price">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GIAO DIỆN POPUP ĐẶT HÀNG THÀNH CÔNG */}
      {showSuccessPopup && (
        <div className="checkout-popup-overlay">
          <div className="checkout-popup-content">
            <div className="popup-icon-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <h3 className="popup-title">Đơn hàng của bạn đã đặt thành công!</h3>
            <p className="popup-message">Cảm ơn bạn đã tin tưởng mua sắm tại VGA STORE.</p>

            <div className="popup-actions">
              <button
                className="popup-btn-track"
                onClick={() => handleFinishOrder('/track-order')}
              >
                Chuyển tới tình trạng đơn hàng
              </button>
              <button
                className="popup-btn-home"
                onClick={() => handleFinishOrder('/')}
              >
                Thoát về Trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;