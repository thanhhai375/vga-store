/* eslint-disable no-unused-vars */
import axiosClient from '../api/axiosClient.js';
import { mockProducts } from '../data/mockProducts';

export const productService = {
  // Tạm thời dùng mock data, khi BE xong chỉ cần mở comment dòng dưới
  getAll: async () => {
    // return await axiosClient.get('/products');
    return new Promise((resolve) => setTimeout(() => resolve(mockProducts), 500));
  }
};