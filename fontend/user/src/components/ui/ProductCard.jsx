import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  // Format tiền tệ chuẩn Việt Nam (vd: 12.990.000₫)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  // Giả lập dữ liệu khuyến mãi nếu trong mock data chưa có
  const currentPrice = Number(product.price);
  const oldPrice = currentPrice * 1.1; // Giả sử giá gốc đắt hơn 10%
  const discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);

  return (
    <Link to={`/product/${product.id}`} className="product-card">

      {/* NHÃN HOT DEAL GÓC TRÁI */}
      <div className="card-badge-hot">
        🔥 HOT DEAL
      </div>

      {/* KHUNG ẢNH CÓ VIỀN ĐỎ THEO MẪU */}
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

        {/* Đánh giá sao (Rating) */}
        <div className="card-rating">
          <span className="stars">⭐ 0.0</span>
          <span className="review-count">(0 đánh giá)</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;