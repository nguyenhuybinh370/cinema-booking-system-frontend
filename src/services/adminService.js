import { 
  ADMIN_MOVIES, 
  ROOMS, 
  STAFF, 
  ACCOUNTS,
  SEAT_MAPS, 
  ROOM_TYPES, 
  SEAT_TYPES, 
  DAY_TYPES,
  SHIFTS,
  SHIFT_DETAILS,
  SHOWTIMES,
  SHOWTIME_SEATS,
  CUSTOMERS,
  TICKET_RECEIPTS,
  TICKET_DETAILS
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
    return STAFF.map(s => {
      const account = ACCOUNTS.find(a => a.MaTaiKhoan === s.MaTaiKhoan);
      return {
        ...account,
        ...s,
        KhaDung: s.KhaDung
      };
    });
  },
  addStaff: async (person) => {
    await delay();
    if (!person.HoTen || person.HoTen.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Họ tên không được để trống!');
    }
    if (!person.Email || person.Email.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Email không được để trống!');
    }
    if (!person.SoDienThoai || person.SoDienThoai.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Số điện thoại không được để trống!');
    }
    if (!person.NgaySinh || person.NgaySinh.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Ngày sinh không được để trống!');
    }
    if (person.GioiTinh !== 0 && person.GioiTinh !== 1) {
      throw new Error('Thông tin không hợp lệ: Giới tính không hợp lệ!');
    }
    if (!person.ChucVu || person.ChucVu.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Chức vụ không được để trống!');
    }
    if (!person.MatKhau || person.MatKhau.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Mật khẩu không được để trống!');
    }

    const emailExists = ACCOUNTS.some(a => a.Email.toLowerCase() === person.Email.toLowerCase() && a.KhaDung !== 0);
    if (emailExists) {
      throw new Error('Lỗi: Email đã được đăng ký bởi tài khoản khác!');
    }

    const phoneExists = ACCOUNTS.some(a => a.SoDienThoai === person.SoDienThoai && a.KhaDung !== 0);
    if (phoneExists) {
      throw new Error('Lỗi: Số điện thoại đã được đăng ký bởi tài khoản khác!');
    }

    // Auto-generate MaTaiKhoan
    const nextAccId = `TK${String(ACCOUNTS.length + 1).padStart(2, '0')}`;
    
    // Create new account
    const newAccount = {
      MaTaiKhoan: nextAccId,
      HoTen: person.HoTen,
      Email: person.Email,
      SoDienThoai: person.SoDienThoai,
      MatKhau: person.MatKhau,
      NgaySinh: person.NgaySinh,
      GioiTinh: person.GioiTinh,
      Role: person.Role || 'Staff',
      KhaDung: 1,
      NgayTao: person.NgayTao || new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    ACCOUNTS.push(newAccount);

    // Create new staff record
    const newStaff = {
      MaNhanVien: person.MaNhanVien,
      MaTaiKhoan: nextAccId,
      ChucVu: person.ChucVu,
      KhaDung: person.KhaDung !== undefined ? person.KhaDung : 1,
      NgayTao: person.NgayTao || new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    STAFF.push(newStaff);

    return { ...newAccount, ...newStaff };
  },
  updateStaff: async (maNhanVien, updates) => {
    await delay();
    const sIndex = STAFF.findIndex(s => s.MaNhanVien === maNhanVien);
    if (sIndex === -1) {
      throw new Error('Không tìm thấy nhân viên');
    }
    const staffItem = STAFF[sIndex];
    const aIndex = ACCOUNTS.findIndex(a => a.MaTaiKhoan === staffItem.MaTaiKhoan);

    if (updates.HoTen !== undefined && (!updates.HoTen || updates.HoTen.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Họ tên không được để trống!');
    }
    if (updates.Email !== undefined && (!updates.Email || updates.Email.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Email không được để trống!');
    }
    if (updates.SoDienThoai !== undefined && (!updates.SoDienThoai || updates.SoDienThoai.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Số điện thoại không được để trống!');
    }
    if (updates.NgaySinh !== undefined && (!updates.NgaySinh || updates.NgaySinh.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Ngày sinh không được để trống!');
    }
    if (updates.GioiTinh !== undefined && updates.GioiTinh !== 0 && updates.GioiTinh !== 1) {
      throw new Error('Thông tin không hợp lệ: Giới tính không hợp lệ!');
    }
    if (updates.ChucVu !== undefined && (!updates.ChucVu || updates.ChucVu.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Chức vụ không được để trống!');
    }

    if (updates.Email && aIndex !== -1) {
      const emailExists = ACCOUNTS.some(a => a.MaTaiKhoan !== staffItem.MaTaiKhoan && a.Email.toLowerCase() === updates.Email.toLowerCase() && a.KhaDung !== 0);
      if (emailExists) {
        throw new Error('Lỗi: Email đã được đăng ký bởi tài khoản khác!');
      }
    }

    if (updates.SoDienThoai && aIndex !== -1) {
      const phoneExists = ACCOUNTS.some(a => a.MaTaiKhoan !== staffItem.MaTaiKhoan && a.SoDienThoai === updates.SoDienThoai && a.KhaDung !== 0);
      if (phoneExists) {
        throw new Error('Lỗi: Số điện thoại đã được đăng ký bởi tài khoản khác!');
      }
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Update staff fields
    STAFF[sIndex] = {
      ...STAFF[sIndex],
      ChucVu: updates.ChucVu !== undefined ? updates.ChucVu : STAFF[sIndex].ChucVu,
      KhaDung: updates.KhaDung !== undefined ? updates.KhaDung : STAFF[sIndex].KhaDung,
      NgayCapNhat: nowStr
    };

    // Update account fields
    if (aIndex !== -1) {
      ACCOUNTS[aIndex] = {
        ...ACCOUNTS[aIndex],
        HoTen: updates.HoTen !== undefined ? updates.HoTen : ACCOUNTS[aIndex].HoTen,
        Email: updates.Email !== undefined ? updates.Email : ACCOUNTS[aIndex].Email,
        SoDienThoai: updates.SoDienThoai !== undefined ? updates.SoDienThoai : ACCOUNTS[aIndex].SoDienThoai,
        NgaySinh: updates.NgaySinh !== undefined ? updates.NgaySinh : ACCOUNTS[aIndex].NgaySinh,
        GioiTinh: updates.GioiTinh !== undefined ? updates.GioiTinh : ACCOUNTS[aIndex].GioiTinh,
        MatKhau: updates.MatKhau !== undefined ? updates.MatKhau : ACCOUNTS[aIndex].MatKhau,
        Role: updates.Role !== undefined ? updates.Role : ACCOUNTS[aIndex].Role,
        NgayCapNhat: nowStr
      };
    }

    return {
      ...(aIndex !== -1 ? ACCOUNTS[aIndex] : {}),
      ...STAFF[sIndex],
      KhaDung: STAFF[sIndex].KhaDung
    };
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

  // Shifts CRUD
  getShifts: async () => {
    await delay();
    return [...SHIFTS];
  },
  addShift: async (shift) => {
    await delay();
    if (!shift.TenCa || shift.TenCa.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên ca không được để trống!');
    }
    if (!shift.GioBatDau || shift.GioBatDau.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Giờ bắt đầu không được để trống!');
    }
    if (!shift.GioKetThuc || shift.GioKetThuc.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Giờ kết thúc không được để trống!');
    }
    if (shift.SoNguoiToiDa === undefined || isNaN(shift.SoNguoiToiDa) || parseInt(shift.SoNguoiToiDa, 10) <= 0) {
      throw new Error('Thông tin không hợp lệ: Số người tối đa phải lớn hơn 0!');
    }

    const idNum = SHIFTS.reduce((max, s) => {
      const num = parseInt(s.MaCaLamViec.substring(1), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextId = `C${String(idNum + 1).padStart(2, '0')}`;

    const newShift = {
      MaCaLamViec: nextId,
      TenCa: shift.TenCa,
      GioBatDau: shift.GioBatDau.length === 5 ? `${shift.GioBatDau}:00` : shift.GioBatDau,
      GioKetThuc: shift.GioKetThuc.length === 5 ? `${shift.GioKetThuc}:00` : shift.GioKetThuc,
      SoNguoiToiDa: parseInt(shift.SoNguoiToiDa, 10),
      KhaDung: shift.KhaDung !== undefined ? parseInt(shift.KhaDung, 10) : 1,
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    SHIFTS.push(newShift);
    return newShift;
  },
  updateShift: async (maCa, updates) => {
    await delay();
    const index = SHIFTS.findIndex(s => s.MaCaLamViec === maCa);
    if (index === -1) {
      throw new Error('Không tìm thấy ca làm việc');
    }

    if (updates.TenCa !== undefined && (!updates.TenCa || updates.TenCa.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên ca không được để trống!');
    }
    if (updates.GioBatDau !== undefined && (!updates.GioBatDau || updates.GioBatDau.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Giờ bắt đầu không được để trống!');
    }
    if (updates.GioKetThuc !== undefined && (!updates.GioKetThuc || updates.GioKetThuc.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Giờ kết thúc không được để trống!');
    }
    if (updates.SoNguoiToiDa !== undefined && (isNaN(updates.SoNguoiToiDa) || parseInt(updates.SoNguoiToiDa, 10) <= 0)) {
      throw new Error('Thông tin không hợp lệ: Số người tối đa phải lớn hơn 0!');
    }

    SHIFTS[index] = {
      ...SHIFTS[index],
      ...updates,
      GioBatDau: updates.GioBatDau && updates.GioBatDau.length === 5 ? `${updates.GioBatDau}:00` : updates.GioBatDau || SHIFTS[index].GioBatDau,
      GioKetThuc: updates.GioKetThuc && updates.GioKetThuc.length === 5 ? `${updates.GioKetThuc}:00` : updates.GioKetThuc || SHIFTS[index].GioKetThuc,
      SoNguoiToiDa: updates.SoNguoiToiDa !== undefined ? parseInt(updates.SoNguoiToiDa, 10) : SHIFTS[index].SoNguoiToiDa,
      KhaDung: updates.KhaDung !== undefined ? parseInt(updates.KhaDung, 10) : SHIFTS[index].KhaDung,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return SHIFTS[index];
  },
  deleteShift: async (maCa) => {
    await delay();
    const index = SHIFTS.findIndex(s => s.MaCaLamViec === maCa);
    if (index === -1) {
      throw new Error('Không tìm thấy ca làm việc');
    }
    // Check if there are active shift details (assigned / registered)
    const hasAssignments = SHIFT_DETAILS.some(sd => sd.MaCaLamViec === maCa && sd.KhaDung === 1);
    if (hasAssignments) {
      throw new Error('Không thể xóa ca làm việc vì đã có nhân viên đăng ký ca này (Kiểm tra trong bảng CHITIETCALAMVIEC)!');
    }
    SHIFTS.splice(index, 1);
    return true;
  },

  // Shift Registrations (CHITIETCALAMVIEC)
  getShiftDetails: async () => {
    await delay();
    return SHIFT_DETAILS.map(sd => {
      const staffMember = STAFF.find(s => s.MaNhanVien === sd.MaNhanVien);
      const account = staffMember ? ACCOUNTS.find(a => a.MaTaiKhoan === staffMember.MaTaiKhoan) : null;
      const shift = SHIFTS.find(s => s.MaCaLamViec === sd.MaCaLamViec);

      return {
        ...sd,
        HoTen: account ? account.HoTen : 'N/A',
        ChucVu: staffMember ? staffMember.ChucVu : 'N/A',
        TenCa: shift ? shift.TenCa : 'N/A',
        GioBatDau: shift ? shift.GioBatDau : '00:00:00',
        GioKetThuc: shift ? shift.GioKetThuc : '00:00:00',
      };
    });
  },
  addShiftDetail: async (detail) => {
    await delay();
    if (!detail.MaNhanVien || detail.MaNhanVien.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Chưa chọn nhân viên!');
    }
    if (!detail.MaCaLamViec || detail.MaCaLamViec.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Chưa chọn ca làm việc!');
    }
    if (!detail.NgayLam || detail.NgayLam.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Chưa chọn ngày làm việc!');
    }

    const shift = SHIFTS.find(s => s.MaCaLamViec === detail.MaCaLamViec);
    if (!shift) {
      throw new Error('Lỗi: Ca làm việc không tồn tại!');
    }

    // Check duplicate active assignment
    const isDuplicate = SHIFT_DETAILS.some(sd => 
      sd.MaNhanVien === detail.MaNhanVien && 
      sd.MaCaLamViec === detail.MaCaLamViec && 
      sd.NgayLam === detail.NgayLam && 
      sd.KhaDung === 1
    );
    if (isDuplicate) {
      throw new Error('Lỗi: Nhân viên này đã đăng ký ca làm việc này trong ngày đã chọn!');
    }

    // Check shift capacity limit
    const activeCount = SHIFT_DETAILS.filter(sd => 
      sd.MaCaLamViec === detail.MaCaLamViec && 
      sd.NgayLam === detail.NgayLam && 
      sd.KhaDung === 1
    ).length;

    if (activeCount >= shift.SoNguoiToiDa) {
      throw new Error(`Lỗi: Ca làm việc đã đạt giới hạn tối đa (${shift.SoNguoiToiDa} người) trong ngày này!`);
    }

    const idNum = SHIFT_DETAILS.reduce((max, sd) => {
      const num = parseInt(sd.MaChiTietCa.substring(3), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextId = `CTC${String(idNum + 1).padStart(2, '0')}`;

    const newDetail = {
      MaChiTietCa: nextId,
      MaNhanVien: detail.MaNhanVien,
      MaCaLamViec: detail.MaCaLamViec,
      NgayLam: detail.NgayLam,
      GhiChu: detail.GhiChu || '',
      KhaDung: detail.KhaDung !== undefined ? parseInt(detail.KhaDung, 10) : 1,
      NgayLap: detail.NgayLap || null,
      KieuLap: detail.KieuLap !== undefined && detail.KieuLap !== null ? parseInt(detail.KieuLap, 10) : null,
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };

    SHIFT_DETAILS.push(newDetail);
    return newDetail;
  },
  toggleShiftDetailStatus: async (maChiTietCa) => {
    await delay();
    const index = SHIFT_DETAILS.findIndex(sd => sd.MaChiTietCa === maChiTietCa);
    if (index === -1) {
      throw new Error('Không tìm thấy đăng ký ca');
    }

    const registration = SHIFT_DETAILS[index];
    const newKhaDung = registration.KhaDung === 1 ? 0 : 1;

    // If toggling to registered (1), verify capacity and duplicate constraints
    if (newKhaDung === 1) {
      const shift = SHIFTS.find(s => s.MaCaLamViec === registration.MaCaLamViec);
      if (!shift) {
        throw new Error('Lỗi: Ca làm việc không tồn tại!');
      }

      const activeCount = SHIFT_DETAILS.filter(sd => 
        sd.MaCaLamViec === registration.MaCaLamViec && 
        sd.NgayLam === registration.NgayLam && 
        sd.KhaDung === 1
      ).length;

      if (activeCount >= shift.SoNguoiToiDa) {
        throw new Error(`Lỗi: Không thể đăng ký lại ca vì đã đạt giới hạn tối đa (${shift.SoNguoiToiDa} người) trong ngày này!`);
      }
    }

    SHIFT_DETAILS[index] = {
      ...registration,
      KhaDung: newKhaDung,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return SHIFT_DETAILS[index];
  },
  deleteShiftDetail: async (maChiTietCa) => {
    await delay();
    const index = SHIFT_DETAILS.findIndex(sd => sd.MaChiTietCa === maChiTietCa);
    if (index === -1) {
      throw new Error('Không tìm thấy đăng ký ca');
    }
    SHIFT_DETAILS.splice(index, 1);
    return true;
  },

  // Showtimes CRUD (SUATCHIEU & GHE_SUATCHIEU)
  getShowtimes: async () => {
    await delay();
    
    // Ensure all seed showtimes have seats initialized
    SHOWTIMES.forEach(st => {
      // Internal call to seed seats if they don't exist
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
                
                // If it is ST02, we seeded A1 and A2 with status in mock file, so check if already present
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

    // Check time overlap conflict
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

    // Generate MaSuatChieu
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

    // Generate seats for the showtime
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

    // Check constraint: Block editing if seats are booked/held
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

    // Check overlap conflict against other showtimes
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

    // Check if room changed - if yes, regenerate seats
    if (updates.MaPhongChieu !== undefined && updates.MaPhongChieu !== showtime.MaPhongChieu) {
      // Delete old seats
      const oldSeatIndices = [];
      SHOWTIME_SEATS.forEach((s, idx) => {
        if (s.MaSuatChieu === id) oldSeatIndices.push(idx);
      });
      // Splice from end to beginning to preserve indices
      for (let i = oldSeatIndices.length - 1; i >= 0; i--) {
        SHOWTIME_SEATS.splice(oldSeatIndices[i], 1);
      }

      // Generate new seats for the new room
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

    // Check constraint: Block deleting if seats are booked/held
    const hasBookings = SHOWTIME_SEATS.some(s => s.MaSuatChieu === id && (s.TrangThai === 1 || s.TrangThai === 2));
    if (hasBookings) {
      throw new Error('Lỗi ràng buộc: Không thể xóa suất chiếu này vì đã có vé bán ra hoặc khách hàng đang giữ ghế (Kiểm tra trong bảng GHE_SUATCHIEU / CHITIETDATVE)!');
    }

    // Delete showtime
    SHOWTIMES.splice(index, 1);

    // Delete corresponding seats
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
  },

  // Customer Management Services (KHACHHANG, PHIEUDATVE, CHITIETDATVE)
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
