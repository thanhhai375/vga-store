import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../../redux/cartSlice';
import { orderService } from '../../services/orderService';
import cartService from '../../services/cartService';
import './Checkout.css';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated } = useSelector((state) => state.auth) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Popup thành công
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState('');
  const [paymentUrl, setPaymentUrl] = useState(''); // URL VNPay redirect

  const [bankInfo, setBankInfo] = useState({
    bankName: 'Đang tải...',
    accountNumber: '...',
    accountName: '...',
    bankId: ''
  });

  useEffect(() => {
    // Gọi API settings để lấy cấu hình
    axios.get('http://localhost:8080/api/settings/public')
      .then(res => {
        const data = res.data || {};
        setBankInfo({
          bankId: data.BANK_ID || '970436', // Vietcombank default
          accountNumber: data.BANK_ACC_NO || '0000000',
          accountName: data.BANK_ACC_NAME || 'VGA STORE',
          bankName: data.BANK_ID || 'Vietcombank' // VietQR có thể tự map nếu dùng img.vietqr.io
        });
      })
      .catch(err => console.log('Không tải được settings', err));
  }, []);
  const totalAmount = checkoutItems.reduce((total, item) => total + (item.price * (item.cartQuantity || 1)), 0);
  const shippingFee = shippingMethod === 'express' ? 50000 : 0;
  const finalTotal = totalAmount + shippingFee;

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (checkoutItems.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // 1. Tạo đơn hàng
      const orderPayload = {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        address: customerInfo.address,
        note: customerInfo.note || '',
        items: checkoutItems.map(item => ({
          productId: item.id,
          quantity: item.cartQuantity,
          price: Number(item.price)
        }))
      };

      const orderResult = await orderService.createOrder(orderPayload);
      const orderId = orderResult?.orderId || orderResult?.id;
      const orderCode = orderResult?.orderCode || orderResult?.id || 'N/A';
      setCreatedOrderCode(orderCode);

      // 2. Tạo payment (gắn phương thức thanh toán vào đơn)
      let paymentResult = null;
      if (orderId) {
        try {
          paymentResult = await orderService.createPayment(orderId, paymentMethod);
        } catch (payErr) {
          console.warn('Tạo payment error (non-fatal):', payErr);
        }
      }

      // 3. Xóa giỏ hàng local/DB (CHỈ áp dụng khi checkout từ giỏ hàng, KHÔNG áp dụng cho Mua Ngay)
      if (!buyNowItem) {
        dispatch(clearCart());
        if (isAuthenticated) {
          await cartService.clearCart();
        }
      }

      // 4. Nếu VNPay → redirect sang cổng thanh toán
      if (paymentMethod === 'VNPAY' && paymentResult?.paymentUrl) {
        window.location.href = paymentResult.paymentUrl;
        return;
      }

      // 5. Hiển thị popup thành công (COD / Bank Transfer)
      setPaymentUrl(paymentResult?.paymentUrl || '');
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Lỗi đặt hàng:', err);
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOrder = (path) => {
    navigate(path);
  };

  if (checkoutItems.length === 0 && !showSuccessPopup) {
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
                  {/* COD */}
                  <label className={`payment-method-card ${paymentMethod === 'COD' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                    <div className="payment-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <div className="payment-info">
                      <strong>Thanh toán khi nhận hàng (COD)</strong>
                      <span>Thanh toán bằng tiền mặt khi shipper giao hàng tới.</span>
                    </div>
                  </label>

                  {/* BANK TRANSFER / QR */}
                  <label className={`payment-method-card ${paymentMethod === 'BANK_TRANSFER' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="BANK_TRANSFER" checked={paymentMethod === 'BANK_TRANSFER'} onChange={() => setPaymentMethod('BANK_TRANSFER')} />
                    <div className="payment-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                    </div>
                    <div className="payment-info">
                      <strong>Chuyển khoản ngân hàng (Quét mã QR)</strong>
                      <span>Mã QR sẽ hiển thị sau khi xác nhận đơn hàng.</span>
                    </div>
                  </label>

                  {/* VNPAY */}
                  <label className={`payment-method-card ${paymentMethod === 'VNPAY' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} />
                    <div className="payment-icon vnpay-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <div className="payment-info">
                      <strong>Thanh toán VNPay</strong>
                      <span>Ví điện tử, thẻ ATM, thẻ quốc tế. Xác nhận tức thì.</span>
                    </div>
                    <span className="payment-badge-vnpay">VNPay</span>
                  </label>
                </div>

                {/* Box thông tin chuyển khoản */}
                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="bank-transfer-box">
                    <div className="bank-transfer-info">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bank-shield-icon">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <div>
                        <h4 className="bank-transfer-title">Thông tin tài khoản</h4>
                        <p><strong>Ngân hàng:</strong> {bankInfo.bankName}</p>
                        <p><strong>Số tài khoản:</strong> {bankInfo.accountNumber}</p>
                        <p><strong>Chủ tài khoản:</strong> {bankInfo.accountName}</p>
                        <p style={{ color: '#666', fontSize: '13px', marginTop: 6 }}>
                          Mã QR sẽ hiển thị sau khi bạn xác nhận đặt hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && <div className="checkout-error-msg">{error}</div>}

                <button type="submit" className="btn-place-order" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
                </button>
              </div>
            </form>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className="checkout-summary-section">
              <h3>Đơn hàng của bạn ({checkoutItems.length} sản phẩm)</h3>
              <div className="checkout-items-list">
                {checkoutItems.map((item) => {
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
                  <span>Tạm tính</span><span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="checkout-total-line">
                  <span>Phí vận chuyển</span>
                  {shippingFee === 0
                    ? <span className="text-green">Miễn phí</span>
                    : <span className="text-red">+{formatPrice(shippingFee)}</span>}
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
            {createdOrderCode && (
              <p className="popup-order-code">Mã đơn hàng: <strong>#{createdOrderCode}</strong></p>
            )}
            <p className="popup-message">
              {paymentMethod === 'BANK_TRANSFER'
                ? `Vui lòng chuyển khoản với nội dung: #${createdOrderCode} để xác nhận đơn hàng.`
                : 'Cảm ơn bạn đã tin tưởng mua sắm tại VGA STORE. Đơn hàng sẽ được xử lý sớm nhất.'}
            </p>

            {/* Hiển thị QR chuyển khoản nếu Bank Transfer */}
            {paymentMethod === 'BANK_TRANSFER' && (
              <div className="qr-payment-box">
                <img
                  src={`https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-compact2.png?amount=${finalTotal}&addInfo=DH${createdOrderCode}&accountName=${encodeURIComponent(bankInfo.accountName)}`}
                  alt="QR Chuyển khoản"
                  className="qr-payment-img"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <p className="qr-note">Quét mã để chuyển khoản nhanh</p>
              </div>
            )}

            <div className="popup-actions">
              <button className="popup-btn-track" onClick={() => handleFinishOrder('/track-order')}>
                Theo dõi đơn hàng
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