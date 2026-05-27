import { ADMIN_MOVIES, ROOMS, SEAT_MAPS, DAY_TYPES, SHOWTIMES, SHOWTIME_SEATS } from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const showtimeService = {
  getShowtimes: async () => {
    await delay();

    SHOWTIMES.forEach(st => {
      const existingCount = SHOWTIME_SEATS.filter(s => s.MaSuatChieu === st.MaSuatChieu).length;
      if (existingCount === 0) {
        const room = ROOMS.find(r => r.MaPhongChieu === st.MaPhongChieu);
        if (room) {
          const map = SEAT_MAPS.find(m => m.MaSoDoGhe === room.MaSoDoGhe);
          if (map) {
            const overrides = room.Overrides || {};
            const rows = map.TongHang;
            const cols = map.TongCot;
            for (let r = 0; r < rows; r++) {
              const rowChar = String.fromCharCode(65 + r);
              for (let c = 0; c < cols; c++) {
                const seatId = `${room.MaPhongChieu}-${rowChar}${c + 1}`;
                const seatOverride = overrides[seatId] || {};

                const exists = SHOWTIME_SEATS.some(s => s.MaSuatChieu === st.MaSuatChieu && s.MaGhe === seatId);
                if (!exists) {
                  SHOWTIME_SEATS.push({
                    MaGheSuatChieu: `GSC_${st.MaSuatChieu}_${rowChar}${c + 1}`,
                    MaSuatChieu: st.MaSuatChieu,
                    MaGhe: seatId,
                    TrangThai: 0,
                    KhaDung: seatOverride.KhaDung !== undefined ? seatOverride.KhaDung : 1,
                    NgayTao: '2026-05-01 09:00:00',
                    NgayCapNhat: null
                  });
                }
              }
            }
          }
        }
      }
    });

    return SHOWTIMES.map(st => {
      const movie = ADMIN_MOVIES.find(m => m.MaPhim === st.MaPhim);
      const room = ROOMS.find(r => r.MaPhongChieu === st.MaPhongChieu);
      const dayType = DAY_TYPES.find(d => d.MaLoaiNgay === st.MaLoaiNgay);

      const seats = SHOWTIME_SEATS.filter(s => s.MaSuatChieu === st.MaSuatChieu);
      const bookedCount = seats.filter(s => s.TrangThai === 1 || s.TrangThai === 2).length;

      return {
        ...st,
        TenPhim: movie ? movie.TenPhim : 'N/A',
        HinhAnh: movie ? movie.HinhAnh : '',
        ThoiLuong: movie ? movie.ThoiLuong : 120,
        TenPhong: room ? room.TenPhong : 'N/A',
        TenLoaiNgay: dayType ? dayType.TenLoaiNgay : 'N/A',
        TongSoGhe: seats.length,
        DaDat: bookedCount
      };
    });
  },
  addShowtime: async (showtime) => {
    await delay();
    if (!showtime.MaPhim) throw new Error('Thông tin không hợp lệ: Chưa chọn phim!');
    if (!showtime.MaPhongChieu) throw new Error('Thông tin không hợp lệ: Chưa chọn phòng chiếu!');
    if (!showtime.NgayChieu) throw new Error('Thông tin không hợp lệ: Chưa chọn ngày chiếu!');
    if (!showtime.GioChieu) throw new Error('Thông tin không hợp lệ: Chưa chọn giờ bắt đầu!');
    if (!showtime.GioKetThuc) throw new Error('Thông tin không hợp lệ: Chưa chọn giờ kết thúc!');
    if (!showtime.MaLoaiNgay) throw new Error('Thông tin không hợp lệ: Chưa chọn loại ngày!');
    if (showtime.GiaVeCoBan === undefined || isNaN(showtime.GiaVeCoBan) || parseFloat(showtime.GiaVeCoBan) < 0) {
      throw new Error('Thông tin không hợp lệ: Giá vé cơ bản không hợp lệ!');
    }

    const tStart = showtime.GioChieu.length === 5 ? `${showtime.GioChieu}:00` : showtime.GioChieu;
    const tEnd = showtime.GioKetThuc.length === 5 ? `${showtime.GioKetThuc}:00` : showtime.GioKetThuc;

    const conflicts = SHOWTIMES.filter(st =>
      st.MaPhongChieu === showtime.MaPhongChieu &&
      st.NgayChieu === showtime.NgayChieu &&
      st.KhaDung === 1 &&
      ((tStart < st.GioKetThuc && tEnd > st.GioChieu))
    );

    if (conflicts.length > 0) {
      const conflict = conflicts[0];
      const confMovie = ADMIN_MOVIES.find(m => m.MaPhim === conflict.MaPhim);
      throw new Error(`Lỗi trùng lịch chiếu: Phòng chiếu này đã có suất chiếu từ ${conflict.GioChieu.substring(0, 5)} đến ${conflict.GioKetThuc.substring(0, 5)} cho phim "${confMovie?.TenPhim || 'Chưa rõ'}"!`);
    }

    const idNum = SHOWTIMES.reduce((max, s) => {
      const num = parseInt(s.MaSuatChieu.substring(2), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextId = `ST${String(idNum + 1).padStart(2, '0')}`;

    const newShowtime = {
      MaSuatChieu: nextId,
      MaPhim: showtime.MaPhim,
      MaPhongChieu: showtime.MaPhongChieu,
      NgayChieu: showtime.NgayChieu,
      GioChieu: tStart,
      GioKetThuc: tEnd,
      MaLoaiNgay: showtime.MaLoaiNgay,
      GiaVeCoBan: parseFloat(showtime.GiaVeCoBan),
      KhaDung: showtime.KhaDung !== undefined ? parseInt(showtime.KhaDung, 10) : 1,
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };

    SHOWTIMES.push(newShowtime);

    const room = ROOMS.find(r => r.MaPhongChieu === showtime.MaPhongChieu);
    if (room) {
      const map = SEAT_MAPS.find(m => m.MaSoDoGhe === room.MaSoDoGhe);
      if (map) {
        const overrides = room.Overrides || {};
        const rows = map.TongHang;
        const cols = map.TongCot;
        for (let r = 0; r < rows; r++) {
          const rowChar = String.fromCharCode(65 + r);
          for (let c = 0; c < cols; c++) {
            const seatId = `${room.MaPhongChieu}-${rowChar}${c + 1}`;
            const seatOverride = overrides[seatId] || {};

            SHOWTIME_SEATS.push({
              MaGheSuatChieu: `GSC_${nextId}_${rowChar}${c + 1}`,
              MaSuatChieu: nextId,
              MaGhe: seatId,
              TrangThai: 0,
              KhaDung: seatOverride.KhaDung !== undefined ? seatOverride.KhaDung : 1,
              NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
              NgayCapNhat: null
            });
          }
        }
      }
    }

    return newShowtime;
  },
  updateShowtime: async (id, updates) => {
    await delay();
    const index = SHOWTIMES.findIndex(s => s.MaSuatChieu === id);
    if (index === -1) throw new Error('Không tìm thấy suất chiếu!');

    const showtime = SHOWTIMES[index];

    const hasBookings = SHOWTIME_SEATS.some(s => s.MaSuatChieu === id && (s.TrangThai === 1 || s.TrangThai === 2));
    if (hasBookings) {
      throw new Error('Lỗi ràng buộc: Không thể chỉnh sửa suất chiếu này vì đã có vé bán ra hoặc khách hàng đang giữ ghế (Kiểm tra trong bảng GHE_SUATCHIEU)!');
    }

    const tStart = updates.GioChieu !== undefined
      ? (updates.GioChieu.length === 5 ? `${updates.GioChieu}:00` : updates.GioChieu)
      : showtime.GioChieu;
    const tEnd = updates.GioKetThuc !== undefined
      ? (updates.GioKetThuc.length === 5 ? `${updates.GioKetThuc}:00` : updates.GioKetThuc)
      : showtime.GioKetThuc;
    const room = updates.MaPhongChieu !== undefined ? updates.MaPhongChieu : showtime.MaPhongChieu;
    const date = updates.NgayChieu !== undefined ? updates.NgayChieu : showtime.NgayChieu;
    const khaDung = updates.KhaDung !== undefined ? parseInt(updates.KhaDung, 10) : showtime.KhaDung;

    if (khaDung === 1) {
      const conflicts = SHOWTIMES.filter(st =>
        st.MaSuatChieu !== id &&
        st.MaPhongChieu === room &&
        st.NgayChieu === date &&
        st.KhaDung === 1 &&
        ((tStart < st.GioKetThuc && tEnd > st.GioChieu))
      );

      if (conflicts.length > 0) {
        const conflict = conflicts[0];
        const confMovie = ADMIN_MOVIES.find(m => m.MaPhim === conflict.MaPhim);
        throw new Error(`Lỗi trùng lịch chiếu: Phòng chiếu này đã có suất chiếu từ ${conflict.GioChieu.substring(0, 5)} đến ${conflict.GioKetThuc.substring(0, 5)} cho phim "${confMovie?.TenPhim || 'Chưa rõ'}"!`);
      }
    }

    if (updates.MaPhongChieu !== undefined && updates.MaPhongChieu !== showtime.MaPhongChieu) {
      const oldSeatIndices = [];
      SHOWTIME_SEATS.forEach((s, idx) => {
        if (s.MaSuatChieu === id) oldSeatIndices.push(idx);
      });
      for (let i = oldSeatIndices.length - 1; i >= 0; i--) {
        SHOWTIME_SEATS.splice(oldSeatIndices[i], 1);
      }

      const newRoom = ROOMS.find(r => r.MaPhongChieu === updates.MaPhongChieu);
      if (newRoom) {
        const map = SEAT_MAPS.find(m => m.MaSoDoGhe === newRoom.MaSoDoGhe);
        if (map) {
          const overrides = newRoom.Overrides || {};
          const rows = map.TongHang;
          const cols = map.TongCot;
          for (let r = 0; r < rows; r++) {
            const rowChar = String.fromCharCode(65 + r);
            for (let c = 0; c < cols; c++) {
              const seatId = `${newRoom.MaPhongChieu}-${rowChar}${c + 1}`;
              const seatOverride = overrides[seatId] || {};

              SHOWTIME_SEATS.push({
                MaGheSuatChieu: `GSC_${id}_${rowChar}${c + 1}`,
                MaSuatChieu: id,
                MaGhe: seatId,
                TrangThai: 0,
                KhaDung: seatOverride.KhaDung !== undefined ? seatOverride.KhaDung : 1,
                NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
                NgayCapNhat: null
              });
            }
          }
        }
      }
    }

    SHOWTIMES[index] = {
      ...showtime,
      ...updates,
      GioChieu: tStart,
      GioKetThuc: tEnd,
      GiaVeCoBan: updates.GiaVeCoBan !== undefined ? parseFloat(updates.GiaVeCoBan) : showtime.GiaVeCoBan,
      KhaDung: khaDung,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    return SHOWTIMES[index];
  },
  deleteShowtime: async (id) => {
    await delay();
    const index = SHOWTIMES.findIndex(s => s.MaSuatChieu === id);
    if (index === -1) throw new Error('Không tìm thấy suất chiếu!');

    const hasBookings = SHOWTIME_SEATS.some(s => s.MaSuatChieu === id && (s.TrangThai === 1 || s.TrangThai === 2));
    if (hasBookings) {
      throw new Error('Lỗi ràng buộc: Không thể xóa suất chiếu này vì đã có vé bán ra hoặc khách hàng đang giữ ghế (Kiểm tra trong bảng GHE_SUATCHIEU / CHITIETDATVE)!');
    }

    SHOWTIMES.splice(index, 1);

    const oldSeatIndices = [];
    SHOWTIME_SEATS.forEach((s, idx) => {
      if (s.MaSuatChieu === id) oldSeatIndices.push(idx);
    });
    for (let i = oldSeatIndices.length - 1; i >= 0; i--) {
      SHOWTIME_SEATS.splice(oldSeatIndices[i], 1);
    }

    return true;
  },
  getShowtimeSeats: async (maSuatChieu) => {
    await delay();
    return SHOWTIME_SEATS.filter(s => s.MaSuatChieu === maSuatChieu);
  }
};

export default showtimeService;
