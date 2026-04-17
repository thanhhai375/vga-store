import axiosClient from '../api/axiosClient.js';

const FALLBACK_THUMBNAILS = [
  'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop', // pc gaming 
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop', // gpu
  'https://images.unsplash.com/photo-1624704795328-91fb5e2b0286?q=80&w=800&auto=format&fit=crop', // setup
  'https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=800&auto=format&fit=crop', // motherboard
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop', // tech
  'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop'  // ram
];

export const blogService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/blogs');
      const blogs = Array.isArray(response) ? response : [];
      // Sử dụng ảnh từ mảng Unsplash
      return blogs.map((blog, index) => ({
        ...blog,
        thumbnail: FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length]
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
        thumbnail: FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length]
      }));
    } catch (error) {
      console.error('Lỗi gọi API blogs nổi bật:', error);
      return [];
    }
  }
};
