import axiosClient from '../../api/axiosClient';

const mapRoom = (r) => ({
  MaPhongChieu: r.MaPhong,
  TenPhong: r.TenPhong,
  SoGhe: (r.soHang && r.soCot) ? (r.soHang * r.soCot) : (r.SoGhe || 0),
  MaLoaiPhong: r.MaLoaiPhong,
  MaSoDoGhe: r.MaSoDo,
  KhaDung: r.KhaDung ? 1 : 0,
  NgayTao: r.NgayTao ? new Date(r.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : null,
  NgayCapNhat: r.NgayCapNhat ? new Date(r.NgayCapNhat).toISOString().replace('T', ' ').substring(0, 19) : null,
});

const mapRoomType = (t) => ({
  MaLoaiPhong: t.MaLoaiPhong,
  TenLoaiPhong: t.TenLoaiPhong,
  GiaPhuThu: parseFloat(t.PhuThu),
  MoTa: t.MoTa || `Loại phòng ${t.TenLoaiPhong}`,
  KhaDung: t.KhaDung ? 1 : 0,
  NgayTao: t.NgayTao ? new Date(t.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : null,
  NgayCapNhat: t.NgayCapNhat ? new Date(t.NgayCapNhat).toISOString().replace('T', ' ').substring(0, 19) : null,
});

const roomService = {
  getRooms: async () => {
    const data = await axiosClient.get('/admin/phong-chieu');
    return data.map(mapRoom);
  },
  getRoomById: async (id) => {
    const data = await axiosClient.get(`/admin/phong-chieu/${id}`);
    return mapRoom(data);
  },
  addRoom: async (room) => {
    const payload = {
      TenPhong: room.TenPhong,
      MaLoaiPhong: room.MaLoaiPhong,
      MaSoDo: room.MaSoDoGhe,
      KhaDung: room.KhaDung === 1,
    };
    const data = await axiosClient.post('/admin/phong-chieu', payload);
    return mapRoom(data);
  },
  updateRoom: async (maPhong, updates) => {
    const payload = {
      TenPhong: updates.TenPhong,
      MaLoaiPhong: updates.MaLoaiPhong,
      MaSoDo: updates.MaSoDoGhe,
      KhaDung: updates.KhaDung === 1,
    };
    const data = await axiosClient.put(`/admin/phong-chieu/${maPhong}`, payload);
    return mapRoom(data);
  },
  deleteRoom: async (maPhong) => {
    await axiosClient.delete(`/admin/phong-chieu/${maPhong}`);
    return true;
  },

  getRoomTypes: async () => {
    const data = await axiosClient.get('/admin/loai-phong');
    return data.map(mapRoomType);
  },
  addRoomType: async (item) => {
    const payload = {
      TenLoaiPhong: item.TenLoaiPhong,
      PhuThu: Number(item.GiaPhuThu),
    };
    const data = await axiosClient.post('/admin/loai-phong', payload);
    return mapRoomType(data);
  },
  updateRoomType: async (id, updates) => {
    const payload = {
      ...(updates.TenLoaiPhong !== undefined && { TenLoaiPhong: updates.TenLoaiPhong }),
      ...(updates.GiaPhuThu !== undefined && { PhuThu: Number(updates.GiaPhuThu) }),
      ...(updates.KhaDung !== undefined && { KhaDung: updates.KhaDung === 1 }),
    };
    const data = await axiosClient.put(`/admin/loai-phong/${id}`, payload);
    return mapRoomType(data);
  },
  deleteRoomType: async (id) => {
    await axiosClient.delete(`/admin/loai-phong/${id}`);
    return true;
  }
};

export default roomService;
