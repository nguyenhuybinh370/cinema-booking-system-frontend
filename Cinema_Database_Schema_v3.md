**3.7. Thiết Kế Cơ Sở Dữ Liệu**

Hệ thống Quản lý Rạp Chiếu Phim sử dụng MySQL. Khóa chính của tất cả các bảng sử dụng kiểu VARCHAR(36) lưu dưới dạng UUID. Dưới đây là thiết kế chi tiết các bảng trong cơ sở dữ liệu.

## 3.7.1. Bảng KHACHHANG

|     |     |     |     |
| --- | --- | --- | --- |
| **KHACHHANG** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaKhachHang | VARCHAR(36) | Khóa chính | Mã khách hàng (UUID) |
| HoTen | VARCHAR(255) | Not null | Họ và tên |
| Email | VARCHAR(255) | Not null, Unique | Địa chỉ email |
| SoDienThoai | VARCHAR(20) | Not null, Unique | Số điện thoại |
| MatKhau | VARCHAR(255) | Not null | Mật khẩu (đã mã hóa) |
| NgaySinh | DATE | Null | Ngày sinh |
| GioiTinh | TINYINT(1) | Null | Giới tính (0: Nữ, 1: Nam) |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.1 Bảng KHACHHANG_

## 3.7.2. Bảng NHANVIEN

|     |     |     |     |
| --- | --- | --- | --- |
| **NHANVIEN** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaNhanVien | VARCHAR(36) | Khóa chính | Mã nhân viên (UUID) |
| HoTen | VARCHAR(255) | Not null | Họ và tên |
| Email | VARCHAR(255) | Not null, Unique | Địa chỉ email |
| SoDienThoai | VARCHAR(20) | Not null, Unique | Số điện thoại |
| MatKhau | VARCHAR(255) | Not null | Mật khẩu (đã mã hóa) |
| NgaySinh | DATE | Null | Ngày sinh |
| GioiTinh | TINYINT(1) | Null | Giới tính (0: Nữ, 1: Nam) |
| ChucVu | VARCHAR(100) | Not null | Chức vụ |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.2 Bảng NHANVIEN_

## 3.7.3. Bảng CALAMVIEC

|     |     |     |     |
| --- | --- | --- | --- |
| **CALAMVIEC** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaCaLamViec | VARCHAR(36) | Khóa chính | Mã ca làm việc (UUID) |
| TenCa | VARCHAR(100) | Not null | Tên ca (Sáng / Chiều / Tối) |
| GioBatDau | TIME | Not null | Giờ bắt đầu ca |
| GioKetThuc | TIME | Not null | Giờ kết thúc ca |
| SoNguoiToiDa | INT | Not null | Số nhân viên tối đa trong ca |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.3 Bảng CALAMVIEC_

## 3.7.4. Bảng CHITIETCALAMVIEC

|     |     |     |     |
| --- | --- | --- | --- |
| **CHITIETCALAMVIEC** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaChiTietCa | VARCHAR(36) | Khóa chính | Mã chi tiết ca làm việc (UUID) |
| MaNhanVien | VARCHAR(36) | Khóa ngoại | Mã nhân viên |
| MaCaLamViec | VARCHAR(36) | Khóa ngoại | Mã ca làm việc |
| NgayLam | DATE | Not null | Ngày làm việc |
| GhiChu | TEXT | Null | Ghi chú |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayLap | DATE | NULL | Ngày lặp lại cuối (NULL = chỉ 1 ngày) |
| KieuLap | TINYINT | NULL | NULL: không lặp, 1: hàng tuần, 2: hàng ngày |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.4 Bảng CHITIETCALAMVIEC_

## 3.7.5. Bảng LOAIPHONG

|     |     |     |     |
| --- | --- | --- | --- |
| **LOAIPHONG** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaLoaiPhong | VARCHAR(36) | Khóa chính | Mã loại phòng (UUID) |
| TenLoaiPhong | VARCHAR(100) | Not null | Tên loại phòng (2D, 3D, IMAX,...) |
| GiaPhuThu | DECIMAL(10,2) | Not null, Default 0 | Giá phụ thu theo loại phòng |
| MoTa | TEXT | Null | Mô tả loại phòng |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.5 Bảng LOAIPHONG_

## 3.7.6. Bảng PHONGCHIEU

|     |     |     |     |
| --- | --- | --- | --- |
| **PHONGCHIEU** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaPhongChieu | VARCHAR(36) | Khóa chính | Mã phòng chiếu (UUID) |
| MaSoDoGhe | VARCHAR(36) | Khóa ngoại | Sơ đồ ghế |
| TenPhong | VARCHAR(100) | Not null | Tên phòng chiếu |
| SoGhe | INT | Not null | Tổng số ghế |
| MaLoaiPhong | VARCHAR(36) | Khóa ngoại | Mã loại phòng |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.6 Bảng PHONGCHIEU_

