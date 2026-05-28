import axiosClient from '../../api/axiosClient';

const showtimeService = {
  getShowtimes: async () => {
    const data = await axiosClient.get('/admin/suat-chieu');
    
    // Concurrently fetch seat statuses to calculate booked vs total seats
    const results = await Promise.all(data.map(async (st) => {
      let gheList = [];
      try {
        gheList = await axiosClient.get(`/admin/suat-chieu/${st.MaSuatChieu}/ghe`);
      } catch (err) {
        console.error('Error fetching seats for showtime:', st.MaSuatChieu, err);
      }

      const bookedCount = gheList.filter(g => g.TrangThai === 'DA_DAT' || g.TrangThai === 'DANG_GIU').length;
      
      const startLocal = st.GioChieu ? new Date(st.GioChieu) : null;
      let endLocalStr = '';
      if (startLocal && st.Phim?.ThoiLuong) {
        const endLocal = new Date(startLocal.getTime() + st.Phim.ThoiLuong * 60 * 1000);
        endLocalStr = endLocal.toISOString().split('T')[1].substring(0, 8);
      }

      return {
        MaSuatChieu: st.MaSuatChieu,
        MaPhim: st.MaPhim,
        MaPhongChieu: st.MaPhong,
        NgayChieu: st.NgayChieu ? new Date(st.NgayChieu).toISOString().substring(0, 10) : '',
        GioChieu: st.GioChieu ? new Date(st.GioChieu).toISOString().split('T')[1].substring(0, 8) : '',
        GioKetThuc: endLocalStr,
        MaLoaiNgay: st.MaLoaiNgay,
        GiaVeCoBan: parseFloat(st.GiaVeGoc),
        KhaDung: st.KhaDung ? 1 : 0,
        TenPhim: st.Phim?.TenPhim || 'N/A',
        HinhAnh: st.Phim?.HinhAnh || '',
        ThoiLuong: st.Phim?.ThoiLuong || 120,
        TenPhong: st.PhongChieu?.TenPhong || 'N/A',
        TenLoaiNgay: st.LoaiNgay?.TenLoaiNgay || 'N/A',
        TongSoGhe: gheList.length,
        DaDat: bookedCount
      };
    }));

    return results;
  },

  addShowtime: async (showtime) => {
    // Align with backend getCombinedDateTime logic by passing correct ISO strings
    const ngayChieuUTC = new Date(`${showtime.NgayChieu}T00:00:00Z`);
    const gioChieuUTC = new Date(`${showtime.NgayChieu}T${showtime.GioChieu.substring(0, 5)}:00Z`);

    const payload = {
      MaPhim: showtime.MaPhim,
      MaPhong: showtime.MaPhongChieu,
      MaLoaiNgay: showtime.MaLoaiNgay,
      NgayChieu: ngayChieuUTC.toISOString(),
      GioChieu: gioChieuUTC.toISOString(),
      GiaVeGoc: parseFloat(showtime.GiaVeCoBan),
      KhaDung: showtime.KhaDung === 1,
    };

    const data = await axiosClient.post('/admin/suat-chieu', payload);
    return data;
  },

  updateShowtime: async (id, updates) => {
    const payload = {};
    if (updates.MaPhim !== undefined) payload.MaPhim = updates.MaPhim;
    if (updates.MaPhongChieu !== undefined) payload.MaPhong = updates.MaPhongChieu;
    if (updates.MaLoaiNgay !== undefined) payload.MaLoaiNgay = updates.MaLoaiNgay;
    if (updates.GiaVeCoBan !== undefined) payload.GiaVeGoc = parseFloat(updates.GiaVeCoBan);
    if (updates.KhaDung !== undefined) payload.KhaDung = updates.KhaDung === 1;

    // Convert date / time parameters if updated
    const ngay = updates.NgayChieu;
    const gio = updates.GioChieu;

    if (ngay !== undefined) {
      payload.NgayChieu = new Date(`${ngay}T00:00:00Z`).toISOString();
    }
    if (gio !== undefined) {
      const refDate = ngay || '1970-01-01';
      payload.GioChieu = new Date(`${refDate}T${gio.substring(0, 5)}:00Z`).toISOString();
    }

    const data = await axiosClient.put(`/admin/suat-chieu/${id}`, payload);
    return data;
  },

  deleteShowtime: async (id) => {
    await axiosClient.delete(`/admin/suat-chieu/${id}`);
    return true;
  },

  getShowtimeSeats: async (maSuatChieu) => {
    const data = await axiosClient.get(`/admin/suat-chieu/${maSuatChieu}/ghe`);
    return data.map(gsc => ({
      MaGheSuatChieu: gsc.MaGheSuatChieu,
      MaSuatChieu: gsc.MaSuatChieu,
      MaGhe: gsc.Ghe ? `${gsc.Ghe.MaPhong}-${gsc.Ghe.ViTriDay}${gsc.Ghe.ViTriCot}` : gsc.MaGhe || 'A1',
      TrangThai: gsc.TrangThai === 'DA_DAT' ? 1 : (gsc.TrangThai === 'DANG_GIU' ? 2 : 0),
      KhaDung: gsc.KhaDung ? 1 : 0,
      TenLoaiGhe: gsc.Ghe?.LoaiGhe?.TenLoaiGhe || 'Thường',
    }));
  }
};

export default showtimeService;
