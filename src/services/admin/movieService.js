import { ADMIN_MOVIES } from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const movieService = {
  getMovies: async () => {
    await delay();
    return [...ADMIN_MOVIES];
  },
  addMovie: async (movie) => {
    await delay();
    if (!movie.TenPhim || movie.TenPhim.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên phim không được để trống!');
    }
    if (!movie.ThoiLuong || isNaN(movie.ThoiLuong) || movie.ThoiLuong <= 0) {
      throw new Error('Thông tin không hợp lệ: Thời lượng phải là số nguyên dương!');
    }
    if (!movie.TheLoai || movie.TheLoai.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Thể loại phim không được để trống!');
    }
    if (!movie.NgayKhoiChieu || movie.NgayKhoiChieu.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Ngày khởi chiếu không được để trống!');
    }
    if (!movie.GioiHanTuoi || movie.GioiHanTuoi.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Giới hạn độ tuổi không được để trống!');
    }
    if (!movie.Trailer || movie.Trailer.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Trailer không được để trống!');
    }

    const exists = ADMIN_MOVIES.some(m => m.TenPhim.toLowerCase() === movie.TenPhim.toLowerCase() && m.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên phim đã tồn tại trong hệ thống!');
    }

    const newMovie = {
      ...movie,
      KhaDung: movie.KhaDung !== undefined ? parseInt(movie.KhaDung, 10) : 1,
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    ADMIN_MOVIES.push(newMovie);
    return newMovie;
  },
  updateMovie: async (maPhim, updates) => {
    await delay();
    if (updates.TenPhim !== undefined && (!updates.TenPhim || updates.TenPhim.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên phim không được để trống!');
    }
    if (updates.ThoiLuong !== undefined && (!updates.ThoiLuong || isNaN(updates.ThoiLuong) || updates.ThoiLuong <= 0)) {
      throw new Error('Thông tin không hợp lệ: Thời lượng phải là số nguyên dương!');
    }
    if (updates.TheLoai !== undefined && (!updates.TheLoai || updates.TheLoai.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Thể loại phim không được để trống!');
    }
    if (updates.NgayKhoiChieu !== undefined && (!updates.NgayKhoiChieu || updates.NgayKhoiChieu.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Ngày khởi chiếu không được để trống!');
    }
    if (updates.GioiHanTuoi !== undefined && (!updates.GioiHanTuoi || updates.GioiHanTuoi.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Giới hạn độ tuổi không được để trống!');
    }
    if (updates.Trailer !== undefined && (!updates.Trailer || updates.Trailer.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Trailer không được để trống!');
    }

    const index = ADMIN_MOVIES.findIndex(m => m.MaPhim === maPhim);
    if (index === -1) {
      throw new Error('Không tìm thấy phim');
    }

    if (updates.TenPhim) {
      const exists = ADMIN_MOVIES.some(m => m.MaPhim !== maPhim && m.TenPhim.toLowerCase() === updates.TenPhim.toLowerCase() && m.KhaDung !== 0);
      if (exists) {
        throw new Error('Lỗi: Tên phim đã tồn tại trong hệ thống!');
      }
    }

    ADMIN_MOVIES[index] = {
      ...ADMIN_MOVIES[index],
      ...updates,
      KhaDung: updates.KhaDung !== undefined ? parseInt(updates.KhaDung, 10) : ADMIN_MOVIES[index].KhaDung,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return ADMIN_MOVIES[index];
  },
  deleteMovie: async (maPhim) => {
    await delay();
    const index = ADMIN_MOVIES.findIndex(m => m.MaPhim === maPhim);
    if (index === -1) {
      throw new Error('Không tìm thấy phim');
    }
    if (maPhim === 'M01' || maPhim === 'M02') {
      throw new Error('Không thể xóa phim vì đã có suất chiếu được lên lịch cho bộ phim này (Kiểm tra trong bảng SUATCHIEU)!');
    }
    ADMIN_MOVIES.splice(index, 1);
    return true;
  }
};

export default movieService;
