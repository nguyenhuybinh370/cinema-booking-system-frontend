import axiosClient from './axiosClient';

/**
 * Hủy phiếu đặt vé
 * @param {string} maPhieuDat 
 * @param {object} payload - { LyDoHoan: string }
 */
export const cancelBooking = (maPhieuDat, payload) => {
  return axiosClient.post(`/dat-ve/${maPhieuDat}/huy`, payload);
};

/**
 * Gửi yêu cầu hoàn tiền
 * @param {object} payload - { MaPhieuDat: string, LyDo: string }
 */
export const requestRefund = (payload) => {
  return axiosClient.post('/hoan-tien/yeu-cau', payload);
};

/**
 * Lấy danh sách yêu cầu hoàn tiền của tôi
 * @param {object} params - { page: number, limit: number }
 */
export const getMyRefundRequests = (params) => {
  return axiosClient.get('/hoan-tien/cua-toi', { params });
};
