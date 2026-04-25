import axiosClient from '../api/axiosClient';

const servicePolicyService = {
  // Ly tt c chnh sch dch v t BE
  getAll: async () => {
    try {
      const res = await axiosClient.get('/service-policies');
      return Array.isArray(res) ? res : (res?.data || []);
    } catch (err) {
      console.error('Lỗi tải chính sách dịch vụ:', err);
      return [];
    }
  }
};

export default servicePolicyService;
