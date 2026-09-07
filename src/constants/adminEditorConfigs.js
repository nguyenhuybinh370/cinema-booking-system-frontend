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
          { name: 'posterUrl', label: 'Poster URL', helperText: 'Tỷ lệ đề xuất 2:3' },
          { name: 'backdropUrl', label: 'Ảnh nền URL', helperText: 'Tỷ lệ đề xuất 16:9' },
          { name: 'trailerUrl', label: 'Trailer URL', span: 2 },
        ],
      },
      {
        title: 'Phân loại & xuất bản',
        fields: [
          { name: 'genre', label: 'Thể loại', type: 'select', options: ['Hành động', 'Tâm lý', 'Hoạt hình', 'Khoa học viễn tưởng'] },
          { name: 'tags', label: 'Tags', helperText: 'Phân cách nhiều tag bằng dấu phẩy.' },
          { name: 'status', label: 'Trạng thái', type: 'select', options: ['Bản nháp', 'Đã xuất bản', 'Đang ẩn'] },
        ],
      },
    ],
    initialValues: {
      title: '', englishTitle: '', slug: '', summary: '', duration: '', ageRating: 'P', releaseDate: '', endDate: '',
      country: '', language: '', posterUrl: '', backdropUrl: '', trailerUrl: '', genre: 'Hành động', tags: '', status: 'Bản nháp',
    },
    editValues: {
      title: 'Avengers: Endgame', englishTitle: 'Avengers: Endgame', slug: 'avengers-endgame', summary: 'Các Avengers còn lại tập hợp lần cuối để đảo ngược hậu quả của cú búng tay.', duration: '181', ageRating: 'T13', releaseDate: '2019-04-26', endDate: '', country: 'Hoa Kỳ', language: 'Tiếng Anh · Phụ đề Việt', posterUrl: '', backdropUrl: '', trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c', genre: 'Hành động', tags: 'Marvel, IMAX', status: 'Đã xuất bản',
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
          { name: 'avatarUrl', label: 'Ảnh đại diện URL', helperText: 'Tỷ lệ đề xuất 1:1 hoặc 4:5' },
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
};
