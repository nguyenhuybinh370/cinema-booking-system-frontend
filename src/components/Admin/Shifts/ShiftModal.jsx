import Modal from '../Common/Modal';

const ShiftModal = ({ isOpen, onClose, editingShift, formData, onChange, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingShift ? 'Sửa thông tin ca làm việc' : 'Thêm ca làm việc mới'}>
    <form onSubmit={onSubmit} className="space-y-6">
      {editingShift && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mã ca (Không thể sửa)</label>
          <input disabled className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-slate-500 font-mono text-sm font-bold"
            value={editingShift.MaCaLamViec} readOnly />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tên ca làm việc</label>
        <input type="text" required placeholder="VD: Ca Sáng, Ca Chiều, Ca Tối"
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white font-bold text-sm"
          value={formData.TenCa} onChange={e => onChange('TenCa', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { label: 'Giờ bắt đầu', field: 'GioBatDau' },
          { label: 'Giờ kết thúc', field: 'GioKetThuc' },
        ].map(({ label, field }) => (
          <div key={field} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
            <input type="time" required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-slate-300 text-sm font-mono"
              value={formData[field]} onChange={e => onChange(field, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số người tối đa</label>
          <input type="number" min="1" required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-white font-bold font-mono text-sm"
            value={formData.SoNguoiToiDa} onChange={e => onChange('SoNguoiToiDa', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-slate-300 text-sm"
            value={formData.KhaDung} onChange={e => onChange('KhaDung', parseInt(e.target.value, 10))}
          >
            <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
            <option value={0} className="bg-[#0f1117]">0 (Vô hiệu)</option>
          </select>
        </div>
      </div>

      {editingShift && (
        <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
          <div>Ngày tạo: {editingShift.NgayTao || '--:--'}</div>
          <div>Ngày cập nhật: {editingShift.NgayCapNhat || 'Chưa cập nhật'}</div>
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <button type="button" onClick={onClose}
          className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 text-xs uppercase tracking-widest cursor-pointer text-slate-400">
          Hủy
        </button>
        <button type="submit"
          className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest cursor-pointer">
          Lưu lại
        </button>
      </div>
    </form>
  </Modal>
);

export default ShiftModal;
