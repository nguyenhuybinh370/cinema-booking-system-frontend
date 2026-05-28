import AdminTable from '../Common/AdminTable';
import { ShieldCheck, Edit2, UserX, UserCheck } from 'lucide-react';

const PersonnelTable = ({ staff, onEdit, onToggleStatus, onOpenPermissions }) => {
  const columns = [
    { header: 'Mã NV', accessor: 'MaNhanVien', className: 'text-xs font-mono font-bold text-red-500' },
    { header: 'Mã Tài Khoản', accessor: 'MaTaiKhoan', className: 'text-xs font-mono font-bold text-slate-500' },
    {
      header: 'Nhân viên',
      render: (person) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold border border-white/10 shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.15)] text-sm">
            {person.HoTen.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">{person.HoTen}</span>
            <span className="text-[10px] text-slate-500 font-mono font-bold">{person.Email}</span>
          </div>
        </div>
      ),
    },
    { header: 'Số điện thoại', accessor: 'SoDienThoai', className: 'text-sm text-slate-400 font-mono' },
    { header: 'Ngày sinh', accessor: 'NgaySinh', className: 'text-sm text-slate-400 font-mono' },
    { header: 'Giới tính', render: (p) => <span className="text-sm text-slate-400">{p.GioiTinh === 1 ? 'Nam' : 'Nữ'}</span> },
    { header: 'Chức vụ', accessor: 'ChucVu', className: 'text-sm text-slate-400 font-medium' },

    {
      header: 'Trạng thái',
      render: (person) => (
        person.KhaDung === 1 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
            Khả dụng
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-500/20 bg-red-500/10 text-red-400 uppercase tracking-wider select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0" />
            Đã Khóa
          </span>
        )
      ),
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (person) => (
        <div className="flex justify-end gap-1.5">
          <button onClick={() => onEdit(person)} className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer" title="Sửa">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onToggleStatus(person)}
            className={`p-2 border border-transparent rounded-xl transition-all cursor-pointer ${
              person.KhaDung === 1 
                ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400 hover:border-red-500/10' 
                : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/10'
            }`}
            title={person.KhaDung === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            {person.KhaDung === 1 ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return <AdminTable columns={columns} data={staff} rowKey="MaNhanVien" />;
};

export default PersonnelTable;
