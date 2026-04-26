import axiosClient from '../api/axiosClient';

export const orderService = {
  // Order
  createOrder: async (orderData) => {
    const response = await axiosClient.post('/orders', orderData);
    return response?.data || response;
  },

  // Order
  createPayment: async (orderId, paymentMethod) => {
    const response = await axiosClient.post(`/payments/orders/${orderId}`, {
      paymentMethod // 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER'
    });
    return response?.data || response;
  },

  // Order
  getMyOrders: async () => {
    try {
      const response = await axiosClient.get('/orders/my');
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      return [];
    }
  },

  // Order
  getOrderById: async (id) => {
    try {
      const response = await axiosClient.get(`/orders/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error(`Lỗi lấy chi tiết đơn hàng ${id}:`, error);
      return null;
    }
  },

  // Order
  cancelOrder: async (orderId) => {
    const response = await axiosClient.put(`/orders/${orderId}/cancel`);
    return response?.data || response;
  }
};
