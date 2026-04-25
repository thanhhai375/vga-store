import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartDb } from "../../redux/cartSlice";
import { toggleWishlist } from "../../redux/wishlistSlice";
import "./ProductCard.css";

// TỐI ƯU HIỆU NĂNG: Khởi tạo bộ format tiền tệ ở ngoài Component
const currencyFormatter = new Intl.NumberFormat("vi-VN");

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);

  // 1. CHUYỂN TẤT CẢ HOOKS LÊN ĐẦU
  // Kiểm tra sản phẩm này có trong wishlist không
  const wishlistItems = useSelector(state => state.wishlist?.wishlistItems || []);
  const isWishlisted = product ? wishlistItems.some(item => item.id === product.id) : false;

  // BẢO VỆ CHỐNG SẬP: Nếu API chưa tải xong product, không render gì cả
  if (!product) return null;

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      import('../../redux/authSlice').then(({ openAuthModal }) => dispatch(openAuthModal()));
      return;
    }

    dispatch(toggleWishlist(product));
  };

  const formatPrice = (price) => {
    return currencyFormatter.format(price) + "₫";
  };

  const currentPrice = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || 0);
  let discountPercent = 0;
  if (oldPrice > currentPrice) {
    discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  }

  // 1. LẤY LINK ẢNH THÔNG MINH (Bao trọn mọi trường hợp từ API Backend của bạn)
  const dbImageUrl =
    product.imageUrl ||
    product.imgUrl ||
    product.img_url ||
    product.image ||
    (product.images && product.images.length > 0 && product.images[0]?.url);

  // Xử lý thông minh: Nếu ảnh được Upload từ Backend Admin (/uploads/..), nối thêm tên miền của Backend
  let formattedImageUrl = dbImageUrl;
  if (dbImageUrl && dbImageUrl.startsWith('/uploads/')) {
    formattedImageUrl = `http://localhost:8080${dbImageUrl}`;
  }

  // 2. CHỐT HẠ: Dùng ảnh gốc cực xịn của Asus làm phòng hờ nếu DB lỗi
  const fallbackImage = '/images/products/gpu_original.png';
  const finalImageUrl = (imgError || !formattedImageUrl) ? fallbackImage : formattedImageUrl;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      import('../../redux/authSlice').then(({ openAuthModal }) => dispatch(openAuthModal()));
      return;
    }

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      thumbnail: finalImageUrl,
    };

    dispatch(addToCartDb({ product: itemToAdd, quantity: 1 }));
    setShowPopup(true);
  };

  return (
    <>
      {/* LƯU Ý: Chỗ này mình để /products/${product.id}.
          Nếu cấu hình Route chi tiết của bạn là /product (không có s) hoặc /shop thì bạn tự sửa lại chữ s này nha */}
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
            {oldPrice > currentPrice && (
              <div className="old-price-group">
                <span className="old-price">{formatPrice(oldPrice)}</span>
              </div>
            )}
            <div className="new-price-group">
              <span className="new-price">{formatPrice(currentPrice)}</span>
              {discountPercent > 0 && <span className="discount-percent">-{discountPercent}%</span>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <div className="card-rating">
              <span className="stars" style={{ color: '#fbbf24' }}>
                {'⭐'.repeat(Math.max(1, Math.round(Number(product.averageRating || 5))))} 
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
                  {(product.averageRating || 5.0).toFixed(1)}
                </span>
              </span>
              <span className="review-count">({product.reviewCount || 0} đánh giá)</span>
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

      {/* POPUP GIỎ HÀNG */}
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