## 3.7.7. Bảng LOAIGHE

|     |     |     |     |
| --- | --- | --- | --- |
| **LOAIGHE** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaLoaiGhe | VARCHAR(36) | Khóa chính | Mã loại ghế (UUID) |
| TenLoaiGhe | VARCHAR(100) | Not null | Tên loại ghế (Thường, VIP, Couple,...) |
| GiaPhuThu | DECIMAL(10,2) | Not null, Default 0 | Giá phụ thu theo loại ghế |
| MoTa | TEXT | Null | Mô tả loại ghế |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.7 Bảng LOAIGHE_

## 3.7.8. Bảng GHE

|     |     |     |     |
| --- | --- | --- | --- |
| **GHE** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaGhe | VARCHAR(36) | Khóa chính | Mã ghế (UUID) |
| TenGhe | VARCHAR(10) | Not null | Tên ghế (A1, B2,...) |
| HangGhe | VARCHAR(5) | Not null | Hàng ghế (A, B, C,...) |
| SoThuTu | INT | Not null | Số thứ tự ghế trong hàng |
| MaLoaiGhe | VARCHAR(36) | Khóa ngoại | Mã loại ghế |
| MaPhongChieu | VARCHAR(36) | Khóa ngoại | Mã phòng chiếu |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.8 Bảng GHE_

## 3.7.9. Bảng PHIM

|     |     |     |     |
| --- | --- | --- | --- |
| **PHIM** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaPhim | VARCHAR(36) | Khóa chính | Mã phim (UUID) |
| TenPhim | VARCHAR(255) | Not null | Tên phim |
| ThoiLuong | INT | Not null | Thời lượng (phút) |
| TheLoai | VARCHAR(255) | Not null | Thể loại phim |
| NgayKhoiChieu | DATE | Not null | Ngày khởi chiếu |
| NgayKetThuc | DATE | Null | Ngày kết thúc chiếu |
| DaoDien | VARCHAR(255) | Null | Đạo diễn |
| DienVien | TEXT | Null | Diễn viên |
| GioiHanTuoi | VARCHAR(10) | Not null | Giới hạn độ tuổi (P, C13, C16, C18) |
| NoiDung | TEXT | Null | Mô tả nội dung phim |
| HinhAnh | VARCHAR(500) | Null | Đường dẫn ảnh poster |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.9 Bảng PHIM_

## 3.7.10. Bảng LOAINGAY

|     |     |     |     |
| --- | --- | --- | --- |
| **LOAINGAY** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaLoaiNgay | VARCHAR(36) | Khóa chính | Mã loại ngày (UUID) |
| TenLoaiNgay | VARCHAR(100) | Not null | Tên loại ngày (Thường, Cuối tuần, Lễ,...) |
| GiaPhuThu | DECIMAL(10,2) | Not null, Default 0 | Giá phụ thu theo loại ngày |
| MoTa | TEXT | Null | Mô tả loại ngày |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.10 Bảng LOAINGAY_

## 3.7.11. Bảng SUATCHIEU

|     |     |     |     |
| --- | --- | --- | --- |
| **SUATCHIEU** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaSuatChieu | VARCHAR(36) | Khóa chính | Mã suất chiếu (UUID) |
| MaPhim | VARCHAR(36) | Khóa ngoại | Mã phim |
| MaPhongChieu | VARCHAR(36) | Khóa ngoại | Mã phòng chiếu |
| MaLoaiNgay | VARCHAR(36) | Khóa ngoại | Mã loại ngày |
| NgayChieu | DATE | Not null | Ngày chiếu |
| GioChieu | TIME | Not null | Giờ chiếu bắt đầu |
| GioKetThuc | TIME | Not null | Giờ chiếu kết thúc |
| GiaVeCoBan | DECIMAL(10,2) | Not null | Giá vé cơ bản |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.11 Bảng SUATCHIEU_

## 3.7.12. Bảng GHE_SUATCHIEU

|     |     |     |     |
| --- | --- | --- | --- |
| **GHE_SUATCHIEU** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaGheSuatChieu | VARCHAR(36) | Khóa chính | Mã ghế suất chiếu (UUID) |
| MaSuatChieu | VARCHAR(36) | Khóa ngoại | Mã suất chiếu |
| MaGhe | VARCHAR(36) | Khóa ngoại | Mã ghế |
| TrangThai | TINYINT(1) | Not null, Default 0 | Trạng thái (0: Trống, 1: Đã đặt, 2: Đang giữ) |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.12 Bảng GHE_SUATCHIEU_

