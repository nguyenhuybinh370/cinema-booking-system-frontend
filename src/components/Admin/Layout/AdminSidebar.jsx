
import { useState } from 'react';
import logo from '../../../assets/logo.png';
import { NavLink } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';
import ConfirmDialog from '../../common/ConfirmDialog';
import {
  LayoutDashboard,
  Film,
  BadgeDollarSign,
  Users,
  CalendarDays,
  BarChart3,
  LogOut,
  Grid3X3,
  Clock,
  UserCheck,
  Receipt
} from 'lucide-react';

const AdminSidebar = () => {
  const userName = localStorage.getItem('userName') || 'Administrator';
  const userRole = localStorage.getItem('userRole') || 'ADMIN';
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  const initials = getInitials(userName);

  const handleLogoutSubmit = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosClient.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      setIsConfirmOpen(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCode");
      window.location.href = "/login";
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/admin/stats' },
    { name: 'Phòng chiếu', icon: LayoutDashboard, path: '/admin/rooms' },
    { name: 'Sơ đồ mẫu', icon: Grid3X3, path: '/admin/seat-templates' },
    { name: 'Phim', icon: Film, path: '/admin/movies' },
    { name: 'Bảng giá', icon: BadgeDollarSign, path: '/admin/pricing' },
    { name: 'Nhân viên', icon: Users, path: '/admin/personnel' },
    { name: 'Ca làm việc', icon: Clock, path: '/admin/shifts' },
    { name: 'Suất chiếu', icon: CalendarDays, path: '/admin/showtimes' },
    { name: 'Khách hàng', icon: UserCheck, path: '/admin/customers' },
    { name: 'Giao dịch', icon: Receipt, path: '/admin/transactions' },
  ];

  return (
    <aside className="w-64 bg-[#0a0d14] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden">
      <div className="p-6 flex-1 flex flex-col overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-8 shrink-0">
          <img src={logo} alt="UIT Cinema Logo" className="h-12 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(239,68,68,0.15)]" />
          <span className="text-lg font-black tracking-widest text-white uppercase bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
            UIT Cinema
          </span>
        </div>

        <nav className="space-y-1.5 flex-grow">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold transition-all duration-200 w-full group min-w-0 border-l-[3px]
                ${isActive
                  ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[inset_0_0_12px_rgba(239,68,68,0.06)]'
                  : 'border-transparent text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'}
              `}
            >
              <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                <item.icon size={18} />
              </span>
              <span className="text-[13px] tracking-wide leading-tight truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5 bg-[#07090f] shrink-0">
        <div className="flex items-center gap-3 mb-6 p-3 bg-white/[0.03] border border-white/5 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.25)] text-sm">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-extrabold text-white truncate max-w-[125px]">{userName}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{userRole}</span>
          </div>
        </div>
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center gap-3.5 px-4 py-3 w-full rounded-xl font-bold text-slate-500 hover:bg-red-500/10 hover:text-red-400 border-l-[3px] border-transparent transition-all duration-200 group cursor-pointer"
        >
          <LogOut size={18} className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="text-[13px] tracking-wide truncate">Đăng xuất</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Quản trị viên?"
        confirmText="Đăng xuất"
        cancelText="Quay lại"
        variant="danger"
        isLoading={isLoggingOut}
        onConfirm={handleLogoutSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </aside>
  );
};

export default AdminSidebar;
