import AdminTable from '../Common/AdminTable';
import { X, Trash2, RotateCcw } from 'lucide-react';

const ShiftDetailTable = ({ registrations, onToggleStatus, onDelete }) => {
  const columns = [
    { header: 'Mã Đăng Ký', accessor: 'MaChiTietCa', className: 'text-xs font-mono font-bold text-red-500' },
    {
      header: 'Nhân viên',
      render: (reg) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold font-mono shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            {reg.HoTen.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">{reg.HoTen}</span>
            <span className="text-[10px] text-slate-500 font-bold">{reg.ChucVu}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Ca đăng ký',
      render: (reg) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-300">{reg.TenCa}</span>
          <span className="text-xs text-slate-500 font-mono">({reg.GioBatDau.substring(0, 5)} - {reg.GioKetThuc.substring(0, 5)})</span>
        </div>
      ),
    },
    {
      header: 'Ngày làm việc',
      render: (reg) => (
        <span className="text-xs text-slate-300 font-mono font-bold bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/5">
          {reg.NgayLam}
        </span>
      ),
    },
    { header: 'Ghi chú', accessor: 'GhiChu', className: 'text-xs text-slate-400 max-w-[150px] truncate' },
    {
      header: 'Trạng thái',
      render: (reg) => (
        reg.KhaDung === 1 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
            Đăng ký
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-500/20 bg-red-500/10 text-red-400 uppercase tracking-wider select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0" />
            Đã hủy
          </span>
        )
      ),
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (reg) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => onToggleStatus(reg)}
            className={`p-2 border border-transparent rounded-xl transition-all cursor-pointer ${reg.KhaDung === 1 ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400 hover:border-red-500/10' : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/10'}`}
            title={reg.KhaDung === 1 ? 'Hủy đăng ký' : 'Đăng ký lại'}
          >
            {reg.KhaDung === 1 ? <X size={16} className="text-red-400" /> : <RotateCcw size={16} className="text-emerald-400" />}
          </button>
          <button onClick={() => onDelete(reg)} className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 rounded-xl text-red-400 hover:text-red-400 transition-all cursor-pointer" title="Xóa vĩnh viễn">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <AdminTable columns={columns} data={registrations} rowKey="MaChiTietCa" />;
};

export default ShiftDetailTable;
