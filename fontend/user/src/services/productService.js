import axiosClient from '../api/axiosClient.js';
import { mockProducts } from '../data/mockProducts';

export const productService = {
  getAll: async (params = {}) => {
    try {
      // Backend trả về: { success: true, message: "...", data: { content: [...], totalElements: ... } }
      // axiosClient interceptor đã unwrap response.data (HTTP layer) → ta nhận được ApiResponse object
      // Nên đây là: { success, message, data: Page<Product> }
      const apiResponse = await axiosClient.get('/products', { params });

      // Lấy phần data từ ApiResponse wrapper
      const pageData = apiResponse?.data;

      // Spring Boot Page object có field 'content'
      if (pageData && Array.isArray(pageData.content)) return pageData.content;
      // Nếu backend trả mảng thẳng (không paginate)
      if (Array.isArray(pageData)) return pageData;
      // Fallback mock nếu backend offline
      console.warn('⚠️ API trả dữ liệu không đúng format, dùng mock data:', apiResponse);
      return mockProducts;
    } catch (error) {
      console.error('Lỗi gọi API sản phẩm (dùng mock data):', error.message);
      return mockProducts; // Fallback về mock khi backend offline
    }
  },

  getById: async (id) => {
    try {
      // Backend trả về: { success: true, message: "...", data: Product }
      const apiResponse = await axiosClient.get(`/products/${id}`);
      // Lấy Product từ ApiResponse.data
      const product = apiResponse?.data;
      if (product && product.id) return product;
      // Fallback mock
      return mockProducts.find(p => p.id?.toString() === id?.toString()) || mockProducts[0];
    } catch (error) {
      console.error('Lỗi lấy chi tiết sản phẩm (dùng mock data):', error.message);
      return mockProducts.find(p => p.id?.toString() === id?.toString()) || mockProducts[0];
    }
  },
};