import axiosClient from '../api/axiosClient';

const productService = {
  getAll: (params) => axiosClient.get('/admin/products', { params }),
  getById: (id) => axiosClient.get(`/admin/products/${id}`),
  // To mi - gi FormData (multipart/form-data vi nh)
  create: (formData) => axiosClient.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  // Cp nht - gi FormData (multipart/form-data vi nh ty chn)
  update: (id, formData) => axiosClient.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => axiosClient.delete(`/admin/products/${id}`),
};

export default productService;
