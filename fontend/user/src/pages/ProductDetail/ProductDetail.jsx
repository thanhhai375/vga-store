import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { mockProducts } from '../../data/mockProducts';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // STATE
  // 1. Mảng chứa các đánh giá
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Hoàng Minh', rating: 5, date: '22/03/2026', text: 'Card siêu mạnh, tản nhiệt mát mẻ. Chơi max setting mượt mà!', images: ['https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200'] },
    { id: 2, author: 'Tuấn PC', rating: 4, date: '18/03/2026', text: 'Hàng chuẩn chính hãng, đóng gói kỹ. Giao hàng hơi chậm 1 ngày.', images: [] }
  ]);

  // 2. State cho form viết đánh giá mới
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState([]);

  // Hàm xử lý khi chọn ảnh từ máy tính
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setReviewImages(prev => [...prev, ...imageUrls]);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return alert("Vui lòng nhập nội dung đánh giá!");

    // Giả lập đưa dữ liệu vào Database
    const newReview = {
      id: Date.now(),
      author: 'Khách hàng (Bạn)',
      rating: rating,
      date: new Date().toLocaleDateString('vi-VN'),
      text: reviewText,
      images: reviewImages
    };

    // Cập nhật giao diện: Đẩy review mới lên đầu mảng
    setReviews([newReview, ...reviews]);

    // Reset form
    setReviewText('');
    setRating(5);
    setReviewImages([]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const fetchProductFromDB = () => {
      try {
        const foundProduct = mockProducts.find(p => p?.id?.toString() === id?.toString());
        setProduct(foundProduct || mockProducts[0]);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setProduct(mockProducts[0]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchProductFromDB, 300);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '50vh' }}><h3>Đang tải dữ liệu...</h3></div>;

  const formatPrice = (price) => {
    if (!price) return "0₫";
    const cleanPrice = price.toString().replace(/\D/g, '');
    return new Intl.NumberFormat("vi-VN").format(cleanPrice) + "₫";
  };
  const currentPrice = product?.price ? Number(product.price.toString().replace(/\D/g, '')) : 0;
  const oldPrice = currentPrice * 1.1;

  return (
    <div className="product-detail-page container" style={{ paddingTop: '100px' }}>

      {/* PHẦN 1: THÔNG TIN SẢN PHẨM */}
      <div className="pd-main-section">
        <div className="pd-image-gallery">
          <div className="pd-main-image-wrapper">
            <img src={product?.img || product?.image} alt={product?.name} className="pd-main-image" />
          </div>
        </div>

        <div className="pd-info">
          <h1 className="pd-title">{product?.name || 'Đang cập nhật'}</h1>
          <div className="pd-brand">Thương hiệu: <span>{product?.brand || 'ASUS'}</span></div>

          <div className="pd-price-area">
            <div className="pd-current-price">{formatPrice(currentPrice)}</div>
            <div className="pd-old-price">{formatPrice(oldPrice)}</div>
          </div>

          <button className="pd-buy-btn">
            <span className="btn-text-main">MUA NGAY</span>
            <span className="btn-text-sub">Giao tận nơi hoặc nhận tại cửa hàng</span>
          </button>

          <div className="pd-specs-box">
            <h3 className="specs-title">TÓM TẮT THÔNG SỐ</h3>
            <table className="specs-table">
              <tbody>
                <tr><td>Mã SP</td><td>#{product?.id || 'N/A'}</td></tr>
                <tr><td>Trạng thái</td><td>Còn hàng</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PHẦN 2: SẢN PHẨM ĐỀ XUẤT */}
      <div className="pd-similar-section">
        <h2 className="section-title" style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Sản phẩm đề xuất</h2>
        <div className="similar-products-scroll">
          {mockProducts && [...mockProducts, ...mockProducts, ...mockProducts].slice(0, 10).map((p, index) => (
            <div className="scroll-item" key={`similar-${p?.id}-${index}`}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* PHẦN 3: ĐÁNH GIÁ SẢN PHẨM (MỚI THÊM) */}
      <div className="pd-reviews-section">
        <h2 className="section-title">Khách hàng đánh giá</h2>

        <div className="reviews-container">
          {/* Form viết đánh giá */}
          <div className="review-form-box">
            <h3>Viết đánh giá của bạn</h3>
            <form onSubmit={handleReviewSubmit}>

              <div className="form-group">
                <label>Đánh giá sao:</label>
                <div className="star-selector">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      className={`star ${num <= rating ? 'selected' : ''}`}
                      onClick={() => setRating(num)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <textarea
                  placeholder="Mời bạn chia sẻ cảm nhận về sản phẩm..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  className="review-textarea"
                />
              </div>

              <div className="form-group image-upload-group">
                <label className="upload-btn">
                  📷 Thêm hình ảnh thực tế
                  {/* Input ẩn đi, click vào label sẽ kích hoạt */}
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
                </label>

                {/* Khu vực hiển thị ảnh xem trước */}
                {reviewImages.length > 0 && (
                  <div className="image-preview-area">
                    {reviewImages.map((src, idx) => (
                      <img key={idx} src={src} alt="preview" className="preview-img" />
                    ))}
                    <button type="button" className="clear-images-btn" onClick={() => setReviewImages([])}>Xóa ảnh</button>
                  </div>
                )}
              </div>

              <button type="submit" className="submit-review-btn">GỬI ĐÁNH GIÁ</button>
            </form>
          </div>

          {/* Danh sách các đánh giá hiện có */}
          <div className="reviews-list">
            {reviews.map((rev) => (
              <div key={rev.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">{rev.author.charAt(0)}</div>
                    <span className="reviewer-name">{rev.author}</span>
                  </div>
                  <span className="review-date">{rev.date}</span>
                </div>
                <div className="review-stars">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </div>
                <p className="review-content">{rev.text}</p>

                {/* Hiển thị ảnh kèm theo đánh giá */}
                {rev.images && rev.images.length > 0 && (
                  <div className="review-attached-images">
                    {rev.images.map((imgSrc, idx) => (
                      <img key={idx} src={imgSrc} alt="attached" className="attached-img" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;