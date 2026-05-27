import axiosClient from '../../api/axiosClient';

const formatTime = (t) => {
  if (!t) return '00:00:00';
  if (typeof t === 'string' && t.includes('T')) {
    return t.split('T')[1].substring(0, 8);
  }
  const date = new Date(t);
  if (!isNaN(date.getTime())) {
    return date.toISOString().substring(11, 19);
  }
  return t;
};

const mapShift = (s) => ({
  MaCaLamViec: s.MaCa,
  TenCa: s.TenCa,
  GioBatDau: formatTime(s.GioBatDau),
  GioKetThuc: formatTime(s.GioKetThuc),
  SoNguoiToiDa: s.SoNguoiToiDa,
  KhaDung: s.KhaDung ? 1 : 0,
  NgayTao: s.NgayTao ? new Date(s.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : null,
  NgayCapNhat: s.NgayCapNhat ? new Date(s.NgayCapNhat).toISOString().replace('T', ' ').substring(0, 19) : null,
});

const shiftService = {
  getShifts: async () => {
    const data = await axiosClient.get('/admin/ca-lam-viec');
    return data.map(mapShift);
  },

  addShift: async (shift) => {
    const payload = {
      TenCa: shift.TenCa,
      GioBatDau: shift.GioBatDau.length === 5 ? `${shift.GioBatDau}:00` : shift.GioBatDau,
      GioKetThuc: shift.GioKetThuc.length === 5 ? `${shift.GioKetThuc}:00` : shift.GioKetThuc,
      SoNguoiToiDa: shift.SoNguoiToiDa ? parseInt(shift.SoNguoiToiDa, 10) : undefined,
    };
    const data = await axiosClient.post('/admin/ca-lam-viec', payload);
    return mapShift(data);
  },

  updateShift: async (maCa, updates) => {
    const payload = {
      ...(updates.TenCa !== undefined && { TenCa: updates.TenCa }),
      ...(updates.GioBatDau !== undefined && { 
        GioBatDau: updates.GioBatDau.length === 5 ? `${updates.GioBatDau}:00` : updates.GioBatDau 
      }),
      ...(updates.GioKetThuc !== undefined && { 
        GioKetThuc: updates.GioKetThuc.length === 5 ? `${updates.GioKetThuc}:00` : updates.GioKetThuc 
      }),
      ...(updates.SoNguoiToiDa !== undefined && {
        SoNguoiToiDa: updates.SoNguoiToiDa ? parseInt(updates.SoNguoiToiDa, 10) : undefined
      }),
    };
    const data = await axiosClient.put(`/admin/ca-lam-viec/${maCa}`, payload);
    return mapShift(data);
  },

  deleteShift: async (maCa) => {
    await axiosClient.delete(`/admin/ca-lam-viec/${maCa}`);
    return true;
  },

  getShiftDetails: async () => {
    const data = await axiosClient.get('/admin/ca-lam-viec/phan-ca/lich-truc');
    return data.map(sd => {
      const staffName = sd.NhanVien?.TaiKhoan?.HoTen || 'N/A';
      const staffRole = sd.NhanVien?.ChucVu || 'N/A';
      const shiftName = sd.CaLamViec?.TenCa || 'N/A';
      const start = sd.CaLamViec?.GioBatDau ? formatTime(sd.CaLamViec.GioBatDau) : '00:00:00';
      const end = sd.CaLamViec?.GioKetThuc ? formatTime(sd.CaLamViec.GioKetThuc) : '00:00:00';

      return {
        MaChiTietCa: sd.MaChiTietCa,
        MaNhanVien: sd.MaNhanVien,
        MaCaLamViec: sd.MaCa,
        NgayLam: sd.NgayLamViec ? new Date(sd.NgayLamViec).toISOString().substring(0, 10) : '',
        GhiChu: sd.GhiChu || '',
        KhaDung: sd.KhaDung ? 1 : 0,
        HoTen: staffName,
        ChucVu: staffRole,
        TenCa: shiftName,
        GioBatDau: start,
        GioKetThuc: end,
      };
    });
  },

  addShiftDetail: async (detail) => {
    const dates = [];
    const startDate = new Date(detail.NgayLam);
    const endDate = detail.NgayLap ? new Date(detail.NgayLap) : startDate;

    let current = new Date(startDate);
    while (current <= endDate) {
      dates.push(current.toISOString().substring(0, 10));
      if (detail.KieuLap === 1) { // Weekly
        current.setDate(current.getDate() + 7);
      } else if (detail.KieuLap === 2) { // Daily
        current.setDate(current.getDate() + 1);
      } else {
        break;
      }
    }

    let lastResult = null;
    for (const d of dates) {
      const payload = {
        MaNhanVien: detail.MaNhanVien,
        MaCa: detail.MaCaLamViec,
        NgayLamViec: d,
      };
      lastResult = await axiosClient.post('/admin/ca-lam-viec/phan-ca', payload);
    }

    return {
      MaChiTietCa: lastResult?.MaChiTietCa || 'N/A',
      MaNhanVien: detail.MaNhanVien,
      MaCaLamViec: detail.MaCaLamViec,
      NgayLam: detail.NgayLam,
      KhaDung: 1,
    };
  },

  toggleShiftDetailStatus: async (maChiTietCa) => {
    const data = await axiosClient.patch(`/admin/ca-lam-viec/phan-ca/${maChiTietCa}/toggle`);
    return {
      MaChiTietCa: maChiTietCa,
      KhaDung: data.KhaDung ? 1 : 0,
    };
  },

  deleteShiftDetail: async (maChiTietCa) => {
    await axiosClient.delete(`/admin/ca-lam-viec/phan-ca/${maChiTietCa}`);
    return true;
  }
};

export default shiftService;