## 3.7.13. Bảng PHIEUDATVE

|     |     |     |     |
| --- | --- | --- | --- |
| **PHIEUDATVE** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaPhieuDatVe | VARCHAR(36) | Khóa chính | Mã phiếu đặt vé (UUID) |
| MaKhachHang | VARCHAR(36) | Khóa ngoại | Mã khách hàng |
| MaNhanVien | VARCHAR(36) | Khóa ngoại, Null | Mã nhân viên (nếu đặt tại quầy) |
| TongTien | DECIMAL(10,2) | Not null | Tổng tiền thanh toán |
| TrangThai | VARCHAR(50) | Not null | Trạng thái (Chờ, Đã TT, Đã hủy) |
| NgayDat | DATETIME | Not null | Ngày giờ đặt vé |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.13 Bảng PHIEUDATVE_

## 3.7.14. Bảng CHITIETDATVE

|     |     |     |     |
| --- | --- | --- | --- |
| **CHITIETDATVE** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaChiTietDatVe | VARCHAR(36) | Khóa chính | Mã chi tiết đặt vé (UUID) |
| MaPhieuDatVe | VARCHAR(36) | Khóa ngoại | Mã phiếu đặt vé |
| MaGheSuatChieu | VARCHAR(36) | Khóa ngoại | Mã ghế suất chiếu |
| GiaVe | DECIMAL(10,2) | Not null | Giá vé thực tế |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.14 Bảng CHITIETDATVE_

## 3.7.15. Bảng GIAODICH

|     |     |     |     |
| --- | --- | --- | --- |
| **GIAODICH** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaGiaoDich | VARCHAR(36) | Khóa chính | Mã giao dịch (UUID) |
| MaPhieuDatVe | VARCHAR(36) | Khóa ngoại | Mã phiếu đặt vé |
| MaThamChieuDoiTac | VARCHAR(36) | Not null | Mã tham chiếu đối tác |
| SoTien | DECIMAL(10,2) | Not null | Số tiền giao dịch |
| PhuongThucThanhToan | VARCHAR(100) | Not null | Phương thức thanh toán |
| TrangThai | VARCHAR(50) | Not null | Trạng thái giao dịch |
| NgayGiaoDich | DATETIME | Not null | Ngày giờ giao dịch |
| GhiChu | TEXT | Null | Ghi chú giao dịch |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.15 Bảng GIAODICH_

## 3.7.16. Bảng LICHSUHOANTIEN

|     |     |     |     |
| --- | --- | --- | --- |
| **LICHSUHOANTIEN** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaLichSuHoanTien | VARCHAR(36) | Khóa chính | Mã lịch sử hoàn tiền (UUID) |
| MaGiaoDich | VARCHAR(36) | Khóa ngoại | Mã giao dịch gốc |
| MaPhieuDatVe | VARCHAR(36) | Khóa ngoại | Mã phiếu đặt vé |
| SoTienHoan | DECIMAL(10,2) | Not null | Số tiền hoàn trả |
| LyDoHoan | TEXT | Not null | Lý do hoàn tiền |
| TrangThai | VARCHAR(50) | Not null | Trạng thái hoàn tiền |
| NgayYeuCau | DATETIME | Not null | Ngày yêu cầu hoàn tiền |
| NgayHoan | DATETIME | Null | Ngày thực hiện hoàn tiền |
| MaNhanVien | VARCHAR(36) | Khóa ngoại, Null | Mã nhân viên xử lý |
| GhiChu | TEXT | Null | Ghi chú |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |

_Bảng 3.16 Bảng LICHSUHOANTIEN_

**3.7.17. Bảng SODOGHE:**

|     |     |     |     |
| --- | --- | --- | --- |
| **SODOGHE** |     |     |     |
| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| MaSoDoGhe | VARCHAR(36) | Khóa chính | Mã sơ đồ ghế (UUID) |
| TongHang | INT | Not null | Tổng số hàng |
| TongCot | INT | Not null | Tổng số cột |
| CauTruc | TEXT | Not null | Chuỗi JSON lưu ma trận ghế, xác định ô nào là ghế, ô nào là lối đi |
| TrangThaiApDung | TINYINT | Null, Default 1 | 1: Đang sử dụng, 0: Sơ đồ cũ |
| KhaDung | TINYINT(1) | Not null, Default 1 | Trạng thái khả dụng |
| NgayTao | DATETIME | Not null | Ngày tạo bản ghi |
| NgayCapNhat | DATETIME | Null | Ngày cập nhật gần nhất |