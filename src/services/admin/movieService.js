import axiosClient from '../../api/axiosClient';

const mapMovie = (m) => ({
  MaPhim: m.MaPhim,
  TenPhim: m.TenPhim,
  ThoiLuong: Number(m.ThoiLuong),
  TheLoai: m.TheLoai,
  NgayKhoiChieu: m.NgayKhoiChieu ? new Date(m.NgayKhoiChieu).toISOString().substring(0, 10) : '',
  NgayKetThuc: m.NgayKetThuc ? new Date(m.NgayKetThuc).toISOString().substring(0, 10) : null,
  DaoDien: m.DaoDien || '',
  DienVien: m.DienVien || '',
  GioiHanTuoi: m.GioiHanTuoi || 'P',
  NoiDung: m.NoiDung || '',
  Trailer: m.Trailer || '',
  HinhAnh: m.HinhAnh || '',
  KhaDung: m.KhaDung ? 1 : 0,
  NgayTao: m.NgayTao ? new Date(m.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : null,
  NgayCapNhat: m.NgayCapNhat ? new Date(m.NgayCapNhat).toISOString().replace('T', ' ').substring(0, 19) : null,
});

const movieService = {
  getMovies: async () => {
    const res = await axiosClient.get('/phim?includeInactive=true&limit=100');
    const items = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
    return items.map(mapMovie);
  },

  addMovie: async (movie) => {
    const payload = {
      TenPhim: movie.TenPhim,
      ThoiLuong: Number(movie.ThoiLuong),
      TheLoai: movie.TheLoai,
      NgayKhoiChieu: movie.NgayKhoiChieu,
      NgayKetThuc: movie.NgayKetThuc || null,
      DaoDien: movie.DaoDien || null,
      DienVien: movie.DienVien || null,
      GioiHanTuoi: movie.GioiHanTuoi,
      NoiDung: movie.NoiDung || null,
      Trailer: movie.Trailer,
      HinhAnh: movie.HinhAnh || null,
      KhaDung: movie.KhaDung !== undefined ? movie.KhaDung === 1 : true,
    };
    const data = await axiosClient.post('/admin/phim', payload);
    return mapMovie(data);
  },

  updateMovie: async (maPhim, updates) => {
    const payload = {
      ...(updates.TenPhim !== undefined && { TenPhim: updates.TenPhim }),
      ...(updates.ThoiLuong !== undefined && { ThoiLuong: Number(updates.ThoiLuong) }),
      ...(updates.TheLoai !== undefined && { TheLoai: updates.TheLoai }),
      ...(updates.NgayKhoiChieu !== undefined && { NgayKhoiChieu: updates.NgayKhoiChieu }),
      ...(updates.NgayKetThuc !== undefined && { NgayKetThuc: updates.NgayKetThuc || null }),
      ...(updates.DaoDien !== undefined && { DaoDien: updates.DaoDien || null }),
      ...(updates.DienVien !== undefined && { DienVien: updates.DienVien || null }),
      ...(updates.GioiHanTuoi !== undefined && { GioiHanTuoi: updates.GioiHanTuoi }),
      ...(updates.NoiDung !== undefined && { NoiDung: updates.NoiDung || null }),
      ...(updates.Trailer !== undefined && { Trailer: updates.Trailer }),
      ...(updates.HinhAnh !== undefined && { HinhAnh: updates.HinhAnh || null }),
      ...(updates.KhaDung !== undefined && { KhaDung: updates.KhaDung === 1 }),
    };
    const data = await axiosClient.put(`/admin/phim/${maPhim}`, payload);
    return mapMovie(data);
  },

  deleteMovie: async (maPhim) => {
    await axiosClient.delete(`/admin/phim/${maPhim}`);
    return true;
  }
};

export default movieService;
