import { STAFF, ACCOUNTS } from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const personnelService = {
  getStaff: async () => {
    await delay();
    return STAFF.map(s => {
      const account = ACCOUNTS.find(a => a.MaTaiKhoan === s.MaTaiKhoan);
      return {
        ...account,
        ...s,
        KhaDung: s.KhaDung
      };
    });
  },
  addStaff: async (person) => {
    await delay();
    if (!person.HoTen || person.HoTen.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Họ tên không được để trống!');
    }
    if (!person.Email || person.Email.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Email không được để trống!');
    }
    if (!person.SoDienThoai || person.SoDienThoai.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Số điện thoại không được để trống!');
    }
    if (!person.NgaySinh || person.NgaySinh.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Ngày sinh không được để trống!');
    }
    if (person.GioiTinh !== 0 && person.GioiTinh !== 1) {
      throw new Error('Thông tin không hợp lệ: Giới tính không hợp lệ!');
    }
    if (!person.ChucVu || person.ChucVu.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Chức vụ không được để trống!');
    }
    if (!person.MatKhau || person.MatKhau.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Mật khẩu không được để trống!');
    }

    const emailExists = ACCOUNTS.some(a => a.Email.toLowerCase() === person.Email.toLowerCase() && a.KhaDung !== 0);
    if (emailExists) {
      throw new Error('Lỗi: Email đã được đăng ký bởi tài khoản khác!');
    }

    const phoneExists = ACCOUNTS.some(a => a.SoDienThoai === person.SoDienThoai && a.KhaDung !== 0);
    if (phoneExists) {
      throw new Error('Lỗi: Số điện thoại đã được đăng ký bởi tài khoản khác!');
    }

    const nextAccId = `TK${String(ACCOUNTS.length + 1).padStart(2, '0')}`;

    const newAccount = {
      MaTaiKhoan: nextAccId,
      HoTen: person.HoTen,
      Email: person.Email,
      SoDienThoai: person.SoDienThoai,
      MatKhau: person.MatKhau,
      NgaySinh: person.NgaySinh,
      GioiTinh: person.GioiTinh,
      Role: person.Role || 'Staff',
      KhaDung: 1,
      NgayTao: person.NgayTao || new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    ACCOUNTS.push(newAccount);

    const newStaff = {
      MaNhanVien: person.MaNhanVien,
      MaTaiKhoan: nextAccId,
      ChucVu: person.ChucVu,
      KhaDung: person.KhaDung !== undefined ? person.KhaDung : 1,
      NgayTao: person.NgayTao || new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    STAFF.push(newStaff);

    return { ...newAccount, ...newStaff };
  },
  updateStaff: async (maNhanVien, updates) => {
    await delay();
    const sIndex = STAFF.findIndex(s => s.MaNhanVien === maNhanVien);
    if (sIndex === -1) {
      throw new Error('Không tìm thấy nhân viên');
    }
    const staffItem = STAFF[sIndex];
    const aIndex = ACCOUNTS.findIndex(a => a.MaTaiKhoan === staffItem.MaTaiKhoan);

    if (updates.HoTen !== undefined && (!updates.HoTen || updates.HoTen.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Họ tên không được để trống!');
    }
    if (updates.Email !== undefined && (!updates.Email || updates.Email.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Email không được để trống!');
    }
    if (updates.SoDienThoai !== undefined && (!updates.SoDienThoai || updates.SoDienThoai.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Số điện thoại không được để trống!');
    }
    if (updates.NgaySinh !== undefined && (!updates.NgaySinh || updates.NgaySinh.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Ngày sinh không được để trống!');
    }
    if (updates.GioiTinh !== undefined && updates.GioiTinh !== 0 && updates.GioiTinh !== 1) {
      throw new Error('Thông tin không hợp lệ: Giới tính không hợp lệ!');
    }
    if (updates.ChucVu !== undefined && (!updates.ChucVu || updates.ChucVu.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Chức vụ không được để trống!');
    }

    if (updates.Email && aIndex !== -1) {
      const emailExists = ACCOUNTS.some(a => a.MaTaiKhoan !== staffItem.MaTaiKhoan && a.Email.toLowerCase() === updates.Email.toLowerCase() && a.KhaDung !== 0);
      if (emailExists) {
        throw new Error('Lỗi: Email đã được đăng ký bởi tài khoản khác!');
      }
    }

    if (updates.SoDienThoai && aIndex !== -1) {
      const phoneExists = ACCOUNTS.some(a => a.MaTaiKhoan !== staffItem.MaTaiKhoan && a.SoDienThoai === updates.SoDienThoai && a.KhaDung !== 0);
      if (phoneExists) {
        throw new Error('Lỗi: Số điện thoại đã được đăng ký bởi tài khoản khác!');
      }
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    STAFF[sIndex] = {
      ...STAFF[sIndex],
      ChucVu: updates.ChucVu !== undefined ? updates.ChucVu : STAFF[sIndex].ChucVu,
      KhaDung: updates.KhaDung !== undefined ? updates.KhaDung : STAFF[sIndex].KhaDung,
      NgayCapNhat: nowStr
    };

    if (aIndex !== -1) {
      ACCOUNTS[aIndex] = {
        ...ACCOUNTS[aIndex],
        HoTen: updates.HoTen !== undefined ? updates.HoTen : ACCOUNTS[aIndex].HoTen,
        Email: updates.Email !== undefined ? updates.Email : ACCOUNTS[aIndex].Email,
        SoDienThoai: updates.SoDienThoai !== undefined ? updates.SoDienThoai : ACCOUNTS[aIndex].SoDienThoai,
        NgaySinh: updates.NgaySinh !== undefined ? updates.NgaySinh : ACCOUNTS[aIndex].NgaySinh,
        GioiTinh: updates.GioiTinh !== undefined ? updates.GioiTinh : ACCOUNTS[aIndex].GioiTinh,
        MatKhau: updates.MatKhau !== undefined ? updates.MatKhau : ACCOUNTS[aIndex].MatKhau,
        Role: updates.Role !== undefined ? updates.Role : ACCOUNTS[aIndex].Role,
        NgayCapNhat: nowStr
      };
    }

    return {
      ...(aIndex !== -1 ? ACCOUNTS[aIndex] : {}),
      ...STAFF[sIndex],
      KhaDung: STAFF[sIndex].KhaDung
    };
  }
};

export default personnelService;
