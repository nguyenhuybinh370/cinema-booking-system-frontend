export const ROOM_TYPES = [
  { MaLoaiPhong: 'LP01', TenLoaiPhong: '2D', GiaPhuThu: 0, MoTa: 'Phòng chiếu tiêu chuẩn 2D', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaLoaiPhong: 'LP02', TenLoaiPhong: '3D', GiaPhuThu: 30000, MoTa: 'Phòng chiếu phim 3D hiện đại', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaLoaiPhong: 'LP03', TenLoaiPhong: 'IMAX', GiaPhuThu: 50000, MoTa: 'Trải nghiệm màn hình cực đại', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
];

export const ROOMS = [
  { MaPhongChieu: 'PC01', TenPhong: 'Phòng Chiếu 01', SoGhe: 100, MaLoaiPhong: 'LP01', MaSoDoGhe: 'SM01', Status: 'Active', KhaDung: 1 },
  { MaPhongChieu: 'PC02', TenPhong: 'Phòng Chiếu 02', SoGhe: 120, MaLoaiPhong: 'LP02', MaSoDoGhe: 'SM02', Status: 'Active', KhaDung: 1 },
  { MaPhongChieu: 'PC03', TenPhong: 'Phòng Chiếu 03', SoGhe: 150, MaLoaiPhong: 'LP03', MaSoDoGhe: 'SM03', Status: 'Maintenance', KhaDung: 1 },
];

export const SEAT_MAPS = [
  { 
    MaSoDoGhe: 'SM01', 
    TenSoDo: 'Sơ đồ 10x10', 
    TongHang: 10, 
    TongCot: 10, 
    CauTruc: '{"aisles": {"rows": [], "cols": [3, 8]}}',
    KhaDung: 1 
  },
  { 
    MaSoDoGhe: 'SM02', 
    TenSoDo: 'Sơ đồ 10x12', 
    TongHang: 10, 
    TongCot: 12, 
    CauTruc: '{"aisles": {"rows": [], "cols": [4, 9]}}',
    KhaDung: 1 
  },
  { 
    MaSoDoGhe: 'SM03', 
    TenSoDo: 'Sơ đồ 10x15', 
    TongHang: 10, 
    TongCot: 15, 
    CauTruc: '{"aisles": {"rows": [], "cols": [5, 11]}}',
    KhaDung: 1 
  },
];

export const SEAT_TYPES = [
  { MaLoaiGhe: 'LG01', TenLoaiGhe: 'Thường', GiaPhuThu: 0, MoTa: 'Ghế tiêu chuẩn rạp', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaLoaiGhe: 'LG02', TenLoaiGhe: 'VIP', GiaPhuThu: 20000, MoTa: 'Ghế VIP êm ái hàng trung tâm', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaLoaiGhe: 'LG03', TenLoaiGhe: 'Sweetbox', GiaPhuThu: 50000, MoTa: 'Ghế đôi sweetbox riêng tư cho cặp đôi', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
];

export const DAY_TYPES = [
  { MaLoaiNgay: 'LN01', TenLoaiNgay: 'Ngày thường', GiaPhuThu: 0, MoTa: 'Ngày trong tuần từ thứ 2 đến thứ 5', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaLoaiNgay: 'LN02', TenLoaiNgay: 'Cuối tuần', GiaPhuThu: 20000, MoTa: 'Ngày cuối tuần từ thứ 6 đến Chủ Nhật', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaLoaiNgay: 'LN03', TenLoaiNgay: 'Lễ/Tết', GiaPhuThu: 40000, MoTa: 'Các ngày nghỉ lễ Tết theo quy định', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaLoaiNgay: 'LN04', TenLoaiNgay: 'Happy Day', GiaPhuThu: -20000, MoTa: 'Ngày ưu đãi đồng giá vé thứ 4 hàng tuần', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
];

export const ADMIN_MOVIES = [
  { 
    MaPhim: 'M01', 
    TenPhim: 'Lật Mặt 7: Một Điều Ước', 
    ThoiLuong: 112, 
    TheLoai: 'Hành động, Tâm lý', 
    NgayKhoiChieu: '2024-04-26', 
    NgayKetThuc: '2024-06-26', 
    DaoDien: 'Lý Hải', 
    DienVien: 'Trương Minh Cường, Đinh Y Nhung, Quách Ngọc Tuyên', 
    GioiHanTuoi: 'C16', 
    HinhAnh: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800',
    NoiDung: 'Câu chuyện về tình cảm gia đình đầy xúc động của bà Hai và 5 người con.',
    Trailer: 'https://www.youtube.com/watch?v=kYpS-ZlK-bU',
    KhaDung: 1,
    NgayTao: '2026-05-01 10:00:00',
    NgayCapNhat: null
  },
  { 
    MaPhim: 'M02', 
    TenPhim: 'Hành Tinh Khỉ: Vương Quốc Mới', 
    ThoiLuong: 145, 
    TheLoai: 'Hành động, Khoa học viễn tưởng', 
    NgayKhoiChieu: '2024-05-10', 
    NgayKetThuc: '2024-07-10', 
    DaoDien: 'Wes Ball', 
    DienVien: 'Owen Teague, Freya Allan, Kevin Durand', 
    GioiHanTuoi: 'P', 
    HinhAnh: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800',
    NoiDung: 'Nhiều năm sau sự trị vì của Caesar, một chú khỉ trẻ dấn thân vào hành trình định đoạt tương lai.',
    Trailer: 'https://www.youtube.com/watch?v=Kdr5oedn7q8',
    KhaDung: 1,
    NgayTao: '2026-05-02 11:30:00',
    NgayCapNhat: null
  },
];

export const STAFF = [
  { MaNhanVien: 'NV01', HoTen: 'Nguyễn Huy Bình', Email: 'binh@cinema.com', SoDienThoai: '0987654321', MatKhau: 'CinemaPlus@2026', NgaySinh: '1995-04-12', GioiTinh: 1, ChucVu: 'Quản lý rạp', Role: 'Admin', Status: 'Active', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaNhanVien: 'NV02', HoTen: 'Trần Thị Hoa', Email: 'hoa@cinema.com', SoDienThoai: '0123456789', MatKhau: 'CinemaPlus@2026', NgaySinh: '1998-08-25', GioiTinh: 0, ChucVu: 'Nhân viên bán vé', Role: 'Staff', Status: 'Active', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaNhanVien: 'NV03', HoTen: 'Lê Văn Tùng', Email: 'tung@cinema.com', SoDienThoai: '0555666777', MatKhau: 'CinemaPlus@2026', NgaySinh: '1990-11-05', GioiTinh: 1, ChucVu: 'Kỹ thuật viên', Role: 'Manager', Status: 'Inactive', KhaDung: 0, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
];
