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
    <aside className="w-72 shrink-0 h-full staff-card-flat border-r border-white/5 flex flex-col overflow-hidden scrollbar-hide">
      <div className="h-36 flex items-center justify-center border-b border-white/5 shrink-0 px-4">
        <img
          src={LogoImage}
          alt="UIT Cinema Logo"
          className="h-28 w-auto object-contain transition-all duration-300 hover:scale-105"
        />
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-wider transition-all duration-300 w-full group min-w-0
              ${
                isActive
                  ? "bg-[var(--btn-neon)]/10 text-[var(--btn-neon)] shadow-[0_0_20px_rgba(253,224,71,0.1)]"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>

            <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm">
              {item.title}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-bold uppercase tracking-wider text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-colors group min-w-0 cursor-pointer"
        >
          <LogOut size={22} className="shrink-0" />

          <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm">
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
