import { toast } from "react-hot-toast";

export const getErrorMessage = (error, fallback = "Thao tác thất bại.") => {
  if (!error) return fallback;

  if (error.response?.data) {
    const data = error.response.data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0].message) {
      return data.errors[0].message;
    }
  }

  if (error.message) return error.message;

  return fallback;
};

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  toast.error(message);
};

export const showInfo = (message) => {
  toast(message, {
    icon: "ℹ️",
  });
};

export const showWarning = (message) => {
  toast(message, {
    icon: "⚠️",
  });
};
