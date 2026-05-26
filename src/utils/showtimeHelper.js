/**
 * Parse a backend booking/history record and return a Date for the showtime start.
 * Handles both summary records (booking.Phim.NgayChieu/GioChieu) and
 * detail records (booking.ChiTietDatVes[0].SuatChieu.*).
 * Returns null if data is missing or unparseable.
 */
export const getShowtimeStartFromBooking = (booking) => {
  if (!booking) return null;

  let ngayChieu = null;
  let gioChieu = null;

  if (booking.Phim) {
    ngayChieu = booking.Phim.NgayChieu;
    gioChieu = booking.Phim.GioChieu;
  } else if (booking.ChiTietDatVes && booking.ChiTietDatVes.length > 0) {
    const suatChieu = booking.ChiTietDatVes[0]?.SuatChieu;
    if (suatChieu) {
      ngayChieu = suatChieu.NgayChieu;
      gioChieu = suatChieu.GioChieu;
    }
  }

  if (!ngayChieu || !gioChieu) return null;

  try {
    const dDate = new Date(ngayChieu);
    if (isNaN(dDate.getTime())) return null;

    let hour = 0;
    let minute = 0;
    let second = 0;

    // Handle GioChieu parsing (support ISO strings or TIME strings like "HH:mm:ss")
    if (typeof gioChieu === 'string') {
      if (gioChieu.includes('T')) {
        const dTime = new Date(gioChieu);
        if (!isNaN(dTime.getTime())) {
          hour = dTime.getUTCHours();
          minute = dTime.getUTCMinutes();
          second = dTime.getUTCSeconds();
        }
      } else {
        const parts = gioChieu.split(':');
        hour = parseInt(parts[0], 10) || 0;
        minute = parseInt(parts[1], 10) || 0;
        second = parseInt(parts[2], 10) || 0;
      }
    } else {
      const dTime = new Date(gioChieu);
      if (!isNaN(dTime.getTime())) {
        hour = dTime.getUTCHours();
        minute = dTime.getUTCMinutes();
        second = dTime.getUTCSeconds();
      }
    }

    const showtimeStart = new Date(dDate);
    showtimeStart.setUTCHours(hour, minute, second, 0);
    return showtimeStart;
  } catch (e) {
    console.error("Lỗi khi parse showtime:", e);
    return null;
  }
};
