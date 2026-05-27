import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import StaffSidebar from "./StaffSidebar";
import axiosClient from "../../api/axiosClient";
import "../../styles/staff.css";

const StaffLayout = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await axiosClient.get("/staff/ho-so");
        setProfile(data);
      } catch (err) {
        console.error("Error fetching staff profile in layout:", err);
      }
    };
    fetchProfile();
  }, []);

  const displayName = profile ? profile.HoTen : (localStorage.getItem("userName") || "Nhân viên");
  const displayCode = profile ? profile.MaNhanVien : (localStorage.getItem("userCode") || "NV...");
  const avatarLetter = displayName.charAt(0);

  return (
    <div className="flex h-screen w-full text-[var(--white-light)] staff-container overflow-hidden">
      <StaffSidebar />

      <div className="flex-1 min-w-0 flex flex-col h-full relative">
        <header className="h-16 bg-[#0D1321]/80 backdrop-blur-md border-b border-white/[0.06] z-40 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--btn-neon)] font-bold">
              Portal Quản Trị
            </span>
            <span className="text-white/20 text-xs">|</span>
            <span className="text-sm font-semibold text-white/80 tracking-tight">
              Hệ Thống Rạp Chiếu
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Notification bell */}
            <button className="relative p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--btn-neon)] rounded-full"></span>
            </button>

            {/* User info */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--purple-glow)] to-[var(--btn-neon)] flex items-center justify-center font-bold text-sm text-white shrink-0">
                {avatarLetter}
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold tracking-wide whitespace-nowrap text-white/90">
                  {displayName}
                </p>
                <p className="text-[10px] text-white/30 font-mono whitespace-nowrap">
                  {displayCode}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 p-8 overflow-auto relative scrollbar-hide">
          <div className="w-full min-w-0 mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
