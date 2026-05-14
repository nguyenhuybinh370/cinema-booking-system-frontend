import { CheckCircle2, Clock, Users } from "lucide-react";

const ShiftCard = ({ day, shiftTemplate, shiftData, onClick }) => {
  const isFull = shiftData.registeredCount >= shiftTemplate.maxStaff;
  const isMyShift = shiftData.isMyShift;

  // Xác định style dựa trên trạng thái
  let cardStyle =
    "border-white/10 text-white/50 bg-white/5 hover:border-[var(--btn-neon)] hover:text-[var(--btn-neon)] cursor-pointer";
  if (isMyShift) {
    cardStyle =
      "border-[var(--btn-neon)] bg-[var(--btn-neon)]/10 text-[var(--btn-neon)] shadow-[0_0_15px_rgba(253,224,71,0.2)] cursor-pointer hover:border-red-400";
  } else if (isFull) {
    cardStyle =
      "border-red-500/20 bg-red-500/10 text-red-400/50 cursor-not-allowed";
  }

  return (
    <div
      onClick={() =>
        !isFull || isMyShift ? onClick(day.dateString, shiftTemplate) : null
      }
      className={`p-4 rounded-xl border transition-all duration-300 relative flex flex-col gap-2 ${cardStyle}`}
      title={
        isMyShift ? "Nhấn để hủy ca" : isFull ? "Ca đã đầy" : "Nhấn để đăng ký"
      }
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

      <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-center">
        {isMyShift ? "Của bạn" : isFull ? "Đã đầy" : "Đăng ký"}
      </div>
    </div>
  );
};

export default ShiftCard;
