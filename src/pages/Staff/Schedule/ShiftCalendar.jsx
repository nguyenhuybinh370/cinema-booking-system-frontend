import ShiftCard from "./ShiftCard";

const ShiftCalendar = ({ currentWeek, shiftTemplates, shiftDetails, onClick }) => {
  return (
    <div className="bg-[#131A2A]/60 border border-white/[0.06] rounded-2xl p-4 flex-1 overflow-x-auto min-h-[480px] shadow-2xl">
      <div className="min-w-[1000px] grid grid-cols-7 divide-x divide-white/[0.06] h-full">
        {currentWeek.map((day) => {
          const isToday = day.dateString === new Date().toISOString().split("T")[0];
          
          return (
            <div key={day.dateString} className={`flex flex-col gap-4 px-3 pb-2 ${isToday ? "bg-white/[0.01]" : ""}`}>
              {/* Header Cell */}
              <div className="text-center pb-3 pt-2 relative min-h-[64px] flex flex-col items-center justify-center">
                <h3 className={`font-black text-[11px] uppercase tracking-wider ${isToday ? "text-[#FFB000]" : "text-slate-300"}`}>
                  {day.dayName} ({day.displayDate})
                </h3>
                {isToday && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#FFB000] text-slate-950 text-[8px] font-black uppercase rounded tracking-widest font-mono scale-90">
                    Hôm nay
                  </span>
                )}
                {/* Horizontal Line under Header */}
                <div className={`absolute bottom-0 inset-x-0 h-[2px] ${isToday ? "bg-[#FFB000] shadow-[0_0_8px_rgba(255,176,0,0.8)]" : "bg-white/5"}`}></div>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0 pt-2">
                {shiftTemplates.map((template) => (
                  <ShiftCard
                    key={template.MaCa}
                    day={day}
                    shiftTemplate={template}
                    shiftData={
                      shiftDetails[`${day.dateString}_${template.MaCa}`] || {
                        registeredCount: 0,
                        isMyShift: false,
                        capacity: template.SoNguoiToiDa,
                        conTrong: true,
                      }
                    }
                    onClick={onClick}
                  />
                ))}
                {shiftTemplates.length === 0 && (
                  <div className="text-slate-600 text-center py-8 text-xs italic select-none">
                    Không có ca làm việc
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftCalendar;
