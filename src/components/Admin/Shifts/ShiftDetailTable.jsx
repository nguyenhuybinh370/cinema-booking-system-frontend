import AdminTable from '../Common/AdminTable';
import { X, Trash2, RotateCcw } from 'lucide-react';

const ShiftDetailTable = ({ registrations, onToggleStatus, onDelete }) => {
  const columns = [
    { header: 'Mã Đăng Ký', accessor: 'MaChiTietCa', className: 'text-xs font-mono font-bold text-slate-500' },
    {
      header: 'Nhân viên',
      render: (reg) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold font-mono">
            {reg.HoTen.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">{reg.HoTen}</span>
            <span className="text-[10px] text-slate-500 font-medium">{reg.ChucVu}</span>
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
        <span className="text-sm text-slate-300 font-mono font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
          {reg.NgayLam}
        </span>
      ),
    },
    { header: 'Ghi chú', accessor: 'GhiChu', className: 'text-xs text-slate-400 max-w-[150px] truncate' },
    {
      header: 'Trạng thái',
      render: (reg) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
          reg.KhaDung === 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {reg.KhaDung === 0 ? 'Đã hủy' : 'Đăng ký'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (reg) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onToggleStatus(reg)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${reg.KhaDung === 1 ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-500' : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500'}`}
            title={reg.KhaDung === 1 ? 'Hủy đăng ký' : 'Đăng ký lại'}
          >
            {reg.KhaDung === 1 ? <X size={16} className="text-red-400" /> : <RotateCcw size={16} className="text-emerald-400" />}
          </button>
          <button onClick={() => onDelete(reg)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all cursor-pointer" title="Xóa vĩnh viễn">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <AdminTable columns={columns} data={registrations} rowKey="MaChiTietCa" />;
};

export default ShiftDetailTable;
