import Modal from '../Common/Modal';

const CATEGORY_LABELS = { room: 'Loại phòng', seat: 'Hạng ghế', day: 'Loại ngày' };
const PLACEHOLDERS = { room: 'VD: IMAX', seat: 'VD: VIP', day: 'VD: Ngày cuối tuần' };

const PricingModal = ({ isOpen, onClose, modalCategory, editingItem, formData, onChange, onSubmit }) => {
  const catLabel = CATEGORY_LABELS[modalCategory] || '';
  const editId = editingItem?.MaLoaiPhong || editingItem?.MaLoaiGhe || editingItem?.MaLoaiNgay;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? `Chỉnh sửa ${catLabel}` : `Thêm ${catLabel} mới`}>
      <form onSubmit={onSubmit} className="space-y-6">
        {editingItem && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã cấu hình (Không thể sửa)</label>
            <input disabled readOnly value={editId} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-500 font-bold font-mono text-sm" />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên hiển thị</label>
          <input type="text" required placeholder={PLACEHOLDERS[modalCategory]}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white font-bold text-sm"
            value={formData.name} onChange={e => onChange('name', e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Giá phụ thu (đ)</label>
          <input type="number" required placeholder="Nhập số tiền phụ thu..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white font-bold text-sm font-mono"
            value={formData.surcharge} onChange={e => onChange('surcharge', e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả</label>
          <textarea rows={3} placeholder="Nhập mô tả..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-slate-300 text-sm min-h-[80px]"
            value={formData.description} onChange={e => onChange('description', e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái khả dụng</label>
          <select value={formData.KhaDung} onChange={e => onChange('KhaDung', parseInt(e.target.value, 10))}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-slate-300 text-sm">
            <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
            <option value={0} className="bg-[#0f1117]">0 (Chưa khả dụng)</option>
          </select>
        </div>

        {editingItem && (
          <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
            <div>Ngày tạo: {editingItem.NgayTao || '--:--'}</div>
            <div>Ngày cập nhật: {editingItem.NgayCapNhat || 'Chưa cập nhật'}</div>
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t border-white/5">
          <button type="button" onClick={onClose} className="flex-grow py-3 px-6 rounded-xl font-bold text-slate-400 hover:bg-white/5 uppercase tracking-widest text-xs cursor-pointer">Hủy</button>
          <button type="submit" className="flex-grow py-3 px-6 rounded-xl font-bold bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs cursor-pointer text-white">
            {editingItem ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PricingModal;
