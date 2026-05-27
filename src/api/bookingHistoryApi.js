import axiosClient from './axiosClient';

/**
 * Lấy lịch sử giao dịch/đặt vé của khách hàng hiện tại
 * @param {object} params 
 */
export const getBookingHistory = (params) => {
  return axiosClient.get('/lich-su-giao-dich', { params });
};

/**
 * Lấy chi tiết phiếu đặt vé của khách hàng hiện tại
 * @param {string} maPhieuDat 
 */
export const getBookingDetail = (maPhieuDat) => {
  return axiosClient.get(`/lich-su-giao-dich/${maPhieuDat}`);
};
