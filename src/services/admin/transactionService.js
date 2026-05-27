import { 
  TRANSACTIONS, 
  TICKET_RECEIPTS, 
  CUSTOMERS, 
  ACCOUNTS, 
  TICKET_DETAILS, 
  SHOWTIME_SEATS, 
  SHOWTIMES, 
  ADMIN_MOVIES,
  LICHSUHOANTIEN
} from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const transactionService = {
  getTransactions: async () => {
    await delay();
    return TRANSACTIONS.map(tx => {
      const receipt = TICKET_RECEIPTS.find(r => r.MaPhieuDatVe === tx.MaPhieuDatVe);
      let customerName = 'N/A';
      let movieName = 'N/A';
      let seatsList = [];

      if (receipt) {
        const customer = CUSTOMERS.find(c => c.MaKhachHang === receipt.MaKhachHang);
        if (customer) {
          const account = ACCOUNTS.find(acc => acc.MaTaiKhoan === customer.MaTaiKhoan);
          if (account) {
            customerName = account.HoTen;
          }
        }

        const details = TICKET_DETAILS.filter(d => d.MaPhieuDatVe === receipt.MaPhieuDatVe);
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
        ...tx,
        KhachHang: customerName,
        Phim: movieName,
        Ghe: seatsList.join(', ') || 'N/A',
        SoTien: parseFloat(tx.SoTien)
      };
    });
  },

  refundTransaction: async (maGiaoDich, reason) => {
    await delay();
    const tx = TRANSACTIONS.find(t => t.MaGiaoDich === maGiaoDich);
    if (!tx) throw new Error('Không tìm thấy giao dịch!');

    tx.TrangThai = 'Refunded';
    tx.GhiChu = reason;
    tx.NgayCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const receipt = TICKET_RECEIPTS.find(r => r.MaPhieuDatVe === tx.MaPhieuDatVe);
    if (receipt) {
      receipt.TrangThai = 'Đã hủy';
      receipt.NgayCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);

      const details = TICKET_DETAILS.filter(d => d.MaPhieuDatVe === receipt.MaPhieuDatVe);
      details.forEach(det => {
        const showtimeSeat = SHOWTIME_SEATS.find(s => s.MaGheSuatChieu === det.MaGheSuatChieu);
        if (showtimeSeat) {
          showtimeSeat.TrangThai = 0;
          showtimeSeat.NgayCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);
        }
      });
    }

    const refundRecord = {
      MaLichSuHoanTien: `HT_${Math.floor(100000 + Math.random() * 900000)}`,
      MaGiaoDich: tx.MaGiaoDich,
      MaPhieuDatVe: tx.MaPhieuDatVe,
      SoTienHoan: tx.SoTien,
      LyDoHoan: reason,
      TrangThai: 'Success',
      NgayYeuCau: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayHoan: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    LICHSUHOANTIEN.push(refundRecord);

    return { tx, refundRecord };
  }
};

export default transactionService;
