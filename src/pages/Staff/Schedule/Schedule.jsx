import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ShiftCard from "./ShiftCard";
import ShiftActionModal from "./ShiftActionModal";

// --- MOCK DATA VÀ HELPER ---
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

const generateCurrentWeek = () => {
  const week = [];
  const currentDate = new Date("2026-05-14");
  const currentDay = currentDate.getDay();
  const firstDay = new Date(currentDate);
  firstDay.setDate(
    currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1),
  );

  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);
    week.push({
      dateString: date.toISOString().split("T")[0],
      dayName: i === 6 ? "Chủ Nhật" : `Thứ ${i + 2}`,
      displayDate: `${date.getDate()}/${date.getMonth() + 1}`,
    });
  }
  return week;
};

// --- COMPONENT CHÍNH ---
const Schedule = () => {
  const currentWeek = generateCurrentWeek();

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

    alert(
      isCurrentlyRegistered
        ? "Đã HỦY ca thành công!"
        : "Đã ĐĂNG KÝ ca thành công!",
    );
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

      <div className="glass-effect rounded-3xl p-6 flex-1 overflow-x-auto">
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
