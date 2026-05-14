import { X, AlertCircle, Check } from "lucide-react";

const ShiftActionModal = ({ selectedShift, onClose, onConfirm }) => {
  if (!selectedShift) return null;

  const { data, template, dateString } = selectedShift;
  const isMyShift = data.isMyShift;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-[var(--navy-light)] border border-white/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div
            className={`p-4 rounded-full mb-4 ${isMyShift ? "bg-red-500/10 text-red-400" : "bg-[var(--btn-neon)]/10 text-[var(--btn-neon)]"}`}
          >
            {isMyShift ? <AlertCircle size={32} /> : <Check size={32} />}
          </div>

          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">
            {isMyShift ? "Xác nhận hủy ca" : "Xác nhận đăng ký"}
          </h2>

          <div className="bg-black/20 w-full p-4 rounded-xl border border-white/5 mt-4 text-left space-y-2">
            <p className="text-sm text-white/50">
              Ngày:{" "}
              <span className="font-bold text-white float-right">
                {dateString}
              </span>
            </p>
            <p className="text-sm text-white/50">
              Ca:{" "}
              <span className="font-bold text-[var(--btn-neon)] float-right">
                {template.name}
              </span>
            </p>
            <p className="text-sm text-white/50">
              Thời gian:{" "}
              <span className="font-mono text-white float-right">
                {template.startTime} - {template.endTime}
              </span>
            </p>
          </div>

          <div className="flex gap-3 w-full mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full font-bold text-white/50 hover:bg-white/5 hover:text-white transition-colors border border-white/10"
            >
              Đóng
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-full font-bold uppercase tracking-wider transition-colors
                ${
                  isMyShift
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/50"
                    : "btn-bright"
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
