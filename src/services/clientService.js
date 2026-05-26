import axiosPublic from '../api/axiosPublic';

// ============================================================
// Helper: map Phim record từ backend sang format frontend dùng
// ============================================================
const mapMovie = (phim) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const releaseDate = phim.NgayKhoiChieu ? new Date(phim.NgayKhoiChieu) : null;
  const isComingSoon = releaseDate ? releaseDate > today : false;

  return {
    // ID dùng để điều hướng URL và tìm kiếm
    _id: phim.MaPhim,
    MaPhim: phim.MaPhim,

    // Thông tin hiển thị
    title: phim.TenPhim,
    TenPhim: phim.TenPhim,
    poster_path: phim.HinhAnh || '',
    HinhAnh: phim.HinhAnh || '',
    overview: phim.NoiDung || '',
    NoiDung: phim.NoiDung || '',
    runtime: phim.ThoiLuong || 0,
    ThoiLuong: phim.ThoiLuong || 0,

    // Ngày
    release_date: releaseDate ? releaseDate.toISOString().substring(0, 10) : '',
    NgayKhoiChieu: phim.NgayKhoiChieu || null,
    NgayKetThuc: phim.NgayKetThuc || null,

    // Thể loại, diễn viên, đạo diễn
    genres: phim.TheLoai
      ? phim.TheLoai.split(',').map((g) => ({ name: g.trim() }))
      : [],
    TheLoai: phim.TheLoai || '',
    DaoDien: phim.DaoDien || '',
    DienVien: phim.DienVien || '',
    casts: phim.DienVien
      ? phim.DienVien.split(',').map((name) => ({ name: name.trim() }))
      : [],

    // Trailer & giới hạn tuổi
    videoUrl: phim.Trailer || '',
    Trailer: phim.Trailer || '',
    GioiHanTuoi: phim.GioiHanTuoi || 'P',

    // Rating (nếu có)
    vote_average: phim.vote_average || null,
    original_language: 'vi',

    // Phân loại đang chiếu / sắp chiếu
    isComingSoon,
    KhaDung: phim.KhaDung ? 1 : 0,
  };
};

// ============================================================
// Helper: map SuatChieu record thành format slot cho UI
// ============================================================
const mapShowtime = (sc) => {
  // GioChieu từ backend là ISO datetime string
  const gioChieuDate = sc.GioChieu ? new Date(sc.GioChieu) : null;
  const gioChieuStr = gioChieuDate
    ? gioChieuDate.toTimeString().substring(0, 5)
    : '';

  const thoiLuong = sc.Phim?.ThoiLuong || 0;
  let gioKetThucStr = '';
  if (gioChieuDate && thoiLuong) {
    const end = new Date(gioChieuDate.getTime() + thoiLuong * 60 * 1000);
    gioKetThucStr = end.toTimeString().substring(0, 5);
  }

  return {
    showId: sc.MaSuatChieu,
    MaSuatChieu: sc.MaSuatChieu,
    MaPhong: sc.MaPhong,
    TenPhong: sc.PhongChieu?.TenPhong || 'N/A',
    LoaiPhong: sc.PhongChieu?.LoaiPhong?.TenLoaiPhong || '',
    startTime: sc.GioChieu || '',
    endTime: gioKetThucStr
      ? `${new Date(sc.NgayChieu).toISOString().substring(0, 10)}T${gioKetThucStr}:00`
      : '',
    GioChieu: gioChieuStr,
    GioKetThuc: gioKetThucStr,
    GiaVeGoc: parseFloat(sc.GiaVeGoc) || 85000,
    KhaDung: sc.KhaDung ? 1 : 0,
  };
};

// ============================================================
// Service
// ============================================================
const clientService = {
  /**
   * Lấy danh sách phim (public, chỉ phim khả dụng).
   * Backend mặc định trả về phim đang chiếu nếu không có includeInactive.
   */
  getMovies: async ({ limit = 30, page = 1 } = {}) => {
    const res = await axiosPublic.get(`/phim`, {
      params: { limit, page },
    });
    // Backend trả về dạng paginated: { data, pagination }
    const items = Array.isArray(res)
      ? res
      : res?.data
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
    return items.map(mapMovie);
  },

  /**
   * Lấy chi tiết một phim theo MaPhim.
   */
  getMovieById: async (maPhim) => {
    const phim = await axiosPublic.get(`/phim/${maPhim}`);
    return mapMovie(phim);
  },

  /**
   * Lấy danh sách suất chiếu theo phim và ngày.
   * @param {string} maPhim
   * @param {string} ngayChieu - định dạng YYYY-MM-DD
   */
  getShowtimes: async (maPhim, ngayChieu) => {
    const params = {};
    if (maPhim) params.maPhim = maPhim;
    if (ngayChieu) params.ngayChieu = ngayChieu;

    const result = await axiosPublic.get(`/suat-chieu`, { params });
    const items = Array.isArray(result) ? result : result?.data || [];
    return items
      .filter((sc) => sc.KhaDung)
      .map(mapShowtime);
  },

  /**
   * Lấy sơ đồ ghế và trạng thái của một suất chiếu.
   * Trả về object: { [seatKey]: 'empty' | 'booked' | 'held' }
   * seatKey = `${ViTriDay}${ViTriCot}` (ví dụ: "A1", "B3")
   */
  getSeatMap: async (maSuatChieu) => {
    const seats = await axiosPublic.get(`/suat-chieu/${maSuatChieu}/ghe`);
    const seatList = Array.isArray(seats) ? seats : seats?.data || [];

    const occupiedSeats = {};
    seatList.forEach((gsc) => {
      const ghe = gsc.Ghe || gsc;
      const seatKey = `${ghe.ViTriDay}${ghe.ViTriCot}`;
      if (gsc.TrangThai === 'DA_DAT' || gsc.TrangThai === 'DANG_GIU') {
        occupiedSeats[seatKey] = true;
      }
    });

    return { seats: seatList, occupiedSeats };
  },
};

export default clientService;
