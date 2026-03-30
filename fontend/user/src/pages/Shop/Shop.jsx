import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import { productService } from '../../services/productService';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // === CÁC STATE QUẢN LÝ BỘ LỌC ===
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Nổi bật');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // === TỰ ĐỘNG LẤY DANH SÁCH HÃNG & DANH MỤC TỪ DATA THẬT ===
  // (Lọc ra các tên không trùng lặp để cho vào thẻ <select>)
  const uniqueBrands = ['Tất cả', ...new Set(products.map(p => p.brand?.name).filter(Boolean))];
  const uniqueCategories = ['Tất cả', ...new Set(products.map(p => p.category?.name).filter(Boolean))];

  // === LOGIC TÌM KIẾM & LỌC ===
  let displayProducts = products.filter((product) => {
    // 1. Lọc theo chữ gõ vào (không phân biệt hoa thường)
    const matchName = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Lọc theo Hãng
    const matchBrand = selectedBrand === 'Tất cả' || (product.brand && product.brand.name === selectedBrand);

    // 3. Lọc theo Dòng VGA (Category)
    const matchCategory = selectedCategory === 'Tất cả' || (product.category && product.category.name === selectedCategory);

    return matchName && matchBrand && matchCategory;
  });

  // === LOGIC SẮP XẾP GIÁ ===
  if (sortOrder === 'Giá: Tăng dần') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'Giá: Giảm dần') {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="shop-page container">
      <div className="shop-toolbar">
        {/* 1. THANH TÌM KIẾM */}
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Gõ tên Card (VD: ASUS, 4090)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <button className="filter-btn active-filter">Bộ lọc:</button>

            {/* 2. MENU LỌC HÃNG (Đã chạy bằng Data thật) */}
            <select className="filter-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand === 'Tất cả' ? 'Hãng: Tất cả' : brand}</option>
              ))}
            </select>

            {/* 3. MENU LỌC DÒNG VGA (Đã chạy bằng Data thật) */}
            <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat === 'Tất cả' ? 'Dòng VGA: Tất cả' : cat}</option>
              ))}
            </select>
          </div>

          <div className="sort-group">
            {/* 4. MENU SẮP XẾP */}
            <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="Nổi bật">Xếp theo: Nổi bật</option>
              <option value="Giá: Tăng dần">Giá: Tăng dần</option>
              <option value="Giá: Giảm dần">Giá: Giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* HIỂN THỊ SẢN PHẨM SAU KHI LỌC */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>Đang kết nối kho VGA...</div>
      ) : (
        <div className="shop-product-grid">
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div style={{ width: '100%', textAlign: 'center', padding: '50px' }}>
              <p>Không có sản phẩm nào khớp với bộ lọc của bạn!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;