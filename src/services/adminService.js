import { 
  ADMIN_MOVIES, 
  ROOMS, 
  STAFF, 
  SEAT_MAPS, 
  ROOM_TYPES, 
  SEAT_TYPES, 
  DAY_TYPES 
} from '../constants/adminMockData';

// Helper to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const adminService = {
  // Movies
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
    // Simulation: M01 and M02 have scheduled showtimes in SUATCHIEU
    if (maPhim === 'M01' || maPhim === 'M02') {
      throw new Error('Không thể xóa phim vì đã có suất chiếu được lên lịch cho bộ phim này (Kiểm tra trong bảng SUATCHIEU)!');
    }
    ADMIN_MOVIES.splice(index, 1);
    return true;
  },

  // Rooms
  getRooms: async () => {
    await delay();
    return [...ROOMS];
  },
  getRoomById: async (id) => {
    await delay();
    return ROOMS.find(r => r.MaPhongChieu === id);
  },
  addRoom: async (room) => {
    await delay();
    if (!room.TenPhong || room.TenPhong.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên phòng chiếu không được để trống!');
    }
    const exists = ROOMS.some(r => r.TenPhong.toLowerCase() === room.TenPhong.toLowerCase() && r.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Phòng chiếu đã tồn tại trong hệ thống!');
    }
    const newRoom = {
      ...room,
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    ROOMS.push(newRoom);
    return newRoom;
  },
  updateRoom: async (maPhong, updates) => {
    await delay();
    if (!updates.TenPhong || updates.TenPhong.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên phòng chiếu không được để trống!');
    }
    const index = ROOMS.findIndex(r => r.MaPhongChieu === maPhong);
    if (index === -1) {
      throw new Error('Không tìm thấy phòng chiếu');
    }
    const exists = ROOMS.some(r => r.MaPhongChieu !== maPhong && r.TenPhong.toLowerCase() === updates.TenPhong.toLowerCase() && r.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên phòng chiếu đã tồn tại!');
    }
    
    ROOMS[index] = { 
      ...ROOMS[index], 
      ...updates,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return ROOMS[index];
  },
  deleteRoom: async (maPhong) => {
    await delay();
    const index = ROOMS.findIndex(r => r.MaPhongChieu === maPhong);
    if (index === -1) {
      throw new Error('Không tìm thấy phòng chiếu');
    }
    // Simulation: PC01 has sold tickets in CHITIETDATVE
    if (maPhong === 'PC01') {
      throw new Error('Không thể xóa phòng chiếu vì đã có vé bán ra thuộc các suất chiếu của phòng này (Kiểm tra trong bảng CHITIETDATVE)!');
    }
    // Hard delete from CSDL
    ROOMS.splice(index, 1);
    return true;
  },

  // Personnel
  getStaff: async () => {
    await delay();
    return [...STAFF];
  },
  addStaff: async (person) => {
    await delay();
    STAFF.push(person);
    return person;
  },
  updateStaff: async (maNhanVien, updates) => {
    await delay();
    const index = STAFF.findIndex(s => s.MaNhanVien === maNhanVien);
    if (index !== -1) {
      STAFF[index] = { ...STAFF[index], ...updates };
      return STAFF[index];
    }
    throw new Error('Staff not found');
  },

  // Metadata/Constants
  getRoomTypes: async () => {
    await delay();
    return [...ROOM_TYPES];
  },
  addRoomType: async (item) => {
    await delay();
    if (!item.TenLoaiPhong || item.TenLoaiPhong.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên loại phòng không được để trống!');
    }
    const exists = ROOM_TYPES.some(t => t.TenLoaiPhong.toLowerCase() === item.TenLoaiPhong.toLowerCase() && t.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên loại phòng đã tồn tại trong hệ thống!');
    }
    ROOM_TYPES.push(item);
    return item;
  },
  updateRoomType: async (id, updates) => {
    await delay();
    const index = ROOM_TYPES.findIndex(t => t.MaLoaiPhong === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại phòng');
    }
    if (updates.TenLoaiPhong !== undefined && (!updates.TenLoaiPhong || updates.TenLoaiPhong.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên loại phòng không được để trống!');
    }
    if (updates.TenLoaiPhong) {
      const exists = ROOM_TYPES.some(t => t.MaLoaiPhong !== id && t.TenLoaiPhong.toLowerCase() === updates.TenLoaiPhong.toLowerCase() && t.KhaDung !== 0);
      if (exists) {
        throw new Error('Lỗi: Tên loại phòng đã tồn tại trong hệ thống!');
      }
    }
    ROOM_TYPES[index] = { 
      ...ROOM_TYPES[index], 
      ...updates,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return ROOM_TYPES[index];
  },
  deleteRoomType: async (id) => {
    await delay();
    const index = ROOM_TYPES.findIndex(t => t.MaLoaiPhong === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại phòng');
    }
    const roomExists = ROOMS.some(r => r.MaLoaiPhong === id);
    if (roomExists) {
      throw new Error('Không thể xóa loại phòng này vì đang được sử dụng trong bảng phòng chiếu (Kiểm tra trong bảng PHONGCHIEU)!');
    }
    ROOM_TYPES.splice(index, 1);
    return true;
  },

  // Seat Types CRUD
  getSeatTypes: async () => {
    await delay();
    return [...SEAT_TYPES];
  },
  addSeatType: async (item) => {
    await delay();
    if (!item.TenLoaiGhe || item.TenLoaiGhe.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên loại ghế không được để trống!');
    }
    const exists = SEAT_TYPES.some(t => t.TenLoaiGhe.toLowerCase() === item.TenLoaiGhe.toLowerCase() && t.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên loại ghế đã tồn tại trong hệ thống!');
    }
    SEAT_TYPES.push(item);
    return item;
  },
  updateSeatType: async (id, updates) => {
    await delay();
    const index = SEAT_TYPES.findIndex(t => t.MaLoaiGhe === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại ghế');
    }
    if (updates.TenLoaiGhe !== undefined && (!updates.TenLoaiGhe || updates.TenLoaiGhe.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên loại ghế không được để trống!');
    }
    if (updates.TenLoaiGhe) {
      const exists = SEAT_TYPES.some(t => t.MaLoaiGhe !== id && t.TenLoaiGhe.toLowerCase() === updates.TenLoaiGhe.toLowerCase() && t.KhaDung !== 0);
      if (exists) {
        throw new Error('Lỗi: Tên loại ghế đã tồn tại trong hệ thống!');
      }
    }
    SEAT_TYPES[index] = { 
      ...SEAT_TYPES[index], 
      ...updates,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return SEAT_TYPES[index];
  },
  deleteSeatType: async (id) => {
    await delay();
    const index = SEAT_TYPES.findIndex(t => t.MaLoaiGhe === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại ghế');
    }
    if (id === 'LG01' || id === 'LG02' || id === 'LG03') {
      throw new Error('Không thể xóa loại ghế này vì đang được sử dụng trong sơ đồ ghế rạp (Kiểm tra trong bảng GHE)!');
    }
    SEAT_TYPES.splice(index, 1);
    return true;
  },

  // Day Types CRUD
  getDayTypes: async () => {
    await delay();
    return [...DAY_TYPES];
  },
  addDayType: async (item) => {
    await delay();
    if (!item.TenLoaiNgay || item.TenLoaiNgay.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên loại ngày không được để trống!');
    }
    const exists = DAY_TYPES.some(t => t.TenLoaiNgay.toLowerCase() === item.TenLoaiNgay.toLowerCase() && t.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên loại ngày đã tồn tại trong hệ thống!');
    }
    DAY_TYPES.push(item);
    return item;
  },
  updateDayType: async (id, updates) => {
    await delay();
    const index = DAY_TYPES.findIndex(t => t.MaLoaiNgay === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại ngày');
    }
    if (updates.TenLoaiNgay !== undefined && (!updates.TenLoaiNgay || updates.TenLoaiNgay.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên loại ngày không được để trống!');
    }
    if (updates.TenLoaiNgay) {
      const exists = DAY_TYPES.some(t => t.MaLoaiNgay !== id && t.TenLoaiNgay.toLowerCase() === updates.TenLoaiNgay.toLowerCase() && t.KhaDung !== 0);
      if (exists) {
        throw new Error('Lỗi: Tên loại ngày đã tồn tại trong hệ thống!');
      }
    }
    DAY_TYPES[index] = { 
      ...DAY_TYPES[index], 
      ...updates,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return DAY_TYPES[index];
  },
  deleteDayType: async (id) => {
    await delay();
    const index = DAY_TYPES.findIndex(t => t.MaLoaiNgay === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại ngày');
    }
    if (id === 'LN01' || id === 'LN02') {
      throw new Error('Không thể xóa loại ngày này vì đang có suất chiếu áp dụng loại ngày này (Kiểm tra trong bảng SUATCHIEU)!');
    }
    DAY_TYPES.splice(index, 1);
    return true;
  },

  getSeatMaps: async () => SEAT_MAPS,

  // Seat Configuration
  getSeatMapByRoomId: async (roomId) => {
    await delay();
    const room = ROOMS.find(r => r.MaPhongChieu === roomId);
    if (!room) return null;
    return SEAT_MAPS.find(m => m.MaSoDoGhe === room.MaSoDoGhe);
  },
  saveSeatConfig: async (roomId, overrides) => {
    await delay();
    const room = ROOMS.find(r => r.MaPhongChieu === roomId);
    if (room) {
      room.Overrides = overrides;
      return true;
    }
    return false;
  }
};

export default adminService;
