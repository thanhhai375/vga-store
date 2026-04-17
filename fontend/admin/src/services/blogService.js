import axiosClient from '../api/axiosClient';

const blogService = {
  getAll: (params) => axiosClient.get('/blogs', { params }),
  getById: (id) => axiosClient.get(`/blogs/${id}`),
  create: (data) => axiosClient.post('/admin/blogs', data),
  update: (id, data) => axiosClient.put(`/admin/blogs/${id}`, data),
  delete: (id) => axiosClient.delete(`/admin/blogs/${id}`),
};

export default blogService;
