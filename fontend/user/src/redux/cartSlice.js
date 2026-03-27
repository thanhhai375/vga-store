import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [], // Mảng chứa các sản phẩm trong giỏ
  cartTotalQuantity: 0, // Tổng số lượng sản phẩm (hiển thị trên Header)
  cartTotalAmount: 0, // Tổng tiền
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Thêm sản phẩm vào giỏ
    addToCart(state, action) {
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        // Nếu có rồi thì tăng số lượng
        state.cartItems[itemIndex].cartQuantity += 1;
      } else {
        // Nếu chưa có thì thêm mới với số lượng là 1
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
      }

      // Cập nhật tổng số lượng trên icon giỏ hàng
      state.cartTotalQuantity += 1;
    },

    // 2. Xóa hẳn sản phẩm khỏi giỏ
    removeFromCart(state, action) {
      const nextCartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      state.cartItems = nextCartItems;

      // Cập nhật lại tổng số lượng
      state.cartTotalQuantity = state.cartItems.reduce(
        (total, item) => total + item.cartQuantity, 0
      );
    },

    // 3. Giảm số lượng 1 đơn vị
    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
        state.cartTotalQuantity -= 1;
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        // Nếu số lượng là 1 mà bấm giảm thì xóa luôn
        const nextCartItems = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );
        state.cartItems = nextCartItems;
        state.cartTotalQuantity -= 1;
      }
    },

    // 4. Xóa sạch giỏ hàng
    clearCart(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, decreaseCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;