import axiosClient from '../api/axiosClient.js';

const FALLBACK_THUMBNAILS = [
  '/images/blog/blog-rtx5090-leak.jpg',
  '/images/blog/blog-dlss4-framegeneration.jpg',
  '/images/blog/blog-top5-budget.jpg',
  '/images/blog/blog-undervolt-guide.jpg',
  '/images/blog/blog-amd-rx7900xtx.jpg',
  '/images/blog/blog-asus-rog-rtx4090.jpg',
];

// Xử lý URL ảnh thông minh: ưu tiên thumbnail từ DB
const processImageUrl = (blog, index) => {
  const thumb = blog.thumbnail || blog.image || blog.imgUrl;
  if (thumb) {
    // Ảnh từ Upload backend
    if (thumb.startsWith('/uploads/')) return `http://localhost:8080${thumb}`;
    // Ảnh tịnh trong public user
    if (thumb.startsWith('/images/')) return thumb; // Relative, React dev server tự serve
    if (thumb.startsWith('http')) return thumb;
    return thumb;
  }
  // Fallback khi DB không có ảnh
  return FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length];
};

export const blogService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/blogs');
      const blogs = Array.isArray(response) ? response : [];
      return blogs.map((blog, index) => ({
        ...blog,
        thumbnail: processImageUrl(blog, index)
      }));
    } catch (error) {
      console.error('Lỗi gọi API blogs:', error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/blogs/${id}`);
      return response;
    } catch (error) {
      console.error(`Lỗi lấy bài viết ${id}:`, error);
      return null;
    }
  },

  getFeatured: async () => {
    try {
      const response = await axiosClient.get('/blogs/featured');
      const blogs = Array.isArray(response) ? response : [];
      return blogs.map((blog, index) => ({
        ...blog,
        thumbnail: processImageUrl(blog, index)
      }));
    } catch (error) {
      console.error('Lỗi gọi API blogs nổi bật:', error);
      return [];
    }
  }
};
