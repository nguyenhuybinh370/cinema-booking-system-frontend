import AdminTable from '../Common/AdminTable';
import { Clock, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const ShiftTable = ({ shifts, onEdit, onDelete, onToggleStatus }) => {
  const columns = [
    { header: 'Mã Ca', accessor: 'MaCaLamViec', className: 'text-xs font-mono font-bold text-slate-500' },
    {
      header: 'Tên Ca làm việc',
      render: (shift) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10 shrink-0">
            <Clock size={16} />
          </div>
          <span className="font-bold text-white text-sm">{shift.TenCa}</span>
        </div>
      ),
    },
    {
      header: 'Khung giờ',
      render: (shift) => (
        <span className="font-mono text-sm text-slate-300 font-semibold bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
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
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
          shift.KhaDung === 0
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {shift.KhaDung === 0 ? '0 (Vô hiệu)' : '1 (Khả dụng)'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (shift) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => onToggleStatus(shift)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${shift.KhaDung === 1 ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-500' : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500'}`}
            title={shift.KhaDung === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            {shift.KhaDung === 1 ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} />}
          </button>
          <button onClick={() => onEdit(shift)} className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all cursor-pointer" title="Sửa">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(shift)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all cursor-pointer" title="Xóa">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <AdminTable columns={columns} data={shifts} rowKey="MaCaLamViec" />;
};

export default ShiftTable;
