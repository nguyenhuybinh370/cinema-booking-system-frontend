import { Film, Ticket } from "lucide-react";

const TicketInfoCard = ({ ticketData }) => {
  if (!ticketData) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="border border-purple-500/40 rounded-xl overflow-hidden bg-[#131A2A]/90 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
        {/* Header */}
        <div className="bg-[#1B2435] border-b border-purple-500/20 px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-black text-purple-300 uppercase tracking-widest">
            CHI TIẾT VÉ VỪA QUÉT
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2 rounded font-black tracking-wider">
            ĐÃ SOÁT VÉ
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col md:flex-row gap-6">
          {/* Graphic Ticket on Left */}
          <div className="w-full md:w-32 h-44 bg-gradient-to-br from-[#1b2130] to-[#0D1321] border border-white/5 rounded-lg flex flex-col items-center justify-between p-3 shrink-0 relative overflow-hidden select-none">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mt-2">
              <Film className="w-5 h-5" />
            </div>
            <div className="text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MÃ GHẾ</div>
              <div className="text-2xl font-black text-[var(--btn-neon)] font-mono tracking-tighter text-glow">
                {ticketData.seat}
              </div>
            </div>
            <div className="w-full border-t border-dashed border-white/10 pt-2 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-purple-400/60" />
            </div>
          </div>

          {/* Details on Right */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide leading-tight mb-2">
                {ticketData.movie}
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Rạp</span>
                  <span className="text-sm font-bold text-slate-200 uppercase">{ticketData.room}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Ghế</span>
                  <span className="text-sm font-bold text-[var(--btn-neon)] font-mono">{ticketData.seat}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Suất chiếu</span>
                  <span className="text-sm font-bold text-slate-200 font-mono">
                    {ticketData.time} - {ticketData.date}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Giá vé</span>
                  <span className="text-sm font-bold text-slate-200 font-mono">
                    {ticketData.price ? ticketData.price.toLocaleString("vi-VN") : "0"}đ
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-slate-500">
              <span>MÃ VÉ (UUID): HỢP LỆ</span>
              <span>UIT CINEMA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfoCard;
