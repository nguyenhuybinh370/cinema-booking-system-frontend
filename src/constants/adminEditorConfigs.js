export const adminEditorConfigs = {
  movie: {
    entityLabel: 'phim',
    listPath: '/admin/movies',
    sections: [
      {
        title: 'Thông tin cơ bản',
        description: 'Nội dung chính dùng trên trang chi tiết phim.',
        fields: [
          { name: 'title', label: 'Tên phim', required: true, span: 2 },
          { name: 'englishTitle', label: 'Tên tiếng Anh' },
          { name: 'slug', label: 'Slug', required: true, prefix: '/phim/' },
          { name: 'summary', label: 'Mô tả ngắn', type: 'textarea', span: 2 },
          { name: 'duration', label: 'Thời lượng (phút)', type: 'number', required: true },
          { name: 'ageRating', label: 'Giới hạn tuổi', type: 'select', options: ['P', 'K', 'T13', 'T16', 'T18'] },
          { name: 'releaseDate', label: 'Ngày khởi chiếu', type: 'date', required: true },
          { name: 'endDate', label: 'Ngày kết thúc', type: 'date' },
          { name: 'country', label: 'Quốc gia' },
          { name: 'language', label: 'Ngôn ngữ' },
        ],
      },
      {
        title: 'Media',
        description: 'Dùng URL tạm thời; uploader sẽ nối dịch vụ lưu trữ sau.',
        fields: [
          { name: 'posterUrl', label: 'Poster', type: 'image', aspectRatio: '2:3' },
          { name: 'backdropUrl', label: 'Ảnh nền', type: 'image', aspectRatio: '16:9' },
          { name: 'trailerUrl', label: 'Trailer URL', span: 2 },
        ],
      },
      {
        title: 'Phân loại & xuất bản',
        fields: [
          { name: 'genre', label: 'Thể loại', type: 'select', options: ['Hành động', 'Tâm lý', 'Hoạt hình', 'Khoa học viễn tưởng'] },
          { name: 'status', label: 'Trạng thái', type: 'select', options: ['Bản nháp', 'Đã xuất bản', 'Đang ẩn'] },
        ],
      },
    ],
    initialValues: {
      title: '', englishTitle: '', slug: '', summary: '', duration: '', ageRating: 'P', releaseDate: '', endDate: '',
      country: '', language: '', posterUrl: '', backdropUrl: '', trailerUrl: '', genre: 'Hành động', status: 'Bản nháp',
    },
    editValues: {
      title: 'Avengers: Endgame', englishTitle: 'Avengers: Endgame', slug: 'avengers-endgame', summary: 'Các Avengers còn lại tập hợp lần cuối để đảo ngược hậu quả của cú búng tay.', duration: '181', ageRating: 'T13', releaseDate: '2019-04-26', endDate: '', country: 'Hoa Kỳ', language: 'Tiếng Anh · Phụ đề Việt', posterUrl: '', backdropUrl: '', trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c', genre: 'Hành động', status: 'Đã xuất bản',
    },
  },
  actor: {
    entityLabel: 'diễn viên',
    listPath: '/admin/actors',
    sections: [
      {
        title: 'Hồ sơ diễn viên',
        description: 'Thông tin dùng chung cho tất cả phim có diễn viên này.',
        fields: [
          { name: 'name', label: 'Tên diễn viên', required: true },
          { name: 'internationalName', label: 'Tên quốc tế' },
          { name: 'slug', label: 'Slug', required: true, prefix: '/dien-vien/' },
          { name: 'birthday', label: 'Ngày sinh', type: 'date' },
          { name: 'country', label: 'Quốc gia' },
          { name: 'avatarUrl', label: 'Ảnh đại diện', type: 'image', aspectRatio: '1:1' },
          { name: 'bio', label: 'Giới thiệu', type: 'textarea', span: 2 },
          { name: 'status', label: 'Trạng thái', type: 'select', options: ['Bản nháp', 'Đang hoạt động', 'Đã lưu trữ'] },
        ],
      },
      {
        title: 'Liên kết ngoài',
        fields: [
          { name: 'imdbUrl', label: 'IMDb URL' },
          { name: 'websiteUrl', label: 'Website cá nhân' },
        ],
      },
    ],
    initialValues: { name: '', internationalName: '', slug: '', birthday: '', country: '', avatarUrl: '', bio: '', status: 'Bản nháp', imdbUrl: '', websiteUrl: '' },
    editValues: { name: 'Robert Downey Jr.', internationalName: 'Robert Downey Jr.', slug: 'robert-downey-jr', birthday: '1965-04-04', country: 'Hoa Kỳ', avatarUrl: '', bio: 'Diễn viên và nhà sản xuất người Mỹ, nổi tiếng với vai Tony Stark trong Vũ trụ Điện ảnh Marvel.', status: 'Đang hoạt động', imdbUrl: 'https://www.imdb.com/name/nm0000375/', websiteUrl: '' },
  },
  blog: {
    entityLabel: 'bài viết',
    listPath: '/admin/blog',
    sections: [
      {
        title: 'Nội dung bài viết',
        description: 'Viết ngắn gọn, dễ đọc và dùng tiêu đề mô tả đúng nội dung.',
        fields: [
          { name: 'title', label: 'Tiêu đề', required: true, span: 2 },
          { name: 'slug', label: 'Slug', required: true, prefix: '/blog/' },
          { name: 'author', label: 'Tác giả', required: true },
          { name: 'excerpt', label: 'Tóm tắt', type: 'textarea', span: 2 },
          { name: 'coverUrl', label: 'Ảnh bìa', type: 'image', aspectRatio: '16:9', span: 2 },
          { name: 'body', label: 'Nội dung', type: 'richtext', required: true, span: 2 },
        ],
      },
      {
        title: 'Phân loại & xuất bản',
        fields: [
          { name: 'status', label: 'Trạng thái', type: 'select', options: ['Bản nháp', 'Đã lên lịch', 'Đã xuất bản', 'Đang ẩn'] },
          { name: 'publishedAt', label: 'Thời gian xuất bản', type: 'datetime-local' },
        ],
      },
      {
        title: 'SEO',
        description: 'Tùy chọn. Nếu để trống, hệ thống dùng tiêu đề và tóm tắt bài viết.',
        fields: [
          { name: 'seoTitle', label: 'SEO title' },
          { name: 'metaDescription', label: 'Meta description', type: 'textarea' },
          { name: 'ogImage', label: 'OG image URL', span: 2 },
        ],
      },
    ],
    initialValues: { title: '', slug: '', author: '', excerpt: '', coverUrl: '', body: '', status: 'Bản nháp', publishedAt: '', seoTitle: '', metaDescription: '', ogImage: '' },
    editValues: { title: 'Trải nghiệm phòng chiếu IMAX tại NexCinema', slug: 'trai-nghiem-phong-chieu-imax', author: 'Quang Huy', excerpt: 'Khám phá chất lượng hình ảnh và âm thanh khác biệt tại phòng chiếu IMAX.', coverUrl: '', body: 'Màn hình lớn, âm thanh chính xác và không gian được tối ưu giúp mỗi cảnh phim trở nên sống động hơn.', status: 'Bản nháp', publishedAt: '', seoTitle: '', metaDescription: '', ogImage: '' },
  },
  banner: {
    entityLabel: 'banner',
    listPath: '/admin/site/banners',
    sections: [
      {
        title: 'Nội dung banner',
        fields: [
          { name: 'name', label: 'Tên nội bộ', required: true },
          { name: 'placement', label: 'Vị trí', type: 'select', options: ['Trang chủ · Hero', 'Trang chủ · Giữa trang', 'Trang phim'] },
          { name: 'heading', label: 'Tiêu đề hiển thị', span: 2 },
          { name: 'description', label: 'Mô tả', type: 'textarea', span: 2 },
          { name: 'ctaLabel', label: 'Nhãn CTA' },
          { name: 'ctaUrl', label: 'CTA URL' },
        ],
      },
      {
        title: 'Hình ảnh',
        fields: [
          { name: 'desktopImage', label: 'Ảnh desktop', type: 'image', aspectRatio: '21:9', required: true },
          { name: 'mobileImage', label: 'Ảnh mobile', type: 'image', aspectRatio: '4:5' },
        ],
      },
      {
        title: 'Lịch hiển thị',
        fields: [
          { name: 'startAt', label: 'Bắt đầu', type: 'datetime-local' },
          { name: 'endAt', label: 'Kết thúc', type: 'datetime-local' },
          { name: 'order', label: 'Thứ tự', type: 'number' },
          { name: 'status', label: 'Trạng thái', type: 'select', options: ['Bản nháp', 'Đang hoạt động', 'Ngừng hoạt động'] },
        ],
      },
    ],
    initialValues: { name: '', placement: 'Trang chủ · Hero', heading: '', description: '', ctaLabel: '', ctaUrl: '', desktopImage: '', mobileImage: '', startAt: '', endAt: '', order: '1', status: 'Bản nháp' },
    editValues: { name: 'Phim mới tháng 9', placement: 'Trang chủ · Hero', heading: 'Phim mới. Trải nghiệm mới.', description: 'Đặt vé những bộ phim được mong đợi nhất tháng này.', ctaLabel: 'Đặt vé ngay', ctaUrl: '/movies/now-showing', desktopImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba', mobileImage: '', startAt: '2026-09-01T00:00', endAt: '2026-09-30T23:59', order: '1', status: 'Đang hoạt động' },
  },
};
