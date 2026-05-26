import AdminTable from '../Common/AdminTable';
import { ShieldCheck, Edit2, UserX, UserCheck } from 'lucide-react';

const PersonnelTable = ({ staff, onEdit, onToggleStatus, onOpenPermissions }) => {
  const columns = [
    { header: 'Mã NV', accessor: 'MaNhanVien', className: 'text-xs font-mono font-bold text-slate-500' },
    { header: 'Mã Tài Khoản', accessor: 'MaTaiKhoan', className: 'text-xs font-mono font-bold text-slate-500' },
    {
      header: 'Nhân viên',
      render: (person) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-white/10 shrink-0">
            {person.HoTen.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">{person.HoTen}</span>
            <span className="text-xs text-slate-500 font-mono">{person.Email}</span>
          </div>
        </div>
      ),
    },
    { header: 'Số điện thoại', accessor: 'SoDienThoai', className: 'text-sm text-slate-400 font-mono' },
    { header: 'Ngày sinh', accessor: 'NgaySinh', className: 'text-sm text-slate-400 font-mono' },
    { header: 'Giới tính', render: (p) => <span className="text-sm text-slate-400">{p.GioiTinh === 1 ? 'Nam' : 'Nữ'}</span> },
    { header: 'Chức vụ', accessor: 'ChucVu', className: 'text-sm text-slate-400 font-medium' },
    {
      header: 'Vai trò',
      render: (person) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
          person.Role === 'Admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          person.Role === 'Manager' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          'bg-slate-500/10 text-slate-400 border border-white/5'
        }`}>{person.Role}</span>
      ),
    },
    {
      header: 'Trạng thái',
      render: (person) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
          person.KhaDung === 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {person.KhaDung === 0 ? '0 (Khóa)' : '1 (Khả dụng)'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (person) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => onOpenPermissions(person)} className="p-2 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500 rounded-xl transition-all cursor-pointer" title="Phân quyền">
            <ShieldCheck size={18} />
          </button>
          <button onClick={() => onEdit(person)} className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all cursor-pointer" title="Sửa">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onToggleStatus(person)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${person.KhaDung === 1 ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-500' : 'hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500'}`}
            title={person.KhaDung === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            {person.KhaDung === 1 ? <UserX size={18} /> : <UserCheck size={18} />}
          </button>
        </div>
      ),
    },
  ];

  return <AdminTable columns={columns} data={staff} rowKey="MaNhanVien" />;
};

export default PersonnelTable;
