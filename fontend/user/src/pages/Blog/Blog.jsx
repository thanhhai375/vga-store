import React from 'react';
import { Link } from 'react-router-dom';
import { mockBlogs } from '../../data/mockBlogs';
import './Blog.css';

const Blog = () => {
  // Lấy dữ liệu tạm từ mockBlogs (Nhân bản lên để đủ lắp vào các vị trí)
  const allPosts = [...mockBlogs, ...mockBlogs, ...mockBlogs];

  const heroPost = allPosts[0]; // Bài bự nhất
  const sideHeroPost = allPosts[1]; // Bài nhỏ bên cạnh
  const subGridPosts = allPosts.slice(2, 5); // 3 bài ngang
  const listPosts = allPosts.slice(5, 10); // Danh sách dọc bên dưới
  const tipPosts = allPosts.slice(0, 5); // Các bài thủ thuật ở Sidebar

  return (
    <div className="blog-page container">

      <div className="blog-layout">
        {/* ================= CỘT TRÁI: NỘI DUNG CHÍNH ================= */}
        <div className="blog-main-content">

          {/* TOP 1: 1 Bự + 1 Nhỏ */}
          <div className="blog-hero-grid">
            <Link to={`/blog/${heroPost.id}`} className="hero-post-card large">
              <div className="img-wrapper">
                <img src={heroPost.thumbnail} alt={heroPost.title} />
                <span className="blog-badge">Đánh giá - Tư vấn</span>
              </div>
              <h2 className="hero-title">{heroPost.title}</h2>
            </Link>

            <Link to={`/blog/${sideHeroPost.id}`} className="hero-post-card small">
              <div className="img-wrapper">
                <img src={sideHeroPost.thumbnail} alt={sideHeroPost.title} />
              </div>
              <h3 className="hero-title">{sideHeroPost.title}</h3>
              <p className="hero-excerpt">{sideHeroPost.excerpt}</p>
            </Link>
          </div>

          {/* TOP 2: Lưới 3 bài viết */}
          <div className="blog-sub-grid">
            {subGridPosts.map((post, idx) => (
              <Link to={`/blog/${post.id}`} className="sub-grid-card" key={`sub-${idx}`}>
                <div className="img-wrapper">
                  <img src={post.thumbnail} alt={post.title} />
                </div>
                <h4 className="sub-title">{post.title}</h4>
              </Link>
            ))}
          </div>

          {/* TOP 3: Danh sách bài viết mới */}
          <div className="blog-list-section">
            {listPosts.map((post, idx) => (
              <div className="list-post-item" key={`list-${idx}`}>
                <Link to={`/blog/${post.id}`} className="list-img-wrapper">
                  <img src={post.thumbnail} alt={post.title} />
                </Link>
                <div className="list-post-info">
                  <h3 className="list-title"><Link to={`/blog/${post.id}`}>{post.title}</Link></h3>
                  <div className="list-meta">⏱ {post.date} • {post.author}</div>
                  <p className="list-excerpt">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ================= CỘT PHẢI: SIDEBAR ================= */}
        <div className="blog-sidebar">

          {/* Widget 1: Chủ đề hot */}
          <div className="sidebar-widget">
            <div className="widget-header">CHỦ ĐỀ HOT 🔥</div>
            <div className="topic-grid">
              <div className="topic-item"><div className="topic-icon bg-blue">🎁</div><span>Code game</span></div>
              <div className="topic-item"><div className="topic-icon bg-green">⛏️</div><span>Minecraft</span></div>
              <div className="topic-item"><div className="topic-icon bg-purple">🤖</div><span>AI</span></div>
              <div className="topic-item"><div className="topic-icon bg-black">🔥</div><span>Free Fire</span></div>
              <div className="topic-item"><div className="topic-icon bg-gray">🧱</div><span>Roblox</span></div>
              <div className="topic-item"><div className="topic-icon bg-red">🏷️</div><span>Khuyến mãi</span></div>
            </div>
          </div>

          {/* Widget 2: Mẹo & Thủ thuật (List nhỏ) */}
          <div className="sidebar-widget">
            <div className="widget-header blue-header">THỦ THUẬT ⚡</div>
            <div className="tips-list">
              {tipPosts.map((post, idx) => (
                <Link to={`/blog/${post.id}`} className="tip-item" key={`tip-${idx}`}>
                  <img src={post.thumbnail} alt={post.title} className="tip-img" />
                  <h5 className="tip-title">{post.title}</h5>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Blog;