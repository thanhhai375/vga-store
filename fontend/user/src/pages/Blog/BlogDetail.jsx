import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBlogs } from '../../data/mockBlogs';
import './BlogDetail.css';

// Nội dung bài viết giả lập dạng rich text
const ARTICLE_CONTENT = {
  1: {
    intro: `Cộng đồng game thủ và người hâm mộ phần cứng đang sôi sục với những thông tin rò rỉ về thế hệ GPU tiếp theo của NVIDIA. Mặc dù chưa có xác nhận chính thức, nhưng các nguồn tin uy tín đã tiết lộ một số thông số đáng choáng ngợp.`,
    sections: [
      {
        heading: "Thông số rò rỉ cho RTX 5090",
        body: `Theo thông tin từ leaker nổi tiếng kopite7kimi và một số nguồn từ chuỗi cung ứng Đài Loan, RTX 5090 sẽ sử dụng die GPU mới nhất "GB202" trên tiến trình TSMC 3nm. Đây là bước tiến lớn so với kiến trúc Ada Lovelace trên 4nm hiện tại.`,
      },
      {
        heading: "Điểm nhấn: 32GB GDDR7 và bus 512-bit",
        body: `Điểm gây sốc nhất trong danh sách thông số rò rỉ chính là con số VRAM: 32GB GDDR7 với bus 256-bit. Băng thông bộ nhớ dự kiến vượt ngưỡng 1,7 TB/s — cao hơn gần 70% so với RTX 4090 hiện tại. Với lượng VRAM khổng lồ này, RTX 5090 không chỉ là card gaming mà còn là điểm giao thoa với dòng Workstation chuyên nghiệp.`,
      },
      {
        heading: "TDP và hiệu quả năng lượng",
        body: `Điểm đáng lo ngại là TDP dự kiến lên tới 600W. Điều này đồng nghĩa người dùng bắt buộc phải có PSU ít nhất 1200W để build PC ổn định. Dù vậy, với kiến trúc 3nm, hiệu suất trên mỗi watt vẫn được kỳ vọng sẽ cải thiện đáng kể.`,
      },
      {
        heading: "Khi nào ra mắt và giá bán?",
        body: `Theo tiến độ thông thường, NVIDIA thường tổ chức sự kiện ra mắt flagship tại CES hoặc GTC. Dựa trên chu kỳ cũ, RTX 5090 có thể ra mắt vào cuối 2025 hoặc đầu 2026. Về giá, hãy chuẩn bị tinh thần với mức giá bán lẻ vượt $2000 USD tại thị trường Mỹ, tương đương 70-80 triệu VNĐ tại Việt Nam sau thuế.`,
      },
    ],
    tip: "💡 Lời khuyên: Nếu bạn đang có nhu cầu nâng cấp GPU gấp, RTX 4090 hiện tại vẫn là lựa chọn tốt nhất. Không nên chờ đợi quá lâu vì thế hệ mới luôn kéo theo áp lực giá mới.",
  },
};

// Lấy nội dung mặc định nếu không tìm thấy bài viết
const getDefaultContent = (blog) => ({
  intro: blog?.excerpt || "",
  sections: [
    {
      heading: "Nội dung chi tiết",
      body: `Đây là bài viết phân tích chuyên sâu về chủ đề "${blog?.title}". Tại VGA STORE Blog, chúng tôi cung cấp những thông tin công nghệ được kiểm chứng và phân tích bởi đội ngũ kỹ thuật viên có kinh nghiệm hơn 10 năm trong ngành linh kiện máy tính.`,
    },
    {
      heading: "Tại sao điều này quan trọng?",
      body: `Trong bối cảnh công nghệ GPU phát triển với tốc độ chóng mặt, việc nắm bắt thông tin kịp thời giúp bạn đưa ra quyết định mua sắm thông minh hơn, tránh tình trạng mua nhầm thế hệ cũ hoặc overspending cho những tính năng không cần thiết với use-case của mình.`,
    },
    {
      heading: "Kết luận của chuyên gia",
      body: `Với hơn một thập kỷ theo dõi thị trường GPU Việt Nam, đội ngũ chuyên gia tại VGA STORE đánh giá đây là một trong những chủ đề đáng quan tâm nhất trong quý này. Hãy để lại câu hỏi bên dưới nếu bạn cần tư vấn thêm!`,
    },
  ],
  tip: "💡 Theo dõi VGA STORE Blog để không bỏ lỡ những bài viết công nghệ mới nhất mỗi tuần.",
});

