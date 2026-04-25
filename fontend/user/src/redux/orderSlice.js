import { createSlice } from '@reduxjs/toolkit';

// orderSlice chỉ giữ state cache — dữ liệu thực lấy từ API qua orderService
const initialState = {
  orders: [] // sẽ được load từ API trong TrackOrder/Profile
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
    }
  }
});

export const { setOrders, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;