import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
  },
});