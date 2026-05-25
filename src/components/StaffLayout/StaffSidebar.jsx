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
    subtitle: "Dashboard",
    path: "/staff/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: "Bán vé",
    subtitle: "POS",
    path: "/staff/sell-ticket",
    icon: <Ticket size={20} />,
  },
  {
    title: "Soát vé",
    subtitle: "Check-in",
    path: "/staff/check-in",
    icon: <Scan size={20} />,
  },
  {
    title: "Lịch làm việc",
    subtitle: "Schedule",
    path: "/staff/schedule",
    icon: <Calendar size={20} />,
  },
  {
    title: "Cá nhân",
    subtitle: "Profile",
    path: "/staff/profile",
    icon: <User size={20} />,
  },
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
    <aside className="w-60 shrink-0 h-full bg-[#0D1321] border-r border-white/5 flex flex-col overflow-hidden scrollbar-hide relative">
      {/* Logo */}
      <div className="h-24 flex items-center justify-center border-b border-white/[0.06] shrink-0 px-5">
        <img
          src={LogoImage}
          alt="UIT Cinema Logo"
          className="h-16 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(255,176,0,0.12)]"
        />
      </div>

      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all duration-200 w-full group min-w-0 border-l-[3px]
              ${
                isActive
                  ? "bg-[var(--btn-neon)]/10 border-[var(--btn-neon)] text-[var(--btn-neon)]"
                  : "border-transparent text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
              }`
            }
          >
            <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">{item.icon}</span>

            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold uppercase tracking-wider leading-tight truncate">
                {item.title}
              </span>
              <span className="text-[10px] text-slate-600 font-medium tracking-wide leading-tight">
                {item.subtitle}
              </span>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Logout area */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 w-full rounded-xl font-semibold text-slate-500 hover:bg-red-500/10 hover:text-red-400 border-l-[3px] border-transparent transition-all duration-200 group min-w-0 cursor-pointer"
        >
          <LogOut size={18} className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />

          <span className="text-[13px] font-bold uppercase tracking-wider truncate">
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
