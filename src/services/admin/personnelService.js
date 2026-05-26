import axiosClient from '../../api/axiosClient';

const mapUserToStaff = (u) => ({
  MaNhanVien: u.NhanVien?.MaNhanVien || u.MaTaiKhoan,
  MaTaiKhoan: u.MaTaiKhoan,
  HoTen: u.HoTen,
  Email: u.Email,
  SoDienThoai: u.SoDienThoai,
  NgaySinh: u.NgaySinh ? new Date(u.NgaySinh).toISOString().substring(0, 10) : '',
  GioiTinh: u.GioiTinh ? 1 : 0,
  ChucVu: u.NhanVien?.ChucVu || (u.VaiTro === 'ADMIN' ? 'Quản lý hệ thống' : 'Nhân viên'),
  Role: u.VaiTro === 'ADMIN' ? 'Admin' : (u.NhanVien?.ChucVu?.toLowerCase().includes('quản lý') ? 'Manager' : 'Staff'),
  KhaDung: u.KhaDung ? 1 : 0,
  NgayTao: u.NgayTao ? new Date(u.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : null,
  NgayCapNhat: u.NgayCapNhat ? new Date(u.NgayCapNhat).toISOString().replace('T', ' ').substring(0, 19) : null,
});

const personnelService = {
  getStaff: async () => {
    const res = await axiosClient.get('/admin/nguoi-dung?limit=200');
    const items = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
    // Only return ADMIN and STAFF roles for Personnel module
    return items
      .filter(u => u.VaiTro === 'ADMIN' || u.VaiTro === 'STAFF')
      .map(mapUserToStaff);
  },

  addStaff: async (person) => {
    const payload = {
      TenDangNhap: person.Email,
      MatKhau: person.MatKhau || 'CinemaPlus@2026',
      HoTen: person.HoTen,
      Email: person.Email,
      SoDienThoai: person.SoDienThoai,
      GioiTinh: person.GioiTinh === 1,
      NgaySinh: person.NgaySinh || undefined,
      VaiTro: person.Role === 'Admin' ? 'ADMIN' : 'STAFF',
      ChucVu: person.ChucVu || 'Nhân viên',
    };
    const data = await axiosClient.post('/admin/nguoi-dung', payload);
    return mapUserToStaff(data);
  },

  updateStaff: async (maNhanVien, updates) => {
    // 1. Resolve maNhanVien to maTaiKhoan
    const resList = await axiosClient.get('/admin/nguoi-dung?limit=200');
    const users = Array.isArray(resList) ? resList : (resList && Array.isArray(resList.data) ? resList.data : []);
    const user = users.find(u => u.NhanVien?.MaNhanVien === maNhanVien || u.MaTaiKhoan === maNhanVien);
    if (!user) {
      throw new Error(`Không tìm thấy tài khoản nhân viên với mã: ${maNhanVien}`);
    }

    const maTaiKhoan = user.MaTaiKhoan;

    // 2. Perform password update if provided and modified
    if (updates.MatKhau && updates.MatKhau !== 'CinemaPlus@2026') {
      await axiosClient.put(`/admin/nguoi-dung/${maTaiKhoan}/doi-mat-khau`, { MatKhau: updates.MatKhau });
    }

    // 3. Perform profile update
    const payload = {
      ...(updates.HoTen !== undefined && { HoTen: updates.HoTen }),
      ...(updates.Email !== undefined && { Email: updates.Email }),
      ...(updates.SoDienThoai !== undefined && { SoDienThoai: updates.SoDienThoai }),
      ...(updates.GioiTinh !== undefined && { GioiTinh: updates.GioiTinh === 1 }),
      ...(updates.NgaySinh !== undefined && { NgaySinh: updates.NgaySinh }),
      ...(updates.KhaDung !== undefined && { KhaDung: updates.KhaDung === 1 }),
      ...(updates.ChucVu !== undefined && { ChucVu: updates.ChucVu }),
    };

    const data = await axiosClient.put(`/admin/nguoi-dung/${maTaiKhoan}`, payload);
    return mapUserToStaff(data);
  }
};

export default personnelService;
