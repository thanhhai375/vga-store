import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import './BestSellers.css';

const stripHtmlTags = (str) => {
  if (!str) return "";
  return str.replace(/<[^>]*>?/gm, '');
};

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    productService.getAll()
      .then(data => {
        // Sắp xếp lượt bán giảm dần
        const sortedProducts = data.sort((a, b) => (b.sold || b.sales || 0) - (a.sold || a.sales || 0));
        setProducts(sortedProducts.slice(0, 4));
      })
      .catch(err => console.error("Lỗi lấy sản phẩm bán chạy:", err));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bs-section">
      <div className="container">
        <div className="bs-header-center">
          <h2 className="bs-title">SẢN PHẨM BÁN CHẠY</h2>
        </div>

        <div className="bs-grid">
          {products.map((p) => {
            // ĐÃ NÂNG CẤP: Dò quét TẤT CẢ các tên biến chứa link ảnh mà Backend có thể trả về!
            const dbImageUrl =
              p.imgUrl ||
              p.img_url ||
              p.img ||
              p.imageUrl ||
              p.image ||
              (p.images && p.images.length > 0 && p.images[0]?.url);

            // Đường dẫn ảnh mặc định (Chính là tấm ảnh nền tím bạn đang thấy)
            const fallbackImage = "/images/products/gpu_original.png";

            // Chốt link cuối cùng
            const finalImageUrl = dbImageUrl || fallbackImage;

            return (
              <div
                key={p.id}
                className="asus-corner-card"
                // Đảm bảo click vào sẽ sang đúng trang chi tiết sản phẩm (dùng /products hay /shop tùy Route của bạn)
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="bs-img-box">
                  <img
                    src={finalImageUrl}
                    alt={p.name}
                    // TUYỆT CHIÊU Ở ĐÂY: Nếu ảnh từ DB bị lỗi 404, tự động đắp ảnh fallback vào!
                    onError={(e) => {
                      e.target.onerror = null; // Chống lặp vô hạn
                      e.target.src = fallbackImage;
                    }}
                  />
                </div>
                <h4 className="bs-name">{p.name}</h4>
                <p className="bs-desc">
                  {stripHtmlTags(p.description).substring(0, 90)}...
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;