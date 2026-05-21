import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { LayoutGrid, Plus, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';

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
    KhaDung: 1
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
    errors,
    handleChange,
    handleSubmit,
    resetForm
  } = useAdminForm(initialFormState, async (data, { resetForm }) => {
    // Convert KhaDung form value to integer 0/1
    const processedData = {
      ...data,
      KhaDung: parseInt(data.KhaDung, 10),
      SoGhe: getSeatCount(data.MaSoDoGhe)
    };

    if (editingRoom) {
      await adminService.updateRoom(editingRoom.MaPhongChieu, processedData);
      alert("Cập nhật phòng chiếu thành công!");
    } else {
      const newRoom = {
        MaPhongChieu: `PC${String(rooms.length + 1).padStart(2, '0')}`,
        ...processedData
      };
      await adminService.addRoom(newRoom);
      alert("Thêm phòng chiếu mới thành công!");
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
      KhaDung: room.KhaDung
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phòng chiếu ${id} khỏi cơ sở dữ liệu?`)) {
      try {
        const success = await adminService.deleteRoom(id);
        if (success) {
          alert("Xóa phòng chiếu khỏi cơ sở dữ liệu thành công!");
          await loadData();
        }
      } catch (err) {
        alert(`Lỗi khi xóa: ${err.message}`);
      }
    }
  };

  const columns = [
    {
      header: 'Mã phòng chiếu',
      render: (room) => <span className="font-mono text-xs text-red-500 font-bold">{room.MaPhongChieu}</span>
    },
    {
      header: 'Tên phòng chiếu',
      render: (room) => (
        <Link 
          to={`/admin/rooms/${room.MaPhongChieu}/seats`}
          className="font-bold text-white hover:text-red-500 transition-colors"
        >
          {room.TenPhong}
        </Link>
      )
    },
    { header: 'Số ghế', render: (room) => <span className="text-slate-200 font-bold font-mono">{room.SoGhe} ghế</span> },
    {
      header: 'Mã loại phòng',
      render: (room) => {
        const type = roomTypes.find(t => t.MaLoaiPhong === room.MaLoaiPhong);
        return (
          <div className="flex flex-col">
            <span className="font-mono text-xs text-slate-400">{room.MaLoaiPhong}</span>
            <span className="text-[10px] text-slate-500 font-bold">{type?.TenLoaiPhong || 'Chưa rõ'}</span>
          </div>
        );
      }
    },
    { 
      header: 'Mã sơ đồ ghế', 
      render: (room) => <span className="text-slate-400 text-xs font-mono">{room.MaSoDoGhe}</span>
    },
    {
      header: 'Khả dụng',
      render: (room) => (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
          room.KhaDung === 1 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          {room.KhaDung === 1 ? '1 (Khả dụng)' : '0 (Không khả dụng)'}
        </span>
      )
    },
    {
      header: 'Thời gian',
      render: (room) => (
        <div className="flex flex-col text-[10px] text-slate-500 font-mono">
          <span>Tạo: {room.NgayTao || '--:--'}</span>
          <span>Sửa: {room.NgayCapNhat || '--:--'}</span>
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
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Cấu hình ghế"
          >
            <LayoutGrid size={18} />
          </Link>
          <button 
            onClick={() => handleEdit(room)}
            className="p-2 hover:bg-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all cursor-pointer"
            title="Sửa"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(room.MaPhongChieu)}
            className="p-2 hover:bg-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
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
          <p className="text-slate-500 font-medium">Định nghĩa và kiểm soát cơ sở hạ tầng phòng chiếu vật lý.</p>
        </div>
        <button 
          onClick={() => {
            setEditingRoom(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer"
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
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên phòng chiếu (TenPhong)</label>
            <input 
              type="text" 
              name="TenPhong"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-white font-bold"
              value={formData.TenPhong}
              onChange={handleChange}
              placeholder="VD: Phòng Chiếu 01"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã loại phòng (MaLoaiPhong)</label>
              <select 
                name="MaLoaiPhong"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm text-slate-300"
                value={formData.MaLoaiPhong}
                onChange={handleChange}
              >
                {roomTypes.map(type => (
                  <option key={type.MaLoaiPhong} value={type.MaLoaiPhong} className="bg-[#0f1117]">
                    {type.MaLoaiPhong} ({type.TenLoaiPhong})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã sơ đồ ghế (MaSoDoGhe)</label>
              <select 
                name="MaSoDoGhe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm text-slate-300"
                value={formData.MaSoDoGhe}
                onChange={handleChange}
              >
                {seatMaps.map(map => (
                  <option key={map.MaSoDoGhe} value={map.MaSoDoGhe} className="bg-[#0f1117]">
                    {map.MaSoDoGhe} ({map.TongHang}x{map.TongCot})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Số ghế (SoGhe - Tự tính)</label>
              <div className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-500 font-bold font-mono">
                {getSeatCount(formData.MaSoDoGhe)} ghế
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Khả dụng (KhaDung)</label>
              <select 
                name="KhaDung"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm text-slate-300"
                value={formData.KhaDung}
                onChange={handleChange}
              >
                <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
                <option value={0} className="bg-[#0f1117]">0 (Không khả dụng)</option>
              </select>
            </div>
          </div>

          {editingRoom && (
            <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
              <div>Ngày tạo: {editingRoom.NgayTao || '--:--'}</div>
              <div>Ngày cập nhật: {editingRoom.NgayCapNhat || 'Chưa cập nhật'}</div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingRoom(null);
              }}
              className="flex-grow py-3 px-6 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all uppercase tracking-widest text-xs cursor-pointer"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-grow py-3 px-6 rounded-xl font-bold bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs cursor-pointer"
            >
              {editingRoom ? "Cập nhật" : "Thêm phòng"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Rooms;
