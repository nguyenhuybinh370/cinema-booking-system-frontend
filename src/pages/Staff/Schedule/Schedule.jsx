import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";

// 1. Mock Data bảng CALAMVIEC (Các ca mẫu trong ngày)
const SHIFT_TEMPLATES = [
  {
    id: "CA_SANG",
    name: "Ca Sáng",
    startTime: "08:00",
    endTime: "16:00",
    maxStaff: 5,
  },
  {
    id: "CA_CHIEU",
    name: "Ca Chiều",
    startTime: "16:00",
    endTime: "00:00",
    maxStaff: 6,
  },
];

// 2. Helper tạo ra mảng 7 ngày trong tuần (giả lập tuần hiện tại)
const generateCurrentWeek = () => {
  const week = [];
  const currentDate = new Date("2026-05-14"); // Fix cứng ngày hiện tại theo bối cảnh để dễ test
  const currentDay = currentDate.getDay();
  const firstDay = new Date(currentDate);
  firstDay.setDate(
    currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1),
  ); // Lùi về Thứ 2

  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);
    week.push({
      dateString: date.toISOString().split("T")[0], // YYYY-MM-DD
      dayName: i === 6 ? "Chủ Nhật" : `Thứ ${i + 2}`,
      displayDate: `${date.getDate()}/${date.getMonth() + 1}`,
    });
  }
  return week;
};

// 3. Mock Data bảng CHITIETCALAMVIEC (Giả lập dữ liệu ca đã đăng ký và số lượng người đang đăng ký)
const MOCK_SHIFT_DETAILS = {
  // Key format: YYYY-MM-DD_SHIFT-ID
  "2026-05-14_CA_SANG": { registeredCount: 5, isMyShift: false }, // Đã đầy
  "2026-05-14_CA_CHIEU": { registeredCount: 3, isMyShift: true }, // Mình đã đăng ký
  "2026-05-15_CA_SANG": { registeredCount: 2, isMyShift: false }, // Còn trống
  "2026-05-16_CA_CHIEU": { registeredCount: 4, isMyShift: true }, // Mình đã đăng ký
};

const Schedule = () => {
  const currentWeek = generateCurrentWeek();

  // Hàm render trạng thái của một ca làm việc (Shift Card)
  const renderShiftCard = (dateString, shiftTemplate) => {
    const shiftKey = `${dateString}_${shiftTemplate.id}`;
    const shiftData = MOCK_SHIFT_DETAILS[shiftKey] || {
      registeredCount: 0,
      isMyShift: false,
    };

    const isFull = shiftData.registeredCount >= shiftTemplate.maxStaff;
    const isMyShift = shiftData.isMyShift;

    // Xác định style dựa trên trạng thái
    let cardStyle =
      "border-white/10 text-white/50 bg-white/5 hover:border-white/30 hover:bg-white/10"; // Default (Còn trống)
    if (isMyShift) {
      cardStyle =
        "border-[var(--btn-neon)] bg-[var(--btn-neon)]/10 text-[var(--btn-neon)] shadow-[0_0_15px_rgba(253,224,71,0.2)]"; // Mình đã đk
    } else if (isFull) {
      cardStyle =
        "border-red-500/20 bg-red-500/10 text-red-400/50 cursor-not-allowed"; // Đã đầy
    }

    return (
      <div
        key={shiftTemplate.id}
        className={`p-4 rounded-xl border transition-all duration-300 relative flex flex-col gap-2 ${cardStyle}`}
      >
        <div className="flex justify-between items-start">
          <span className="font-bold text-sm uppercase tracking-wider">
            {shiftTemplate.name}
          </span>
          {isMyShift && (
            <CheckCircle2 size={16} className="text-[var(--btn-neon)]" />
          )}
        </div>

        <div className="text-xs space-y-1">
          <p className="flex items-center gap-1 opacity-80">
            <Clock size={12} /> {shiftTemplate.startTime} -{" "}
            {shiftTemplate.endTime}
          </p>
          <p className="flex items-center gap-1 opacity-80">
            <Users size={12} /> {shiftData.registeredCount}/
            {shiftTemplate.maxStaff} người
          </p>
        </div>

        {/* Trạng thái text */}
        <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-center">
          {isMyShift ? "Của bạn" : isFull ? "Đã đầy" : "Đăng ký"}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* --- HEADER & ĐIỀU HƯỚNG TUẦN --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[var(--btn-neon)]">
            Lịch Làm Việc
          </h1>
          <p className="text-white/50 mt-2">
            Xem lịch và đăng ký ca làm việc hàng tuần
          </p>
        </div>

        <div className="glass-effect rounded-full p-1 flex items-center border border-white/20">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="px-6 py-2 flex items-center gap-2 font-bold text-sm">
            <CalendarIcon size={16} className="text-[var(--btn-neon)]" />
            <span>Tuần: 11/05 - 17/05/2026</span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* --- LƯỚI LỊCH (GRID CALENDAR) --- */}
      <div className="glass-effect rounded-3xl p-6 flex-1 overflow-x-auto">
        <div className="min-w-[1000px] grid grid-cols-7 gap-4 h-full">
          {currentWeek.map((day) => (
            <div key={day.dateString} className="flex flex-col gap-4">
              {/* Tiêu đề ngày */}
              <div className="text-center pb-4 border-b border-white/10">
                <h3 className="font-bold text-lg text-white">{day.dayName}</h3>
                <p className="text-sm text-[var(--btn-neon)] font-mono mt-1">
                  {day.displayDate}
                </p>
              </div>

              {/* Danh sách ca trong ngày */}
              <div className="flex flex-col gap-3 flex-1">
                {SHIFT_TEMPLATES.map((template) =>
                  renderShiftCard(day.dateString, template),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
