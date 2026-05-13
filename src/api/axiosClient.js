import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5173/",
  headers: {
    "Content-Type": "application/json",
  },
});

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
        return { data, pagination };
      }
      return data;
    }
    return Promise.reject(new Error(message || "Có lỗi xảy ra"));
  },
  (error) => {
    const errData = error.response?.data;
    if (errData) {
      console.error(
        `[API Error] Code: ${errData.code} - Message: ${errData.message}`,
      );

      // Xử lý riêng biệt các mã lỗi (Ví dụ: hết hạn token)
      if (errData.code === "AUTH_TOKEN_EXPIRED") {
        // TODO: Xử lý logic gọi API refresh token hoặc force logout
        console.warn("Token expired. Cần refresh token!");
      }
    } else {
      console.error("Lỗi mạng hoặc server không phản hồi", error.message);
    }

    return Promise.reject(errData || error);
  },
);

export default axiosClient;
