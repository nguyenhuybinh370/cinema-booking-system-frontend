import { CheckCircle2, Clock, Users } from "lucide-react";

const ShiftCard = ({ day, shiftTemplate, shiftData, onClick }) => {
  const isFull = shiftData.registeredCount >= shiftTemplate.SoNguoiToiDa;
  const isMyShift = shiftData.isMyShift;

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // Base style is dark themed card
  let cardStyle =
    "border-white/[0.06] bg-[#1B2435]/60 text-slate-300 hover:border-slate-500 hover:text-white cursor-pointer hover:-translate-y-0.5 shadow-lg group";
  
  if (isMyShift) {
    cardStyle =
      "border-[#FFB000] bg-[#FFB000]/10 text-[#FFB000] shadow-[0_0_20px_rgba(255,176,0,0.1)] cursor-pointer hover:border-red-500/50 hover:text-red-400 hover:bg-red-950/20";
  } else if (isFull) {
    cardStyle =
      "border-white/[0.03] bg-slate-900/40 text-slate-600 cursor-not-allowed opacity-40";
  }

  return (
    <div
      onClick={() =>
        !isFull || isMyShift ? onClick(day.dateString, shiftTemplate) : null
      }
      className={`p-4 rounded-xl border transition-all duration-300 relative flex flex-col gap-3 ${cardStyle}`}
      title={
        isMyShift ? "Nhấn để hủy ca" : isFull ? "Ca đã đầy" : "Nhấn để đăng ký"
      }
    >
      <div className="flex justify-between items-start">
        <span className={`font-black text-xs uppercase tracking-widest truncate ${isMyShift ? "text-[#FFB000]" : "text-white"}`}>
          {shiftTemplate.TenCa}
        </span>
        {isMyShift && (
          <CheckCircle2 size={16} className="text-[#FFB000] shrink-0 filter drop-shadow-[0_0_5px_rgba(255,176,0,0.5)]" />
        )}
      </div>

      <div className="text-[11px] space-y-1.5 font-mono">
        <p className="flex items-center gap-2 opacity-80">
          <Clock size={12} className={isMyShift ? "text-[#FFB000]/60" : "text-slate-500"} />
          <span className="font-semibold">{formatTime(shiftTemplate.GioBatDau)} - {formatTime(shiftTemplate.GioKetThuc)}</span>
        </p>
        <p className="flex items-center gap-2 opacity-80">
          <Users size={12} className={isMyShift ? "text-[#FFB000]/60" : "text-slate-500"} />
          <span className="font-semibold">{shiftData.registeredCount}/{shiftTemplate.SoNguoiToiDa} người</span>
        </p>
      </div>

      <div className={`mt-1 py-1.5 text-[9px] font-black uppercase tracking-widest text-center rounded transition-all duration-300 border ${
        isMyShift 
          ? "bg-[#FFB000] border-transparent text-slate-950 hover:bg-red-600 hover:text-white" 
          : isFull 
            ? "bg-transparent border-white/[0.04] text-slate-600" 
            : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white"
      }`}>
        {isMyShift ? "Đã Đăng Ký" : isFull ? "Đã Đầy" : "Đăng Ký"}
      </div>
    </div>
  );
};

export default ShiftCard;
