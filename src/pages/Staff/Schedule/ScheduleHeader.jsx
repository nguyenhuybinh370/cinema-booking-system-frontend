import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const ScheduleHeader = ({ setWeekOffset, weekDisplayTitle }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#FFB000] font-black">
          PREMIUM STAFF OPERATIONS SCHEDULE
        </span>
        <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-white mt-1">
          Lịch Làm Việc Tuần
        </h1>
      </div>

      <div className="bg-[#131A2A] border border-white/[0.08] rounded-lg px-2 py-1 flex items-center shrink-0 shadow-lg">
        <button
          onClick={() => setWeekOffset((prev) => prev - 1)}
          className="p-2 hover:bg-white/5 rounded transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="px-4 py-1.5 flex items-center gap-2 font-bold text-xs min-w-[220px] justify-center text-[#FFB000]">
          <CalendarIcon size={14} className="filter drop-shadow-[0_0_5px_rgba(255,176,0,0.4)]" />
          <span className="tracking-widest uppercase font-mono">{weekDisplayTitle.replace("Tuần:", "TUẦN:")}</span>
        </div>
        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          className="p-2 hover:bg-white/5 rounded transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
