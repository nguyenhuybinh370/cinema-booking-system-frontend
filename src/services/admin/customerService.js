import { CUSTOMERS, ACCOUNTS, TICKET_RECEIPTS, TICKET_DETAILS, SHOWTIME_SEATS, SHOWTIMES, ADMIN_MOVIES } from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const customerService = {
  getCustomers: async () => {
    await delay();
    return CUSTOMERS.map(c => {
      const account = ACCOUNTS.find(acc => acc.MaTaiKhoan === c.MaTaiKhoan);
      return {
        ...c,
        HoTen: account ? account.HoTen : 'N/A',
        Email: account ? account.Email : 'N/A',
        SoDienThoai: account ? account.SoDienThoai : 'N/A',
        TrangThai: c.KhaDung === 1 ? 'Active' : 'Banned'
      };
    });
  },
  lockCustomerAccount: async (maKhachHang, reason) => {
    await delay();
    const customer = CUSTOMERS.find(c => c.MaKhachHang === maKhachHang);
    if (!customer) throw new Error('Không tìm thấy khách hàng!');

    customer.KhaDung = 0;
    customer.LyDoKhoa = reason;
    customer.NgayCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const account = ACCOUNTS.find(acc => acc.MaTaiKhoan === customer.MaTaiKhoan);
    return {
      success: true,
      email: account ? account.Email : 'N/A',
      reason: reason
    };
  },
  unlockCustomerAccount: async (maKhachHang) => {
    await delay();
    const customer = CUSTOMERS.find(c => c.MaKhachHang === maKhachHang);
    if (!customer) throw new Error('Không tìm thấy khách hàng!');

    customer.KhaDung = 1;
    customer.LyDoKhoa = null;
    customer.NgayCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);
    return true;
  },
  getCustomerTransactions: async (maKhachHang) => {
    await delay();
    const receipts = TICKET_RECEIPTS.filter(r => r.MaKhachHang === maKhachHang);
    return receipts.map(r => {
      const details = TICKET_DETAILS.filter(d => d.MaPhieuDatVe === r.MaPhieuDatVe);
      let seatsList = [];
      let movieName = 'N/A';

      if (details.length > 0) {
        details.forEach(det => {
          const showtimeSeat = SHOWTIME_SEATS.find(s => s.MaGheSuatChieu === det.MaGheSuatChieu);
          if (showtimeSeat) {
            const label = showtimeSeat.MaGhe.split('-')[1] || showtimeSeat.MaGhe;
            seatsList.push(label);

            if (movieName === 'N/A') {
              const showtime = SHOWTIMES.find(st => st.MaSuatChieu === showtimeSeat.MaSuatChieu);
              if (showtime) {
                const movie = ADMIN_MOVIES.find(m => m.MaPhim === showtime.MaPhim);
                if (movie) {
                  movieName = movie.TenPhim;
                }
              }
            }
          }
        });
      }

      return {
        MaDatVe: r.MaPhieuDatVe,
        NgayDat: r.NgayDat.substring(0, 16),
        Phim: movieName,
        Ghe: seatsList.join(', ') || 'Chưa chọn',
        TongTien: parseFloat(r.TongTien),
        PTThanhToan: 'VNPay',
        TrangThai: r.TrangThai === 'Đã TT' ? 'Thành công' : r.TrangThai === 'Đã hủy' ? 'Đã hủy' : r.TrangThai
      };
    });
  }
};

export default customerService;
