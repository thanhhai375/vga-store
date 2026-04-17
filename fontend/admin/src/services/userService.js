import axiosClient from '../api/axiosClient';

const userService = {
  getAll: (params) => axiosClient.get('/admin/users', { params }),
  getById: (id) => axiosClient.get(`/admin/users/${id}`),
  create: (data) => axiosClient.post('/auth/register-admin', data),
  update: (id, data) => axiosClient.put(`/admin/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/admin/users/${id}`),
  toggleStatus: (id) => axiosClient.put(`/admin/users/${id}/toggle-status`),
};

export default userService;
