import axiosClient from '../api/axiosClient.js';

export const blogService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/blogs');
      return Array.isArray(response) ? response : [];
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
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Lỗi gọi API blogs nổi bật:', error);
      return [];
    }
  }
};
