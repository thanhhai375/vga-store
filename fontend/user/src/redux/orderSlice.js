import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Dữ liệu mẫu (Có thêm thông tin chi tiết để test)
  orders: [
    {
      id: 'VGA-180288', date: '18/02/2026', total: '12.490.000đ', status: 'Đang giao hàng', statusColor: '#3b82f6',
      customerInfo: { fullName: 'Nguyễn Văn A', phone: '0901234567', address: '123 Lê Lợi, Q1, TP.HCM', note: '' },
      items: [{ name: 'ASUS Dual RTX 3060', price: 12490000, cartQuantity: 1 }]
    },
    {
      id: 'VGA-427010', date: '29/03/2026', total: '55.000.000đ', status: 'Chờ duyệt', statusColor: '#f59e0b',
      customerInfo: { fullName: 'Trưởng Nhóm', phone: '0326017487', address: '456 Cống Quỳnh, Q1, TP.HCM', note: 'Giao giờ hành chính' },
      items: [{ name: 'ASUS ROG Strix RTX 4090 - OC Edition', price: 55000000, cartQuantity: 1 }]
    }
  ]
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const orderIndex = state.orders.findIndex(o => o.id === orderId);
      if (orderIndex >= 0) {
        state.orders[orderIndex].status = 'Đã hủy';
        state.orders[orderIndex].statusColor = '#ef4444';
      }
    },
    // THÊM MỚI: Cập nhật địa chỉ giao hàng
    updateOrderAddress: (state, action) => {
      const { orderId, newAddress } = action.payload;
      const orderIndex = state.orders.findIndex(o => o.id === orderId);
      if (orderIndex >= 0) {
        state.orders[orderIndex].customerInfo.address = newAddress;
      }
    }
  }
});

export const { addOrder, cancelOrder, updateOrderAddress } = orderSlice.actions;
export default orderSlice.reducer;