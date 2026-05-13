import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import { ROOMS, ROOM_TYPES, SEAT_MAPS } from '../../constants/adminMockData';
import { LayoutGrid, Plus, MoreVertical } from 'lucide-react';

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState(ROOMS);
  const [formData, setFormData] = useState({
    TenPhong: '',
    MaLoaiPhong: 'LP01',
    MaSoDoGhe: 'SM01',
    Status: 'Active'
  });

  const handleToggleStatus = (id) => {
    if (window.confirm("Các suất chiếu đã lên lịch sẽ không bị ảnh hưởng. Xác nhận?")) {
      setRooms(rooms.map(room => 
        room.MaPhongChieu === id 
          ? { ...room, Status: room.Status === 'Active' ? 'Maintenance' : 'Active' } 
          : room
      ));
    }
  };

  const getSeatCount = (seatMapId) => {
    const map = SEAT_MAPS.find(m => m.MaSoDoGhe === seatMapId);
    return map ? map.TongHang * map.TongCot : 0;
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const newRoom = {
      MaPhongChieu: `PC${String(rooms.length + 1).padStart(2, '0')}`,
      ...formData,
      SoGhe: getSeatCount(formData.MaSoDoGhe),
      KhaDung: 1
    };
    setRooms([...rooms, newRoom]);
    setIsModalOpen(false);
    setFormData({ TenPhong: '', MaLoaiPhong: 'LP01', MaSoDoGhe: 'SM01', Status: 'Active' });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý phòng chiếu</h1>
          <p className="text-slate-500 font-medium">Danh sách các phòng chiếu vật lý trong hệ thống.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm phòng chiếu
        </button>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tên phòng</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Loại phòng</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Sức chứa</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Sơ đồ ghế</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rooms.map((room) => (
<<<<<<< Updated upstream
              <tr key={room.MaPhongChieu} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-bold text-white">{room.TenPhong}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    room.MaLoaiPhong === 'LP03' ? 'bg-amber-500/10 text-amber-500' : 
                    room.MaLoaiPhong === 'LP02' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'
=======
              <tr key={room.MaPhongChieu} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <Link 
                    to={`/admin/rooms/${room.MaPhongChieu}/seats`}
                    className="font-bold text-white hover:text-red-500 transition-colors"
                  >
                    {room.TenPhong}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                    room.MaLoaiPhong === 'LP03' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    room.MaLoaiPhong === 'LP02' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-white/5'
>>>>>>> Stashed changes
                  }`}>
                    {ROOM_TYPES.find(t => t.MaLoaiPhong === room.MaLoaiPhong)?.TenLoaiPhong}
                  </span>
                </td>
<<<<<<< Updated upstream
                <td className="px-6 py-4 text-slate-400">{room.SoGhe} ghế</td>
                <td className="px-6 py-4 text-slate-400">
                  {SEAT_MAPS.find(m => m.MaSoDoGhe === room.MaSoDoGhe)?.MaSoDoGhe}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    room.Status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {room.Status === 'Active' ? 'Đang sử dụng' : 'Đang bảo trì'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sửa</button>
                    <button 
                      onClick={() => handleToggleStatus(room.MaPhongChieu)}
                      className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
=======
                <td className="px-6 py-4 text-slate-400 font-medium">{room.SoGhe} ghế</td>
                <td className="px-6 py-4 text-slate-400 text-sm font-mono">
                  {room.MaSoDoGhe}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${room.Status === 'Active' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                    <span className="text-xs font-bold text-slate-300">
                      {room.Status === 'Active' ? 'Sẵn sàng' : 'Bảo trì'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link 
                      to={`/admin/rooms/${room.MaPhongChieu}/seats`}
                      className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all"
                      title="Cấu hình ghế"
>>>>>>> Stashed changes
                    >
                      <LayoutGrid size={18} />
                    </Link>
                    <button className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(room.MaPhongChieu)}
                      className="text-xs font-bold text-red-500 hover:underline px-2"
                    >
                      {room.Status === 'Active' ? 'Bảo trì' : 'Kích hoạt'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Thêm phòng chiếu mới"
      >
        <form onSubmit={handleAddRoom} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên phòng</label>
            <input 
              type="text" 
              required
<<<<<<< Updated upstream
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors"
=======
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-white font-bold"
>>>>>>> Stashed changes
              value={formData.TenPhong}
              onChange={e => setFormData({ ...formData, TenPhong: e.target.value })}
              placeholder="VD: Phòng chiếu 01"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loại phòng</label>
              <select 
<<<<<<< Updated upstream
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors"
=======
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm"
>>>>>>> Stashed changes
                value={formData.MaLoaiPhong}
                onChange={e => setFormData({ ...formData, MaLoaiPhong: e.target.value })}
              >
                {ROOM_TYPES.map(type => (
                  <option key={type.MaLoaiPhong} value={type.MaLoaiPhong} className="bg-[#0f1117]">{type.TenLoaiPhong}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sơ đồ mẫu</label>
              <select 
<<<<<<< Updated upstream
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors"
=======
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm"
>>>>>>> Stashed changes
                value={formData.MaSoDoGhe}
                onChange={e => setFormData({ ...formData, MaSoDoGhe: e.target.value })}
              >
                {SEAT_MAPS.map(map => (
                  <option key={map.MaSoDoGhe} value={map.MaSoDoGhe} className="bg-[#0f1117]">{map.MaSoDoGhe} ({map.TongHang}x{map.TongCot})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
<<<<<<< Updated upstream
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sức chứa (Tự động)</label>
            <input 
              type="text" 
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-500"
              value={`${getSeatCount(formData.MaSoDoGhe)} ghế`}
            />
=======
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sức chứa dự kiến</label>
            <div className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-500 font-bold">
              {getSeatCount(formData.MaSoDoGhe)} ghế
            </div>
>>>>>>> Stashed changes
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Trạng thái ban đầu</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="status" 
                  className="w-4 h-4 accent-red-500"
                  checked={formData.Status === 'Active'}
                  onChange={() => setFormData({ ...formData, Status: 'Active' })}
                />
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Sẵn sàng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="status" 
                  className="w-4 h-4 accent-red-500"
                  checked={formData.Status === 'Maintenance'}
                  onChange={() => setFormData({ ...formData, Status: 'Maintenance' })}
                />
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Bảo trì</span>
              </label>
            </div>
          </div>

<<<<<<< Updated upstream

          <div className="flex gap-4 pt-4">
=======
          <div className="flex gap-4 pt-4 border-t border-white/5">
>>>>>>> Stashed changes
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-grow py-3 px-6 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all uppercase tracking-widest text-xs"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-grow py-3 px-6 rounded-xl font-bold bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs"
            >
              Lưu phòng
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Rooms;
