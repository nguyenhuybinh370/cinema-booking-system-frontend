import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";

const StaffLayout = () => {
  return (
    <div className="flex min-h-screen text-[var(--white-light)]">
      {/* Sidebar cố định */}
      <StaffSidebar />

      {/* Vùng nội dung chính */}
      <div className="flex-1 flex flex-col relative">
        {/* Header Glassmorphism */}
        <header className="h-20 glass-effect sticky top-0 z-40 border-b border-white/10 flex items-center justify-between px-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--btn-neon)] font-bold">
              Portal Quản Trị
            </span>
            <h2 className="text-lg font-bold tracking-tight text-glow">
              Hệ Thống Rạp Chiếu
            </h2>
          </div>

          {/* User Info Card */}
          <div className="flex items-center gap-5 p-2 pr-5 rounded-full bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--purple-glow)] to-[var(--btn-neon)] flex items-center justify-center font-bold text-white shadow-lg">
              Đ
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold tracking-wide">Phan Gia Đạt</p>
              <p className="text-[10px] text-white/40 font-mono">NV24520287</p>
            </div>
          </div>
        </header>

        {/* Nội dung trang con */}
        <main className="flex-1 p-10 overflow-y-auto relative">
          {/* Một chút trang trí để tạo chiều sâu */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--purple-glow)] opacity-10 blur-[120px] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
