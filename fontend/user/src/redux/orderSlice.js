import { createSlice } from '@reduxjs/toolkit';

// orderSlice ch gi state cache d liu thc ly t API qua orderService
const initialState = {
  orders: [] // s c load t API trong TrackOrder/Profile
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
