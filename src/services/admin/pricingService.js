import { SEAT_TYPES, DAY_TYPES } from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const pricingService = {
  getSeatTypes: async () => {
    await delay();
    return [...SEAT_TYPES];
  },
  addSeatType: async (item) => {
    await delay();
    if (!item.TenLoaiGhe || item.TenLoaiGhe.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên loại ghế không được để trống!');
    }
    const exists = SEAT_TYPES.some(t => t.TenLoaiGhe.toLowerCase() === item.TenLoaiGhe.toLowerCase() && t.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên loại ghế đã tồn tại trong hệ thống!');
    }
    SEAT_TYPES.push(item);
    return item;
  },
  updateSeatType: async (id, updates) => {
    await delay();
    const index = SEAT_TYPES.findIndex(t => t.MaLoaiGhe === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại ghế');
    }
    if (updates.TenLoaiGhe !== undefined && (!updates.TenLoaiGhe || updates.TenLoaiGhe.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên loại ghế không được để trống!');
    }
    if (updates.TenLoaiGhe) {
      const exists = SEAT_TYPES.some(t => t.MaLoaiGhe !== id && t.TenLoaiGhe.toLowerCase() === updates.TenLoaiGhe.toLowerCase() && t.KhaDung !== 0);
      if (exists) {
        throw new Error('Lỗi: Tên loại ghế đã tồn tại trong hệ thống!');
      }
    }
    SEAT_TYPES[index] = {
      ...SEAT_TYPES[index],
      ...updates,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return SEAT_TYPES[index];
  },
  deleteSeatType: async (id) => {
    await delay();
    const index = SEAT_TYPES.findIndex(t => t.MaLoaiGhe === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại ghế');
    }
    if (id === 'LG01' || id === 'LG02' || id === 'LG03') {
      throw new Error('Không thể xóa loại ghế này vì đang được sử dụng trong sơ đồ ghế rạp (Kiểm tra trong bảng GHE)!');
    }
    SEAT_TYPES.splice(index, 1);
    return true;
  },

  getDayTypes: async () => {
    await delay();
    return [...DAY_TYPES];
  },
  addDayType: async (item) => {
    await delay();
    if (!item.TenLoaiNgay || item.TenLoaiNgay.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên loại ngày không được để trống!');
    }
    const exists = DAY_TYPES.some(t => t.TenLoaiNgay.toLowerCase() === item.TenLoaiNgay.toLowerCase() && t.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên loại ngày đã tồn tại trong hệ thống!');
    }
    DAY_TYPES.push(item);
    return item;
  },
  updateDayType: async (id, updates) => {
    await delay();
    const index = DAY_TYPES.findIndex(t => t.MaLoaiNgay === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại ngày');
    }
    if (updates.TenLoaiNgay !== undefined && (!updates.TenLoaiNgay || updates.TenLoaiNgay.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên loại ngày không được để trống!');
    }
    if (updates.TenLoaiNgay) {
      const exists = DAY_TYPES.some(t => t.MaLoaiNgay !== id && t.TenLoaiNgay.toLowerCase() === updates.TenLoaiNgay.toLowerCase() && t.KhaDung !== 0);
      if (exists) {
        throw new Error('Lỗi: Tên loại ngày đã tồn tại trong hệ thống!');
      }
    }
    DAY_TYPES[index] = {
      ...DAY_TYPES[index],
      ...updates,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return DAY_TYPES[index];
  },
  deleteDayType: async (id) => {
    await delay();
    const index = DAY_TYPES.findIndex(t => t.MaLoaiNgay === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại ngày');
    }
    if (id === 'LN01' || id === 'LN02') {
      throw new Error('Không thể xóa loại ngày này vì đang có suất chiếu áp dụng loại ngày này (Kiểm tra trong bảng SUATCHIEU)!');
    }
    DAY_TYPES.splice(index, 1);
    return true;
  }
};

export default pricingService;
