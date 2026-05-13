import { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import { STAFF } from '../../constants/adminMockData';
import { Search, ShieldCheck, UserX, UserCheck, Edit2, X } from 'lucide-react';

const Personnel = () => {
  const [staff] = useState(STAFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermPanelOpen, setIsPermPanelOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Manager': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const permissions = [
    'Quản lý phòng chiếu', 'Quản lý phim', 'Cấu hình sơ đồ ghế', 
    'Cấu hình bảng giá', 'Quản lý nhân sự', 'Quản lý suất chiếu', 'Xem thống kê'
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý nhân sự</h1>
          <p className="text-slate-500">Quản lý hồ sơ và phân quyền truy cập cho nhân viên.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
        >
          + Thêm nhân viên
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="flex-grow flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
          <Search size={20} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email hoặc số điện thoại..." 
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full"
          />
        </div>
        <select className="bg-white/5 border border-white/5 rounded-2xl px-6 py-3 text-sm font-bold text-slate-300 focus:outline-none focus:border-red-500 transition-all">
          <option value="All" className="bg-[#0f1117]">Tất cả vai trò</option>
          <option value="Admin" className="bg-[#0f1117]">Admin</option>
          <option value="Manager" className="bg-[#0f1117]">Quản lý</option>
          <option value="Staff" className="bg-[#0f1117]">Nhân viên</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Nhân viên</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Chức vụ</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Vai trò</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {staff.map((person) => (
              <tr key={person.MaNhanVien} className={`group hover:bg-white/[0.02] transition-colors ${person.Status === 'Inactive' ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-white/10">
                      {person.HoTen.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{person.HoTen}</span>
                      <span className="text-xs text-slate-500">{person.Email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{person.ChucVu}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getRoleBadge(person.Role)}`}>
                    {person.Role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${person.Status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></div>
                    <span className="text-xs font-medium text-slate-300">{person.Status === 'Active' ? 'Hoạt động' : 'Vô hiệu hóa'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setSelectedStaff(person); setIsPermPanelOpen(true); }}
                      className="p-2 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500 rounded-xl transition-all"
                      title="Phân quyền"
                    >
                      <ShieldCheck size={18} />
                    </button>
                    <button className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all" title="Sửa">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all" title="Vô hiệu hóa">
                      {person.Status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Panel (Slide-in) */}
      {isPermPanelOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPermPanelOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#0f1117] h-screen shadow-2xl border-l border-white/10 p-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Phân quyền hệ thống</h3>
              <button onClick={() => setIsPermPanelOpen(false)} className="p-2 hover:bg-white/5 rounded-xl"><X size={20} /></button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl mb-8 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-xl">
                {selectedStaff?.HoTen.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white">{selectedStaff?.HoTen}</h4>
                <p className="text-xs text-slate-500">{selectedStaff?.Role} • {selectedStaff?.ChucVu}</p>
              </div>
            </div>


            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Danh sách quyền hạn</p>
              {permissions.map((perm, idx) => (
                <label key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] cursor-pointer border border-transparent hover:border-white/5 transition-all group">
                  <span className="text-sm text-slate-300 group-hover:text-white">{perm}</span>
                  <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-white/5 accent-red-500" defaultChecked={idx < 3} />
                </label>
              ))}
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <button className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all uppercase tracking-widest text-xs">
                Cập nhật quyền hạn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm nhân viên mới">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Họ tên</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all" placeholder="Nguyễn Văn A" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số điện thoại</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email đăng nhập</label>
            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all" placeholder="email@cinema.com" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chức vụ</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vai trò hệ thống</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all">
                <option className="bg-[#0f1117]">Staff</option>
                <option className="bg-[#0f1117]">Manager</option>
                <option className="bg-[#0f1117]">Admin</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mật khẩu ban đầu</label>
            <input type="password" disabled className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-600" value="CinemaPlus@2024" />
            <p className="text-[10px] text-slate-600 italic">Mật khẩu mặc định sẽ được gửi qua email nhân viên.</p>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest">Hủy</button>
            <button type="submit" className="flex-grow py-4 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest">Lưu hồ sơ</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Personnel;
