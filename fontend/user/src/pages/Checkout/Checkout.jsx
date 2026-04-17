import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/cartSlice';
import { addOrder } from '../../redux/orderSlice';
import './Checkout.css';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State lưu thông tin form
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  // State Vận chuyển & Thanh toán
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Tính toán tiền bạc
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  const shippingFee = shippingMethod === 'express' ? 50000 : 0; // Hỏa tốc 50k, Tiêu chuẩn 0đ
  const finalTotal = totalAmount + shippingFee;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const randomId = 'VGA-' + Math.floor(100000 + Math.random() * 900000);
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const newOrder = {
      id: randomId,
      date: formattedDate,
      total: formatPrice(finalTotal), // Lưu tổng tiền đã cộng ship
      status: 'Chờ duyệt',
      statusColor: '#f59e0b',
      shippingMethod: shippingMethod,
      paymentMethod: paymentMethod,
      customerInfo: customerInfo,
      items: cartItems
    };

    dispatch(addOrder(newOrder));
    setShowSuccessPopup(true);
  };

  const handleFinishOrder = (path) => {
    dispatch(clearCart());
    navigate(path);
  };

  if (cartItems.length === 0 && !showSuccessPopup) {
    return (
      <div className="checkout-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '80px', marginBottom: '20px' }}>
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          <line x1="3" y1="3" x2="21" y2="21"></line>
        </svg>
        <h2>Giỏ hàng của bạn đang trống!</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Vui lòng thêm sản phẩm vào giỏ để tiến hành thanh toán.</p>
        <Link to="/products" className="btn-return-shop">QUAY LẠI MUA SẮM</Link>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-layout">
          <h2 className="checkout-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d8282e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            THANH TOÁN AN TOÀN
          </h2>

          <div className="checkout-content">
            {/* CỘT TRÁI: FORM */}
            <form className="checkout-form-column" onSubmit={handlePlaceOrder}>

              {/* KHỐI 1: THÔNG TIN GIAO HÀNG */}
              <div className="checkout-section-block">
                <div className="section-header">
                  <span className="step-number">1</span>
                  <h3>Thông tin giao hàng</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input type="text" name="fullName" required placeholder="Ví dụ: Nguyễn Văn A" onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input type="tel" name="phone" required placeholder="Nhập số điện thoại" onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Địa chỉ nhận hàng *</label>
                  <input type="text" name="address" required placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." onChange={handleChange} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Ghi chú (Tùy chọn)</label>
                  <textarea name="note" rows="2" placeholder="Ghi chú thời gian nhận hàng, chỉ dẫn cho shipper..." onChange={handleChange}></textarea>
                </div>
              </div>

              {/* KHỐI 2: PHƯƠNG THỨC VẬN CHUYỂN */}
              <div className="checkout-section-block">
                <div className="section-header">
                  <span className="step-number">2</span>
                  <h3>Phương thức vận chuyển</h3>
                </div>
                <div className="shipping-methods">
                  <label className={`method-card ${shippingMethod === 'standard' ? 'active' : ''}`}>
                    <input type="radio" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                    <div className="method-info">
                      <span className="method-name">Giao hàng tiêu chuẩn (Dự kiến 3-5 ngày)</span>
                      <span className="method-price text-green">Miễn phí</span>
                    </div>
                  </label>
                  <label className={`method-card ${shippingMethod === 'express' ? 'active' : ''}`}>
                    <input type="radio" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                    <div className="method-info">
                      <span className="method-name">Giao hàng hỏa tốc (Nhận trong 24h)</span>
                      <span className="method-price text-red">50.000₫</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* KHỐI 3: PHƯƠNG THỨC THANH TOÁN */}
              <div className="checkout-section-block">
                <div className="section-header">
                  <span className="step-number">3</span>
                  <h3>Phương thức thanh toán</h3>
                </div>

                <div className="payment-methods">
                  <label className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <div className="payment-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <div className="payment-info">
                      <strong>Thanh toán khi nhận hàng (COD)</strong>
                      <span>Thanh toán bằng tiền mặt khi shipper giao hàng tới.</span>
                    </div>
                  </label>

                  <label className={`payment-method-card ${paymentMethod === 'bank' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                    <div className="payment-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                    </div>
                    <div className="payment-info">
                      <strong>Chuyển khoản ngân hàng (Quét mã QR)</strong>
                      <span>Tiện lợi, an toàn, xác nhận đơn hàng tự động.</span>
                    </div>
                  </label>
                </div>

                {/* HIỂN THỊ MÃ QR KHI CHỌN CHUYỂN KHOẢN */}
                {paymentMethod === 'bank' && (
                  <div className="bank-transfer-box">
                    <div className="bank-transfer-info">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bank-shield-icon">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <h4 className="bank-transfer-title">Thanh toán an toàn</h4>
                      <p>
                        Thông tin tài khoản và <strong>Mã QR thanh toán</strong> sẽ được tạo tự động và hiển thị ở bước tiếp theo sau khi bạn bấm <strong>Xác nhận đặt hàng</strong>.
                      </p>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-place-order">XÁC NHẬN ĐẶT HÀNG</button>
              </div>
            </form>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className="checkout-summary-section">
              <h3>Đơn hàng của bạn ({cartItems.length} sản phẩm)</h3>

              <div className="checkout-items-list">
                {cartItems.map((item) => {
                  const cardImage = item.imgUrl || item.img || item.thumbnail || '/images/products/gpu_original.png';
                  return (
                    <div key={item.id} className="checkout-summary-item">
                      <img src={cardImage} alt={item.name} className="checkout-item-thumb" />
                      <div className="checkout-item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price-qty">
                          <span className="item-qty">SL: {item.cartQuantity}</span>
                          <span className="item-price">{formatPrice(item.price * item.cartQuantity)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-bill-details">
                <div className="checkout-total-line">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="checkout-total-line">
                  <span>Phí vận chuyển</span>
                  {shippingFee === 0 ? (
                    <span className="text-green">Miễn phí</span>
                  ) : (
                    <span className="text-red">+{formatPrice(shippingFee)}</span>
                  )}
                </div>
                <div className="checkout-total-line final">
                  <span>Tổng thanh toán</span>
                  <span className="final-price">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP THÀNH CÔNG */}
      {showSuccessPopup && (
        <div className="checkout-popup-overlay">
          <div className="checkout-popup-content">
            <div className="popup-icon-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '36px', height: '36px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <h3 className="popup-title">Đặt hàng thành công!</h3>
            <p className="popup-message">Cảm ơn bạn đã tin tưởng mua sắm tại VGA STORE. Thông tin đơn hàng đã được ghi nhận.</p>

            <div className="popup-actions">
              <button className="popup-btn-track" onClick={() => handleFinishOrder('/track-order')}>
                Theo dõi tiến độ đơn hàng
              </button>
              <button className="popup-btn-home" onClick={() => handleFinishOrder('/')}>
                Quay lại Trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;