import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    const { success, data, message, pagination } = response.data;
    if (success) {
      if (pagination) {
        const { success: s, message: m, ...rest } = response.data;
        return rest;
      }
      return data;
    }
    return Promise.reject(new Error(message || "Có lỗi xảy ra"));
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error status is 401 and it hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
          const response = await axios.post(`${apiBase}/auth/refresh-token`, {
            refreshToken,
          });
          
          const newAccessToken = response.data?.data?.accessToken;
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            processQueue(null, newAccessToken);
            isRefreshing = false;
            
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          
          // Clear credentials and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          localStorage.removeItem("userCode");
          
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear credentials and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userCode");
        
        window.location.href = "/login";
      }
    }

    const errData = error.response?.data;
    return Promise.reject(errData || error);
  },
);

export default axiosClient;
