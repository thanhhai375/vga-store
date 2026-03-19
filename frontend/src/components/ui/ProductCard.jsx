import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <img src={product.img} alt={product.name} className="card-image" />
      </div>

      <div className="card-info">
        <span className="card-brand">{product.brand}</span>
        <h3 className="card-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="card-bottom">
          <span className="card-price">{formatPrice(product.price)}</span>
          <button className={`btn-add-cart ${product.name.includes('White') ? 'btn-outline' : ''}`}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;