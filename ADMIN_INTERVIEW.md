# Admin frontend: flow và checklist phỏng vấn

## Phạm vi đóng góp

Đây là dự án hai người. Tài liệu chỉ tập trung phần Admin; trước phỏng vấn hãy
đối chiếu commit/phân công thật và dùng “em làm” cho đúng phần của mình. Không
nhận customer checkout, payment gateway hoặc staff portal nếu đó là phần của
đồng đội.

Đợt chuẩn bị này tập trung vào ba kết quả có thể chứng minh:

- Tách trang giao dịch lớn thành tab, hook và modal có trách nhiệm rõ ràng.
- Làm rõ refund là **xác nhận sau chuyển tiền thủ công**, chống gửi trùng phía UI
  và không hiển thị response cũ khi filter/detail thay đổi nhanh.
- Thay dashboard mock và form phim giả bằng API thật; gỡ route/menu CMS chưa có
  backend khỏi phạm vi demo. Source prototype vẫn còn trong repo để không xóa
  công việc cũ, nhưng không được mount trong `App.jsx`.

## Bản đồ code

| Chức năng | Page/component | State và API |
| --- | --- | --- |
| Dashboard | `pages/Admin/Stats.jsx` | `services/admin/dashboardService.js` |
| Phim | `pages/Admin/Movies.jsx`, `MovieEditor.jsx` | `movieService.js`, `MovieModal.jsx` |
| Giao dịch | `pages/Admin/Transactions/BookingTransactionsTab.jsx` | `useBookingTransactions.js` |
| Yêu cầu hoàn | `pages/Admin/Transactions/RefundRequestsTab.jsx` | `useRefundRequests.js` |
| Chi tiết/xác nhận | `RefundDetailModal.jsx`, `TransactionRefundModal.jsx` | hook tương ứng |
| API chung | — | `api/axiosClient.js`: token, refresh, unwrap envelope |
| Route và RBAC UI | `App.jsx`, `ProtectedRoute` | backend vẫn là nơi enforce quyền thật |

## Flow nên trình bày

### Dashboard

`Stats` mount → `getDashboard()` gọi song song doanh thu toàn kỳ, tỷ lệ ghế
trong ngày Việt Nam và trang đầu yêu cầu hoàn chờ xử lý → `mapDashboard()` tính
tỷ lệ theo tổng số ghế (weighted), sort lịch chiếu → UI hiển thị loading/error,
empty state hoặc dữ liệu. Một request lỗi làm dashboard vào error state, không
biến lỗi mạng thành số 0 gây hiểu nhầm.

Doanh thu là số backend trả về sau khi loại giao dịch đã hoàn và booking không
còn hiệu lực; không gọi đây là báo cáo kế toán. Ngày lịch chiếu dùng
`Asia/Ho_Chi_Minh`, còn backend hiện lọc doanh thu theo UTC.

### Thêm/sửa phim

Danh sách → `/admin/movies/new` hoặc `/:id` → `MovieEditor`. Edit tải chi tiết
phim, normalize kiểu trong `movieService`, dùng form chung `MovieModal`, rồi POST
hoặc PUT. `useRef` khóa lần submit thứ hai ngay cả trước render tiếp theo; fieldset
và nút bị disable trong lúc chờ. Lỗi API được giữ tại form; thành công quay về
danh sách. Validate ngày ở UI để phản hồi nhanh, backend validator vẫn là nguồn
đảm bảo dữ liệu.

### Refund request

Tab yêu cầu dùng server pagination/filter và debounce keyword. Mỗi lần tải có
version; response cũ bị bỏ qua nếu user đã đổi filter/tab. Mở detail cũng có
version riêng. Approve/reject khóa submission bằng ref và loading state.

Approve chỉ được bấm sau khi admin đã chuyển tiền ngoài hệ thống. Frontend gọi
PATCH rồi reload list; tính nguyên tử và chống hai admin xử lý cùng yêu cầu nằm
ở backend transaction/conditional update. Modal hoàn trực tiếp cũng chỉ “ghi
nhận đã hoàn”, không hứa gọi payment provider.

## Kịch bản demo 7–10 phút

1. Đăng nhập Admin, mở Tổng quan: chỉ ra 3 API song song, loading/error/empty và
   ý nghĩa từng KPI.
2. Mở Phim: tìm/lọc; thêm một phim demo; sửa lại; nhấn lưu nhanh hai lần để giải
   thích guard. Có thể bỏ bước xóa để tránh phá dữ liệu chung.
3. Mở Suất chiếu hoặc Phòng/Sơ đồ để mô tả quan hệ Phim → Suất → Phòng → Ghế.
4. Mở Giao dịch, chuyển sang Yêu cầu hoàn, xem detail và thông tin ngân hàng.
   Chỉ approve dữ liệu dành riêng cho demo và chỉ sau khi nói rõ chuyển tiền là
   thủ công. Nếu không muốn đổi DB, dừng trước nút xác nhận và trình bày test.
5. Mở test backend `adminRefund.test.ts`: chọn concurrency và rollback làm bằng
   chứng. Kết thúc bằng limitation và hướng nâng cấp provider reconciliation.

Chuẩn bị trước: backend/frontend `.env` local, MySQL, seed/test account và một
yêu cầu hoàn chuyên dùng demo. Không dùng schema `nex_cinema_admin_test` để demo
vì test integration sẽ xóa dữ liệu trong schema đó.

## Verify không dùng browser

```sh
node --test tests/admin-transactions.test.mjs tests/admin-operations.test.mjs
node node_modules/eslint/bin/eslint.js src/pages/Admin src/components/Admin src/services/admin src/hooks/useClientPagination.js
node node_modules/vite/bin/vite.js build
git diff --check
```

Node test dùng Vite SSR và Axios adapter: kiểm tra render, mapping và API contract
nhưng không phải browser E2E hoặc live backend integration. Build hiện có warning
bundle chính lớn hơn 500 kB; đây là tối ưu tiếp theo bằng route-level lazy load.
Full-repo ESLint còn lỗi legacy ngoài phạm vi Admin (payment/customer/staff và
utility). Không nói “toàn bộ lint pass”; scoped Admin lint mới là gate của PR.

## Câu hỏi hay gặp

- “Vì sao không sửa toàn bộ app?” Thời gian hai ngày nên giới hạn theo ownership
  và luồng demo, ưu tiên correctness/test hơn một cuộc rewrite rủi ro.
- “Tách Transactions đem lại gì?” Page điều phối tab; hook sở hữu async state;
  component render; modal chỉ xác nhận. Mỗi phần test/đọc độc lập hơn.
- “Disable button đã chống duplicate chưa?” Chỉ chống thao tác UI phổ biến;
  correctness phải được backend đảm bảo vì request có thể đến từ tab/máy khác.
- “Vì sao gỡ CMS khỏi route?” Đó là prototype local không có persistence. Đưa
  vào demo như chức năng thật sẽ sai; giữ source để có thể nối backend sau.
- “Nếu có thêm thời gian?” Lưu audit người duyệt/lý do từ chối, provider refund
  có idempotency và reconciliation, E2E API thật, lazy routes và xử lý lint debt.
