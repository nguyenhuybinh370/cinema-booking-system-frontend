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
            <input disabled readOnly value={editId} className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-slate-500 font-bold font-mono text-sm" />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên hiển thị</label>
          <input type="text" required placeholder={PLACEHOLDERS[modalCategory]}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-white font-bold text-sm placeholder:text-slate-500"
            value={formData.name} onChange={e => onChange('name', e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Giá phụ thu (đ)</label>
          <input type="number" required placeholder="Nhập số tiền phụ thu..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-white font-bold text-sm font-mono placeholder:text-slate-500"
            value={formData.surcharge} onChange={e => onChange('surcharge', e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả</label>
          <textarea rows={3} placeholder="Nhập mô tả..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-200 text-sm min-h-[80px] placeholder:text-slate-500"
            value={formData.description} onChange={e => onChange('description', e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái khả dụng</label>
          <select value={formData.KhaDung} onChange={e => onChange('KhaDung', parseInt(e.target.value, 10))}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-200 font-bold text-sm [&>option]:bg-[#0a0d14] cursor-pointer">
            <option value={1}>1 (Khả dụng)</option>
            <option value={0}>0 (Chưa khả dụng)</option>
          </select>
        </div>

        {editingItem && (
          <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
            <div>Ngày tạo: {editingItem.NgayTao || '--:--'}</div>
            <div>Ngày cập nhật: {editingItem.NgayCapNhat || 'Chưa cập nhật'}</div>
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t border-white/5">
          <button type="button" onClick={onClose} className="flex-grow py-3 px-6 rounded-xl font-bold text-slate-400 hover:bg-white/5 border border-white/5 hover:border-white/10 active:scale-95 transition-all uppercase tracking-widest text-xs cursor-pointer">Hủy</button>
          <button type="submit" className="flex-grow py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-500/20 text-white active:scale-95 uppercase tracking-widest text-xs cursor-pointer">
            {editingItem ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PricingModal;
