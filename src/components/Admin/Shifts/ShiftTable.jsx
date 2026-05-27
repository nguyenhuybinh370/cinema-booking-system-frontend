import AdminTable from '../Common/AdminTable';
import { Clock, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const ShiftTable = ({ shifts, onEdit, onDelete, onToggleStatus }) => {
  const columns = [
    { header: 'Mã Ca', accessor: 'MaCaLamViec', className: 'text-xs font-mono font-bold text-red-500' },
    {
      header: 'Tên Ca làm việc',
      render: (shift) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10 shrink-0">
            <Clock size={15} />
          </div>
          <span className="font-bold text-white text-sm">{shift.TenCa}</span>
        </div>
      ),
    },
    {
      header: 'Khung giờ',
      render: (shift) => (
        <span className="font-mono text-xs text-slate-300 font-bold bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/5">
          {shift.GioBatDau.substring(0, 5)} - {shift.GioKetThuc.substring(0, 5)}
        </span>
      ),
    },
    {
      header: 'Số người tối đa',
      render: (shift) => <span className="text-sm text-slate-400 font-bold font-mono">{shift.SoNguoiToiDa} người</span>,
    },
    {
      header: 'Trạng thái',
      render: (shift) => (
        shift.KhaDung === 1 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
            Khả dụng
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-500/20 bg-red-500/10 text-red-400 uppercase tracking-wider select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0" />
            Vô hiệu
          </span>
        )
      ),
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (shift) => (
        <div className="flex justify-end gap-1.5">
          <button onClick={() => onToggleStatus(shift)}
            className={`p-2 border border-transparent rounded-xl transition-all cursor-pointer ${shift.KhaDung === 1 ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400' : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400'}`}
            title={shift.KhaDung === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            {shift.KhaDung === 1 ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} className="text-slate-500" />}
          </button>
          <button onClick={() => onEdit(shift)} className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer" title="Sửa">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(shift)} className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 rounded-xl text-red-400 hover:text-red-400 transition-all cursor-pointer" title="Xóa">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <AdminTable columns={columns} data={shifts} rowKey="MaCaLamViec" />;
};

export default ShiftTable;
