import { X, AlertCircle, Check } from "lucide-react";

const ShiftActionModal = ({ selectedShift, onClose, onConfirm }) => {
  if (!selectedShift) return null;

  const { data, template, dateString } = selectedShift;
  const isMyShift = data.isMyShift;

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-[#131A2A] border border-white/[0.08] rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div
            className={`p-4 rounded-full mb-4 ${isMyShift ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-[#FFB000]/10 text-[#FFB000] border border-[#FFB000]/20"}`}
          >
            {isMyShift ? <AlertCircle size={28} /> : <Check size={28} />}
          </div>

          <h2 className="text-lg font-black uppercase tracking-widest text-white mb-1">
            {isMyShift ? "Xác nhận hủy ca" : "Xác nhận đăng ký"}
          </h2>
          <p className="text-xs text-slate-400">
            {isMyShift ? "Bạn có chắc chắn muốn hủy đăng ký ca làm này?" : "Vui lòng xác nhận đăng ký ca làm việc dưới đây:"}
          </p>

          <div className="bg-[#0D1321]/60 w-full p-4 rounded-xl border border-white/5 mt-5 text-left space-y-2.5">
            <p className="text-xs text-slate-400 flex justify-between">
              <span>Ngày làm:</span>
              <span className="font-bold text-white">{dateString}</span>
            </p>
            <p className="text-xs text-slate-400 flex justify-between">
              <span>Ca trực:</span>
              <span className="font-bold text-[#FFB000] uppercase">{template.TenCa}</span>
            </p>
            <p className="text-xs text-slate-400 flex justify-between">
              <span>Thời gian:</span>
              <span className="font-mono font-bold text-white">
                {formatTime(template.GioBatDau)} - {formatTime(template.GioKetThuc)}
              </span>
            </p>
          </div>

          <div className="flex gap-3 w-full mt-7">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full font-bold text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-white/10 cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer
                ${
                  isMyShift
                    ? "bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-500/40 hover:border-red-500"
                    : "bg-[#FFB000] text-slate-950 hover:bg-[#FFB000]/80"
                }
              `}
            >
              {isMyShift ? "Hủy Ca" : "Đăng Ký"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftActionModal;
