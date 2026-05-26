import axiosClient from '../../api/axiosClient';

const transactionService = {
  getTransactions: async () => {
    const res = await axiosClient.get('/admin/giao-dich/phieu-dat?limit=1000');
    const items = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);

    const txList = [];
    items.forEach(p => {
      const customerName = p.KhachHang?.TaiKhoan?.HoTen || 'Khách vãng lai';
      const firstDetail = p.ChiTietDatVes?.[0];
      const movieName = firstDetail?.GheSuatChieu?.SuatChieu?.Phim?.TenPhim || 'N/A';
      const seatsList = p.ChiTietDatVes?.map(ct => {
        const ghe = ct.GheSuatChieu?.Ghe;
        return ghe ? `${ghe.ViTriDay}${ghe.ViTriCot}` : '';
      }).filter(Boolean).join(', ') || 'N/A';

      if (p.GiaoDichs && p.GiaoDichs.length > 0) {
        p.GiaoDichs.forEach(gd => {
          let displayStatus = 'Success';
          if (gd.TrangThai === 'CHO_XU_LY') displayStatus = 'Pending';
          if (gd.TrangThai === 'THAT_BAI') displayStatus = 'Failed';
          if (gd.TrangThai === 'DA_HOAN_TIEN') displayStatus = 'Refunded';

          txList.push({
            MaGiaoDich: gd.MaGiaoDich,
            MaPhieuDatVe: p.MaPhieuDat,
            PhuongThuc: gd.PhuongThuc,
            SoTien: parseFloat(gd.SoTien),
            TrangThai: displayStatus,
            NgayGiaoDich: gd.NgayGiaoDich ? new Date(gd.NgayGiaoDich).toISOString().replace('T', ' ').substring(0, 19) : '',
            KhachHang: customerName,
            Phim: movieName,
            Ghe: seatsList,
            GhiChu: gd.MaGiaoDichNgoai || ''
          });
        });
      } else {
        // Fallback for bookings without transaction records (e.g. cash bookings)
        let displayStatus = 'Success';
        if (p.TrangThai === 'DA_HUY') displayStatus = 'Refunded';
        if (p.TrangThai === 'CHO_THANH_TOAN') displayStatus = 'Pending';

        txList.push({
          MaGiaoDich: `CASH_${p.MaPhieuDat}`,
          MaPhieuDatVe: p.MaPhieuDat,
          PhuongThuc: 'TIEN_MAT',
          SoTien: parseFloat(p.TongTien),
          TrangThai: displayStatus,
          NgayGiaoDich: p.NgayTao ? new Date(p.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : '',
          KhachHang: customerName,
          Phim: movieName,
          Ghe: seatsList,
          GhiChu: 'Thanh toán trực tiếp'
        });
      }
    });

    return txList;
  },

  refundTransaction: async (maGiaoDich, reason) => {
    if (maGiaoDich.startsWith('CASH_')) {
      const maPhieuDat = maGiaoDich.replace('CASH_', '');
      await axiosClient.patch(`/admin/giao-dich/phieu-dat/${maPhieuDat}/huy`);
      return { success: true };
    }

    // Resolve transaction amount by retrieving all receipts
    const res = await axiosClient.get('/admin/giao-dich/phieu-dat?limit=1000');
    const items = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
    
    let targetGd = null;
    for (const p of items) {
      if (p.GiaoDichs) {
        targetGd = p.GiaoDichs.find(g => g.MaGiaoDich === maGiaoDich);
        if (targetGd) break;
      }
    }

    const amount = targetGd ? parseFloat(targetGd.SoTien) : 0;

    await axiosClient.post(`/admin/giao-dich/${maGiaoDich}/hoan-tien`, {
      SoTienHoan: amount,
      LyDo: reason
    });

    return { success: true };
  }
};

export default transactionService;
