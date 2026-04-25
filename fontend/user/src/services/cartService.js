import axiosClient from '../api/axiosClient';

const cartService = {
  // Lấy giỏ hàng từ DB (tạo mới nếu chưa có)
  getCart: async () => {
    try {
      const res = await axiosClient.get('/cart');
      return res?.data || res;
    } catch (err) {
      console.error('Lỗi lấy giỏ hàng:', err);
      return null;
    }
  },

  // Thêm sản phẩm vào giỏ
  addItem: async (productId, quantity = 1) => {
    try {
      const res = await axiosClient.post('/cart/add', { productId, quantity });
      return res?.data || res;
    } catch (err) {
      console.error('Lỗi thêm vào giỏ:', err);
      throw err;
    }
  },

  // Cập nhật số lượng 1 item
  updateItem: async (cartItemId, quantity) => {
    try {
      const res = await axiosClient.put(`/cart/items/${cartItemId}`, { quantity });
      return res?.data || res;
    } catch (err) {
      console.error('Lỗi cập nhật giỏ:', err);
      throw err;
    }
  },

  // Xóa 1 item khỏi giỏ
  removeItem: async (cartItemId) => {
    try {
      const res = await axiosClient.delete(`/cart/items/${cartItemId}`);
      return res?.data || res;
    } catch (err) {
      console.error('Lỗi xóa item giỏ:', err);
      throw err;
    }
  },

  // Xóa toàn bộ giỏ
  clearCart: async () => {
    try {
      await axiosClient.delete('/cart');
    } catch (err) {
      console.error('Lỗi xóa giỏ hàng:', err);
    }
  }
};

export default cartService;
