import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice'; // Giả sử có action
import { toggleWishlist } from '../../redux/wishlistSlice';
import RelatedProducts from './RelatedProducts'; // Component phụ

const ProductDetail = () => {
  const { id } = useParams(); // Hoặc slug nếu bạn chỉnh React Router lấy slug
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Trạng thái cho thư viện ảnh (Image Carousel)
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState([]);

  // Tab
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' hoặc 'desc'

  useEffect(() => {
    // 1. Kéo dữ liệu từ Backend
    // Lưu ý: Tùy theo logic API hiện tại, bạn có thể gọi theo ID
    // Tôi giả định API là /api/products/{id} hoặc nếu bạn dùng mock tạm thời thì code tự filter.
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // THAY ĐỔI: Gọi endpoint thực tế của bạn
        const res = await axios.get(`http://localhost:8080/api/products/${id}`);
        // Chú ý với ApiResponse wrapper của backend: res.data.data
        const pData = res.data.data || res.data; 
        
        setProduct(pData);
        
        // Khởi tạo mảng ảnh
        let images = [];
        if (pData.imagesJson) {
           try {
              images = JSON.parse(pData.imagesJson);
           } catch(e) {
              console.error("Lỗi parse imagesJson", e);
           }
        }
        
        if(images.length === 0 && pData.imgUrl) {
            images = [pData.imgUrl]; // Fallback
        }

        setGallery(images);
        if(images.length > 0) setMainImage(images[0]);

      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin sản phẩm. Có thể API chưa cấu hình route này.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="detail-loading"><div className="spinner"></div> Đang tải thông số siêu phẩm...</div>;
  if (error || !product) return <div className="detail-error">{error || 'Không tìm thấy sản phẩm này!'}</div>;

  return (
    <div className="product-detail-page">
      
      {/* KHỐI 1: TỔNG QUAN (ẢNH TRÁI - GIÁ PHẢI) */}
      <div className="detail-hero">
        <div className="container">
          
          <button className="btn-back" onClick={() => navigate('/shop')}>
            ← Quay lại Cửa hàng
          </button>

          <div className="detail-grid">
            {/* CỘT TRÁI: ẢNH SẢN PHẨM DUY NHẤT */}
            <div className="detail-gallery">
               <div className="main-image-box">
                  <img src={product.imgUrl || product.img_url} alt={product.name} />
               </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN MUA HÀNG */}
            <div className="detail-info">
               <div className="brand-tag">
                 {product.category?.name || 'Card Đồ Họa'} • {product.brand?.name || 'VGA'}
               </div>
               <h1 className="product-title">{product.name}</h1>
               <div className="sku-code">Mã SP: <span>{product.sku}</span> | Tình trạng: {product.stock > 0 ? <span className="in-stock">Còn {product.stock} hàng</span> : <span className="out-stock">Hết hàng</span>}</div>
               
               <div className="price-box">
                  <span className="current-price">{new Intl.NumberFormat('vi-VN').format(product.price)}đ</span>
                  {/* Tính năng giảm giá giả định */}
                  <span className="old-price">{new Intl.NumberFormat('vi-VN').format(product.price * 1.1)}đ</span>
                  <span className="discount-badge">-9%</span>
               </div>

               <div className="policy-box">
                  <ul>
                    <li>✅ Đổi trả trong 7 ngày nếu lỗi nhà sản xuất.</li>
                    <li>✅ Miễn phí giao hàng toàn quốc (Hóa đơn trên 1tr).</li>
                    <li>✅ Bảo hành chính hãng 36 Tháng. Tặng gói vệ sinh định kỳ.</li>
                  </ul>
               </div>

               <div className="action-buttons">
                  <button className="btn-buy-now" disabled={product.stock <= 0}>MUA NGAY <small>Giao tận nơi hoặc nhận tại cửa hàng</small></button>
                  <div className="sub-actions">
                     <button className="btn-add-cart" disabled={product.stock <= 0} onClick={() => dispatch(addToCart(product))}>
                        🛒 Thêm vào Giỏ
                     </button>
                     <button className="btn-wishlist-detail" onClick={() => dispatch(toggleWishlist(product))}>
                        ❤️ Yêu Thích
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 2: THÔNG SỐ VÀ BÀI VIẾT TẠI TAB */}
      <div className="detail-tabs-section">
         <div className="container">
            <div className="tab-headers">
               <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Thông Số Kỹ Thuật</button>
               <button className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>Khám Phá Sức Mạnh</button>
            </div>

            <div className="tab-content">
               {activeTab === 'specs' && (
                  <div className="specs-table-wrapper">
                     <table className="specs-table">
                        <tbody>
                           <tr><td>Model GPU</td><td>{product.gpuModel || 'Đang cập nhật'}</td></tr>
                           <tr><td>Dung lượng VRAM</td><td>{product.vram || 'Đang cập nhật'}</td></tr>
                           <tr><td>Loại bộ nhớ (Thế hệ)</td><td>{product.memoryType || 'GDDR6 / GDDR6X'}</td></tr>
                           <tr><td>Hệ thống tản nhiệt</td><td>{product.coolingType || 'Đang cập nhật'}</td></tr>
                           <tr><td>Nguồn cung cấp đề nghị (PSU)</td><td>{product.recommendedPsu || 'Đang cập nhật'}</td></tr>
                           <tr><td>Đầu cấp nguồn</td><td>{product.powerConnectors || 'Đang cập nhật'}</td></tr>
                           <tr><td>Kích thước Vật lý</td><td>{product.dimension || 'Đang cập nhật'}</td></tr>
                           <tr><td>Thương hiệu sản xuất</td><td>{product.brand?.name || 'Unknown'}</td></tr>
                        </tbody>
                     </table>
                  </div>
               )}

               {activeTab === 'desc' && (
                  <div className="article-content" dangerouslySetInnerHTML={{ __html: product.description || '<p>Đang cập nhật bài viết chi tiết.</p>' }}>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* KHỐI 3: SẢN PHẨM TƯƠNG TỰ */}
      <div className="related-section">
         <div className="container">
            <h2 className="related-title">Sản Phẩm Tương Tự</h2>
            <RelatedProducts categoryId={product.categoryId || product.category?.id} currentId={product.id} />
         </div>
      </div>
    </div>
  );
};

export default ProductDetail;
