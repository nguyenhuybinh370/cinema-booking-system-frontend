import axiosClient from './axiosClient';

/**
 * Lấy sơ đồ ghế và trạng thái giữ ghế của suất chiếu
 * @param {string} maSuatChieu 
 */
export const getSeatMap = (maSuatChieu) => {
  return axiosClient.get(`/suat-chieu/${maSuatChieu}/ghe`);
};
