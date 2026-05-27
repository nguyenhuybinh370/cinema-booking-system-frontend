
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
    { name: 'Phòng chiếu', icon: LayoutDashboard, path: '/admin/rooms' },
    { name: 'Sơ đồ mẫu', icon: Grid3X3, path: '/admin/seat-templates' },
    { name: 'Phim', icon: Film, path: '/admin/movies' },
    { name: 'Bảng giá', icon: BadgeDollarSign, path: '/admin/pricing' },
    { name: 'Nhân viên', icon: Users, path: '/admin/personnel' },
    { name: 'Ca làm việc', icon: Clock, path: '/admin/shifts' },
    { name: 'Suất chiếu', icon: CalendarDays, path: '/admin/showtimes' },
    { name: 'Khách hàng', icon: UserCheck, path: '/admin/customers' },
    { name: 'Giao dịch', icon: Receipt, path: '/admin/transactions' },
    { name: 'Thống kê', icon: BarChart3, path: '/admin/stats' },
  ];

  return (
    <aside className="w-64 bg-[#0f1117] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="UIT Cinema Logo" className="h-12 w-auto object-contain" />
          <span className="text-lg font-black tracking-widest text-white uppercase bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
            UIT Cinema
          </span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                ${isActive
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white font-bold">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white truncate max-w-[120px]">{userName}</span>
            <span className="text-xs text-slate-500">{userRole}</span>
          </div>
        </div>
        <button onClick={() => setIsConfirmOpen(true)} className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
          <LogOut size={20} />
          <span className="font-medium">Đăng xuất</span>
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