const BlogDetail = () => {
  const { id } = useParams();
  const blog = mockBlogs.find(b => b.id?.toString() === id?.toString()) || mockBlogs[0];
  const articleContent = ARTICLE_CONTENT[parseInt(id)] || getDefaultContent(blog);
  const relatedPosts = mockBlogs.filter(b => b.id?.toString() !== id?.toString()).slice(0, 3);

  return (
    <div className="blog-detail-page container">
      <div className="blog-detail-layout">

        {/* ===== CỘT TRÁI: NỘI DUNG CHÍNH ===== */}
        <article className="blog-detail-main">

          {/* BREADCRUMB */}
          <div className="blog-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/blog">Blog</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{blog.category}</span>
          </div>

          {/* HEADER BÀI VIẾT */}
          <div className="blog-detail-header">
            <span className="blog-detail-badge">{blog.category}</span>
            <h1 className="blog-detail-title">{blog.title}</h1>
            <div className="blog-detail-meta">
              <div className="meta-author">
                <div className="author-avatar">{blog.author?.charAt(0)}</div>
                <div className="author-info">
                  <span className="author-name">{blog.author}</span>
                  <span className="author-role">Senior Editor</span>
                </div>
              </div>
              <div className="meta-stats">
                <span>📅 {blog.date}</span>
                <span>👁 {(blog.views || 0).toLocaleString()} lượt xem</span>
                <span>⏱ 5 phút đọc</span>
              </div>
            </div>
          </div>

          {/* ẢNH BÌA */}
          <div className="blog-detail-hero-img">
            <img src={blog.thumbnail} alt={blog.title} />
          </div>

          {/* NỘI DUNG BÀI VIẾT */}
          <div className="blog-detail-body">
            <p className="article-intro">{articleContent.intro}</p>

            {articleContent.sections.map((section, idx) => (
              <div key={idx} className="article-section">
                <h2 className="article-heading">{section.heading}</h2>
                <p className="article-paragraph">{section.body}</p>
              </div>
            ))}

            {/* TIP BOX */}
            <div className="article-tip-box">
              <p>{articleContent.tip}</p>
            </div>
          </div>

          {/* TAGS */}
          <div className="blog-detail-tags">
            <span className="tags-label">Tags:</span>
            {['VGA', 'NVIDIA', 'GPU 2026', 'Gaming', 'Review'].map(tag => (
              <span key={tag} className="blog-tag">{tag}</span>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="blog-detail-divider"></div>

          {/* AUTHOR BOX */}
          <div className="author-card">
            <div className="author-card-avatar">{blog.author?.charAt(0)}</div>
            <div className="author-card-info">
              <h4 className="author-card-name">Viết bởi {blog.author}</h4>
              <p className="author-card-bio">Senior Tech Writer tại VGA STORE với hơn 8 năm kinh nghiệm phân tích thị trường linh kiện PC. Chuyên gia về GPU NVIDIA và AMD.</p>
            </div>
          </div>

        </article>

        {/* ===== CỘT PHẢI: SIDEBAR ===== */}
        <aside className="blog-detail-sidebar">

          {/* BÀI VIẾT LIÊN QUAN */}
          <div className="sidebar-widget">
            <h3 className="sidebar-widget-title">BÀI VIẾT LIÊN QUAN</h3>
            <div className="related-posts-list">
              {relatedPosts.map(post => (
                <Link to={`/blog/${post.id}`} key={post.id} className="related-post-item">
                  <div className="related-post-img">
                    <img src={post.thumbnail} alt={post.title} />
                  </div>
                  <div className="related-post-info">
                    <span className="related-post-category">{post.category}</span>
                    <h4 className="related-post-title">{post.title}</h4>
                    <span className="related-post-date">{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CHỦ ĐỀ HOT */}
          <div className="sidebar-widget">
            <h3 className="sidebar-widget-title">CHỦ ĐỀ HOT 🔥</h3>
            <div className="hot-topics">
              {['Review VGA', 'So sánh GPU', 'Tin tức NVIDIA', 'Build PC', 'Overclock', 'Ray Tracing'].map(topic => (
                <span key={topic} className="hot-topic-tag">{topic}</span>
              ))}
            </div>
          </div>

          {/* CTA BANNER */}
          <div className="sidebar-cta">
            <div className="sidebar-cta-icon">🎮</div>
            <h4>Cần tư vấn VGA?</h4>
            <p>Chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn card phù hợp.</p>
            <Link to="/products" className="sidebar-cta-btn">Xem Sản Phẩm</Link>
          </div>

        </aside>
      </div>

      {/* BACK BUTTON */}
      <div className="blog-detail-back-bar container">
        <Link to="/blog" className="back-to-blog-btn">
          ← Quay lại danh sách Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;
