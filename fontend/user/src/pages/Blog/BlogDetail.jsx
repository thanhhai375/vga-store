import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import axiosClient from '../../api/axiosClient';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await blogService.getById(id);
      setPost(data);
      if (data) {
        try {
          const res = await axiosClient.get(`/reviews/blog/${id}`);
          setComments(Array.isArray(res) ? res : []);
        } catch (e) {
          console.error('Lỗi load comment:', e);
        }
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchData();
  }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const rev = {
        blog: { id: parseInt(id) },
        comment: newComment,
        rating: newRating,
        guestName: guestName || 'Khách hàng'
      };
      const saved = await axiosClient.post('/reviews', rev);
      setComments(prev => [saved, ...prev]);
      setNewComment('');
      setGuestName('');
      setNewRating(5);
    } catch (error) {
      console.error('Lỗi đăng bình luận:', error);
      alert('Có lỗi khi gửi bình luận. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div className="bd-spinner"></div>
        <p>Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-not-found container">
        <h1>404 - Không tìm thấy bài viết</h1>
        <Link to="/blog">← Quay lại trang Blog</Link>
      </div>
    );
  }

  // Parse content blocks từ JSON
  let contentBlocks = [];
  try {
    contentBlocks = JSON.parse(post.content);
    if (!Array.isArray(contentBlocks)) contentBlocks = [];
  } catch {
    contentBlocks = post.content
      ? [{ type: 'paragraph', body: post.content }]
      : [];
  }

  const publishDate = post.createdAt || post.publishedDate;

  return (
    <div className="blog-detail-page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div
        className="bd-hero"
        style={{ backgroundImage: `url(${post.thumbnail || '/images/blog/default.jpg'})` }}
      >
        <div className="bd-hero-overlay" />
        <div className="bd-hero-content container">
          <Link to="/blog" className="bd-back-link">← Quay lại Blog</Link>
          <span className="bd-category">{post.category}</span>
          <h1 className="bd-title">{post.title}</h1>
          <div className="bd-meta">
            <span className="bd-author-avatar">✍️</span>
            <span className="bd-author-name">{post.author}</span>
            {publishDate && (
              <span className="bd-date">
                📅 {new Date(publishDate).toLocaleDateString('vi-VN')}
              </span>
            )}
            <span className="bd-views">👁 {post.views?.toLocaleString()} lượt xem</span>
          </div>
        </div>
      </div>

      <div className="bd-container container">
        {/* ── Nội dung bài viết ────────────────────────────── */}
        <article className="bd-main">
          <div className="bd-excerpt">{post.excerpt}</div>

          <div className="bd-content-blocks">
            {contentBlocks.map((block, idx) => {
              const type = (block.type || '').toLowerCase();
              switch (type) {
                case 'heading':
                  return <h3 key={idx} className="bd-h3">{block.body}</h3>;
                case 'paragraph':
                  return <p key={idx} className="bd-p">{block.body}</p>;
                case 'image':
                  return (
                    <figure key={idx} className="bd-figure">
                      <img src={block.url} alt={block.caption || ''} className="bd-img" />
                      {block.caption && <figcaption>{block.caption}</figcaption>}
                    </figure>
                  );
                case 'tip':
                  return (
                    <div key={idx} className="bd-tip-box">
                      <span className="bd-tip-icon">💡</span>
                      <div>{block.body}</div>
                    </div>
                  );
                case 'steps':
                  return (
                    <div key={idx} className="bd-steps">
                      {(block.items || []).map((step, si) => (
                        <div key={si} className="bd-step-item">
                          <div className="bd-step-num">{step.step}</div>
                          <div className="bd-step-text">
                            <strong>{step.title}:</strong> {step.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                default:
                  return block.body ? <p key={idx} className="bd-p">{block.body}</p> : null;
              }
            })}
          </div>

          <div className="bd-share">
            <span>Chia sẻ bài viết:</span>
            <div className="bd-share-icons">
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}>
                📘 Facebook
              </button>
              <button onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Đã copy link!'))}>
                🔗 Copy Link
              </button>
            </div>
          </div>
        </article>

        {/* ── Bình luận ───────────────────────────────────── */}
        <div className="bd-comments-section">
          <h3>💬 Bình luận ({comments.length})</h3>

          <form className="bd-comment-form" onSubmit={handlePostComment}>
            <div className="bd-comment-header-inputs">
              <input
                type="text"
                placeholder="Tên của bạn (để trống = Khách hàng)"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="bd-name-input"
              />
              <div className="bd-rating-row">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`bd-star-btn ${n <= newRating ? 'active' : ''}`}
                    onClick={() => setNewRating(n)}
                  >
                    ⭐
                  </button>
                ))}
                <span>{newRating}/5</span>
              </div>
            </div>
            <textarea
              placeholder="Bạn nghĩ gì về bài viết này..."
              rows="4"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              required
            />
            <button type="submit" className="bd-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'ĐANG GỬI...' : '📤 GỬI BÌNH LUẬN'}
            </button>
          </form>

          <div className="bd-comments-list">
            {comments.length === 0 ? (
              <p className="bd-no-comments">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            ) : comments.map((c, i) => (
              <div key={i} className="bd-comment-item">
                <div className="bd-comment-avatar">👤</div>
                <div className="bd-comment-body">
                  <div className="bd-comment-meta">
                    <strong>{c.guestName || c.user?.username || 'Khách hàng'}</strong>
                    <span className="bd-comment-stars">{'⭐'.repeat(c.rating || 5)}</span>
                    <span className="bd-comment-date">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                  </div>
                  <p>{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
