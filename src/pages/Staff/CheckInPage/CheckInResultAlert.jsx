import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

const CheckInResultAlert = ({ status, message, ticketData, onReset }) => {
  if (status === "IDLE" || status === "PROCESSING") return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-4 duration-300 relative">
      {status === "SUCCESS" ? (
        <div className="w-full bg-gradient-to-r from-emerald-950/20 via-emerald-800/40 to-emerald-950/20 border-y border-emerald-500/30 py-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span className="text-emerald-400 text-2xl font-black tracking-widest uppercase">
              VALID TICKET
            </span>
          </div>
          <p className="text-xs text-emerald-200/90 font-medium">
            Tên phim: <span className="font-bold text-white">{ticketData?.movie}</span>, Ghế: <span className="font-bold text-[var(--btn-neon)] font-mono">{ticketData?.seat}</span>, Suất: <span className="font-bold text-[var(--btn-neon)] font-mono">{ticketData?.time}</span>
          </p>
        </div>
      ) : (
        <div className="w-full bg-gradient-to-r from-red-950/20 via-red-800/40 to-red-950/20 border-y border-red-500/30 py-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-6 h-6 text-red-500" />
            <span className="text-red-500 text-2xl font-black tracking-widest uppercase">
              INVALID TICKET
            </span>
          </div>
          <p className="text-xs text-red-200/90 font-medium uppercase font-mono tracking-wider">
            {message || "Vé không hợp lệ hoặc đã được sử dụng"}
          </p>
        </div>
      )}
      
      <button
        onClick={onReset}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-purple-500 hover:text-white text-slate-400 transition-all duration-300 cursor-pointer border border-white/5 shadow-md"
        title="Quét lại (Reset)"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CheckInResultAlert;
