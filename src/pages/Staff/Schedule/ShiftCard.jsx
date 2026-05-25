import { CheckCircle2, Clock, Users } from "lucide-react";

const ShiftCard = ({ day, shiftTemplate, shiftData, onClick }) => {
  const isFull = shiftData.registeredCount >= shiftTemplate.SoNguoiToiDa;
  const isMyShift = shiftData.isMyShift;

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // Style based on state
  let cardStyle =
    "border-slate-800 bg-[#1B2435]/40 text-slate-400 hover:border-[var(--btn-neon)]/60 hover:text-[var(--btn-neon)] cursor-pointer hover:-translate-y-0.5 shadow-md";
  if (isMyShift) {
    cardStyle =
      "border-[var(--btn-neon)] bg-gradient-to-br from-[var(--btn-neon)]/15 to-[var(--btn-neon)]/5 text-[var(--btn-neon)] shadow-[0_0_20px_rgba(255,176,0,0.15)] cursor-pointer hover:border-red-500/50 hover:text-red-400 hover:from-red-500/10 hover:to-transparent hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]";
  } else if (isFull) {
    cardStyle =
      "border-slate-900 bg-slate-950/25 text-slate-600 cursor-not-allowed opacity-50";
  }

  return (
    <div
      onClick={() =>
        !isFull || isMyShift ? onClick(day.dateString, shiftTemplate) : null
      }
      className={`p-4 rounded-2xl border transition-all duration-300 relative flex flex-col gap-2 ${cardStyle}`}
      title={
        isMyShift ? "Nhấn để hủy ca" : isFull ? "Ca đã đầy" : "Nhấn để đăng ký"
      }
    >
      <div className="flex justify-between items-start">
        <span className="font-extrabold text-xs uppercase tracking-widest truncate text-white group-hover:text-inherit">
          {shiftTemplate.TenCa}
        </span>
        {isMyShift && (
          <CheckCircle2 size={15} className="text-[var(--btn-neon)] shrink-0 filter drop-shadow-[0_0_5px_rgba(255,176,0,0.5)] group-hover:text-red-400" />
        )}
      </div>

      <div className="text-[11px] space-y-1 font-mono">
        <p className="flex items-center gap-1.5 opacity-80">
          <Clock size={11} className="text-slate-500" /> {formatTime(shiftTemplate.GioBatDau)} -{" "}
          {formatTime(shiftTemplate.GioKetThuc)}
        </p>
        <p className="flex items-center gap-1.5 opacity-80">
          <Users size={11} className="text-slate-500" /> {shiftData.registeredCount}/
          {shiftTemplate.SoNguoiToiDa} người
        </p>
      </div>

      <div className={`mt-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-center rounded border ${
        isMyShift 
          ? "bg-[var(--btn-neon)]/10 border-[var(--btn-neon)]/20 text-[var(--btn-neon)] group-hover:bg-red-500/10 group-hover:border-red-500/20 group-hover:text-red-400" 
          : isFull 
            ? "bg-transparent border-slate-900 text-slate-700" 
            : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
      }`}>
        {isMyShift ? "Đã Đăng Ký" : isFull ? "Đã Đầy" : "Đăng Ký"}
      </div>
    </div>
  );
};

export default ShiftCard;
