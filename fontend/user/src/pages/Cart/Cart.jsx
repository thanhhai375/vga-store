import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, decreaseCart, removeFromCart, clearCart } from '../../redux/cartSlice'; // Đảm bảo đường dẫn import đúng
import './Cart.css';

const Cart = () => {
  // Lấy danh sách sản phẩm từ kho Redux
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  // Hàm format tiền tệ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  // Tính tổng tiền trực tiếp từ các sản phẩm đang có trong giỏ
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);

  return (
    <div className="cart-page-container">
      <h2 className="cart-page-title">GIỎ HÀNG CỦA BẠN</h2>

      {cartItems.length === 0 ? (
        // NẾU GIỎ HÀNG TRỐNG
        <div className="cart-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <p>Hiện tại chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link to="/products" className="btn-continue-shopping">
            QUAY LẠI CỬA HÀNG
          </Link>
        </div>
      ) : (
        // NẾU CÓ HÀNG TRONG GIỎ
        <div className="cart-content-wrapper">

          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="cart-items-list">
            <div className="cart-header-row">
              <div className="col-product">Sản phẩm</div>
              <div className="col-price">Đơn giá</div>
              <div className="col-quantity">Số lượng</div>
              <div className="col-total">Thành tiền</div>
              <div className="col-action"></div>
            </div>

            {cartItems.map((item) => (
              <div className="cart-item-row" key={item.id}>
                <div className="col-product">
                  <img src={item.thumbnail} alt={item.name} className="cart-item-img" />
                  <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                </div>
                <div className="col-price">{formatPrice(item.price)}</div>
                <div className="col-quantity">
                  <div className="qty-controls">
                    <button onClick={() => dispatch(decreaseCart(item))}>-</button>
                    <span className="qty-number">{item.cartQuantity}</span>
                    <button onClick={() => dispatch(addToCart(item))}>+</button>
                  </div>
                </div>
                <div className="col-total">{formatPrice(item.price * item.cartQuantity)}</div>
                <div className="col-action">
                  <button className="btn-remove-item" onClick={() => dispatch(removeFromCart(item))}>
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <button className="btn-clear-all" onClick={() => dispatch(clearCart())}>
              Xóa toàn bộ giỏ hàng
            </button>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
          <div className="cart-summary-box">
            <h3 className="summary-title">Tóm tắt đơn hàng</h3>
            <div className="summary-line">
              <span>Tạm tính:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="summary-line">
              <span>Phí vận chuyển:</span>
              <span>Chưa tính</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-line summary-total">
              <span>Tổng cộng:</span>
              <span className="final-price">{formatPrice(totalAmount)}</span>
            </div>
           <Link to="/checkout" className="btn-checkout-now" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
  TIẾN HÀNH THANH TOÁN
</Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;