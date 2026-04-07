import axiosClient from '../api/axiosClient.js';

export const productService = {
  getAll: async (params = {}) => {
    try {
      // axiosClient interceptor đã unwrap response.data rồi
      // nên 'data' ở đây chính là body của backend (VD: { content: [...], totalElements: ... })
      const data = await axiosClient.get('/products', { params });

      // Spring Boot Pageable
      if (data && Array.isArray(data.content)) return data.content;
      // Trả về mảng thẳng
      if (Array.isArray(data)) return data;
      return [];
    } catch (error) {
      console.error('Lỗi gọi API sản phẩm:', error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const data = await axiosClient.get(`/products/${id}`);
      return data;
    } catch (error) {
      console.error('Lỗi lấy chi tiết sản phẩm:', error);
      return null;
    }
  },
};