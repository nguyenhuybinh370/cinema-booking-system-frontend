import axiosClient from '../../api/axiosClient';

const mapSeatType = (t) => ({
  MaLoaiGhe: t.MaLoaiGhe,
  TenLoaiGhe: t.TenLoaiGhe,
  GiaPhuThu: parseFloat(t.PhuThu),
  MoTa: t.MoTa || `Ghế loại ${t.TenLoaiGhe}`,
  KhaDung: t.KhaDung ? 1 : 0,
  NgayTao: t.NgayTao ? new Date(t.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : null,
  NgayCapNhat: t.NgayCapNhat ? new Date(t.NgayCapNhat).toISOString().replace('T', ' ').substring(0, 19) : null,
});

const mapDayType = (t) => ({
  MaLoaiNgay: t.MaLoaiNgay,
  TenLoaiNgay: t.TenLoaiNgay,
  GiaPhuThu: parseFloat(t.PhuThu),
  MoTa: t.MoTa || `Ngày loại ${t.TenLoaiNgay}`,
  KhaDung: t.KhaDung ? 1 : 0,
  NgayTao: t.NgayTao ? new Date(t.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : null,
  NgayCapNhat: t.NgayCapNhat ? new Date(t.NgayCapNhat).toISOString().replace('T', ' ').substring(0, 19) : null,
});

const pricingService = {
  getSeatTypes: async () => {
    const data = await axiosClient.get('/admin/loai-ghe');
    return data.map(mapSeatType);
  },
  addSeatType: async (item) => {
    const payload = {
      TenLoaiGhe: item.TenLoaiGhe,
      PhuThu: Number(item.GiaPhuThu),
    };
    const data = await axiosClient.post('/admin/loai-ghe', payload);
    return mapSeatType(data);
  },
  updateSeatType: async (id, updates) => {
    const payload = {
      ...(updates.TenLoaiGhe !== undefined && { TenLoaiGhe: updates.TenLoaiGhe }),
      ...(updates.GiaPhuThu !== undefined && { PhuThu: Number(updates.GiaPhuThu) }),
      ...(updates.KhaDung !== undefined && { KhaDung: updates.KhaDung === 1 }),
    };
    const data = await axiosClient.put(`/admin/loai-ghe/${id}`, payload);
    return mapSeatType(data);
  },
  deleteSeatType: async (id) => {
    await axiosClient.delete(`/admin/loai-ghe/${id}`);
    return true;
  },

  getDayTypes: async () => {
    const data = await axiosClient.get('/admin/loai-ngay');
    return data.map(mapDayType);
  },
  addDayType: async (item) => {
    const payload = {
      TenLoaiNgay: item.TenLoaiNgay,
      PhuThu: Number(item.GiaPhuThu),
    };
    const data = await axiosClient.post('/admin/loai-ngay', payload);
    return mapDayType(data);
  },
  updateDayType: async (id, updates) => {
    const payload = {
      ...(updates.TenLoaiNgay !== undefined && { TenLoaiNgay: updates.TenLoaiNgay }),
      ...(updates.GiaPhuThu !== undefined && { PhuThu: Number(updates.GiaPhuThu) }),
      ...(updates.KhaDung !== undefined && { KhaDung: updates.KhaDung === 1 }),
    };
    const data = await axiosClient.put(`/admin/loai-ngay/${id}`, payload);
    return mapDayType(data);
  },
  deleteDayType: async (id) => {
    await axiosClient.delete(`/admin/loai-ngay/${id}`);
    return true;
  }
};

export default pricingService;
