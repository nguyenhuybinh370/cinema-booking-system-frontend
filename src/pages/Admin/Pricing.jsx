import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import PriceTable from '../../components/Admin/Pricing/PriceTable';
import PricingModal from '../../components/Admin/Pricing/PricingModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

const formatPrice = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const Pricing = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [dayTypes, setDayTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', surcharge: 0, description: '', KhaDung: 1 });

  const [calc, setCalc] = useState({ basePrice: 85000, roomType: '', seatType: '', dayType: '' });
  const [confirmState, setConfirmState] = useState({ isOpen: false, category: '', id: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    const [rooms, seats, days] = await Promise.all([
      adminService.getRoomTypes(), adminService.getSeatTypes(), adminService.getDayTypes(),
    ]);
    setRoomTypes(rooms); setSeatTypes(seats); setDayTypes(days);
    setCalc(prev => ({
      ...prev,
      roomType: prev.roomType || rooms[0]?.MaLoaiPhong || '',
      seatType: prev.seatType || seats[0]?.MaLoaiGhe || '',
      dayType: prev.dayType || days[0]?.MaLoaiNgay || '',
    }));
  };

  useEffect(() => {
    let ignore = false;
    loadData().then(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const getSurcharge = (list, key, id) => list.find(x => x[key] === id)?.GiaPhuThu || 0;
  const total = calc.basePrice + getSurcharge(roomTypes, 'MaLoaiPhong', calc.roomType)
    + getSurcharge(seatTypes, 'MaLoaiGhe', calc.seatType) + getSurcharge(dayTypes, 'MaLoaiNgay', calc.dayType);

  const openAdd = (cat) => {
    setModalCategory(cat); setEditingItem(null);
    setFormData({ name: '', surcharge: 0, description: '', KhaDung: 1 });
    setIsModalOpen(true);
  };
  const openEdit = (cat, item) => {
    setModalCategory(cat); setEditingItem(item);
    setFormData({ name: item.TenLoaiPhong || item.TenLoaiGhe || item.TenLoaiNgay || '', surcharge: item.GiaPhuThu || 0, description: item.MoTa || '', KhaDung: item.KhaDung ?? 1 });
    setIsModalOpen(true);
  };
  const handleDelete = (cat, id) => {
    setConfirmState({ isOpen: true, category: cat, id });
  };

  const handleConfirmDelete = async () => {
    const { category, id } = confirmState;
    setIsDeleting(true);
    try {
      if (category === 'room') await adminService.deleteRoomType(id);
      else if (category === 'seat') await adminService.deleteSeatType(id);
      else await adminService.deleteDayType(id);
      showSuccess('Xóa thành công!');
      await loadData();
    } catch (e) {
      showError('Lỗi khi xóa: ' + e.message);
    } finally {
      setIsDeleting(false);
      setConfirmState({ isOpen: false, category: '', id: '' });
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const base = { GiaPhuThu: parseFloat(formData.surcharge) || 0, MoTa: formData.description?.trim() || null, KhaDung: parseInt(formData.KhaDung, 10) };
      const namePatch = modalCategory === 'room' ? { TenLoaiPhong: formData.name } : modalCategory === 'seat' ? { TenLoaiGhe: formData.name } : { TenLoaiNgay: formData.name };
      if (editingItem) {
        const id = editingItem.MaLoaiPhong || editingItem.MaLoaiGhe || editingItem.MaLoaiNgay;
        if (modalCategory === 'room') await adminService.updateRoomType(id, { ...namePatch, ...base });
        else if (modalCategory === 'seat') await adminService.updateSeatType(id, { ...namePatch, ...base });
        else await adminService.updateDayType(id, { ...namePatch, ...base });
        showSuccess('Cập nhật cấu hình thành công!');
      } else {
        if (modalCategory === 'room') await adminService.addRoomType({ ...namePatch, ...base });
        else if (modalCategory === 'seat') await adminService.addSeatType({ ...namePatch, ...base });
        else await adminService.addDayType({ ...namePatch, ...base });
        showSuccess('Thêm cấu hình mới thành công!');
      }
      await loadData(); setIsModalOpen(false);
    } catch (err) { showError('Lỗi khi lưu: ' + err.message); }
    finally { setLoading(false); }
  };

  if (loading && roomTypes.length === 0) return (
    <AdminLayout><div className="flex items-center justify-center h-64 text-slate-500 animate-pulse font-bold">Đang tải cấu hình bảng giá...</div></AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white text-glow">Cấu hình bảng giá</h1>
        <p className="text-slate-500">Định nghĩa chính sách Dynamic Pricing cho hệ thống rạp.</p>
      </div>

      {/* 3 price tables */}
      <div className="space-y-8 mb-12">
        {[
          { title: 'Phụ thu loại phòng', data: roomTypes, typeKey: 'MaLoaiPhong', nameKey: 'TenLoaiPhong', cat: 'room' },
          { title: 'Phụ thu hạng ghế', data: seatTypes, typeKey: 'MaLoaiGhe', nameKey: 'TenLoaiGhe', cat: 'seat' },
          { title: 'Phụ thu loại ngày', data: dayTypes, typeKey: 'MaLoaiNgay', nameKey: 'TenLoaiNgay', cat: 'day' },
        ].map(({ title, data, typeKey, nameKey, cat }) => (
          <PriceTable key={cat} title={title} data={data} typeKey={typeKey} nameKey={nameKey}
            onAdd={() => openAdd(cat)} onEdit={(item) => openEdit(cat, item)} onDelete={(id) => handleDelete(cat, id)} />
        ))}
      </div>

      {/* Price preview calculator */}
      <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500 opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity" />
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <div className="w-2 h-8 bg-red-500 rounded-full" /> Preview công thức giá
        </h3>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Loại phòng', key: 'roomType', list: roomTypes, optKey: 'MaLoaiPhong', optLabel: 'TenLoaiPhong' },
              { label: 'Hạng ghế', key: 'seatType', list: seatTypes, optKey: 'MaLoaiGhe', optLabel: 'TenLoaiGhe' },
              { label: 'Loại ngày', key: 'dayType', list: dayTypes, optKey: 'MaLoaiNgay', optLabel: 'TenLoaiNgay' },
            ].map(({ label, key, list, optKey, optLabel }) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                <select value={calc[key]} onChange={e => setCalc(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-sm text-slate-300">
                  {list.map(t => <option key={t[optKey]} value={t[optKey]} className="bg-[#0f1117]">{t[optLabel]}</option>)}
                </select>
              </div>
            ))}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giá cơ bản (đ)</label>
              <input type="number" value={calc.basePrice} onChange={e => setCalc(p => ({ ...p, basePrice: parseInt(e.target.value, 10) || 0 }))}
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm text-white font-bold" />
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="space-y-3 font-mono text-sm border-l border-white/5 pl-10">
              {[
                { label: 'Giá vé cơ sở:', val: formatPrice(calc.basePrice) },
                { label: `+ Phụ thu phòng (${roomTypes.find(t => t.MaLoaiPhong === calc.roomType)?.TenLoaiPhong}):`, val: formatPrice(getSurcharge(roomTypes, 'MaLoaiPhong', calc.roomType)) },
                { label: `+ Phụ thu ghế (${seatTypes.find(t => t.MaLoaiGhe === calc.seatType)?.TenLoaiGhe}):`, val: formatPrice(getSurcharge(seatTypes, 'MaLoaiGhe', calc.seatType)) },
                { label: `+ Phụ thu ngày (${dayTypes.find(t => t.MaLoaiNgay === calc.dayType)?.TenLoaiNgay}):`, val: formatPrice(getSurcharge(dayTypes, 'MaLoaiNgay', calc.dayType)) },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-slate-400"><span>{label}</span><span>{val}</span></div>
              ))}
              <div className="h-px bg-white/10 my-4" />
              <div className="flex justify-between text-2xl font-black text-white">
                <span className="uppercase tracking-tighter italic">Tổng dự kiến:</span>
                <span className="text-red-500">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        modalCategory={modalCategory} editingItem={editingItem} formData={formData}
        onChange={(k, v) => setFormData(p => ({ ...p, [k]: v }))}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Xóa cấu hình phụ thu"
        message="Bạn có chắc chắn muốn xóa mục này khỏi cơ sở dữ liệu?"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, category: '', id: '' })}
      />
    </AdminLayout>
  );
};

export default Pricing;
