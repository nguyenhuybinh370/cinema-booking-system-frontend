import axiosClient from '../../api/axiosClient';

const getAisles = (cols) => {
  if (cols <= 6) return [];
  if (cols <= 10) return [3, 8];
  return [Math.floor(cols / 3) + 1, Math.floor(cols * 2 / 3) + 1];
};

const seatService = {
  getSeatMaps: async () => {
    const data = await axiosClient.get('/admin/so-do-ghe');
    return data.map(r => ({
      MaSoDoGhe: r.MaSoDo,
      TenSoDo: r.TenSoDo,
      TongHang: r.SoHang,
      TongCot: r.SoCot,
      CauTruc: JSON.stringify({ aisles: { rows: [], cols: getAisles(r.SoCot) } }),
      KhaDung: r.KhaDung ? 1 : 0
    }));
  },

  getSeatMapByRoomId: async (roomId) => {
    const room = await axiosClient.get(`/admin/phong-chieu/${roomId}`);
    const template = await axiosClient.get(`/admin/so-do-ghe/${room.MaSoDo}`);
    return {
      MaSoDoGhe: template.MaSoDo,
      TenSoDo: template.TenSoDo,
      TongHang: template.SoHang,
      TongCot: template.SoCot,
      CauTruc: JSON.stringify({ aisles: { rows: [], cols: getAisles(template.SoCot) } }),
      KhaDung: template.KhaDung ? 1 : 0
    };
  },

  getSeatsByRoom: async (roomId) => {
    const data = await axiosClient.get(`/admin/phong-chieu/${roomId}/ghe`);
    return data.map(s => ({
      MaGhe: s.MaGhe,
      ViTriDay: s.ViTriDay,
      ViTriCot: s.ViTriCot,
      MaLoaiGhe: s.MaLoaiGhe,
      KhaDung: s.KhaDung ? 1 : 0
    }));
  },

  saveSeatConfig: async (roomId, overrides) => {
    const ghes = Object.entries(overrides)
      .filter(([_, value]) => value.MaGhe) // Must have MaGhe (UUID)
      .map(([_, value]) => ({
        maGhe: value.MaGhe,
        maLoaiGhe: value.MaLoaiGhe,
        khaDung: value.KhaDung === 1
      }));

    if (ghes.length > 0) {
      await axiosClient.put(`/admin/phong-chieu/${roomId}/ghe`, { ghes });
      return true;
    }
    return false;
  },

  addSeatMap: async (data) => {
    const payload = {
      TenSoDo: data.TenSoDo || data.MaSoDoGhe || `Sơ đồ ${data.TongHang}x${data.TongCot}`,
      SoHang: Number(data.TongHang),
      SoCot: Number(data.TongCot)
    };
    const res = await axiosClient.post('/admin/so-do-ghe', payload);
    return {
      MaSoDoGhe: res.MaSoDo,
      TenSoDo: res.TenSoDo,
      TongHang: res.SoHang,
      TongCot: res.SoCot,
      CauTruc: JSON.stringify({ aisles: { rows: [], cols: getAisles(res.SoCot) } }),
      KhaDung: res.KhaDung ? 1 : 0
    };
  },

  updateSeatMap: async (id, data) => {
    const payload = {
      TenSoDo: data.TenSoDo || data.MaSoDoGhe || `Sơ đồ ${data.TongHang}x${data.TongCot}`,
      SoHang: Number(data.TongHang),
      SoCot: Number(data.TongCot),
      KhaDung: data.KhaDung === 1
    };
    const res = await axiosClient.put(`/admin/so-do-ghe/${id}`, payload);
    return {
      MaSoDoGhe: res.MaSoDo,
      TenSoDo: res.TenSoDo,
      TongHang: res.SoHang,
      TongCot: res.SoCot,
      CauTruc: JSON.stringify({ aisles: { rows: [], cols: getAisles(res.SoCot) } }),
      KhaDung: res.KhaDung ? 1 : 0
    };
  },

  deleteSeatMap: async (id) => {
    await axiosClient.delete(`/admin/so-do-ghe/${id}`);
    return true;
  }
};

export default seatService;
