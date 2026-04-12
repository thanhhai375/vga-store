import axiosClient from '../api/axiosClient';

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await axiosClient.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng của người dùng hiện tại
  getMyOrders: async () => {
    try {
      const response = await axiosClient.get('/orders/my');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      return [];
    }
  },

  // Lấy chi tiết một đơn hàng cụ thể
  getOrderById: async (id) => {
    try {
      const response = await axiosClient.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error(`Lỗi lấy chi tiết đơn hàng ${id}:`, error);
      return null;
    }
  }
};
