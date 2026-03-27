import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  return (
    <div className="cart-page container">
      <div className="cart-content-wrapper">

        {/* ================= THANH TIẾN TRÌNH (STEPPER) ================= */}
        <div className="cart-stepper-box">
          <div className="cart-stepper">

            {/* Bước 1: Giỏ hàng (Đang Active) */}
            <div className="step active">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-3V6a4 4 0 0 0-8 0v2H5c-1.1 0-2 .9-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-9-2a2 2 0 0 1 4 0v2h-4V6zm9 14H5V10h14v10z"/></svg>
              </div>
              <span>Giỏ hàng</span>
            </div>

            <div className="step-line"></div>

            {/* Bước 2: Thông tin đặt hàng */}
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/></svg>
              </div>
              <span>Thông tin đặt hàng</span>
            </div>

            <div className="step-line"></div>

            {/* Bước 3: Thanh toán */}
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
              </div>
              <span>Thanh toán</span>
            </div>

            <div className="step-line"></div>

            {/* Bước 4: Hoàn tất */}
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <span>Hoàn tất</span>
            </div>

          </div>
        </div>

        {/* ================= TRẠNG THÁI GIỎ HÀNG TRỐNG ================= */}
        <div className="empty-cart-section">
          <p className="empty-message">Giỏ hàng của bạn đang trống</p>
          {/* Trỏ link về trang /products để khách mua tiếp */}
          <Link to="/products" className="btn-continue-shopping">
            TIẾP TỤC MUA HÀNG
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Cart;