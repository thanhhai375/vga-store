import React, { useState } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import { mockProducts } from '../../data/mockProducts'; // Tạm thời dùng lại data cũ để test
import './Shop.css';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="shop-page container">

      {/* 1. THANH TÌM KIẾM & BỘ LỌC TỔNG HỢP */}
      <div className="shop-toolbar">

        {/* Thanh tìm kiếm */}
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Bạn cần tìm Card màn hình, VGA nào hôm nay?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* Các nút Lọc (Filter) y như ảnh mẫu */}
        <div className="filter-row">
          <div className="filter-group">
            <button className="filter-btn active-filter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Bộ lọc
            </button>
            <select className="filter-select"><option>Tình trạng sản phẩm</option></select>
            <select className="filter-select"><option>Giá</option></select>
            <select className="filter-select"><option>Hãng</option></select>
            <select className="filter-select"><option>Dòng VGA</option></select>
            <select className="filter-select"><option>Dung lượng bộ nhớ</option></select>
            <select className="filter-select"><option>Nhân đồ họa</option></select>
          </div>

          <div className="sort-group">
            <select className="sort-select">
              <option>Xếp theo: Nổi bật</option>
              <option>Giá: Tăng dần</option>
              <option>Giá: Giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. LƯỚI SẢN PHẨM (Grid 5 cột) */}
      <div className="shop-product-grid">
        {/* Tạm thời tôi nhân bản mảng mockProducts lên để test xem lưới 5 cột lên hình có đẹp không nhé */}
        {[...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts].map((product, index) => (
          <ProductCard key={`${product.id}-${index}`} product={product} />
        ))}
      </div>

    </div>
  );
};

export default Shop;