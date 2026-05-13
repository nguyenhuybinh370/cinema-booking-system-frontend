export const ROOM_TYPES = [
  { id: '2D', name: '2D', surcharge: 0, description: 'Phòng chiếu tiêu chuẩn 2D', available: true },
  { id: '3D', name: '3D', surcharge: 30000, description: 'Phòng chiếu phim 3D hiện đại', available: true },
  { id: 'IMAX', name: 'IMAX', surcharge: 50000, description: 'Trải nghiệm màn hình cực đại', available: true },
];

export const ROOMS = [
  { id: 'PC01', name: 'Phòng Chiếu 01', seatCount: 100, typeId: '2D', seatMapId: 'SM01', status: 'Active', available: true },
  { id: 'PC02', name: 'Phòng Chiếu 02', seatCount: 120, typeId: '3D', seatMapId: 'SM02', status: 'Active', available: true },
  { id: 'PC03', name: 'Phòng Chiếu 03', seatCount: 150, typeId: 'IMAX', seatMapId: 'SM03', status: 'Maintenance', available: true },
];

export const SEAT_MAPS = [
  { id: 'SM01', name: 'Sơ đồ 10x10', rows: 10, cols: 10, available: true },
  { id: 'SM02', name: 'Sơ đồ 10x12', rows: 10, cols: 12, available: true },
  { id: 'SM03', name: 'Sơ đồ 10x15', rows: 10, cols: 15, available: true },
];

export const SEAT_TYPES = [
  { id: 'Normal', name: 'Thường', surcharge: 0 },
  { id: 'VIP', name: 'VIP', surcharge: 20000 },
  { id: 'Sweetbox', name: 'Sweetbox', surcharge: 50000 },
];

export const DAY_TYPES = [
  { id: 'Weekday', name: 'Ngày thường', surcharge: 0 },
  { id: 'Weekend', name: 'Cuối tuần', surcharge: 20000 },
  { id: 'Holiday', name: 'Lễ/Tết', surcharge: 40000 },
  { id: 'HappyDay', name: 'Happy Day', surcharge: -20000 },
];

export const ADMIN_MOVIES = [
  { 
    id: 'M01', 
    title: 'Lật Mặt 7: Một Điều Ước', 
    duration: 112, 
    genres: 'Hành động, Tâm lý', 
    releaseDate: '2024-04-26', 
    endDate: '2024-06-26', 
    director: 'Lý Hải', 
    cast: 'Trương Minh Cường, Đinh Y Nhung, Quách Ngọc Tuyên', 
    ageRating: 'T16', 
    status: 'Showing',
    image: 'https://image.api.playready.com.vn/api/v2/image/6628b031b268010026e6d338'
  },
  { 
    id: 'M02', 
    title: 'Hành Tinh Khỉ: Vương Quốc Mới', 
    duration: 145, 
    genres: 'Hành động, Khoa học viễn tưởng', 
    releaseDate: '2024-05-10', 
    endDate: '2024-07-10', 
    director: 'Wes Ball', 
    cast: 'Owen Teague, Freya Allan, Kevin Durand', 
    ageRating: 'P', 
    status: 'Showing',
    image: 'https://image.api.playready.com.vn/api/v2/image/66399f668673a500264024c0'
  },
];

export const STAFF = [
  { id: 'NV01', name: 'Nguyễn Huy Bình', email: 'binh@cinema.com', phone: '0987654321', position: 'Quản lý rạp', role: 'Admin', status: 'Active' },
  { id: 'NV02', name: 'Trần Thị Hoa', email: 'hoa@cinema.com', phone: '0123456789', position: 'Nhân viên bán vé', role: 'Staff', status: 'Active' },
  { id: 'NV03', name: 'Lê Văn Tùng', email: 'tung@cinema.com', phone: '0555666777', position: 'Kỹ thuật viên', role: 'Manager', status: 'Inactive' },
];
