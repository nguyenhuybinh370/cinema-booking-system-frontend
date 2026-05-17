import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ShiftCard from "./ShiftCard";
import ShiftActionModal from "./ShiftActionModal";

// --- MOCK DATA ---
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

// --- HELPER: TẠO LỊCH ĐỘNG DỰA VÀO ĐỘ LỆCH TUẦN ---
const generateWeek = (offset = 0) => {
  const week = [];
  // Lấy mốc chuẩn là giữa tháng 5/2026, cộng trừ số ngày dựa theo offset
  const baseDate = new Date("2026-05-14T12:00:00");
  baseDate.setDate(baseDate.getDate() + offset * 7);

  const currentDay = baseDate.getDay();
  const firstDay = new Date(baseDate);
  // Lùi về ngày Thứ 2 của tuần đó
  firstDay.setDate(
    baseDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1),
  );

  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);
    week.push({
      dateString: date.toISOString().split("T")[0],
      dayName: i === 6 ? "Chủ Nhật" : `Thứ ${i + 2}`,
      // Format ngày/tháng thêm số 0 ở trước cho đẹp (VD: 09/05)
      displayDate: `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`,
      year: date.getFullYear(),
    });
  }
  return week;
};

// --- COMPONENT CHÍNH ---
const Schedule = () => {
  // 1. State quản lý việc lùi/tiến tuần
  const [weekOffset, setWeekOffset] = useState(0);

  // Tạo mảng 7 ngày cho tuần hiện tại (dựa vào offset)
  const currentWeek = generateWeek(weekOffset);

  // Lấy ra ngày đầu và ngày cuối tuần để in lên cái nút Header
  const startOfWeek = currentWeek[0];
  const endOfWeek = currentWeek[6];
  const weekDisplayTitle = `Tuần: ${startOfWeek.displayDate} - ${endOfWeek.displayDate}/${endOfWeek.year}`;

  const [shiftDetails, setShiftDetails] = useState({
    "2026-05-14_CA_SANG": { registeredCount: 5, isMyShift: false },
    "2026-05-14_CA_CHIEU": { registeredCount: 3, isMyShift: true },
    "2026-05-15_CA_SANG": { registeredCount: 2, isMyShift: false },
    "2026-05-16_CA_CHIEU": { registeredCount: 4, isMyShift: true },
  });

  const [selectedShift, setSelectedShift] = useState(null);

  const handleCardClick = (dateString, shiftTemplate) => {
    const shiftKey = `${dateString}_${shiftTemplate.id}`;
    const shiftData = shiftDetails[shiftKey] || {
      registeredCount: 0,
      isMyShift: false,
    };

    setSelectedShift({
      key: shiftKey,
      dateString,
      template: shiftTemplate,
      data: shiftData,
    });
  };

  const handleToggleRegistration = () => {
    if (!selectedShift) return;

    const { key, data } = selectedShift;
    const isCurrentlyRegistered = data.isMyShift;

    setShiftDetails((prev) => {
      const currentCount = prev[key]?.registeredCount || 0;
      return {
        ...prev,
        [key]: {
          isMyShift: !isCurrentlyRegistered,
          registeredCount: isCurrentlyRegistered
            ? currentCount - 1
            : currentCount + 1,
        },
      };
    });

    setSelectedShift(null);
  };

  return (
    <div className="flex flex-col h-full space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[var(--btn-neon)]">
            Lịch Làm Việc
          </h1>
          <p className="text-white/50 mt-2">
            Xem lịch và đăng ký ca làm việc hàng tuần
          </p>
        </div>

        {/* --- CỤM ĐIỀU HƯỚNG TUẦN --- */}
        <div className="staff-card-flat rounded-full p-1 flex items-center">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
            title="Tuần trước"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="px-6 py-2 flex items-center gap-2 font-bold text-sm min-w-[220px] justify-center">
            <CalendarIcon size={16} className="text-[var(--btn-neon)]" />
            <span>{weekDisplayTitle}</span>
          </div>

          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
            title="Tuần sau"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* --- LƯỚI LỊCH (Đã đổi class thành staff-card-flat) --- */}
      <div className="staff-card-flat rounded-3xl p-6 flex-1 overflow-x-auto">
        <div className="min-w-[1000px] grid grid-cols-7 gap-4 h-full">
          {currentWeek.map((day) => (
            <div key={day.dateString} className="flex flex-col gap-4">
              <div className="text-center pb-4 border-b border-white/10">
                <h3 className="font-bold text-lg text-white">{day.dayName}</h3>
                <p className="text-sm text-[var(--btn-neon)] font-mono mt-1">
                  {day.displayDate}
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                {SHIFT_TEMPLATES.map((template) => (
                  <ShiftCard
                    key={template.id}
                    day={day}
                    shiftTemplate={template}
                    shiftData={
                      shiftDetails[`${day.dateString}_${template.id}`] || {
                        registeredCount: 0,
                        isMyShift: false,
                      }
                    }
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ShiftActionModal
        selectedShift={selectedShift}
        onClose={() => setSelectedShift(null)}
        onConfirm={handleToggleRegistration}
      />
    </div>
  );
};

export default Schedule;
