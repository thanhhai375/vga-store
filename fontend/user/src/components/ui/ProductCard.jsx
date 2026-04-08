import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { toggleWishlist } from "../../redux/wishlistSlice";
import "./ProductCard.css";


// TỐI ƯU HIỆU NĂNG: Khởi tạo bộ format tiền tệ ở ngoài Component
// để không bị tạo lại hàng chục lần mỗi khi render 20 cái card, chống giật web.
const currencyFormatter = new Intl.NumberFormat("vi-VN");

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Kiểm tra sản phẩm này có trong wishlist không
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  const formatPrice = (price) => {
    return currencyFormatter.format(price) + "₫";
  };

  const currentPrice = Number(product.price);
  const oldPrice = currentPrice * 1.1;
  const discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);

  // 1. Lấy link ảnh từ Database
  const dbImageUrl = product.imgUrl || product.img_url || product.img || product.image;

  // 2. CHỐT HẠ: Nếu ảnh trong DB bị lỗi (imgError) hoặc không có, tự động dùng ảnh local đã tải về máy.
  // Bạn cần để 1 tấm ảnh tên là 'default-vga.jpg' vào thư mục public/images/ để làm ảnh phòng hờ.
  const finalImageUrl = imgError || !dbImageUrl
    ? '/images/default-vga.jpg'
    : dbImageUrl;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      thumbnail: finalImageUrl,
    };

    dispatch(addToCart(itemToAdd));
    setShowPopup(true);
  };

  return (
    <>
      <Link to={`/product/${product.id}`} className="product-card">
        {/* Badge động từ product.badge */}
        {product.badge && <div className="card-badge-hot">{product.badge}</div>}

        {/* Nút Wishlist ❤️ */}
        <button
          className={`btn-wishlist ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>

        <div className="card-image-wrapper">
          {/* Dùng onError với State để chống sập web */}
          <img
            src={finalImageUrl}
            alt={product.name}
            className="card-image"
            onError={() => {
              if (!imgError) setImgError(true); // Chỉ đổi state 1 lần duy nhất, ngắt vòng lặp
            }}
          />
        </div>

        <div className="card-info">
          <h3 className="card-name" title={product.name}>{product.name}</h3>

          <div className="card-price-area">
            <div className="old-price-group">
              <span className="old-price">{formatPrice(oldPrice)}</span>
            </div>
            <div className="new-price-group">
              <span className="new-price">{formatPrice(currentPrice)}</span>
              <span className="discount-percent">-{discountPercent}%</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <div className="card-rating">
              <span className="stars">⭐ 0.0</span>
              <span className="review-count">(0 đánh giá)</span>
            </div>

            <button
              className="btn-quick-add"
              onClick={handleQuickAdd}
            >
              MUA
            </button>
          </div>
        </div>
      </Link>

      {/* POPUP GIỎ HÀNG (Giữ nguyên giao diện của bạn) */}
      {showPopup && (
        <div className="custom-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-corner-close" onClick={() => setShowPopup(false)}>✕</button>
            <div className="popup-icon-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="popup-title">Đã thêm sản phẩm vào giỏ hàng!</h3>
            <div className="popup-actions">
              <button className="popup-btn-continue" onClick={() => setShowPopup(false)}>Tiếp tục mua sắm</button>
              <button className="popup-btn-close" onClick={() => navigate('/cart')}>Đi đến giỏ hàng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;