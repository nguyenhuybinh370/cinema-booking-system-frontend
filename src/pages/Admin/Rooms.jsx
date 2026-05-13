import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { LayoutGrid, Plus, MoreVertical } from 'lucide-react';

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [seatMaps, setSeatMaps] = useState([]);
  const [formData, setFormData] = useState({
    TenPhong: '',
    MaLoaiPhong: 'LP01',
    MaSoDoGhe: 'SM01',
    Status: 'Active'
  });

  const loadData = async () => {
    const [roomsData, typesData, mapsData] = await Promise.all([
      adminService.getRooms(),
      adminService.getRoomTypes(),
      adminService.getSeatMaps()
    ]);
    setRooms(roomsData);
    setRoomTypes(typesData);
    setSeatMaps(mapsData);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const [roomsData, typesData, mapsData] = await Promise.all([
        adminService.getRooms(),
        adminService.getRoomTypes(),
        adminService.getSeatMaps()
      ]);
      if (!ignore) {
        setRooms(roomsData);
        setRoomTypes(typesData);
        setSeatMaps(mapsData);
        setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, []);

  const handleToggleStatus = async (id) => {
    if (window.confirm("Các suất chiếu đã lên lịch sẽ không bị ảnh hưởng. Xác nhận?")) {
      const room = rooms.find(r => r.MaPhongChieu === id);
      const newStatus = room.Status === 'Active' ? 'Maintenance' : 'Active';
      await adminService.updateRoom(id, { Status: newStatus });
      loadData();
    }
  };

  const getSeatCount = (seatMapId) => {
    const map = seatMaps.find(m => m.MaSoDoGhe === seatMapId);
    return map ? map.TongHang * map.TongCot : 0;
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const newRoom = {
      MaPhongChieu: `PC${String(rooms.length + 1).padStart(2, '0')}`,
      ...formData,
      SoGhe: getSeatCount(formData.MaSoDoGhe),
      KhaDung: 1
    };
    // In a real app, we'd call adminService.addRoom
    // For now, let's just push to rooms and update state
    setRooms([...rooms, newRoom]);
    setIsModalOpen(false);
    setFormData({ TenPhong: '', MaLoaiPhong: 'LP01', MaSoDoGhe: 'SM01', Status: 'Active' });
  };

  const columns = [
    {
      header: 'Tên phòng',
      render: (room) => (
        <Link 
          to={`/admin/rooms/${room.MaPhongChieu}/seats`}
          className="font-bold text-white hover:text-red-500 transition-colors"
        >
          {room.TenPhong}
        </Link>
      )
    },
    {
      header: 'Loại phòng',
      render: (room) => {
        const type = roomTypes.find(t => t.MaLoaiPhong === room.MaLoaiPhong);
        return (
          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
            room.MaLoaiPhong === 'LP03' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
            room.MaLoaiPhong === 'LP02' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-white/5'
          }`}>
            {type?.TenLoaiPhong}
          </span>
        );
      }
    },
    { header: 'Sức chứa', render: (room) => <span className="text-slate-400 font-medium">{room.SoGhe} ghế</span> },
    { header: 'Sơ đồ ghế', accessor: 'MaSoDoGhe', className: 'text-slate-400 text-sm font-mono' },
    {
      header: 'Trạng thái',
      render: (room) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={room.Status} />
        </div>
      )
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (room) => (
        <div className="flex justify-end gap-2">
          <Link 
            to={`/admin/rooms/${room.MaPhongChieu}/seats`}
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all"
            title="Cấu hình ghế"
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
      )
    }
  ];

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

      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse"></div>
      ) : (
        <AdminTable columns={columns} data={rooms} rowKey="MaPhongChieu" />
      )}

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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-white font-bold"
              value={formData.TenPhong}
              onChange={e => setFormData({ ...formData, TenPhong: e.target.value })}
              placeholder="VD: Phòng chiếu 01"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loại phòng</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm"
                value={formData.MaLoaiPhong}
                onChange={e => setFormData({ ...formData, MaLoaiPhong: e.target.value })}
              >
                {roomTypes.map(type => (
                  <option key={type.MaLoaiPhong} value={type.MaLoaiPhong} className="bg-[#0f1117]">{type.TenLoaiPhong}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sơ đồ mẫu</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm"
                value={formData.MaSoDoGhe}
                onChange={e => setFormData({ ...formData, MaSoDoGhe: e.target.value })}
              >
                {seatMaps.map(map => (
                  <option key={map.MaSoDoGhe} value={map.MaSoDoGhe} className="bg-[#0f1117]">{map.MaSoDoGhe} ({map.TongHang}x{map.TongCot})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sức chứa dự kiến</label>
            <div className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-500 font-bold">
              {getSeatCount(formData.MaSoDoGhe)} ghế
            </div>
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

          <div className="flex gap-4 pt-4 border-t border-white/5">
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
