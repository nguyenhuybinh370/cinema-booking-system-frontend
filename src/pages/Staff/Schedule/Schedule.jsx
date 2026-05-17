import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ShiftCard from "./ShiftCard";
import ShiftActionModal from "./ShiftActionModal";
import {
  SHIFT_TEMPLATES,
  INITIAL_SHIFT_DETAILS,
} from "../../../data/mockSchedule";
import { generateWeek } from "../../../utils/dateHelper";

const Schedule = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const currentWeek = generateWeek(weekOffset);

  const startOfWeek = currentWeek[0];
  const endOfWeek = currentWeek[6];
  const weekDisplayTitle = `Tuần: ${startOfWeek.displayDate} - ${endOfWeek.displayDate}/${endOfWeek.year}`;

  const [shiftDetails, setShiftDetails] = useState(INITIAL_SHIFT_DETAILS);
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

        <div className="staff-card-flat rounded-full p-1 flex items-center">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
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
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

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
