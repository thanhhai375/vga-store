import axiosClient from '../api/axiosClient';

export const orderService = {
  // To n hng mi
  createOrder: async (orderData) => {
    const response = await axiosClient.post('/orders', orderData);
    return response?.data || response;
  },

  // To thanh ton cho n hng (gi sau createOrder)
  createPayment: async (orderId, paymentMethod) => {
    const response = await axiosClient.post(`/payments/orders/${orderId}`, {
      paymentMethod // 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER'
    });
    return response?.data || response;
  },

  // Ly danh sch n hng ca user hin ti
  getMyOrders: async () => {
    try {
      const response = await axiosClient.get('/orders/my');
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      return [];
    }
  },

  // Ly chi tit 1 n hng
  getOrderById: async (id) => {
    try {
      const response = await axiosClient.get(`/orders/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error(`Lỗi lấy chi tiết đơn hàng ${id}:`, error);
      return null;
    }
  },

  // Hy n hng (user ch c hy khi status = PENDING)
  cancelOrder: async (orderId) => {
    const response = await axiosClient.put(`/orders/${orderId}/cancel`);
    return response?.data || response;
  }
};
