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

  // Metadata/Constants
  getRoomTypes: async () => ROOM_TYPES,
  getSeatTypes: async () => SEAT_TYPES,
  getDayTypes: async () => DAY_TYPES,
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
