import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { productService } from '../../services/productService';
import './Shop.css';

const SERIES_TAGS = ['ROG Strix', 'TUF Gaming', 'ASUS Dual', 'ProArt'];

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [selectedSeries, setSelectedSeries] = useState('Tất cả');

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

  // Đọc series từ URL param khi navigate từ Home
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const seriesParam = queryParams.get('series');
    if (seriesParam) {
      setSelectedSeries(seriesParam);
    } else {
      setSelectedSeries('Tất cả');
    }
  }, [location.search]);

  const uniqueBrands = ['Tất cả', ...new Set(products.map(p => p.brand?.name).filter(Boolean))];

  let displayProducts = products.filter((product) => {
    const matchName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBrand = selectedBrand === 'Tất cả' || product.brand?.name === selectedBrand;
    const matchSeries = selectedSeries === 'Tất cả' || product.name.toLowerCase().includes(selectedSeries.toLowerCase()) || product.category?.name === selectedSeries;
    return matchName && matchBrand && matchSeries;
  });

  if (sortOrder === 'price_asc') {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="shop-page">
      {/* ===== SHOP HERO BANNER ===== */}
      <div className="shop-hero">
        <div className="container shop-hero-inner">
          <div className="shop-hero-text">
            <span className="shop-hero-badge">GRAPHICS CARDS</span>
            <h1 className="shop-hero-title">Khám Phá Toàn Bộ<br /><span>Gaming Series</span></h1>
            <p className="shop-hero-desc">Chọn vũ khí phù hợp với phong cách chiến đấu của bạn</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* ===== THANH LỌC SERIES - kiểu ROG ===== */}
        <div className="series-filter-bar">
          <span className="filter-label">SERIES</span>
          <div className="series-tags">
            <button
              className={`series-tag ${selectedSeries === 'Tất cả' ? 'active' : ''}`}
              onClick={() => setSelectedSeries('Tất cả')}
            >
              TẤT CẢ
            </button>
            {SERIES_TAGS.map(s => (
              <button
                key={s}
                className={`series-tag ${selectedSeries === s ? 'active' : ''}`}
                onClick={() => setSelectedSeries(s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ===== TOOLBAR TÌM KIẾM & LỌC ===== */}
        <div className="shop-toolbar">
          <div className="toolbar-left">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm card đồ họa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select className="filter-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand === 'Tất cả' ? 'Hãng: Tất cả' : brand}</option>
              ))}
            </select>
          </div>

          <div className="toolbar-right">
            <span className="result-count">{displayProducts.length} sản phẩm</span>
            <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Xếp theo: Nổi bật</option>
              <option value="price_asc">Giá: Thấp → Cao</option>
              <option value="price_desc">Giá: Cao → Thấp</option>
            </select>
          </div>
        </div>

        {/* ===== DANH SÁCH SẢN PHẨM ===== */}
        {loading ? (
          <div className="shop-loading">
            <div className="loading-dots">
              <span /><span /><span />
            </div>
            <p>Đang kết nối kho VGA...</p>
          </div>
        ) : (
          <>
            {displayProducts.length > 0 ? (
              <div className="shop-product-grid">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="shop-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 15s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button className="btn-reset-filter" onClick={() => { setSelectedSeries('Tất cả'); setSearchTerm(''); setSelectedBrand('Tất cả'); }}>
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;