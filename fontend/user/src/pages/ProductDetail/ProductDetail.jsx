import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './ProductDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toggleWishlist } from '../../redux/wishlistSlice';
import RelatedProducts from './RelatedProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [guestName, setGuestName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const isWishlisted = product ? wishlistItems.some(i => i.id === product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiResponse = await axiosClient.get(`/products/${id}`);
        const pData = apiResponse?.data;

        if (!pData || !pData.id) {
          setError('Không tìm thấy sản phẩm này!');
          return;
        }

        setProduct(pData);

        // Build image gallery
        let images = [];
        if (pData.imagesJson) {
          try {
            const parsed = JSON.parse(pData.imagesJson);
            images = Array.isArray(parsed) ? parsed : [pData.imagesJson];
          } catch {
            images = [pData.imagesJson];
          }
        }
        if (images.length === 0 && pData.imgUrl) images = [pData.imgUrl];

        setGallery(images);
        setMainImage(images[0] || '/images/default-vga.jpg');

        // Load reviews
        try {
          const rev = await axiosClient.get(`/reviews/product/${id}`);
          setReviews(Array.isArray(rev) ? rev : []);
        } catch {
          setReviews([]);
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin sản phẩm.');
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product.id, name: product.name, price: Number(product.price), thumbnail: mainImage }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ id: product.id, name: product.name, price: Number(product.price), thumbnail: mainImage }));
    navigate('/checkout');
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const rev = {
        product: { id: parseInt(id) },
        comment: newComment,
        rating: newRating,
        guestName: guestName || 'Khách hàng'
      };
      const saved = await axiosClient.post('/reviews', rev);
      setReviews(prev => [saved, ...prev]);
      setNewComment('');
      setGuestName('');
      setNewRating(5);
    } catch (err) {
      console.error('Lỗi đăng review:', err);
      alert('Có lỗi khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Đang tải thông số sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-error">
        <h2>⚠️ {error || 'Không tìm thấy sản phẩm!'}</h2>
        <Link to="/products" className="btn-back-link">← Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">

      {/* ── HERO: ẢNH + GIÁ ─────────────────────────────────── */}
      <div className="detail-hero">
        <div className="container">
          <button className="btn-back" onClick={() => navigate('/products')}>
            ← Quay lại cửa hàng
          </button>

          <div className="detail-grid">
            {/* CỘT TRÁI: ẢNH */}
            <div className="detail-gallery">
              <div className="main-image-box">
                <img
                  src={mainImage || '/images/default-vga.jpg'}
                  alt={product.name}
                  onError={e => { e.target.src = '/images/default-vga.jpg'; }}
                />
              </div>
              {gallery.length > 1 && (
                <div className="thumb-strip">
                  {gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${i + 1}`}
                      className={`thumb-img ${mainImage === img ? 'active' : ''}`}
                      onClick={() => setMainImage(img)}
                      onError={e => { e.target.src = '/images/default-vga.jpg'; }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: THÔNG TIN */}
            <div className="detail-info">
              <div className="brand-tag">
                {product.category?.name || 'Card Đồ Họa'} • {product.brand?.name || 'VGA'}
              </div>
              <h1 className="product-title">{product.name}</h1>
              <div className="rating-row">
                <span className="stars-display">{'⭐'.repeat(Math.max(1, Math.round(Number(avgRating))))}</span>
                <span className="avg-score">{avgRating}/5</span>
                <span className="review-cnt">({reviews.length} đánh giá)</span>
              </div>
              <div className="sku-code">
                Mã SP: <span>{product.sku}</span> &nbsp;|&nbsp;
                {product.stock > 0
                  ? <span className="in-stock">Còn {product.stock} hàng</span>
                  : <span className="out-stock">Hết hàng</span>
                }
              </div>

              <div className="price-box">
                <span className="current-price">
                  {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                </span>
                <span className="old-price">
                  {new Intl.NumberFormat('vi-VN').format(Math.round(product.price * 1.1))}đ
                </span>
                <span className="discount-badge">-9%</span>
              </div>

              <div className="policy-box">
                <ul>
                  <li>✅ Đổi trả trong 7 ngày nếu lỗi nhà sản xuất.</li>
                  <li>✅ Miễn phí giao hàng toàn quốc (Hóa đơn trên 1tr).</li>
                  <li>✅ Bảo hành chính hãng 36 tháng.</li>
                </ul>
              </div>

              <div className="action-buttons">
                <button className="btn-buy-now" disabled={product.stock <= 0} onClick={handleBuyNow}>
                  MUA NGAY
                </button>
                <div className="sub-actions">
                  <button
                    className={`btn-add-cart ${addedToCart ? 'added' : ''}`}
                    disabled={product.stock <= 0}
                    onClick={handleAddToCart}
                  >
                    {addedToCart ? '✓ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ'}
                  </button>
                  <button
                    className={`btn-wishlist-detail ${isWishlisted ? 'wishlisted' : ''}`}
                    onClick={() => dispatch(toggleWishlist(product))}
                  >
                    {isWishlisted ? '❤️ Đã yêu thích' : '🤍 Yêu Thích'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────────── */}
      <div className="detail-tabs-section">
        <div className="container">
          <div className="tab-headers">
            <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>
              Thông Số Kỹ Thuật
            </button>
            <button className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>
              Mô Tả Sản Phẩm
            </button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              Đánh Giá ({reviews.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'specs' && (
              <div className="specs-table-wrapper">
                <table className="specs-table">
                  <tbody>
                    <tr><td>Model GPU</td><td>{product.gpuModel || 'Đang cập nhật'}</td></tr>
                    <tr><td>Dung lượng VRAM</td><td>{product.vram || 'Đang cập nhật'}</td></tr>
                    <tr><td>Loại bộ nhớ</td><td>{product.memoryType || 'GDDR6'}</td></tr>
                    <tr><td>Hệ thống tản nhiệt</td><td>{product.coolingType || 'Đang cập nhật'}</td></tr>
                    <tr><td>PSU khuyến cáo</td><td>{product.recommendedPsu || 'Đang cập nhật'}</td></tr>
                    <tr><td>Đầu cấp nguồn</td><td>{product.powerConnectors || 'Đang cập nhật'}</td></tr>
                    <tr><td>Kích thước</td><td>{product.dimension || 'Đang cập nhật'}</td></tr>
                    <tr><td>Thương hiệu</td><td>{product.brand?.name || 'Unknown'}</td></tr>
                    <tr><td>Danh mục</td><td>{product.category?.name || 'Unknown'}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'desc' && (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: product.description || '<p>Đang cập nhật mô tả chi tiết sản phẩm.</p>'
                }}
              />
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-section">
                <div className="review-summary">
                  <div className="avg-big">{avgRating}</div>
                  <div>
                    <div className="stars-big">{'⭐'.repeat(Math.max(1, Math.round(Number(avgRating))))}</div>
                    <div className="review-total">Dựa trên {reviews.length} đánh giá</div>
                  </div>
                </div>

                <form className="review-form" onSubmit={handlePostReview}>
                  <h4>✍️ Viết đánh giá của bạn</h4>
                  <div className="rating-picker">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" className={`star-btn ${n <= newRating ? 'active' : ''}`} onClick={() => setNewRating(n)}>⭐</button>
                    ))}
                    <span>{newRating}/5 sao</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Tên của bạn (để trống sẽ là 'Khách hàng')"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="reviewer-name-input"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '10px', fontSize: '14px', boxSizing: 'border-box', background: '#fafafa' }}
                  />
                  <textarea
                    placeholder="Nhận xét của bạn về sản phẩm này..."
                    rows="4"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-submit-review" disabled={submitting}>
                    {submitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                  </button>
                </form>

                <div className="reviews-list">
                  {reviews.length === 0 ? (
                    <p className="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                  ) : reviews.map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-avatar">👤</div>
                      <div className="review-body">
                        <div className="review-header">
                          <strong>{r.guestName || r.user?.username || 'Khách hàng'}</strong>
                          <span className="review-stars">{'⭐'.repeat(r.rating || 5)}</span>
                          <span className="review-date">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ''}
                          </span>
                        </div>
                        <p>{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SẢN PHẨM TƯƠNG TỰ ────────────────────────────────── */}
      <div className="related-section">
        <div className="container">
          <h2 className="related-title">Sản Phẩm Tương Tự</h2>
          <RelatedProducts categoryId={product.category?.id} currentId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
