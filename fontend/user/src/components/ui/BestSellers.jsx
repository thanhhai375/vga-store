import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import './BestSellers.css';

const BestSellers = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getAll()
      .then(data => setProducts(data.slice(0, 4))) // Đổi thành 4 sản phẩm
      .catch(() => { });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bs-section">
      <div className="container">
        <div className="bs-header-center">
          <h2 className="bs-title">SẢN PHẨM BÁN CHẠY</h2>
        </div>

        <div className="bs-grid">
          {products.map((p) => (
            <div key={p.id} className="asus-corner-card">
              <div className="bs-img-box">
                {/* Fallback ảnh nếu API chưa có */}
                <img src={p.imageUrl || "/images/products/asus/gpu_original.png"} alt={p.name} />
              </div>
              <h4 className="bs-name">{p.name}</h4>
              <p className="bs-desc">{p.description || "Mô tả ngắn gọn về sản phẩm cực kỳ mạnh mẽ."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;