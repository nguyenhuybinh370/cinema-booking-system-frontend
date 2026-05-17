import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import "../../styles/staff.css"; // Import file CSS riêng biệt vừa tạo

const StaffLayout = () => {
  return (
    // staff-container sẽ khóa cứng nền màu tối phẳng (Solid) cho toàn bộ trang của nhân viên
    <div className="flex min-h-screen text-[var(--white-light)] staff-container">
      {/* Sidebar cố định */}
      <StaffSidebar />

      {/* Vùng nội dung chính */}
      <div className="flex-1 flex flex-col relative">
        {/* Header chuyển sang dùng class staff-card-flat phẳng và rõ nét */}
        <header className="h-20 staff-card-flat sticky top-0 z-40 flex items-center justify-between px-10">
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
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
