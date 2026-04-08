import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { productService } from '../../services/productService';
import './BestSellers.css';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAll()
      .then(data => setProducts(data.slice(0, 3)))  // Chỉ lấy 3 sản phẩm bán chạy nhất
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="bs-section">
      <div className="container bs-header">
        <h2 className="bs-title">SẢN PHẨM BÁN CHẠY</h2>
      </div>
      <div className="bs-loading">Đang tải sản phẩm...</div>
    </section>
  );

  if (products.length === 0) return null;

  return (
    <section className="bs-section">
      <div className="container bs-header">
        <div>
          <h2 className="bs-title">SẢN PHẨM BÁN CHẠY</h2>
          <p className="bs-sub">Những chiếc GPU được game thủ tin chọn nhiều nhất</p>
        </div>
        <Link to="/products" className="bs-see-all">
          Xem tất cả <span>›</span>
        </Link>
      </div>

      <div className="container">
        <div className="bs-grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
