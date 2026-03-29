import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice'; // <-- 1. Import orderSlice

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer, // <-- 2. Thêm vào đây
  },
});