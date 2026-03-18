import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Hàm format tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <img src={product.img} alt={product.name} className="card-image" />
        {product.stock === 0 && <span className="badge-soldout">Hết hàng</span>}
      </div>

      <div className="card-info">
        <span className="card-brand">{product.brand}</span>
        <h3 className="card-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="card-vram">{product.vram}</p>

        <div className="card-bottom">
          <span className="card-price">{formatPrice(product.price)}</span>
          <button
            className="btn-add-cart"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;