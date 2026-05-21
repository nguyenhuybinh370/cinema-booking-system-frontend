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

export const ACCOUNTS = [
  { MaTaiKhoan: 'TK01', HoTen: 'Nguyễn Huy Bình', Email: 'binh@cinema.com', SoDienThoai: '0987654321', MatKhau: 'CinemaPlus@2026', NgaySinh: '1995-04-12', GioiTinh: 1, Role: 'Admin', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaTaiKhoan: 'TK02', HoTen: 'Trần Thị Hoa', Email: 'hoa@cinema.com', SoDienThoai: '0123456789', MatKhau: 'CinemaPlus@2026', NgaySinh: '1998-08-25', GioiTinh: 0, Role: 'Staff', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaTaiKhoan: 'TK03', HoTen: 'Lê Văn Tùng', Email: 'tung@cinema.com', SoDienThoai: '0555666777', MatKhau: 'CinemaPlus@2026', NgaySinh: '1990-11-05', GioiTinh: 1, Role: 'Manager', KhaDung: 0, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaTaiKhoan: 'TK_KH001', HoTen: 'Phạm Minh Hoàng', Email: 'hoang.pham@gmail.com', SoDienThoai: '0912345678', MatKhau: 'Customer@123', NgaySinh: '1994-05-12', GioiTinh: 1, Role: 'Customer', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaTaiKhoan: 'TK_KH002', HoTen: 'Nguyễn Diệp Chi', Email: 'chi.nd@gmail.com', SoDienThoai: '0987654321', MatKhau: 'Customer@123', NgaySinh: '1997-03-20', GioiTinh: 0, Role: 'Customer', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaTaiKhoan: 'TK_KH003', HoTen: 'Lê Anh Đức', Email: 'duc.la@gmail.com', SoDienThoai: '0901234567', MatKhau: 'Customer@123', NgaySinh: '1999-11-15', GioiTinh: 1, Role: 'Customer', KhaDung: 0, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaTaiKhoan: 'TK_KH004', HoTen: 'Vũ Hoài Nam', Email: 'nam.vh@gmail.com', SoDienThoai: '0934567890', MatKhau: 'Customer@123', NgaySinh: '1996-07-08', GioiTinh: 1, Role: 'Customer', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaTaiKhoan: 'TK_KH005', HoTen: 'Đỗ Thùy Linh', Email: 'linh.dt@gmail.com', SoDienThoai: '0978901234', MatKhau: 'Customer@123', NgaySinh: '2000-01-25', GioiTinh: 0, Role: 'Customer', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
];

export const STAFF = [
  { MaNhanVien: 'NV01', MaTaiKhoan: 'TK01', ChucVu: 'Quản lý rạp', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaNhanVien: 'NV02', MaTaiKhoan: 'TK02', ChucVu: 'Nhân viên bán vé', KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaNhanVien: 'NV03', MaTaiKhoan: 'TK03', ChucVu: 'Kỹ thuật viên', KhaDung: 0, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
];

export const SHIFTS = [
  { MaCaLamViec: 'C01', TenCa: 'Ca Sáng', GioBatDau: '08:00:00', GioKetThuc: '14:00:00', SoNguoiToiDa: 5, KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaCaLamViec: 'C02', TenCa: 'Ca Chiều', GioBatDau: '14:00:00', GioKetThuc: '20:00:00', SoNguoiToiDa: 5, KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaCaLamViec: 'C03', TenCa: 'Ca Tối', GioBatDau: '20:00:00', GioKetThuc: '02:00:00', SoNguoiToiDa: 3, KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
];

export const SHIFT_DETAILS = [
  { MaChiTietCa: 'CTC01', MaNhanVien: 'NV01', MaCaLamViec: 'C01', NgayLam: '2026-05-21', GhiChu: 'Trực quầy chính', KhaDung: 1, NgayLap: null, KieuLap: null, NgayTao: '2026-05-20 10:00:00', NgayCapNhat: null },
  { MaChiTietCa: 'CTC02', MaNhanVien: 'NV02', MaCaLamViec: 'C02', NgayLam: '2026-05-21', GhiChu: 'Bán vé + bắp nước', KhaDung: 1, NgayLap: null, KieuLap: null, NgayTao: '2026-05-20 11:00:00', NgayCapNhat: null },
  { MaChiTietCa: 'CTC03', MaNhanVien: 'NV02', MaCaLamViec: 'C03', NgayLam: '2026-05-22', GhiChu: 'Ca tối tăng cường', KhaDung: 0, NgayLap: null, KieuLap: null, NgayTao: '2026-05-21 08:30:00', NgayCapNhat: '2026-05-21 15:00:00' },
];

export const SHOWTIMES = [
  { MaSuatChieu: 'ST01', MaPhim: 'M01', MaPhongChieu: 'PC01', NgayChieu: '2026-05-22', GioChieu: '09:00:00', GioKetThuc: '10:52:00', MaLoaiNgay: 'LN01', GiaVeCoBan: 85000, KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaSuatChieu: 'ST02', MaPhim: 'M02', MaPhongChieu: 'PC01', NgayChieu: '2026-05-22', GioChieu: '12:00:00', GioKetThuc: '14:25:00', MaLoaiNgay: 'LN01', GiaVeCoBan: 85000, KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaSuatChieu: 'ST03', MaPhim: 'M01', MaPhongChieu: 'PC02', NgayChieu: '2026-05-22', GioChieu: '10:30:00', GioKetThuc: '12:22:00', MaLoaiNgay: 'LN01', GiaVeCoBan: 85000, KhaDung: 1, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
];

export const SHOWTIME_SEATS = [
  { MaGheSuatChieu: 'GSC_ST02_A1', MaSuatChieu: 'ST02', MaGhe: 'PC01-A1', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_A2', MaSuatChieu: 'ST02', MaGhe: 'PC01-A2', TrangThai: 2, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_D4', MaSuatChieu: 'ST02', MaGhe: 'PC01-D4', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_D5', MaSuatChieu: 'ST02', MaGhe: 'PC01-D5', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_D6', MaSuatChieu: 'ST02', MaGhe: 'PC01-D6', TrangThai: 2, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_E4', MaSuatChieu: 'ST02', MaGhe: 'PC01-E4', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_E5', MaSuatChieu: 'ST02', MaGhe: 'PC01-E5', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_E6', MaSuatChieu: 'ST02', MaGhe: 'PC01-E6', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_E7', MaSuatChieu: 'ST02', MaGhe: 'PC01-E7', TrangThai: 2, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_F3', MaSuatChieu: 'ST02', MaGhe: 'PC01-F3', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_F4', MaSuatChieu: 'ST02', MaGhe: 'PC01-F4', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_F5', MaSuatChieu: 'ST02', MaGhe: 'PC01-F5', TrangThai: 2, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_F6', MaSuatChieu: 'ST02', MaGhe: 'PC01-F6', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_F7', MaSuatChieu: 'ST02', MaGhe: 'PC01-F7', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_F8', MaSuatChieu: 'ST02', MaGhe: 'PC01-F8', TrangThai: 2, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_G4', MaSuatChieu: 'ST02', MaGhe: 'PC01-G4', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_G5', MaSuatChieu: 'ST02', MaGhe: 'PC01-G5', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_H5', MaSuatChieu: 'ST02', MaGhe: 'PC01-H5', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
  { MaGheSuatChieu: 'GSC_ST02_H6', MaSuatChieu: 'ST02', MaGhe: 'PC01-H6', TrangThai: 1, KhaDung: 1, NgayTao: '2026-05-20 09:00:00', NgayCapNhat: null },
];

export const CUSTOMERS = [
  { MaKhachHang: 'KH001', MaTaiKhoan: 'TK_KH001', DiemTichLuy: 120, KhaDung: 1, LyDoKhoa: null, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaKhachHang: 'KH002', MaTaiKhoan: 'TK_KH002', DiemTichLuy: 450, KhaDung: 1, LyDoKhoa: null, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaKhachHang: 'KH003', MaTaiKhoan: 'TK_KH003', DiemTichLuy: 0, KhaDung: 0, LyDoKhoa: 'Vi phạm nghiêm trọng điều khoản sử dụng: Nghi ngờ giao dịch gian lận nhiều lần.', NgayTao: '2026-05-01 09:00:00', NgayCapNhat: '2026-05-20 15:30:00' },
  { MaKhachHang: 'KH004', MaTaiKhoan: 'TK_KH004', DiemTichLuy: 95, KhaDung: 1, LyDoKhoa: null, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null },
  { MaKhachHang: 'KH005', MaTaiKhoan: 'TK_KH005', DiemTichLuy: 880, KhaDung: 1, LyDoKhoa: null, NgayTao: '2026-05-01 09:00:00', NgayCapNhat: null }
];

export const TICKET_RECEIPTS = [
  { MaPhieuDatVe: 'PDV01', MaKhachHang: 'KH001', MaNhanVien: null, TongTien: 170000, TrangThai: 'Đã TT', NgayDat: '2026-05-18 19:30:00', KhaDung: 1, NgayTao: '2026-05-18 19:30:00', NgayCapNhat: null },
  { MaPhieuDatVe: 'PDV02', MaKhachHang: 'KH001', MaNhanVien: null, TongTien: 85000, TrangThai: 'Đã TT', NgayDat: '2026-05-10 14:00:00', KhaDung: 1, NgayTao: '2026-05-10 14:00:00', NgayCapNhat: null },
  { MaPhieuDatVe: 'PDV03', MaKhachHang: 'KH002', MaNhanVien: null, TongTien: 170000, TrangThai: 'Đã TT', NgayDat: '2026-05-20 20:15:00', KhaDung: 1, NgayTao: '2026-05-20 20:15:00', NgayCapNhat: null },
  { MaPhieuDatVe: 'PDV04', MaKhachHang: 'KH002', MaNhanVien: null, TongTien: 85000, TrangThai: 'Đã hủy', NgayDat: '2026-05-05 18:00:00', KhaDung: 1, NgayTao: '2026-05-05 18:00:00', NgayCapNhat: null },
  { MaPhieuDatVe: 'PDV05', MaKhachHang: 'KH004', MaNhanVien: null, TongTien: 170000, TrangThai: 'Đã TT', NgayDat: '2026-05-19 17:30:00', KhaDung: 1, NgayTao: '2026-05-19 17:30:00', NgayCapNhat: null },
  { MaPhieuDatVe: 'PDV06', MaKhachHang: 'KH005', MaNhanVien: null, TongTien: 170000, TrangThai: 'Đã TT', NgayDat: '2026-05-21 09:30:00', KhaDung: 1, NgayTao: '2026-05-21 09:30:00', NgayCapNhat: null },
  { MaPhieuDatVe: 'PDV07', MaKhachHang: 'KH003', MaNhanVien: null, TongTien: 170000, TrangThai: 'Đã hủy', NgayDat: '2026-05-01 11:20:00', KhaDung: 1, NgayTao: '2026-05-01 11:20:00', NgayCapNhat: null },
];

export const TICKET_DETAILS = [
  { MaChiTietDatVe: 'CTDV01', MaPhieuDatVe: 'PDV01', MaGheSuatChieu: 'GSC_ST01_F8', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-18 19:30:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV02', MaPhieuDatVe: 'PDV01', MaGheSuatChieu: 'GSC_ST01_F9', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-18 19:30:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV03', MaPhieuDatVe: 'PDV02', MaGheSuatChieu: 'GSC_ST02_G4', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-10 14:00:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV04', MaPhieuDatVe: 'PDV03', MaGheSuatChieu: 'GSC_ST02_E4', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-20 20:15:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV05', MaPhieuDatVe: 'PDV03', MaGheSuatChieu: 'GSC_ST02_E5', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-20 20:15:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV06', MaPhieuDatVe: 'PDV04', MaGheSuatChieu: 'GSC_ST02_A2', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-05 18:00:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV07', MaPhieuDatVe: 'PDV05', MaGheSuatChieu: 'GSC_ST02_D4', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-19 17:30:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV08', MaPhieuDatVe: 'PDV05', MaGheSuatChieu: 'GSC_ST02_D5', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-19 17:30:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV09', MaPhieuDatVe: 'PDV06', MaGheSuatChieu: 'GSC_ST02_F3', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-21 09:30:00', NgayCapNhat: null },
  { MaChiTietDatVe: 'CTDV10', MaPhieuDatVe: 'PDV06', MaGheSuatChieu: 'GSC_ST02_F4', GiaVe: 85000, KhaDung: 1, NgayTao: '2026-05-21 09:30:00', NgayCapNhat: null },
];

export const TRANSACTIONS = [
  { MaGiaoDich: 'TX10091', MaPhieuDatVe: 'PDV06', MaThamChieuDoiTac: 'VNP_20260521_9910', SoTien: 170000, PhuongThucThanhToan: 'VNPay', TrangThai: 'Success', NgayGiaoDich: '2026-05-21 09:30:00', GhiChu: 'Thanh toán trực tuyến thành công', KhaDung: 1, NgayTao: '2026-05-21 09:30:00', NgayCapNhat: null },
  { MaGiaoDich: 'TX10090', MaPhieuDatVe: 'PDV03', MaThamChieuDoiTac: 'CARD_7721839210', SoTien: 170000, PhuongThucThanhToan: 'Card', TrangThai: 'Success', NgayGiaoDich: '2026-05-20 20:15:00', GhiChu: 'Thanh toán quốc tế VISA', KhaDung: 1, NgayTao: '2026-05-20 20:15:00', NgayCapNhat: null },
  { MaGiaoDich: 'TX10089', MaPhieuDatVe: 'PDV05', MaThamChieuDoiTac: 'VNP_20260519_8812', SoTien: 170000, PhuongThucThanhToan: 'VNPay', TrangThai: 'Success', NgayGiaoDich: '2026-05-19 17:30:00', GhiChu: 'Thanh toán qua ví VNPay', KhaDung: 1, NgayTao: '2026-05-19 17:30:00', NgayCapNhat: null },
  { MaGiaoDich: 'TX10088', MaPhieuDatVe: 'PDV01', MaThamChieuDoiTac: 'VNP_20260518_7723', SoTien: 170000, PhuongThucThanhToan: 'VNPay', TrangThai: 'Success', NgayGiaoDich: '2026-05-18 19:30:00', GhiChu: 'Thanh toán vé xem phim Lật Mặt 7', KhaDung: 1, NgayTao: '2026-05-18 19:30:00', NgayCapNhat: null },
  { MaGiaoDich: 'TX10086', MaPhieuDatVe: 'PDV04', MaThamChieuDoiTac: 'MOMO_20260505_4412', SoTien: 85000, PhuongThucThanhToan: 'MoMo', TrangThai: 'Refunded', NgayGiaoDich: '2026-05-05 18:00:00', GhiChu: 'Khách hàng hoàn vé sớm', KhaDung: 1, NgayTao: '2026-05-05 18:00:00', NgayCapNhat: '2026-05-05 18:15:00' },
  { MaGiaoDich: 'TX10085', MaPhieuDatVe: 'PDV07', MaThamChieuDoiTac: 'MOMO_20260501_1120', SoTien: 170000, PhuongThucThanhToan: 'MoMo', TrangThai: 'Failed', NgayGiaoDich: '2026-05-01 11:20:00', GhiChu: 'Lỗi giao dịch từ ví MoMo (Số dư không đủ)', KhaDung: 1, NgayTao: '2026-05-01 11:20:00', NgayCapNhat: null }
];

