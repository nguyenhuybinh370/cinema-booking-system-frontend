import { NavLink, useNavigate } from "react-router-dom";
import {
  Ticket,
  Scan,
  LayoutDashboard,
  User,
  Calendar,
  LogOut,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

import LogoImage from "../../assets/UITCinema.png";

const menuItems = [
  {
    title: "Tổng quan",
    path: "/staff/dashboard",
    icon: <LayoutDashboard size={22} />,
  },
  { title: "Bán vé", path: "/staff/sell-ticket", icon: <Ticket size={22} /> },
  { title: "Soát vé", path: "/staff/check-in", icon: <Scan size={22} /> },
  {
    title: "Lịch làm việc",
    path: "/staff/schedule",
    icon: <Calendar size={22} />,
  },
  { title: "Cá nhân", path: "/staff/profile", icon: <User size={22} /> },
];

const StaffSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosClient.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Error during backend logout:", err);
    } finally {
      // Always clear local storage tokens and navigate to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCode");
      navigate("/login");
    }
  };

  return (
    <aside className="w-72 shrink-0 h-full bg-[#131A2A] border-r border-white/5 flex flex-col overflow-hidden scrollbar-hide shadow-2xl relative">
      {/* Logo container with subtle ambient glow */}
      <div className="h-36 flex items-center justify-center border-b border-white/5 shrink-0 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--btn-neon)]/5 rounded-full blur-2xl pointer-events-none"></div>
        <img
          src={LogoImage}
          alt="UIT Cinema Logo"
          className="h-24 w-auto object-contain transition-all duration-500 hover:scale-105 filter drop-shadow-[0_0_15px_rgba(255,176,0,0.15)]"
        />
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 w-full group min-w-0 border-l-4
              ${
                isActive
                  ? "bg-gradient-to-r from-[var(--btn-neon)]/15 to-transparent border-[var(--btn-neon)] text-[var(--btn-neon)] shadow-[0_4px_20px_rgba(255,176,0,0.05)] text-glow"
                  : "border-transparent text-slate-500 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">{item.icon}</span>

            <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left text-xs tracking-widest font-extrabold">
              {item.title}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout area */}
      <div className="p-4 border-t border-white/5 shrink-0 bg-slate-950/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 w-full rounded-xl font-bold uppercase tracking-wider text-slate-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all duration-300 group min-w-0 cursor-pointer text-xs"
        >
          <LogOut size={18} className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />

          <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left font-extrabold tracking-widest">
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
