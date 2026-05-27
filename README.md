# Cinema Booking System - Frontend

## Giới thiệu

Cinema Booking System / UIT Cinema là phần giao diện người dùng của đồ án nhóm về hệ thống đặt vé xem phim. Repository này chỉ chứa **frontend** được xây dựng bằng React và Vite; backend nằm ở repository riêng và cần được chạy độc lập để các chức năng gọi API hoạt động.

Ứng dụng hiện tập trung vào hai nhóm người dùng chính:

- Khách hàng đặt vé và quản lý lịch sử đặt vé.
- Nhân viên bán vé tại quầy, soát vé và quản lý lịch làm việc.

Admin có thể xuất hiện trong luồng điều hướng/role fallback, nhưng không phải trọng tâm hoàn thiện của frontend hiện tại.

## Liên kết repository

| Thành phần | Liên kết |
| --- | --- |
| Frontend repository | Repository hiện tại |
| Backend repository | Cập nhật link backend repository của nhóm |

## Công nghệ sử dụng

| Nhóm | Công nghệ / thư viện |
| --- | --- |
| Core UI | React 19, React DOM |
| Build tool | Vite |
| Styling | TailwindCSS, `@tailwindcss/vite` |
| Routing | React Router DOM |
| HTTP client | Axios |
| Icon/UI hỗ trợ | Lucide React, React Hot Toast |
| Media | React Player |
| Lint | ESLint, eslint-plugin-react-hooks, eslint-plugin-react-refresh |

## Chức năng chính

### Khách hàng

- Đăng ký, đăng nhập, đăng xuất.
- Xem danh sách phim, tìm kiếm phim.
- Xem chi tiết phim, trailer/hình ảnh với fallback visual khi URL từ backend thiếu hoặc lỗi.
- Xem danh sách đánh giá và gửi đánh giá.
- Chọn suất chiếu.
- Xem sơ đồ ghế, chọn ghế và giữ ghế.
- Thanh toán giả lập qua backend.
- Xác nhận vé sau khi đặt.
- Hiển thị QR/check-in code dựa trên `MaChiTietDat` phục vụ demo/soát vé.
- Xem lịch sử đặt vé và chi tiết đặt vé.
- Hủy đặt vé.
- Gửi yêu cầu hoàn tiền và theo dõi trạng thái hoàn tiền.
- Cập nhật hồ sơ cá nhân.
- Đổi mật khẩu.

### Nhân viên

- Đăng nhập tài khoản nhân viên.
- Xem dashboard nghiệp vụ.
- Bán vé tại quầy/POS.
- Chọn suất chiếu và sơ đồ ghế khi bán vé tại quầy.
- Thanh toán vé tại quầy.
- Soát vé bằng `MaChiTietDat`.
- Xem lịch sử soát vé/giao dịch.
- Xem lịch làm việc.
- Đăng ký và hủy ca làm.
- Cập nhật hồ sơ nhân viên.
- Đổi mật khẩu.

### Ghi chú về Admin

Frontend có xử lý điều hướng cho route bắt đầu bằng `/admin` trong một số luồng đăng nhập/role, nhưng module Admin không phải phần được tài liệu hóa như chức năng hoàn thiện trong repository này.

## Cấu trúc thư mục

```text
src/
├── api/                 # Axios client và các hàm gọi API nghiệp vụ
├── assets/              # Logo, hình ảnh, SVG và dữ liệu visual fallback
├── components/          # Component dùng chung, layout staff, bảo vệ route
├── data/                # Dữ liệu mock cục bộ cho một số màn hình
├── hooks/               # Custom hooks, hiện có các hook cho luồng khách hàng
├── pages/
│   ├── Auth/            # Đăng nhập, đăng ký, quên mật khẩu
│   ├── Client/          # Trang khách hàng: phim, đặt vé, hồ sơ
│   └── Staff/           # Trang nhân viên: dashboard, bán vé, soát vé, lịch làm
├── styles/              # CSS riêng cho một số khu vực giao diện
├── utils/               # Helper định dạng, ngày giờ, trạng thái, visual fallback
├── App.jsx              # Khai báo route chính
├── index.css            # CSS global
└── main.jsx             # Entry point React
```

## Yêu cầu cài đặt

- Node.js.
- npm.
- Backend API của hệ thống phải được chạy riêng trước khi sử dụng các chức năng cần dữ liệu thật.

## Cấu hình môi trường

File `.env.example` hiện khai báo:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Tạo file `.env` ở thư mục gốc frontend nếu cần cấu hình lại API:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

`src/api/axiosClient.js` cũng dùng giá trị mặc định `http://localhost:5000/api/v1` nếu biến môi trường chưa được cấu hình.

## Cài đặt và chạy project

Cài dependency:

```bash
npm install
```

Chạy môi trường phát triển:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Xem bản build bằng Vite preview:

```bash
npm run preview
```

Chạy lint:

```bash
npm run lint
```

## Tài khoản test

Tài khoản test phụ thuộc vào seed data của backend. Vui lòng xem README/backend seed script của repository backend để biết tài khoản khách hàng, nhân viên và dữ liệu mẫu tương ứng.

## Quy trình phát triển nhóm

Khuyến nghị quy trình làm việc:

1. Cập nhật branch nền trước khi làm việc.
2. Tạo branch riêng cho từng task/feature.
3. Commit rõ nội dung thay đổi.
4. Mở pull request để review trước khi merge.
5. Tránh code trực tiếp trên `main`.

Ví dụ commit message:

```text
feat(customer): add booking history view
fix(staff): handle check-in validation error
docs: update frontend README
```

## Lưu ý quan trọng

- Đây là repository **frontend only**, không phải monorepo/full-stack repository.
- Backend phải chạy riêng để các API như đăng nhập, phim, suất chiếu, giữ ghế, thanh toán giả lập và lịch sử đặt vé hoạt động.
- API prefix mặc định: `http://localhost:5000/api/v1`.
- Tích hợp thanh toán thật MoMo/VNPay chưa hoàn thiện và đang được hoãn.
- Checkout hiện tại sử dụng luồng thanh toán giả lập qua backend.
- QR code trong giao diện được tạo từ `MaChiTietDat` để phục vụ demo/check-in; không mô tả đây là secure token do backend sinh.
- Frontend có thể dùng visual movie assets cục bộ làm fallback nếu URL poster/backdrop/trailer từ backend bị thiếu hoặc lỗi.
- Dự án phục vụ mục đích học thuật/đồ án nhóm, không nên xem là hệ thống production-ready.

## Thành viên / Liên hệ

- Nhóm phát triển: cập nhật theo danh sách thành viên nhóm.
- Liên hệ:
  - Phan Gia Đạt
  - Email: phangiadat300106@gmail.com
  - Phone: 0907510942
