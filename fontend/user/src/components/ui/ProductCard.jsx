import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice"; // Đảm bảo đường dẫn import đúng
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Khởi tạo điều hướng

  // TẠO STATE QUẢN LÝ ẨN/HIỆN POPUP
  const [showPopup, setShowPopup] = useState(false);

  // Format tiền tệ chuẩn Việt Nam (vd: 12.990.000₫)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  // Giả lập dữ liệu khuyến mãi
  const currentPrice = Number(product.price);
  const oldPrice = currentPrice * 1.1; // Giả sử giá gốc đắt hơn 10%
  const discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);

  // Hàm xử lý thêm vào giỏ hàng
  const handleQuickAdd = (e) => {
    e.preventDefault(); // Chặn thẻ <Link> chuyển trang
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      thumbnail: product.img || product.image,
    };

    // Đẩy lên Redux
    dispatch(addToCart(itemToAdd));

    // BẬT POPUP THAY VÌ DÙNG alert()
    setShowPopup(true);
  };

  return (
    <>
      <Link to={`/product/${product.id}`} className="product-card">
        {/* NHÃN HOT DEAL GÓC TRÁI */}
        <div className="card-badge-hot">
          🔥 HOT DEAL
        </div>

        {/* KHUNG ẢNH */}
        <div className="card-image-wrapper">
          <img src={product.img || product.image} alt={product.name} className="card-image" />
        </div>

        <div className="card-info">
          {/* Tên sản phẩm giới hạn 2 dòng */}
          <h3 className="card-name">{product.name}</h3>

          <div className="card-price-area">
            {/* Giá cũ gạch chéo */}
            <div className="old-price-group">
              <span className="old-price">{formatPrice(oldPrice)}</span>
            </div>

            {/* Giá mới màu đỏ & Phần trăm giảm giá */}
            <div className="new-price-group">
              <span className="new-price">{formatPrice(currentPrice)}</span>
              <span className="discount-percent">-{discountPercent}%</span>
            </div>
          </div>

          {/* Đánh giá sao (Rating) & Nút MUA */}
          <div className="card-bottom-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <div className="card-rating">
              <span className="stars">⭐ 0.0</span>
              <span className="review-count" style={{ fontSize: '11px' }}>(0 đánh giá)</span>
            </div>

            {/* NÚT MUA NHANH (Màu đỏ chủ đạo) */}
            <button
              className="btn-quick-add"
              onClick={handleQuickAdd}
              style={{
                background: '#ed1b24', color: '#fff', border: 'none',
                padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '12px'
              }}
            >
              MUA
            </button>
          </div>
        </div>
      </Link>

      {/* GIAO DIỆN POPUP THÔNG BÁO XỊN SÒ */}
      {showPopup && (
        <div className="custom-popup-overlay" onClick={() => setShowPopup(false)}>
          {/* Ngăn không cho click vào box trắng bị đóng popup */}
          <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>

            {/* DẤU X ĐÓNG CỬA SỔ (Ở góc trên bên phải) */}
            <button className="popup-corner-close" onClick={() => setShowPopup(false)}>
              ✕
            </button>

            {/* Icon Checkmark màu xanh */}
            <div className="popup-icon-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <h3 className="popup-title">Đã thêm sản phẩm vào giỏ hàng!</h3>

            <div className="popup-actions">
              {/* Nút 1: Tiếp tục mua sắm (Đóng popup) */}
              <button className="popup-btn-continue" onClick={() => setShowPopup(false)}>
                Tiếp tục mua sắm
              </button>

              {/* Nút 2: Đi đến giỏ hàng (Chuyển trang) */}
              <button className="popup-btn-close" onClick={() => navigate('/cart')}>
                Đi đến giỏ hàng
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;