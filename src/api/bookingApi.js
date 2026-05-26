import axiosClient from './axiosClient';

/**
 * Lấy sơ đồ ghế và trạng thái giữ ghế của suất chiếu
 * @param {string} maSuatChieu 
 */
export const getSeatMap = (maSuatChieu) => {
  return axiosClient.get(`/suat-chieu/${maSuatChieu}/ghe`);
};

/**
 * Giữ ghế cho khách hàng
 * @param {string} maSuatChieu 
 * @param {string[]} seatIds 
 */
export const holdSeats = (maSuatChieu, seatIds) => {
  return axiosClient.post('/dat-ve/giu-ghe', {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds,
  });
};

/**
 * Hủy giữ ghế thủ công
 * @param {string} maSuatChieu 
 * @param {string[]} seatIds 
 */
export const cancelHeldSeats = (maSuatChieu, seatIds) => {
  return axiosClient.post('/dat-ve/huy-giu-ghe', {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds,
  });
};
