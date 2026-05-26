import axios from 'axios';

/**
 * axiosPublic - Axios instance dành riêng cho các API public (không yêu cầu đăng nhập).
 * Khác với axiosClient, instance này KHÔNG redirect về /login khi gặp lỗi 401.
 */
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosPublic.interceptors.response.use(
  (response) => {
    const { success, data, message, pagination } = response.data;
    if (success) {
      if (pagination) {
        return { data, pagination };
      }
      return data;
    }
    return Promise.reject(new Error(message || 'Có lỗi xảy ra'));
  },
  (error) => {
    const errData = error.response?.data;
    return Promise.reject(errData || error);
  },
);

export default axiosPublic;
