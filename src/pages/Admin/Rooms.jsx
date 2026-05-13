import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { LayoutGrid, Plus, Edit2, Trash2 } from 'lucide-react';

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [seatMaps, setSeatMaps] = useState([]);

  const initialFormState = {
    TenPhong: '',
    MaLoaiPhong: 'LP01',
    MaSoDoGhe: 'SM01',
    Status: 'Active'
  };

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

  const getSeatCount = (seatMapId) => {
    const map = seatMaps.find(m => m.MaSoDoGhe === seatMapId);
    return map ? map.TongHang * map.TongCot : 0;
  };

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    resetForm
  } = useAdminForm(initialFormState, async (data, { resetForm }) => {
    if (editingRoom) {
      await adminService.updateRoom(editingRoom.MaPhongChieu, {
        ...data,
        SoGhe: getSeatCount(data.MaSoDoGhe)
      });
    } else {
      const newRoom = {
        MaPhongChieu: `PC${String(rooms.length + 1).padStart(2, '0')}`,
        ...data,
        SoGhe: getSeatCount(data.MaSoDoGhe),
        KhaDung: 1
      };
      await adminService.addRoom(newRoom);
    }
    
    await loadData();
    setIsModalOpen(false);
    setEditingRoom(null);
    resetForm();
  });

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      TenPhong: room.TenPhong,
      MaLoaiPhong: room.MaLoaiPhong,
      MaSoDoGhe: room.MaSoDoGhe,
      Status: room.Status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này? Các suất chiếu liên quan có thể bị ảnh hưởng.")) {
      const success = await adminService.deleteRoom(id);
      if (success) {
        await loadData();
      }
    }
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
            room.MaLoaiPhong === 'LP03' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
            room.MaLoaiPhong === 'LP02' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-white/5'
          }`}>
            {type?.TenLoaiPhong}
          </span>
        );
      }
    },
    { header: 'Sức chứa', render: (room) => <span className="text-slate-400 font-medium">{room.SoGhe} ghế</span> },
    { header: 'Sơ đồ mẫu', accessor: 'MaSoDoGhe', className: 'text-slate-400 text-sm font-mono' },
    {
      header: 'Trạng thái',
      render: (room) => <StatusBadge status={room.Status} />
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
          <button 
            onClick={() => handleEdit(room)}
            className="p-2 hover:bg-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all"
            title="Sửa"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(room.MaPhongChieu)}
            className="p-2 hover:bg-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all"
            title="Xóa"
          >
            <Trash2 size={18} />
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
          onClick={() => {
            setEditingRoom(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm phòng chiếu
        </button>
      </div>

      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse"></div>
      ) : (
        <AdminTable columns={columns} data={rooms.filter(r => r.KhaDung !== 0)} rowKey="MaPhongChieu" />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingRoom(null);
        }}
        title={editingRoom ? "Cập nhật phòng chiếu" : "Thêm phòng chiếu mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên phòng</label>
            <input 
              type="text" 
              name="TenPhong"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-white font-bold"
              value={formData.TenPhong}
              onChange={handleChange}
              placeholder="VD: Phòng chiếu 01"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loại phòng</label>
              <select 
                name="MaLoaiPhong"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm"
                value={formData.MaLoaiPhong}
                onChange={handleChange}
              >
                {roomTypes.map(type => (
                  <option key={type.MaLoaiPhong} value={type.MaLoaiPhong} className="bg-[#0f1117]">{type.TenLoaiPhong}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sơ đồ mẫu</label>
              <select 
                name="MaSoDoGhe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm"
                value={formData.MaSoDoGhe}
                onChange={handleChange}
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
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Trạng thái vận hành</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="Status" 
                  value="Active"
                  className="w-4 h-4 accent-red-500"
                  checked={formData.Status === 'Active'}
                  onChange={handleChange}
                />
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Sẵn sàng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="Status" 
                  value="Maintenance"
                  className="w-4 h-4 accent-red-500"
                  checked={formData.Status === 'Maintenance'}
                  onChange={handleChange}
                />
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Bảo trì</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingRoom(null);
              }}
              className="flex-grow py-3 px-6 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all uppercase tracking-widest text-xs"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-grow py-3 px-6 rounded-xl font-bold bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs"
            >
              {editingRoom ? "Cập nhật" : "Lưu phòng"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Rooms;
