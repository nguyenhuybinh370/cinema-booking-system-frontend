import axiosClient from './axiosClient';

export const getSeatMap = (maSuatChieu) => {
  return axiosClient.get(`/suat-chieu/${maSuatChieu}/ghe`);
};

export const holdSeats = (maSuatChieu, seatIds) => {
  return axiosClient.post('/dat-ve/giu-ghe', {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds
  });
};

export const cancelHeldSeats = (maSuatChieu, seatIds) => {
  return axiosClient.post('/dat-ve/huy-giu-ghe', {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds
  });
};
