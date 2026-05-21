import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import adminService from '../../services/adminService';
import { Edit2, Plus, Trash2 } from 'lucide-react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const PriceTable = ({ title, data, typeKey, nameKey, onAdd, onEdit, onDelete }) => (
  <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-xl h-full flex flex-col">
    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
      <h3 className="font-bold text-white uppercase tracking-widest text-xs">{title}</h3>
      <button 
        onClick={onAdd}
        className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1 hover:bg-white/5 rounded-lg"
      >
        <Plus size={16} />
      </button>
    </div>
    <div className="flex-grow overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-white/5">
            <th className="px-6 py-3">Tên</th>
            <th className="px-6 py-3">Phụ thu</th>
            <th className="px-6 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr key={item[typeKey]} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4 text-sm font-bold text-slate-300">
                <div>
                  <div>{item[nameKey]}</div>
                  {item.MoTa && <div className="text-[10px] text-slate-500 font-normal mt-0.5">{item.MoTa}</div>}
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-mono text-emerald-500">
                {item.GiaPhuThu > 0 ? `+${formatPrice(item.GiaPhuThu)}` : formatPrice(item.GiaPhuThu)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(item)}
                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(item[typeKey])}
                    className="p-2 hover:bg-white/5 rounded-lg text-red-500 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Pricing = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [dayTypes, setDayTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState(''); // 'room', 'seat', 'day'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surcharge: 0,
    description: ''
  });

  const [calc, setCalc] = useState({
    basePrice: 85000,
    roomType: '',
    seatType: '',
    dayType: ''
  });

  const loadData = async () => {
    const [rooms, seats, days] = await Promise.all([
      adminService.getRoomTypes(),
      adminService.getSeatTypes(),
      adminService.getDayTypes()
    ]);
    setRoomTypes(rooms);
    setSeatTypes(seats);
    setDayTypes(days);
    
    // update calc keys if empty
    setCalc(prev => ({
      ...prev,
      roomType: prev.roomType || rooms[0]?.MaLoaiPhong || '',
      seatType: prev.seatType || seats[0]?.MaLoaiGhe || '',
      dayType: prev.dayType || days[0]?.MaLoaiNgay || ''
    }));
  };

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      await loadData();
      if (!ignore) {
        setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, []);

  const getSurcharge = (list, key, id) => list.find(item => item[key] === id)?.GiaPhuThu || 0;

  const total = calc.basePrice + 
                getSurcharge(roomTypes, 'MaLoaiPhong', calc.roomType) + 
                getSurcharge(seatTypes, 'MaLoaiGhe', calc.seatType) + 
                getSurcharge(dayTypes, 'MaLoaiNgay', calc.dayType);

  // Handlers for CRUD
  const handleOpenAdd = (category) => {
    setModalCategory(category);
    setEditingItem(null);
    setFormData({
      name: '',
      surcharge: 0,
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category, item) => {
    setModalCategory(category);
    setEditingItem(item);
    if (category === 'room') {
      setFormData({
        name: item.TenLoaiPhong,
        surcharge: item.GiaPhuThu,
        description: item.MoTa || ''
      });
    } else if (category === 'seat') {
      setFormData({
        name: item.TenLoaiGhe,
        surcharge: item.GiaPhuThu,
        description: item.MoTa || ''
      });
    } else {
      setFormData({
        name: item.TenLoaiNgay,
        surcharge: item.GiaPhuThu,
        description: item.MoTa || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (category, id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mục này?")) return;
    setLoading(true);
    try {
      if (category === 'room') {
        await adminService.deleteRoomType(id);
      } else if (category === 'seat') {
        await adminService.deleteSeatType(id);
      } else {
        await adminService.deleteDayType(id);
      }
      await loadData();
    } catch (e) {
      alert("Lỗi khi xóa: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        // Edit Mode
        if (modalCategory === 'room') {
          await adminService.updateRoomType(editingItem.MaLoaiPhong, {
            TenLoaiPhong: formData.name,
            GiaPhuThu: parseFloat(formData.surcharge) || 0,
            MoTa: formData.description
          });
        } else if (modalCategory === 'seat') {
          await adminService.updateSeatType(editingItem.MaLoaiGhe, {
            TenLoaiGhe: formData.name,
            GiaPhuThu: parseFloat(formData.surcharge) || 0,
            MoTa: formData.description
          });
        } else {
          await adminService.updateDayType(editingItem.MaLoaiNgay, {
            TenLoaiNgay: formData.name,
            GiaPhuThu: parseFloat(formData.surcharge) || 0,
            MoTa: formData.description
          });
        }
      } else {
        // Add Mode
        const code = Math.floor(1000 + Math.random() * 9000);
        if (modalCategory === 'room') {
          await adminService.addRoomType({
            MaLoaiPhong: `LP-${code}`,
            TenLoaiPhong: formData.name,
            GiaPhuThu: parseFloat(formData.surcharge) || 0,
            MoTa: formData.description,
            KhaDung: 1
          });
        } else if (modalCategory === 'seat') {
          await adminService.addSeatType({
            MaLoaiGhe: `LG-${code}`,
            TenLoaiGhe: formData.name,
            GiaPhuThu: parseFloat(formData.surcharge) || 0,
            MoTa: formData.description,
            KhaDung: 1
          });
        } else {
          await adminService.addDayType({
            MaLoaiNgay: `LN-${code}`,
            TenLoaiNgay: formData.name,
            GiaPhuThu: parseFloat(formData.surcharge) || 0,
            MoTa: formData.description,
            KhaDung: 1
          });
        }
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      alert("Lỗi khi lưu thông tin: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    if (modalCategory === 'room') return 'Loại phòng';
    if (modalCategory === 'seat') return 'Hạng ghế';
    return 'Loại ngày';
  };

  if (loading && roomTypes.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-500 animate-pulse font-bold">
          Đang tải cấu hình bảng giá...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-glow">Cấu hình bảng giá</h1>
        <p className="text-slate-500">Định nghĩa chính sách Dynamic Pricing cho hệ thống rạp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <PriceTable 
          title="Phụ thu loại phòng" 
          data={roomTypes} 
          typeKey="MaLoaiPhong" 
          nameKey="TenLoaiPhong" 
          onAdd={() => handleOpenAdd('room')}
          onEdit={(item) => handleOpenEdit('room', item)}
          onDelete={(id) => handleDelete('room', id)}
        />
        <PriceTable 
          title="Phụ thu hạng ghế" 
          data={seatTypes} 
          typeKey="MaLoaiGhe" 
          nameKey="TenLoaiGhe" 
          onAdd={() => handleOpenAdd('seat')}
          onEdit={(item) => handleOpenEdit('seat', item)}
          onDelete={(id) => handleDelete('seat', id)}
        />
        <PriceTable 
          title="Phụ thu loại ngày" 
          data={dayTypes} 
          typeKey="MaLoaiNgay" 
          nameKey="TenLoaiNgay" 
          onAdd={() => handleOpenAdd('day')}
          onEdit={(item) => handleOpenEdit('day', item)}
          onDelete={(id) => handleDelete('day', id)}
        />
      </div>

      {/* Price Preview */}
      <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500 opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity"></div>
        
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <div className="w-2 h-8 bg-red-500 rounded-full"></div>
          Preview công thức giá
        </h3>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Controls */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loại phòng</label>
              <select 
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300"
                value={calc.roomType}
                onChange={e => setCalc({ ...calc, roomType: e.target.value })}
              >
                {roomTypes.map(t => <option key={t.MaLoaiPhong} value={t.MaLoaiPhong} className="bg-[#0f1117]">{t.TenLoaiPhong}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hạng ghế</label>
              <select 
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300"
                value={calc.seatType}
                onChange={e => setCalc({ ...calc, seatType: e.target.value })}
              >
                {seatTypes.map(t => <option key={t.MaLoaiGhe} value={t.MaLoaiGhe} className="bg-[#0f1117]">{t.TenLoaiGhe}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loại ngày</label>
              <select 
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300"
                value={calc.dayType}
                onChange={e => setCalc({ ...calc, dayType: e.target.value })}
              >
                {dayTypes.map(t => <option key={t.MaLoaiNgay} value={t.MaLoaiNgay} className="bg-[#0f1117]">{t.TenLoaiNgay}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giá cơ bản (đ)</label>
              <input 
                type="number"
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white font-bold"
                value={calc.basePrice}
                onChange={e => setCalc({ ...calc, basePrice: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Result */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="space-y-3 font-mono text-sm border-l border-white/5 pl-10">
              <div className="flex justify-between text-slate-400">
                <span>Giá vé cơ sở:</span>
                <span>{formatPrice(calc.basePrice)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>+ Phụ thu phòng ({roomTypes.find(t => t.MaLoaiPhong === calc.roomType)?.TenLoaiPhong}):</span>
                <span>{formatPrice(getSurcharge(roomTypes, 'MaLoaiPhong', calc.roomType))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>+ Phụ thu ghế ({seatTypes.find(t => t.MaLoaiGhe === calc.seatType)?.TenLoaiGhe}):</span>
                <span>{formatPrice(getSurcharge(seatTypes, 'MaLoaiGhe', calc.seatType))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>+ Phụ thu ngày ({dayTypes.find(t => t.MaLoaiNgay === calc.dayType)?.TenLoaiNgay}):</span>
                <span>{formatPrice(getSurcharge(dayTypes, 'MaLoaiNgay', calc.dayType))}</span>
              </div>
              <div className="h-[1px] bg-white/10 my-4"></div>
              <div className="flex justify-between text-2xl font-black text-white">
                <span className="uppercase tracking-tighter italic">Tổng dự kiến:</span>
                <span className="text-red-500">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Chỉnh sửa ${getCategoryTitle()}` : `Thêm ${getCategoryTitle()} mới`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên hiển thị</label>
            <input 
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-white font-bold"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder={modalCategory === 'room' ? 'VD: IMAX' : modalCategory === 'seat' ? 'VD: VIP' : 'VD: Ngày cuối tuần'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Giá phụ thu (đ)</label>
            <input 
              type="number"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-white font-bold"
              value={formData.surcharge}
              onChange={e => setFormData({ ...formData, surcharge: e.target.value })}
              placeholder="Nhập số tiền phụ thu..."
            />
          </div>

          {modalCategory !== 'seat' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-slate-300 text-sm min-h-[80px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả..."
              />
            </div>
          )}

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
              {editingItem ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Pricing;
