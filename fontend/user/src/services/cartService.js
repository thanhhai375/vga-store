import axiosClient from '../api/axiosClient';

const cartService = {
  // Ly gi hng t DB (to mi nu cha c)
  getCart: async () => {
    try {
      const res = await axiosClient.get('/cart');
      return res?.data || res;
    } catch (err) {
      console.error('Lỗi lấy giỏ hàng:', err);
      return null;
    }
  },

  // Thm sn phm vo gi
  addItem: async (productId, quantity = 1) => {
    try {
      const res = await axiosClient.post('/cart/add', { productId, quantity });
      return res?.data || res;
    } catch (err) {
      console.error('Lỗi thêm vào giỏ:', err);
      throw err;
    }
  },

  // Cp nht s lng 1 item
  updateItem: async (cartItemId, quantity) => {
    try {
      const res = await axiosClient.put(`/cart/items/${cartItemId}`, { quantity });
      return res?.data || res;
    } catch (err) {
      console.error('Lỗi cập nhật giỏ:', err);
      throw err;
    }
  },

  // Xa 1 item khi gi
  removeItem: async (cartItemId) => {
    try {
      const res = await axiosClient.delete(`/cart/items/${cartItemId}`);
      return res?.data || res;
    } catch (err) {
      console.error('Lỗi xóa item giỏ:', err);
      throw err;
    }
  },

  // Xa ton b gi
  clearCart: async () => {
    try {
      await axiosClient.delete('/cart');
    } catch (err) {
      console.error('Lỗi xóa giỏ hàng:', err);
    }
  }
};

export default cartService;
