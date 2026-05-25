import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
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
        <header className="h-20 staff-card-flat border-b border-white/5 z-40 flex items-center justify-between px-10 shrink-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--btn-neon)] font-bold">
              Portal Quản Trị
            </span>
            <h2 className="text-lg font-bold tracking-tight text-glow whitespace-nowrap">
              Hệ Thống Rạp Chiếu
            </h2>
          </div>

          <div className="flex items-center gap-5 p-2 pr-5 rounded-full bg-white/5 border border-white/10 shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--purple-glow)] to-[var(--btn-neon)] flex items-center justify-center font-bold text-white shadow-lg shrink-0">
              {avatarLetter}
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-bold tracking-wide whitespace-nowrap">
                {displayName}
              </p>
              <p className="text-[10px] text-white/40 font-mono whitespace-nowrap">
                {displayCode}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 p-10 overflow-auto relative scrollbar-hide">
          <div className="w-full min-w-0 mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
