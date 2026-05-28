import axiosClient from './axiosClient';

/**
 * Tạo link thanh toán PayOS
 * @param {string} maPhieuDat 
 */
export const createPayOSPayment = (maPhieuDat) => {
  return axiosClient.post('/payment/payos/create', { MaPhieuDat: maPhieuDat });
};

/**
 * Lấy trạng thái giao dịch thanh toán PayOS
 * @param {string} maGiaoDich 
 */
export const getPayOSPaymentStatus = (maGiaoDich) => {
  return axiosClient.get(`/payment/payos/${maGiaoDich}/status`);
};
