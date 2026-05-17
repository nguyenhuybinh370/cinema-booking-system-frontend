import { useNavigate } from "react-router-dom";
import { DollarSign, ScanLine, Clock, Film, TrendingUp } from "lucide-react";
import {
  UPCOMING_SHOWS,
  SHIFT_STATS,
  RECENT_TRANSACTIONS,
} from "../../data/mockDashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleQuickSell = (show) => {
    navigate("/staff/sell-ticket", {
      state: {
        preSelected: { movie: show.movie, showtime: show.showtime },
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[var(--btn-neon)]">
            Tổng Quan Ca Làm Việc
          </h1>
          <p className="text-white/60 mt-2 flex items-center gap-2">
            <Clock size={16} /> Đang diễn ra:{" "}
            <span className="font-bold text-white">
              {SHIFT_STATS.shiftName}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="staff-card-flat p-6 rounded-3xl relative overflow-hidden group">
          <p className="text-sm text-white/50 uppercase tracking-wider mb-1">
            Doanh thu tại quầy
          </p>
          <h2 className="text-4xl font-black text-white">
            {SHIFT_STATS.revenue.toLocaleString("vi-VN")}đ
          </h2>
        </div>
        <div className="staff-card-flat p-6 rounded-3xl relative overflow-hidden group">
          <p className="text-sm text-white/50 uppercase tracking-wider mb-1">
            Vé đã bán
          </p>
          <h2 className="text-4xl font-black text-white">
            {SHIFT_STATS.ticketsSold}{" "}
            <span className="text-lg text-white/30 font-normal">vé</span>
          </h2>
        </div>
        <div className="staff-card-flat p-6 rounded-3xl relative overflow-hidden group">
          <p className="text-sm text-white/50 uppercase tracking-wider mb-1">
            Vé đã soát (Check-in)
          </p>
          <h2 className="text-4xl font-black text-white">
            {SHIFT_STATS.ticketsChecked}{" "}
            <span className="text-lg text-white/30 font-normal">lượt</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2 staff-card-flat p-8 rounded-3xl flex flex-col">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4 mb-6 flex items-center gap-3">
            <Film className="text-[var(--btn-neon)]" size={20} />
            Suất chiếu sắp diễn ra
          </h2>
          <div className="flex-1 space-y-4">
            {UPCOMING_SHOWS.map((show, index) => {
              const fillPercentage = (show.booked / show.total) * 100;
              return (
                <div
                  key={index}
                  onClick={() => handleQuickSell(show)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-[var(--btn-neon)] hover:bg-[var(--btn-neon)]/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-black/40 rounded-xl flex flex-col items-center justify-center border border-white/5 group-hover:border-[var(--btn-neon)]">
                      <span className="text-sm text-[var(--btn-neon)] font-bold">
                        {show.showtime.time}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-[var(--btn-neon)] transition-colors">
                        {show.movie.title}
                      </h3>
                      <p className="text-sm text-white/50">
                        {show.showtime.room}
                      </p>
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <p className="text-sm text-white/60 mb-1">Tỷ lệ lấp đầy</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${fillPercentage > 80 ? "bg-green-400" : fillPercentage > 50 ? "bg-[var(--btn-neon)]" : "bg-blue-400"}`}
                          style={{ width: `${fillPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-mono font-bold text-white">
                        {show.booked}/{show.total}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="staff-card-flat p-8 rounded-3xl flex flex-col">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4 mb-6 flex items-center gap-3">
            <Clock className="text-blue-400" size={20} />
            Hoạt động gần đây
          </h2>
          <div className="flex-1 space-y-4">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-[var(--btn-neon)]"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm">{tx.type}</p>
                    <span className="text-xs text-white/40 font-mono">
                      {tx.time}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 font-mono mt-0.5">
                    Mã: {tx.id}
                  </p>
                  {tx.amount > 0 && (
                    <p className="text-sm font-bold text-green-400 mt-1">
                      +{tx.amount.toLocaleString()}đ
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/staff/transactions")}
            className="w-full mt-4 py-3 text-sm font-bold text-white/50 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
          >
            Xem tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
