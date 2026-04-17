import axiosClient from '../api/axiosClient';

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    const response = await axiosClient.post('/orders', orderData);
    return response?.data || response;
  },

  // Tạo thanh toán cho đơn hàng (gọi sau createOrder)
  createPayment: async (orderId, paymentMethod) => {
    const response = await axiosClient.post(`/payments/orders/${orderId}`, {
      paymentMethod // 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER'
    });
    return response?.data || response;
  },

  // Lấy danh sách đơn hàng của user hiện tại
  getMyOrders: async () => {
    try {
      const response = await axiosClient.get('/orders/my');
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      return [];
    }
  },

  // Lấy chi tiết 1 đơn hàng
  getOrderById: async (id) => {
    try {
      const response = await axiosClient.get(`/orders/${id}`);
      return response?.data || response;
    } catch (error) {
      console.error(`Lỗi lấy chi tiết đơn hàng ${id}:`, error);
      return null;
    }
  },

  // Hủy đơn hàng (user chỉ được hủy khi status = PENDING)
  cancelOrder: async (orderId) => {
    const response = await axiosClient.put(`/orders/${orderId}/cancel`);
    return response?.data || response;
  }
};
