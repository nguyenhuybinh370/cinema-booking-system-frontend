import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { LayoutGrid, Plus, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [seatMaps, setSeatMaps] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const initialFormState = {
    TenPhong: '',
    MaLoaiPhong: '',
    MaSoDoGhe: '',
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
    const processedData = {
      ...data,
      KhaDung: parseInt(data.KhaDung, 10),
      SoGhe: getSeatCount(data.MaSoDoGhe)
    };

    if (editingRoom) {
      await adminService.updateRoom(editingRoom.MaPhongChieu, processedData);
      showSuccess("Cập nhật phòng chiếu thành công!");
    } else {
      await adminService.addRoom(processedData);
      showSuccess("Thêm phòng chiếu mới thành công!");
    }
    
    await loadData();
    setIsModalOpen(false);
    setEditingRoom(null);
    resetForm();
  });

  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setFormData({
      TenPhong: '',
      MaLoaiPhong: roomTypes[0]?.MaLoaiPhong || '',
      MaSoDoGhe: seatMaps[0]?.MaSoDoGhe || '',
      KhaDung: 1
    });
    setIsModalOpen(true);
  };

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

  const handleDelete = (id) => {
    setConfirmState({ isOpen: true, data: id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmState.data;
    setIsDeleting(true);
    try {
      const success = await adminService.deleteRoom(id);
      if (success) {
        showSuccess("Xóa phòng chiếu khỏi cơ sở dữ liệu thành công!");
        await loadData();
      }
    } catch (err) {
      showError(`Lỗi khi xóa: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setConfirmState({ isOpen: false, data: null });
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
      render: (room) => <StatusBadge status={room.KhaDung} />
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
      <AdminPageHeader
        title="Quản lý phòng chiếu"
        subtitle="Định nghĩa và kiểm soát cơ sở hạ tầng phòng chiếu vật lý."
        action={
          <button 
            onClick={handleOpenAddModal}
            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            Thêm phòng chiếu
          </button>
        }
      />

      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse"></div>
      ) : (
        <AdminTable columns={columns} data={rooms} rowKey="MaPhongChieu" />
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
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-white font-bold placeholder:text-slate-500"
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
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-slate-200 font-bold [&>option]:bg-[#0a0d14] cursor-pointer"
                value={formData.MaLoaiPhong}
                onChange={handleChange}
              >
                {roomTypes.map(type => (
                  <option key={type.MaLoaiPhong} value={type.MaLoaiPhong}>
                    {type.MaLoaiPhong} ({type.TenLoaiPhong})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã sơ đồ ghế (MaSoDoGhe)</label>
              <select 
                name="MaSoDoGhe"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-slate-200 font-bold [&>option]:bg-[#0a0d14] cursor-pointer"
                value={formData.MaSoDoGhe}
                onChange={handleChange}
              >
                {seatMaps.map(map => (
                  <option key={map.MaSoDoGhe} value={map.MaSoDoGhe}>
                    {map.MaSoDoGhe} ({map.TongHang}x{map.TongCot})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Số ghế (SoGhe - Tự tính)</label>
              <div className="w-full bg-white/[0.04] border border-white/5 rounded-xl py-3.5 px-4 text-slate-400 font-bold font-mono">
                {getSeatCount(formData.MaSoDoGhe)} ghế
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Khả dụng (KhaDung)</label>
              <select 
                name="KhaDung"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-slate-200 font-bold [&>option]:bg-[#0a0d14] cursor-pointer"
                value={formData.KhaDung}
                onChange={handleChange}
              >
                <option value={1}>1 (Khả dụng)</option>
                <option value={0}>0 (Chưa khả dụng)</option>
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
              className="flex-grow py-3 px-6 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all border border-white/5 hover:border-white/10 active:scale-95 uppercase tracking-widest text-xs cursor-pointer"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-grow py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-500/20 text-white active:scale-95 uppercase tracking-widest text-xs cursor-pointer"
            >
              {editingRoom ? "Cập nhật" : "Thêm phòng"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Xóa phòng chiếu"
        message={`Bạn có chắc chắn muốn xóa phòng chiếu ${confirmState.data} khỏi cơ sở dữ liệu?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, data: null })}
      />
    </AdminLayout>
  );
};

export default Rooms;
