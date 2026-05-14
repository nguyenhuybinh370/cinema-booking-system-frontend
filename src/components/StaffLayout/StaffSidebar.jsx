import { NavLink } from "react-router-dom";
import {
  Ticket,
  Scan,
  LogOut,
  LayoutDashboard,
  User,
  Calendar,
} from "lucide-react";

const StaffSidebar = () => {
  const menuItems = [
    {
      title: "Tổng quan",
      path: "/staff/dashboard",
      icon: <LayoutDashboard size={22} />,
    },
    {
      title: "Bán vé",
      path: "/staff/sell-ticket",
      icon: <Ticket size={22} />,
    },
    {
      title: "Soát vé",
      path: "/staff/check-in",
      icon: <Scan size={22} />,
    },
    {
      title: "Lịch làm việc",
      path: "/staff/schedule",
      icon: <Calendar size={22} />,
    },
    {
      title: "Cá nhân",
      path: "/staff/profile",
      icon: <User size={22} />,
    },
  ];

  return (
    <div className="w-72 h-screen glass-effect border-r border-white/10 flex flex-col z-50">
      {/* Logo Area */}
      <div className="p-8 border-b border-white/10">
        <h1 className="text-2xl font-black tracking-tighter uppercase text-glow italic">
          Cinema <span className="text-[var(--btn-neon)]">Staff</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-[var(--btn-neon)] text-slate-900 shadow-[0_0_20px_rgba(253,224,71,0.3)] font-bold scale-[1.02]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">
              {item.icon}
            </span>
            <span className="text-sm uppercase tracking-widest font-semibold">
              {item.title}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Area */}
      <div className="p-6 mt-auto border-t border-white/10">
        <button className="flex items-center gap-4 px-5 py-4 w-full text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300">
          <LogOut size={22} />
          <span className="text-sm uppercase tracking-widest font-semibold">
            Đăng xuất
          </span>
        </button>
      </div>
    </div>
  );
};

export default StaffSidebar;
