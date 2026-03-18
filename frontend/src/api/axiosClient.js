import axios from 'axios';

// Cấu hình base Axios để sau này gọi BE Spring Boot không cần gõ lại URL dài
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
