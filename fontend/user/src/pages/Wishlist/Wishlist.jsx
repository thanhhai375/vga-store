import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist, clearWishlist } from '../../redux/wishlistSlice';
import { addToCart } from '../../redux/cartSlice';
import './Wishlist.css';

const Wishlist = () => {
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const dispatch = useDispatch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div className="wishlist-page container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">
          ❤️ Danh sách yêu thích
          <span className="wishlist-count">({wishlistItems.length} sản phẩm)</span>
        </h1>
        {wishlistItems.length > 0 && (
          <button className="btn-clear-wishlist" onClick={() => dispatch(clearWishlist())}>
            Xóa tất cả
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-heart-icon">💔</div>
          <h3>Danh sách yêu thích của bạn đang trống</h3>
          <p>Hãy khám phá sản phẩm và nhấn trái tim để lưu lại những VGA bạn thích!</p>
          <Link to="/products" className="btn-go-shop">Khám phá ngay</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-card">
              <button
                className="btn-remove-wish"
                onClick={() => dispatch(removeFromWishlist(item.id))}
                title="Xóa khỏi danh sách"
              >
                ✕
              </button>

              <Link to={`/product/${item.id}`} className="wish-img-wrapper">
                <img src={item.img || item.thumbnail} alt={item.name} className="wish-img" />
              </Link>

              <div className="wish-info">
                <div className="wish-brand">{item.brand?.name || item.brand || 'ASUS'}</div>
                <Link to={`/product/${item.id}`} className="wish-name">{item.name}</Link>
                <div className="wish-price">{formatPrice(item.price)}</div>

                {item.badge && <span className="wish-badge">{item.badge}</span>}

                <div className="wish-actions">
                  <button
                    className="btn-add-to-cart-wish"
                    onClick={() => {
                      dispatch(addToCart({ ...item, thumbnail: item.img || item.thumbnail }));
                    }}
                  >
                    🛒 Thêm vào giỏ
                  </button>
                  <Link to={`/product/${item.id}`} className="btn-view-detail-wish">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
