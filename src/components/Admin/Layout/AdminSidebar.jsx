
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  BadgeDollarSign, 
  Users, 
  CalendarDays, 
  BarChart3,
  LogOut
} from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Phòng chiếu', icon: LayoutDashboard, path: '/admin/rooms' },
    { name: 'Phim', icon: Film, path: '/admin/movies' },
    { name: 'Bảng giá', icon: BadgeDollarSign, path: '/admin/pricing' },
    { name: 'Nhân sự', icon: Users, path: '/admin/personnel' },
    { name: 'Suất chiếu', icon: CalendarDays, path: '/admin/showtimes' },
    { name: 'Thống kê', icon: BarChart3, path: '/admin/stats' },
  ];

  return (
    <aside className="w-64 bg-[#0f1117] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black">C+</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Admin Panel</span>
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
            HB
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Huy Bình</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-500 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
