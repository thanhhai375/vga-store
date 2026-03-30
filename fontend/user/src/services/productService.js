import axiosClient from '../api/axiosClient.js';

export const productService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/products');

      // Backend giờ đã chuẩn, chỉ cần lấy data.content là ra mảng 20 sản phẩm
      if (response && response.data && response.data.content) {
        return response.data.content;
      }
      return [];
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      return [];
    }
  }
};