import { ROOMS, ROOM_TYPES } from '../../constants/adminMockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const roomService = {
  getRooms: async () => {
    await delay();
    return [...ROOMS];
  },
  getRoomById: async (id) => {
    await delay();
    return ROOMS.find(r => r.MaPhongChieu === id);
  },
  addRoom: async (room) => {
    await delay();
    if (!room.TenPhong || room.TenPhong.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên phòng chiếu không được để trống!');
    }
    const exists = ROOMS.some(r => r.TenPhong.toLowerCase() === room.TenPhong.toLowerCase() && r.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Phòng chiếu đã tồn tại trong hệ thống!');
    }
    const newRoom = {
      ...room,
      NgayTao: new Date().toISOString().replace('T', ' ').substring(0, 19),
      NgayCapNhat: null
    };
    ROOMS.push(newRoom);
    return newRoom;
  },
  updateRoom: async (maPhong, updates) => {
    await delay();
    if (!updates.TenPhong || updates.TenPhong.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên phòng chiếu không được để trống!');
    }
    const index = ROOMS.findIndex(r => r.MaPhongChieu === maPhong);
    if (index === -1) {
      throw new Error('Không tìm thấy phòng chiếu');
    }
    const exists = ROOMS.some(r => r.MaPhongChieu !== maPhong && r.TenPhong.toLowerCase() === updates.TenPhong.toLowerCase() && r.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên phòng chiếu đã tồn tại!');
    }

    ROOMS[index] = {
      ...ROOMS[index],
      ...updates,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return ROOMS[index];
  },
  deleteRoom: async (maPhong) => {
    await delay();
    const index = ROOMS.findIndex(r => r.MaPhongChieu === maPhong);
    if (index === -1) {
      throw new Error('Không tìm thấy phòng chiếu');
    }
    if (maPhong === 'PC01') {
      throw new Error('Không thể xóa phòng chiếu vì đã có vé bán ra thuộc các suất chiếu của phòng này (Kiểm tra trong bảng CHITIETDATVE)!');
    }
    ROOMS.splice(index, 1);
    return true;
  },

  getRoomTypes: async () => {
    await delay();
    return [...ROOM_TYPES];
  },
  addRoomType: async (item) => {
    await delay();
    if (!item.TenLoaiPhong || item.TenLoaiPhong.trim() === '') {
      throw new Error('Thông tin không hợp lệ: Tên loại phòng không được để trống!');
    }
    const exists = ROOM_TYPES.some(t => t.TenLoaiPhong.toLowerCase() === item.TenLoaiPhong.toLowerCase() && t.KhaDung !== 0);
    if (exists) {
      throw new Error('Lỗi: Tên loại phòng đã tồn tại trong hệ thống!');
    }
    ROOM_TYPES.push(item);
    return item;
  },
  updateRoomType: async (id, updates) => {
    await delay();
    const index = ROOM_TYPES.findIndex(t => t.MaLoaiPhong === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại phòng');
    }
    if (updates.TenLoaiPhong !== undefined && (!updates.TenLoaiPhong || updates.TenLoaiPhong.trim() === '')) {
      throw new Error('Thông tin không hợp lệ: Tên loại phòng không được để trống!');
    }
    if (updates.TenLoaiPhong) {
      const exists = ROOM_TYPES.some(t => t.MaLoaiPhong !== id && t.TenLoaiPhong.toLowerCase() === updates.TenLoaiPhong.toLowerCase() && t.KhaDung !== 0);
      if (exists) {
        throw new Error('Lỗi: Tên loại phòng đã tồn tại trong hệ thống!');
      }
    }
    ROOM_TYPES[index] = {
      ...ROOM_TYPES[index],
      ...updates,
      NgayCapNhat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return ROOM_TYPES[index];
  },
  deleteRoomType: async (id) => {
    await delay();
    const index = ROOM_TYPES.findIndex(t => t.MaLoaiPhong === id);
    if (index === -1) {
      throw new Error('Không tìm thấy loại phòng');
    }
    const roomExists = ROOMS.some(r => r.MaLoaiPhong === id);
    if (roomExists) {
      throw new Error('Không thể xóa loại phòng này vì đang được sử dụng trong bảng phòng chiếu (Kiểm tra trong bảng PHONGCHIEU)!');
    }
    ROOM_TYPES.splice(index, 1);
    return true;
  }
};

export default roomService;
