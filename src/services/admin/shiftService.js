import { STAFF, ACCOUNTS, SHIFTS, SHIFT_DETAILS } from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const shiftService = {
  getShifts: async () => {
    await delay();
    return [...SHIFTS];
  },
  addShift: async (shift) => {
    await delay();
    if (!shift.TenCa || shift.TenCa.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên ca không được để trống!');
    }
    if (!shift.GioBatDau || shift.GioBatDau.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Giờ bắt đầu không được để trống!');
    }
    if (!shift.GioKetThuc || shift.GioKetThuc.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Giờ kết thúc không được để trống!');
    }
    if (shift.SoNguoiToiDa === undefined || isNaN(shift.SoNguoiToiDa) || parseInt(shift.SoNguoiToiDa, 10) <= 0) {
      throw new Error('Thông tin không hợp lệ: Số người tối đa phải lớn hơn 0!');
    }

    const idNum = SHIFTS.reduce((max, s) => {
      const num = parseInt(s.MaCaLamViec.substring(1), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextId = `C${String(idNum + 1).padStart(2, '0')}`;

    const newShift = {
      MaCaLamViec: nextId,
      TenCa: shift.TenCa,
      GioBatDau: shift.GioBatDau.length === 5 ? `${shift.GioBatDau}:00` : shift.GioBatDau,
      GioKetThuc: shift.GioKetThuc.length === 5 ? `${shift.GioKetThuc}:00` : shift.GioKetThuc,
      SoNguoiToiDa: parseInt(shift.SoNguoiToiDa, 10),
      KhaDung: shift.KhaDung !== undefined ? parseInt(shift.KhaDung, 10) : 1,
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    SHIFTS.push(newShift);
    return newShift;
  },
  updateShift: async (maCa, updates) => {
    await delay();
    const index = SHIFTS.findIndex(s => s.MaCaLamViec === maCa);
    if (index === -1) {
      throw new Error('Không tìm thấy ca làm việc');
    }

    if (updates.TenCa !== undefined && (!updates.TenCa || updates.TenCa.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên ca không được để trống!');
    }
    if (updates.GioBatDau !== undefined && (!updates.GioBatDau || updates.GioBatDau.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Giờ bắt đầu không được để trống!');
    }
    if (updates.GioKetThuc !== undefined && (!updates.GioKetThuc || updates.GioKetThuc.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Giờ kết thúc không được để trống!');
    }
    if (updates.SoNguoiToiDa !== undefined && (isNaN(updates.SoNguoiToiDa) || parseInt(updates.SoNguoiToiDa, 10) <= 0)) {
      throw new Error('Thông tin không hợp lệ: Số người tối đa phải lớn hơn 0!');
    }

    SHIFTS[index] = {
      ...SHIFTS[index],
      ...updates,
      GioBatDau: updates.GioBatDau && updates.GioBatDau.length === 5 ? `${updates.GioBatDau}:00` : updates.GioBatDau || SHIFTS[index].GioBatDau,
      GioKetThuc: updates.GioKetThuc && updates.GioKetThuc.length === 5 ? `${updates.GioKetThuc}:00` : updates.GioKetThuc || SHIFTS[index].GioKetThuc,
      SoNguoiToiDa: updates.SoNguoiToiDa !== undefined ? parseInt(updates.SoNguoiToiDa, 10) : SHIFTS[index].SoNguoiToiDa,
      KhaDung: updates.KhaDung !== undefined ? parseInt(updates.KhaDung, 10) : SHIFTS[index].KhaDung,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return SHIFTS[index];
  },
  deleteShift: async (maCa) => {
    await delay();
    const index = SHIFTS.findIndex(s => s.MaCaLamViec === maCa);
    if (index === -1) {
      throw new Error('Không tìm thấy ca làm việc');
    }
    const hasAssignments = SHIFT_DETAILS.some(sd => sd.MaCaLamViec === maCa && sd.KhaDung === 1);
    if (hasAssignments) {
      throw new Error('Không thể xóa ca làm việc vì đã có nhân viên đăng ký ca này (Kiểm tra trong bảng CHITIETCALAMVIEC)!');
    }
    SHIFTS.splice(index, 1);
    return true;
  },

  getShiftDetails: async () => {
    await delay();
    return SHIFT_DETAILS.map(sd => {
      const staffMember = STAFF.find(s => s.MaNhanVien === sd.MaNhanVien);
      const account = staffMember ? ACCOUNTS.find(a => a.MaTaiKhoan === staffMember.MaTaiKhoan) : null;
      const shift = SHIFTS.find(s => s.MaCaLamViec === sd.MaCaLamViec);

      return {
        ...sd,
        HoTen: account ? account.HoTen : 'N/A',
        ChucVu: staffMember ? staffMember.ChucVu : 'N/A',
        TenCa: shift ? shift.TenCa : 'N/A',
        GioBatDau: shift ? shift.GioBatDau : '00:00:00',
        GioKetThuc: shift ? shift.GioKetThuc : '00:00:00',
      };
    });
  },
  addShiftDetail: async (detail) => {
    await delay();
    if (!detail.MaNhanVien || detail.MaNhanVien.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Chưa chọn nhân viên!');
    }
    if (!detail.MaCaLamViec || detail.MaCaLamViec.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Chưa chọn ca làm việc!');
    }
    if (!detail.NgayLam || detail.NgayLam.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Chưa chọn ngày làm việc!');
    }

    const shift = SHIFTS.find(s => s.MaCaLamViec === detail.MaCaLamViec);
    if (!shift) {
      throw new Error('Lỗi: Ca làm việc không tồn tại!');
    }

    const isDuplicate = SHIFT_DETAILS.some(sd =>
      sd.MaNhanVien === detail.MaNhanVien &&
      sd.MaCaLamViec === detail.MaCaLamViec &&
      sd.NgayLam === detail.NgayLam &&
      sd.KhaDung === 1
    );
    if (isDuplicate) {
      throw new Error('Lỗi: Nhân viên này đã đăng ký ca làm việc này trong ngày đã chọn!');
    }

    const activeCount = SHIFT_DETAILS.filter(sd =>
      sd.MaCaLamViec === detail.MaCaLamViec &&
      sd.NgayLam === detail.NgayLam &&
      sd.KhaDung === 1
    ).length;

    if (activeCount >= shift.SoNguoiToiDa) {
      throw new Error(`Lỗi: Ca làm việc đã đạt giới hạn tối đa (${shift.SoNguoiToiDa} người) trong ngày này!`);
    }

    const idNum = SHIFT_DETAILS.reduce((max, sd) => {
      const num = parseInt(sd.MaChiTietCa.substring(3), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextId = `CTC${String(idNum + 1).padStart(2, '0')}`;

    const newDetail = {
      MaChiTietCa: nextId,
      MaNhanVien: detail.MaNhanVien,
      MaCaLamViec: detail.MaCaLamViec,
      NgayLam: detail.NgayLam,
      GhiChu: detail.GhiChu || '',
      KhaDung: detail.KhaDung !== undefined ? parseInt(detail.KhaDung, 10) : 1,
      NgayLap: detail.NgayLap || null,
      KieuLap: detail.KieuLap !== undefined && detail.KieuLap !== null ? parseInt(detail.KieuLap, 10) : null,
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };

    SHIFT_DETAILS.push(newDetail);
    return newDetail;
  },
  toggleShiftDetailStatus: async (maChiTietCa) => {
    await delay();
    const index = SHIFT_DETAILS.findIndex(sd => sd.MaChiTietCa === maChiTietCa);
    if (index === -1) {
      throw new Error('Không tìm thấy đăng ký ca');
    }

    const registration = SHIFT_DETAILS[index];
    const newKhaDung = registration.KhaDung === 1 ? 0 : 1;

    if (newKhaDung === 1) {
      const shift = SHIFTS.find(s => s.MaCaLamViec === registration.MaCaLamViec);
      if (!shift) {
        throw new Error('Lỗi: Ca làm việc không tồn tại!');
      }

      const activeCount = SHIFT_DETAILS.filter(sd =>
        sd.MaCaLamViec === registration.MaCaLamViec &&
        sd.NgayLam === registration.NgayLam &&
        sd.KhaDung === 1
      ).length;

      if (activeCount >= shift.SoNguoiToiDa) {
        throw new Error(`Lỗi: Không thể đăng ký lại ca vì đã đạt giới hạn tối đa (${shift.SoNguoiToiDa} người) trong ngày này!`);
      }
    }

    SHIFT_DETAILS[index] = {
      ...registration,
      KhaDung: newKhaDung,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return SHIFT_DETAILS[index];
  },
  deleteShiftDetail: async (maChiTietCa) => {
    await delay();
    const index = SHIFT_DETAILS.findIndex(sd => sd.MaChiTietCa === maChiTietCa);
    if (index === -1) {
      throw new Error('Không tìm thấy đăng ký ca');
    }
    SHIFT_DETAILS.splice(index, 1);
    return true;
  }
};

export default shiftService;
