import Modal from '../Common/Modal';
import { AlertCircle, DollarSign } from 'lucide-react';

const ShowtimeModal = ({
  isOpen, onClose,
  editingShowtime, formData, conflict, submitting,
  movies, rooms, dayTypes,
  onFormChange, onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={editingShowtime
      ? `Cập nhật suất chiếu ${editingShowtime.MaSuatChieu}`
      : 'Thêm suất chiếu mới'}
  >
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Phim */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chọn phim</label>
        <select
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300 font-bold"
          value={formData.MaPhim}
          onChange={e => onFormChange('MaPhim', e.target.value)}
        >
          {movies.map(m => (
            <option key={m.MaPhim} value={m.MaPhim} className="bg-[#0f1117]">
              {m.TenPhim} ({m.ThoiLuong} phút)
            </option>
          ))}
        </select>
      </div>

      {/* Phòng + Loại ngày */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: 'Phòng chiếu', field: 'MaPhongChieu', options: rooms.map(r => ({ value: r.MaPhongChieu, label: r.TenPhong })) },
          { label: 'Loại ngày', field: 'MaLoaiNgay', options: dayTypes.map(d => ({ value: d.MaLoaiNgay, label: d.TenLoaiNgay })) },
        ].map(({ label, field, options }) => (
          <div key={field} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-sm text-slate-300 font-bold"
              value={formData[field]}
              onChange={e => onFormChange(field, e.target.value)}
            >
              {options.map(o => <option key={o.value} value={o.value} className="bg-[#0f1117]">{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Ngày + Giờ bắt đầu + Giờ kết thúc */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày chiếu</label>
          <input type="date" required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-sm text-white font-mono font-bold"
            value={formData.NgayChieu}
            onChange={e => onFormChange('NgayChieu', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giờ chiếu</label>
          <input type="time" required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-sm text-white font-mono font-bold"
            value={formData.GioChieu}
            onChange={e => onFormChange('GioChieu', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest opacity-60">Giờ kết thúc</label>
          <input type="time" readOnly
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-500 font-mono font-bold"
            value={formData.GioKetThuc}
          />
        </div>
      </div>

      {/* Giá vé + Khả dụng */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giá vé cơ bản (VND)</label>
          <div className="relative">
            <input type="number" min="0" required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-red-500 text-sm text-white font-mono font-bold"
              value={formData.GiaVeCoBan}
              onChange={e => onFormChange('GiaVeCoBan', e.target.value)}
            />
            <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Khả dụng</label>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 text-sm text-slate-300 font-bold"
            value={formData.KhaDung}
            onChange={e => onFormChange('KhaDung', parseInt(e.target.value, 10))}
          >
            <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
            <option value={0} className="bg-[#0f1117]">0 (Khóa)</option>
          </select>
        </div>
      </div>

      {/* Timestamps (edit mode) */}
      {editingShowtime && (
        <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
          <div>Ngày tạo: {editingShowtime.NgayTao || '--:--'}</div>
          <div>Ngày cập nhật: {editingShowtime.NgayCapNhat || 'Chưa cập nhật'}</div>
        </div>
      )}

      {/* Conflict warning */}
      {conflict && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-500">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-xs font-bold">⚠️ {conflict}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-white/5">
        <button type="button" onClick={onClose}
          className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 text-xs uppercase tracking-widest text-slate-400 cursor-pointer"
        >
          Hủy
        </button>
        <button type="submit" disabled={!!conflict || submitting}
          className={`flex-grow py-3 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-all shadow-lg ${
            conflict || submitting
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
          }`}
        >
          {submitting ? 'Đang lưu...' : 'Lưu suất chiếu'}
        </button>
      </div>
    </form>
  </Modal>
);

export default ShowtimeModal;
