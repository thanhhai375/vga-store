import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../services/cartService';
import { toastError } from '../utils/alertUtils';

// Thunk: Load gi hng t DB
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
  const state = getState();
  if (!state.auth?.isAuthenticated) return null;
  const res = await cartService.getCart();
  return res?.items || res?.data?.items || [];
});

// Thunk: Thm vo gi
export const addToCartDb = createAsyncThunk('cart/addToCartDb', async ({ product, quantity }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  if (state.auth?.isAuthenticated) {
    try {
      await cartService.addItem(product.id, quantity || 1);
      dispatch(fetchCart());
    } catch (e) {
      console.error('Lỗi khi addToCartDb:', e);
      return rejectWithValue(e.response?.data?.message || 'Lỗi liên kết máy chủ - Vui lòng đăng nhập lại!');
    }
  } else {
    dispatch(addToCart(product));
  }
  return { product, quantity };
});

// Thunk: Cp nht s lng
export const updateCartItemDb = createAsyncThunk('cart/updateCartItemDb', async ({ item, quantity }, { dispatch, getState }) => {
  const state = getState();
  if (state.auth?.isAuthenticated) {
    if (item.cartItemId) await cartService.updateItem(item.cartItemId, quantity);
    dispatch(fetchCart());
  } else {
    // Nu local, decreaseCart/addToCart x l, nhng y c th cp nht trc tip, ta dng cch c
    // Hoc x l n gin: nu quantity > hin ti => addToCart, else => decreaseCart (phc tp)
    // Tt nht l dispatch gim hoc tng t component.
  }
  return { item, quantity };
});

export const removeCartItemDbAction = createAsyncThunk('cart/removeCartItemDbAction', async (item, { dispatch, getState }) => {
  const state = getState();
  if (state.auth?.isAuthenticated) {
    if (item.cartItemId) await cartService.removeItem(item.cartItemId);
    dispatch(fetchCart());
  } else {
    dispatch(removeFromCart(item));
  }
  return item;
});

// Thunk: Checkout (X l xa gi)
export const clearCartDb = createAsyncThunk('cart/clearCartDb', async (_, { dispatch, getState }) => {
  const state = getState();
  if (state.auth?.isAuthenticated) {
    await cartService.clearCart();
    dispatch(fetchCart());
  } else {
    dispatch(clearCart());
  }
});

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  loading: false,
};

const mapDbItemToLocal = (dbItem) => ({
  cartItemId: dbItem.id, // Sa dbItem.cartItemId -> dbItem.id v Backend tr v l "id"
  id: dbItem.productId,
  name: dbItem.productName,
  price: dbItem.price,
  cartQuantity: dbItem.quantity,
  imgUrl: dbItem.productImage,
  subtotal: dbItem.subtotal
});

const calculateTotals = (state) => {
  state.cartTotalQuantity = state.cartItems.reduce((acc, item) => acc + (item.cartQuantity || 0), 0);
  state.cartTotalAmount = state.cartItems.reduce((acc, item) => acc + (item.cartQuantity * item.price), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Cc thao tc local khi khng ng nhp
    addToCart(state, action) {
      const product = action.payload;
      const index = state.cartItems.findIndex(i => i.id === product.id);
      if (index >= 0) {
        state.cartItems[index].cartQuantity += 1;
      } else {
        state.cartItems.push({ ...product, cartQuantity: 1 });
      }
      calculateTotals(state);
    },
    decreaseCart(state, action) {
      const index = state.cartItems.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        if (state.cartItems[index].cartQuantity > 1) {
          state.cartItems[index].cartQuantity -= 1;
        } else {
          state.cartItems.splice(index, 1);
        }
      }
      calculateTotals(state);
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload.id);
      calculateTotals(state);
    },
    clearCart(state) {
      state.cartItems = [];
      calculateTotals(state);
    }
  },
  extraReducers: (builder) => {
    // X l fetchCart
    builder.addCase(fetchCart.pending, (state) => { state.loading = true; });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.cartItems = action.payload.map(mapDbItemToLocal);
        calculateTotals(state);
      }
    });
    builder.addCase(fetchCart.rejected, (state) => { state.loading = false; });

    // X l bo li nu add API throw error
    builder.addCase(addToCartDb.rejected, (state, action) => {
      toastError(action.payload || 'Lỗi hệ thống khi thêm sản phẩm vào giỏ!');
    });
  }
});

export const { addToCart, decreaseCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
