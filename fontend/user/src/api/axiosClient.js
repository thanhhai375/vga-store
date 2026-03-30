import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Đường link gốc của Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để xử lý data trả về cho gọn
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data; // Chỉ lấy cục data, bỏ qua mấy thông tin thừa của HTTP
        }
        return response;
    },
    (error) => {
        throw error;
    }
);

export default axiosClient;