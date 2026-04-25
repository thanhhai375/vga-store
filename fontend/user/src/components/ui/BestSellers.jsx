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
        // Sp xp lt bn gim dn
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
            // NNG CP: D qut TT C cc tn bin cha link nh m Backend c th tr v!
            const dbImageUrl =
              p.imgUrl ||
              p.img_url ||
              p.img ||
              p.imageUrl ||
              p.image ||
              (p.images && p.images.length > 0 && p.images[0]?.url);

            // ng dn nh mc nh (Chnh l tm nh nn tm bn ang thy)
            const fallbackImage = "/images/products/gpu_original.png";

            // Cht link cui cng
            const finalImageUrl = dbImageUrl || fallbackImage;

            return (
              <div
                key={p.id}
                className="asus-corner-card"
                // m bo click vo s sang ng trang chi tit sn phm (dng /products hay /shop ty Route ca bn)
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="bs-img-box">
                  <img
                    src={finalImageUrl}
                    alt={p.name}
                    // TUYT CHIU Y: Nu nh t DB b li 404, t ng p nh fallback vo!
                    onError={(e) => {
                      e.target.onerror = null; // Chng lp v hn
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
