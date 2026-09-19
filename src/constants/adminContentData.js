export const actors = [
  { id: 'actor-1', name: 'Robert Downey Jr.', internationalName: 'Robert Downey Jr.', country: 'Hoa Kỳ', movieCount: 4, status: 'Đang hoạt động', updatedAt: '05/09/2026' },
  { id: 'actor-2', name: 'Scarlett Johansson', internationalName: 'Scarlett Johansson', country: 'Hoa Kỳ', movieCount: 3, status: 'Đang hoạt động', updatedAt: '03/09/2026' },
  { id: 'actor-3', name: 'Trấn Thành', internationalName: 'Tran Thanh', country: 'Việt Nam', movieCount: 2, status: 'Đang hoạt động', updatedAt: '28/08/2026' },
  { id: 'actor-4', name: 'Florence Pugh', internationalName: 'Florence Pugh', country: 'Anh', movieCount: 1, status: 'Bản nháp', updatedAt: '21/08/2026' },
];

export const genres = [
  { id: 'genre-1', name: 'Hành động', slug: 'hanh-dong', usageCount: 18, status: 'Đang hoạt động', updatedAt: '02/09/2026' },
  { id: 'genre-2', name: 'Tâm lý', slug: 'tam-ly', usageCount: 12, status: 'Đang hoạt động', updatedAt: '31/08/2026' },
  { id: 'genre-3', name: 'Hoạt hình', slug: 'hoat-hinh', usageCount: 9, status: 'Đang hoạt động', updatedAt: '29/08/2026' },
  { id: 'genre-4', name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong', usageCount: 7, status: 'Đang hoạt động', updatedAt: '22/08/2026' },
];

export const blogPosts = [
  { id: 'blog-1', title: '5 bộ phim đáng xem nhất tháng 9', author: 'Minh Anh', status: 'Đã xuất bản', publishedAt: '05/09/2026', updatedAt: '05/09/2026' },
  { id: 'blog-2', title: 'Trải nghiệm phòng chiếu IMAX tại NexCinema', author: 'Quang Huy', status: 'Bản nháp', publishedAt: '—', updatedAt: '03/09/2026' },
  { id: 'blog-3', title: 'Ưu đãi thành viên cuối tuần', author: 'Thu Hà', status: 'Đã lên lịch', publishedAt: '12/09/2026', updatedAt: '01/09/2026' },
];

export const banners = [
  { id: 'banner-1', name: 'Phim mới tháng 9', placement: 'Trang chủ · Hero', status: 'Đang hoạt động', schedule: '01/09 – 30/09/2026', order: 1, updatedAt: '05/09/2026' },
  { id: 'banner-2', name: 'Ưu đãi thành viên', placement: 'Trang chủ · Giữa trang', status: 'Đang hoạt động', schedule: 'Không giới hạn', order: 2, updatedAt: '02/09/2026' },
  { id: 'banner-3', name: 'Combo bắp nước', placement: 'Trang phim', status: 'Bản nháp', schedule: '15/09 – 30/09/2026', order: 3, updatedAt: '30/08/2026' },
];

export const dashboardTasks = [
  { id: 'task-1', title: 'Bổ sung poster cho “Mưa đỏ”', meta: 'Phim · Thiếu nội dung', tone: 'danger', href: '/admin/movies/movie-3' },
  { id: 'task-2', title: 'Kiểm tra banner sắp hết hạn', meta: 'Banner · Còn 2 ngày', tone: 'warning', href: '/admin/site/banners' },
  { id: 'task-3', title: 'Hoàn thiện bài viết IMAX', meta: 'Blog · Bản nháp', tone: 'neutral', href: '/admin/blog/blog-2' },
  { id: 'task-4', title: 'Kiểm tra link nhúng bản đồ', meta: 'Website · Chưa xác minh', tone: 'warning', href: '/admin/site/location' },
];

export const todayShowtimes = [
  { id: 'show-1', time: '10:15', movie: 'Avengers: Endgame', room: 'Phòng 01', occupancy: '76/120 ghế' },
  { id: 'show-2', time: '13:30', movie: 'Lật Mặt 7: Một Điều Ước', room: 'Phòng 02', occupancy: '54/96 ghế' },
  { id: 'show-3', time: '16:45', movie: 'Hành Tinh Khỉ: Vương Quốc Mới', room: 'Phòng IMAX', occupancy: '88/150 ghế' },
  { id: 'show-4', time: '20:00', movie: 'Dune: Part Two', room: 'Phòng 01', occupancy: '102/120 ghế' },
];
