# Admin FE refinement

## 1. Tinh gọn IA và cấu hình website

- [x] Bỏ module Navigator/Header khỏi Admin nhưng giữ sidebar quản trị chính.
- [x] Bỏ module Tags và các trường Tags khỏi luồng phim, bài viết.
- [x] Chuẩn hóa URL cấu hình thành cặp `Tên hiển thị` và `Liên kết`.
- [x] Tách giờ mở cửa / đóng cửa và hiển thị trên cùng một hàng.
- [x] Chỉ giữ link nhúng bản đồ; bỏ vĩ độ và kinh độ.
- [x] Tăng độ nổi bật cho tiêu đề các khối trên trang Tổng quan.

## 2. Bảng dữ liệu và trang lỗi

- [x] Cố định cột hành động khi cuộn ngang.
- [x] Ẩn ID/UUID khỏi bảng và bổ sung nút xem chi tiết bằng biểu tượng con mắt.
- [x] Thêm trang lỗi 403 và 404, cập nhật routing phù hợp.

## 3. Kiểm tra chất lượng

- [x] ESLint phạm vi Admin vượt qua.
- [x] Production build vượt qua.
- [x] Commit theo từng lát cắt chức năng vừa đủ.
