import axiosClient from '../../api/axiosClient';

const mapCustomer = (u) => ({
  MaKhachHang: u.KhachHang?.MaKhachHang || u.MaTaiKhoan,
  MaTaiKhoan: u.MaTaiKhoan,
  HoTen: u.HoTen,
  Email: u.Email,
  SoDienThoai: u.SoDienThoai,
  GioiTinh: u.GioiTinh ? 'Nam' : 'Nữ',
  NgaySinh: u.NgaySinh ? new Date(u.NgaySinh).toLocaleDateString('vi-VN') : '--',
  KhaDung: u.KhaDung ? 1 : 0,
  LyDoKhoa: u.KhaDung ? null : 'Bị khóa bởi Admin',
  TrangThai: u.KhaDung ? 'Active' : 'Banned',
  NgayTao: u.NgayTao ? new Date(u.NgayTao).toLocaleDateString('vi-VN') : null,
  NgayCapNhat: u.NgayCapNhat ? new Date(u.NgayCapNhat).toLocaleDateString('vi-VN') : null,
});

const customerService = {
  getCustomers: async () => {
    const res = await axiosClient.get('/admin/nguoi-dung?vaiTro=CUSTOMER&limit=200');
    const items = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
    return items.map(mapCustomer);
  },

  lockCustomerAccount: async (maKhachHang, reason) => {
    // 1. Resolve maKhachHang to maTaiKhoan
    const resList = await axiosClient.get('/admin/nguoi-dung?vaiTro=CUSTOMER&limit=200');
    const users = Array.isArray(resList) ? resList : (resList && Array.isArray(resList.data) ? resList.data : []);
    const user = users.find(u => u.KhachHang?.MaKhachHang === maKhachHang || u.MaTaiKhoan === maKhachHang);
    if (!user) {
      throw new Error(`Không tìm thấy tài khoản khách hàng với mã: ${maKhachHang}`);
    }

    const maTaiKhoan = user.MaTaiKhoan;
    await axiosClient.put(`/admin/nguoi-dung/${maTaiKhoan}`, { KhaDung: false });
    return {
      success: true,
      email: user.Email,
      reason: reason
    };
  },

  unlockCustomerAccount: async (maKhachHang) => {
    // 1. Resolve maKhachHang to maTaiKhoan
    const resList = await axiosClient.get('/admin/nguoi-dung?vaiTro=CUSTOMER&limit=200');
    const users = Array.isArray(resList) ? resList : (resList && Array.isArray(resList.data) ? resList.data : []);
    const user = users.find(u => u.KhachHang?.MaKhachHang === maKhachHang || u.MaTaiKhoan === maKhachHang);
    if (!user) {
      throw new Error(`Không tìm thấy tài khoản khách hàng với mã: ${maKhachHang}`);
    }

    const maTaiKhoan = user.MaTaiKhoan;
    await axiosClient.put(`/admin/nguoi-dung/${maTaiKhoan}`, { KhaDung: true });
    return true;
  },

  getCustomerTransactions: async (maKhachHang) => {
    const res = await axiosClient.get('/admin/giao-dich/phieu-dat?limit=1000');
    const items = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
    
    // Filter tickets belonging to this customer
    return items
      .filter(p => p.MaKhachHang === maKhachHang || p.KhachHang?.MaKhachHang === maKhachHang)
      .map(p => {
        const firstDetail = p.ChiTietDatVes?.[0];
        const movieName = firstDetail?.GheSuatChieu?.SuatChieu?.Phim?.TenPhim || 'N/A';
        const seatsList = p.ChiTietDatVes?.map(ct => {
          const ghe = ct.GheSuatChieu?.Ghe;
          return ghe ? `${ghe.ViTriDay}${ghe.ViTriCot}` : '';
        }).filter(Boolean).join(', ') || 'Chưa chọn';

        const paymentMethod = p.GiaoDichs?.[0]?.PhuongThuc || 'TIEN_MAT';
        
        let displayStatus = 'Chờ thanh toán';
        if (p.TrangThai === 'DA_THANH_TOAN') displayStatus = 'Thành công';
        if (p.TrangThai === 'DA_HUY') displayStatus = 'Đã hủy';

        return {
          MaDatVe: p.MaPhieuDat,
          NgayDat: p.NgayTao ? new Date(p.NgayTao).toISOString().replace('T', ' ').substring(0, 16) : '',
          Phim: movieName,
          Ghe: seatsList,
          TongTien: parseFloat(p.TongTien),
          PTThanhToan: paymentMethod,
          TrangThai: displayStatus
        };
      });
  }
};

export default customerService;
