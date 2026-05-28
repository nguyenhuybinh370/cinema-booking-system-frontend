import axiosPublic from './axiosPublic';

/**
 * Gửi yêu cầu mã OTP khôi phục mật khẩu tới email.
 * @param {string} email 
 */
export const forgotPassword = async (email) => {
  return axiosPublic.post('/auth/forgot-password', { Email: email });
};

/**
 * Xác thực mã OTP khôi phục mật khẩu.
 * @param {string} email 
 * @param {string} otp 
 */
export const verifyResetOtp = async (email, otp) => {
  return axiosPublic.post('/auth/verify-reset-otp', { Email: email, Otp: otp });
};

/**
 * Đặt lại mật khẩu mới.
 * @param {string} email 
 * @param {string} otp 
 * @param {string} newPassword 
 * @param {string} confirmPassword 
 */
export const resetPassword = async (email, otp, newPassword, confirmPassword) => {
  return axiosPublic.post('/auth/reset-password', {
    Email: email,
    Otp: otp,
    MatKhauMoi: newPassword,
    XacNhanMatKhauMoi: confirmPassword,
  });
};
