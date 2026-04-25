import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import './Blog.css';

const BLOG_CATEGORIES = ['Tất cả', 'Tin công nghệ', 'Đánh giá', 'Hướng dẫn', 'Tin khuyến mãi'];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await blogService.getAll();
        setBlogs(data || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // ── Filter + Search ────────────────────────────────────────────
  const filtered = useMemo(() => {
    let posts = [...blogs];
    if (activeCategory !== 'Tất cả') {
      posts = posts.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q)
      );
    }
    return posts;
  }, [blogs, activeCategory, searchQuery]);

  const visiblePosts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // ── Hero post (featured & most views)
  const heroPost = [...blogs]
    .filter((p) => p.featured)
    .sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  // ── Sidebar trending (top 5 by views)
  const trending = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  if (loading) {
    return <div className="blog-page" style={{ paddingTop: '120px', textAlign: 'center', color: '#555' }}>Đang tải bài viết...</div>;
  }

  // Dò ảnh cho Bài nổi bật
  const heroBgImage = heroPost ? (heroPost.thumbnail || heroPost.imgUrl || heroPost.image || '/images/products/gpu_original.png') : '';

  return (
    <div className="blog-page">
      {/* ── PAGE HERO ─────────────────────────────────────────── */}
      {heroPost && activeCategory === 'Tất cả' && !searchQuery && (
        <Link to={`/blog/${heroPost.id}`} className="blog-hero-banner">
          <div
            className="blog-hero-bg"
            style={{ backgroundImage: `url("${heroBgImage}")` }}
          />
          <div className="blog-hero-overlay" />
          <div className="blog-hero-content container">
            <div className="blog-hero-text">
              <span className="blog-hero-badge">{heroPost.category}</span>
              <h1 className="blog-hero-title">{heroPost.title}</h1>
              <p className="blog-hero-excerpt">{heroPost.excerpt}</p>
              <div className="blog-hero-meta">
                <span className="blog-hero-author">
                  <span className="blog-hero-avatar">✍️</span>
                  {heroPost.author || 'Admin'}
                </span>
                <span>👁 {heroPost.views?.toLocaleString() || 0} lượt xem</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="blog-main-wrapper container">
        <div className="blog-layout">
          {/* ── LEFT: Posts ──────────────────────────────────── */}
          <div className="blog-content-col">
            {/* Filter + Search */}
            <div className="blog-filter-bar">
              <div className="blog-categories">
                {BLOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`blog-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="blog-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6); }}
                />
                {searchQuery && (
                  <button className="blog-search-clear" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
            </div>

            {/* Count */}
            {(activeCategory !== 'Tất cả' || searchQuery) && (
              <div className="blog-result-count">
                {filtered.length > 0
                  ? `Tìm thấy ${filtered.length} bài viết`
                  : 'Không tìm thấy bài viết phù hợp'}
              </div>
            )}

            {/* Posts Grid */}
            {filtered.length === 0 ? (
              <div className="blog-empty">
                <div className="blog-empty-icon">📭</div>
                <h3>Không có bài viết nào</h3>
                <p>Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                <button
                  className="blog-empty-reset"
                  onClick={() => { setActiveCategory('Tất cả'); setSearchQuery(''); }}
                >
                  Xem tất cả bài viết
                </button>
              </div>
            ) : (
              <>
                <div className="blog-posts-grid">
                  {visiblePosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {hasMore && (
                  <div className="blog-load-more">
                    <button
                      className="blog-load-more-btn"
                      onClick={() => setVisibleCount((c) => c + 4)}
                    >
                      Xem thêm bài viết
                      <span className="blog-load-more-count">
                        ({filtered.length - visibleCount} bài còn lại)
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── RIGHT: Sidebar (ĐÃ XÓA KHỐI TƯ VẤN) ──────────────────────────────── */}
          <aside className="blog-sidebar">
            {/* Trending */}
            <div className="blog-sidebar-widget">
              <div className="blog-widget-header">
                <span className="blog-widget-title">🔥 BÀI ĐỌC NHIỀU NHẤT</span>
              </div>
              <div className="blog-trending-list">
                {trending.map((post, idx) => (
                  <Link key={post.id} to={`/blog/${post.id}`} className="blog-trending-item">
                    <span className="blog-trending-rank">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="blog-trending-info">
                      <span className="blog-trending-cat">{post.category}</span>
                      <h4 className="blog-trending-title">{post.title}</h4>
                      <span className="blog-trending-views">👁 {post.views?.toLocaleString() || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="blog-sidebar-widget">
              <div className="blog-widget-header">
                <span className="blog-widget-title">📂 DANH MỤC</span>
              </div>
              <div className="blog-cat-list">
                {BLOG_CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => {
                  const count = blogs.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      className={`blog-cat-list-item ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => { setActiveCategory(cat); setVisibleCount(6); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      <span>{cat}</span>
                      <span className="blog-cat-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags Widget */}
            <div className="blog-sidebar-widget">
              <div className="blog-widget-header">
                <span className="blog-widget-title">🏷️ TAGS PHỔ BIẾN</span>
              </div>
              <div className="blog-tags-cloud">
                {['NVIDIA', 'AMD', 'RTX 4090', 'RTX 5090', 'Review', 'DLSS 4', 'Build PC', 'Thủ Thuật', 'Tư Vấn', 'Ray Tracing', 'Intel Arc', 'Best Value'].map((tag) => (
                  <button
                    key={tag}
                    className="blog-tag-btn"
                    onClick={() => { setSearchQuery(tag); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// ── BlogCard Component ─────────────────────────────────────────────────────
function BlogCard({ post }) {
  // Dò ảnh thông minh cho card bài viết
  const cardImage = post.thumbnail || post.imgUrl || post.image || '/images/products/gpu_original.png';

  return (
    <article className="blog-card">
      <Link to={`/blog/${post.id}`} className="blog-card-img-wrap">
        <img src={cardImage} alt={post.title} className="blog-card-img" loading="lazy" />
        <span className="blog-card-category">{post.category}</span>
        {post.featured && <span className="blog-card-featured">⭐ NỔI BẬT</span>}
      </Link>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="blog-card-author">
            <span className="blog-card-avatar">👤</span>
            {post.author || 'Admin'}
          </span>
        </div>
        <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
          <h2 className="blog-card-title">{post.title}</h2>
        </Link>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-footer">
          <div className="blog-card-stats">
            <span>👁 {post.views?.toLocaleString() || 0}</span>
          </div>
          <Link to={`/blog/${post.id}`} className="blog-card-readmore">
            Đọc tiếp →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default Blog;