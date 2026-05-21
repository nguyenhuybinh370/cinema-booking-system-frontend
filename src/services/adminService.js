import { 
  ADMIN_MOVIES, 
  ROOMS, 
  STAFF, 
  SEAT_MAPS, 
  ROOM_TYPES, 
  SEAT_TYPES, 
  DAY_TYPES 
} from '../constants/adminMockData';

// Helper to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const adminService = {
  // Movies
  getMovies: async () => {
    await delay();
    return [...ADMIN_MOVIES];
  },
  addMovie: async (movie) => {
    await delay();
    ADMIN_MOVIES.push(movie);
    return movie;
  },
  updateMovie: async (maPhim, updates) => {
    await delay();
    const index = ADMIN_MOVIES.findIndex(m => m.MaPhim === maPhim);
    if (index !== -1) {
      ADMIN_MOVIES[index] = { ...ADMIN_MOVIES[index], ...updates };
      return ADMIN_MOVIES[index];
    }
    throw new Error('Movie not found');
  },

  // Rooms
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
    ROOMS.push(room);
    return room;
  },
  updateRoom: async (maPhong, updates) => {
    await delay();
    const index = ROOMS.findIndex(r => r.MaPhongChieu === maPhong);
    if (index !== -1) {
      ROOMS[index] = { ...ROOMS[index], ...updates };
      return ROOMS[index];
    }
    throw new Error('Room not found');
  },
  deleteRoom: async (maPhong) => {
    await delay();
    const index = ROOMS.findIndex(r => r.MaPhongChieu === maPhong);
    if (index !== -1) {
      // Soft delete: toggle KhaDung or Status
      ROOMS[index].KhaDung = 0;
      ROOMS[index].Status = 'Inactive';
      return true;
    }
    return false;
  },

  // Personnel
  getStaff: async () => {
    await delay();
    return [...STAFF];
  },
  addStaff: async (person) => {
    await delay();
    STAFF.push(person);
    return person;
  },
  updateStaff: async (maNhanVien, updates) => {
    await delay();
    const index = STAFF.findIndex(s => s.MaNhanVien === maNhanVien);
    if (index !== -1) {
      STAFF[index] = { ...STAFF[index], ...updates };
      return STAFF[index];
    }
    throw new Error('Staff not found');
  },

  // Metadata/Constants
  getRoomTypes: async () => {
    await delay();
    return [...ROOM_TYPES];
  },
  addRoomType: async (item) => {
    await delay();
    ROOM_TYPES.push(item);
    return item;
  },
  updateRoomType: async (id, updates) => {
    await delay();
    const index = ROOM_TYPES.findIndex(t => t.MaLoaiPhong === id);
    if (index !== -1) {
      ROOM_TYPES[index] = { ...ROOM_TYPES[index], ...updates };
      return ROOM_TYPES[index];
    }
    throw new Error('Room type not found');
  },
  deleteRoomType: async (id) => {
    await delay();
    const index = ROOM_TYPES.findIndex(t => t.MaLoaiPhong === id);
    if (index !== -1) {
      ROOM_TYPES.splice(index, 1);
      return true;
    }
    return false;
  },

  // Seat Types CRUD
  getSeatTypes: async () => {
    await delay();
    return [...SEAT_TYPES];
  },
  addSeatType: async (item) => {
    await delay();
    SEAT_TYPES.push(item);
    return item;
  },
  updateSeatType: async (id, updates) => {
    await delay();
    const index = SEAT_TYPES.findIndex(t => t.MaLoaiGhe === id);
    if (index !== -1) {
      SEAT_TYPES[index] = { ...SEAT_TYPES[index], ...updates };
      return SEAT_TYPES[index];
    }
    throw new Error('Seat type not found');
  },
  deleteSeatType: async (id) => {
    await delay();
    const index = SEAT_TYPES.findIndex(t => t.MaLoaiGhe === id);
    if (index !== -1) {
      SEAT_TYPES.splice(index, 1);
      return true;
    }
    return false;
  },

  // Day Types CRUD
  getDayTypes: async () => {
    await delay();
    return [...DAY_TYPES];
  },
  addDayType: async (item) => {
    await delay();
    DAY_TYPES.push(item);
    return item;
  },
  updateDayType: async (id, updates) => {
    await delay();
    const index = DAY_TYPES.findIndex(t => t.MaLoaiNgay === id);
    if (index !== -1) {
      DAY_TYPES[index] = { ...DAY_TYPES[index], ...updates };
      return DAY_TYPES[index];
    }
    throw new Error('Day type not found');
  },
  deleteDayType: async (id) => {
    await delay();
    const index = DAY_TYPES.findIndex(t => t.MaLoaiNgay === id);
    if (index !== -1) {
      DAY_TYPES.splice(index, 1);
      return true;
    }
    return false;
  },

  getSeatMaps: async () => SEAT_MAPS,

  // Seat Configuration
  getSeatMapByRoomId: async (roomId) => {
    await delay();
    const room = ROOMS.find(r => r.MaPhongChieu === roomId);
    if (!room) return null;
    return SEAT_MAPS.find(m => m.MaSoDoGhe === room.MaSoDoGhe);
  },
  saveSeatConfig: async (roomId, overrides) => {
    await delay();
    const room = ROOMS.find(r => r.MaPhongChieu === roomId);
    if (room) {
      room.Overrides = overrides;
      return true;
    }
    return false;
  }
};

export default adminService;
