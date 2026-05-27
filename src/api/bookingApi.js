import axiosClient from './axiosClient';

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

/**
 * Thanh toán giả lập kết quả đặt vé
 * @param {object} payload
 * @param {string} payload.MaSuatChieu
 * @param {string[]} payload.DanhSachMaGheSuatChieu
 * @param {string} payload.PhuongThucThanhToan - 'VNPAY' | 'TIEN_MAT'
 * @param {string} payload.KetQuaThanhToan - 'THANH_CONG' | 'THAT_BAI'
 */
export const simulatedCheckout = (payload) => {
  return axiosClient.post('/dat-ve/thanh-toan-gia-lap', payload);
};
