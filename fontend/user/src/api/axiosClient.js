import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http:// localhost:8080/api', // ng link gc ca Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thm interceptor t ng nht token vo header nu ng nhp
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thm interceptor x l data tr v cho gn
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
             // Tu theo API c bc ApiResponse khng
             return (response.data.success !== undefined) ? response.data : response.data;
        }
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Xa session rt/ht hn trnh b kt 403 vnh vin
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Ti li trang xa sch state Redux
            if(window.location.pathname !== '/login' && window.location.pathname !== '/') {
                 window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
