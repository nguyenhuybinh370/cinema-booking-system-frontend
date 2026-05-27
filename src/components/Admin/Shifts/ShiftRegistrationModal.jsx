import Modal from '../Common/Modal';
import { AlertTriangle } from 'lucide-react';

const ShiftRegistrationModal = ({ isOpen, onClose, formData, onChange, onSubmit, staffList, shifts }) => {
  const activeShifts = shifts.filter(s => s.KhaDung === 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đăng ký ca làm việc mới">
      {staffList.length === 0 || activeShifts.length === 0 ? (
        <div className="space-y-4 text-center py-6">
          <AlertTriangle className="text-amber-500 mx-auto" size={48} />
          <p className="text-slate-400 text-sm">Cần có ít nhất 1 nhân sự đang hoạt động và 1 ca làm việc khả dụng để phân ca.</p>
          <button onClick={onClose}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest border border-white/5 cursor-pointer">
            Đóng
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Staff select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chọn Nhân viên</label>
            <select required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-300 text-sm font-bold [&>option]:bg-[#0a0d14]"
              value={formData.MaNhanVien} onChange={e => onChange('MaNhanVien', e.target.value)}
            >
              {staffList.map(s => (
                <option key={s.MaNhanVien} value={s.MaNhanVien}>
                  {s.HoTen} ({s.ChucVu}) - {s.MaNhanVien}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Shift select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chọn Ca làm việc</label>
              <select required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-300 text-sm font-bold [&>option]:bg-[#0a0d14]"
                value={formData.MaCaLamViec} onChange={e => onChange('MaCaLamViec', e.target.value)}
              >
                {activeShifts.map(s => (
                  <option key={s.MaCaLamViec} value={s.MaCaLamViec}>
                    {s.TenCa} ({s.GioBatDau.substring(0, 5)} - {s.GioKetThuc.substring(0, 5)})
                  </option>
                ))}
              </select>
            </div>
            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày làm việc</label>
              <input type="date" required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-300 text-sm font-mono"
                value={formData.NgayLam} onChange={e => onChange('NgayLam', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Repeat type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kiểu lặp lại</label>
              <select className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-300 text-sm [&>option]:bg-[#0a0d14]"
                value={formData.KieuLap} onChange={e => onChange('KieuLap', e.target.value)}
              >
                <option value="">Không lặp</option>
                <option value={1}>Hàng tuần</option>
                <option value={2}>Hàng ngày</option>
              </select>
            </div>
            {/* End date for repeat */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày lặp cuối</label>
              <input type="date"
                disabled={formData.KieuLap === ''} required={formData.KieuLap !== ''}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-300 text-sm font-mono disabled:opacity-30 disabled:cursor-not-allowed"
                value={formData.NgayLap} onChange={e => onChange('NgayLap', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ghi chú</label>
            <textarea rows="2" placeholder="VD: Trực quầy vé, hỗ trợ soát vé..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-white text-sm"
              value={formData.GhiChu} onChange={e => onChange('GhiChu', e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button type="button" onClick={onClose}
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400">
              Hủy
            </button>
            <button type="submit"
              className="flex-grow py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 transition-all text-xs uppercase tracking-widest cursor-pointer">
              Đăng ký ca
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ShiftRegistrationModal;
