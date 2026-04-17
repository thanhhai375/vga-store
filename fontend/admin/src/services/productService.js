import axiosClient from '../api/axiosClient';

const productService = {
  getAll: (params) => axiosClient.get('/admin/products', { params }),
  getById: (id) => axiosClient.get(`/admin/products/${id}`),
  // Tạo mới - gửi FormData (multipart/form-data với ảnh)
  create: (formData) => axiosClient.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  // Cập nhật - gửi FormData (multipart/form-data với ảnh tùy chọn)
  update: (id, formData) => axiosClient.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => axiosClient.delete(`/admin/products/${id}`),
};

export default productService;
