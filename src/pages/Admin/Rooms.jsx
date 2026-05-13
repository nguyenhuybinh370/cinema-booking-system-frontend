import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import { ROOMS, ROOM_TYPES, SEAT_MAPS } from '../../constants/adminMockData';

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState(ROOMS);
  const [formData, setFormData] = useState({
    name: '',
    typeId: '2D',
    seatMapId: 'SM01',
    status: 'Active'
  });

  const handleToggleStatus = (id) => {
    if (window.confirm("Các suất chiếu đã lên lịch sẽ không bị ảnh hưởng. Xác nhận?")) {
      setRooms(rooms.map(room => 
        room.id === id 
          ? { ...room, status: room.status === 'Active' ? 'Maintenance' : 'Active' } 
          : room
      ));
    }
  };

  const getSeatCount = (seatMapId) => {
    const map = SEAT_MAPS.find(m => m.id === seatMapId);
    return map ? map.rows * map.cols : 0;
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const newRoom = {
      id: `PC${String(rooms.length + 1).padStart(2, '0')}`,
      ...formData,
      seatCount: getSeatCount(formData.seatMapId),
      available: true
    };
    setRooms([...rooms, newRoom]);
    setIsModalOpen(false);
    setFormData({ name: '', typeId: '2D', seatMapId: 'SM01', status: 'Active' });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý phòng chiếu</h1>
          <p className="text-slate-500">Quản lý danh sách phòng chiếu vật lý trong rạp.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
        >
          + Thêm phòng chiếu
        </button>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tên phòng</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Loại phòng</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Sức chứa</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Sơ đồ ghế</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-bold text-white">{room.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    room.typeId === 'IMAX' ? 'bg-amber-500/10 text-amber-500' : 
                    room.typeId === '3D' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {room.typeId}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{room.seatCount} ghế</td>
                <td className="px-6 py-4 text-slate-400">
                  {SEAT_MAPS.find(m => m.id === room.seatMapId)?.name}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    room.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {room.status === 'Active' ? 'Đang sử dụng' : 'Đang bảo trì'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sửa</button>
                    <button 
                      onClick={() => handleToggleStatus(room.id)}
                      className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Đổi trạng thái
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
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tên phòng</label>
            <input 
              type="text" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Phòng chiếu 01"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Loại phòng</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors"
                value={formData.typeId}
                onChange={e => setFormData({ ...formData, typeId: e.target.value })}
              >
                {ROOM_TYPES.map(type => (
                  <option key={type.id} value={type.id} className="bg-[#0f1117]">{type.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sơ đồ ghế</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors"
                value={formData.seatMapId}
                onChange={e => setFormData({ ...formData, seatMapId: e.target.value })}
              >
                {SEAT_MAPS.map(map => (
                  <option key={map.id} value={map.id} className="bg-[#0f1117]">{map.name} ({map.rows}x{map.cols})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sức chứa (Tự động)</label>
            <input 
              type="text" 
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-500"
              value={`${getSeatCount(formData.seatMapId)} ghế`}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider block">Trạng thái</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="status" 
                  className="w-4 h-4 accent-red-500"
                  checked={formData.status === 'Active'}
                  onChange={() => setFormData({ ...formData, status: 'Active' })}
                />
                <span className="text-slate-300 group-hover:text-white transition-colors">Đang sử dụng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="status" 
                  className="w-4 h-4 accent-red-500"
                  checked={formData.status === 'Maintenance'}
                  onChange={() => setFormData({ ...formData, status: 'Maintenance' })}
                />
                <span className="text-slate-300 group-hover:text-white transition-colors">Đang bảo trì</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-grow py-3 px-6 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-grow py-3 px-6 rounded-xl font-bold bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              Lưu phòng chiếu
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Rooms;

