import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Film, DollarSign, TicketCheck, ScanLine } from "lucide-react";
import axiosClient from "../../api/axiosClient";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await axiosClient.get("/staff/dashboard");
      setDashboardData(res);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Không thể tải thông tin tổng quan ca làm việc.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickSell = (show) => {
    navigate("/staff/sell-ticket", {
      state: {
        preSelected: { 
          movie: show.movie, 
          showtime: {
            ...show.showtime,
            // Reconstruct nested structure if SellTicket expects it
            MaSuatChieu: show.showtime.id,
            GioChieu: show.showtime.time,
          } 
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-slate-400 font-bold uppercase tracking-wider">
        <div className="w-12 h-12 border-4 border-[var(--btn-neon)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-glow text-[var(--btn-neon)] text-sm">Đang tải thông tin tổng quan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold text-center animate-pulse">
        ⚠️ {error}
      </div>
    );
  }

  const { stats, upcomingShows, recentActivities } = dashboardData || {
    stats: { revenue: 0, ticketsSold: 0, ticketsChecked: 0, shiftName: "Không có ca trực" },
    upcomingShows: [],
    recentActivities: []
  };

  const kpiCards = [
    {
      label: "Doanh thu tại quầy",
      value: `${stats.revenue.toLocaleString("vi-VN")}đ`,
      icon: <DollarSign size={22} />,
      color: "from-amber-500/20 to-amber-500/5",
      iconBg: "bg-amber-500/15 text-amber-400",
    },
    {
      label: "Vé đã bán",
      value: stats.ticketsSold,
      unit: "vé",
      icon: <TicketCheck size={22} />,
      color: "from-blue-500/20 to-blue-500/5",
      iconBg: "bg-blue-500/15 text-blue-400",
    },
    {
      label: "Vé đã soát (Check-in)",
      value: stats.ticketsChecked,
      unit: "lượt",
      icon: <ScanLine size={22} />,
      color: "from-emerald-500/20 to-emerald-500/5",
      iconBg: "bg-emerald-500/15 text-emerald-400",
    },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest text-[var(--btn-neon)] text-glow">
          Tổng Quan Ca Làm Việc
        </h1>
        <p className="text-white/50 mt-1.5 flex items-center gap-2 text-sm">
          <Clock size={14} /> Đang diễn ra:{" "}
          <span className="font-bold text-white/80">
            {stats.shiftName}
          </span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpiCards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.color} border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-white/10`}
          >
            <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5 truncate">
                {card.label}
              </p>
              <h2 className="text-2xl font-black text-white leading-none">
                {card.value}{" "}
                {card.unit && <span className="text-sm text-white/30 font-normal">{card.unit}</span>}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Upcoming shows */}
        <div className="lg:col-span-2 bg-[#131A2A]/60 border border-white/[0.06] rounded-2xl p-6 flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/[0.06] pb-3 mb-4 flex items-center gap-2.5 text-white/70">
            <Film className="text-[var(--btn-neon)]" size={16} />
            Suất chiếu sắp diễn ra
          </h2>
          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
            {upcomingShows.map((show, index) => {
              const fillPercentage = show.total > 0 ? (show.booked / show.total) * 100 : 0;
              return (
                <div
                  key={show.showtime.id || index}
                  onClick={() => handleQuickSell(show)}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between hover:border-[var(--btn-neon)]/40 hover:bg-[var(--btn-neon)]/[0.03] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-black/30 rounded-lg flex flex-col items-center justify-center border border-white/[0.06] group-hover:border-[var(--btn-neon)]/30 shrink-0">
                      <span className="text-sm text-[var(--btn-neon)] font-bold font-mono">
                        {show.showtime.time}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base group-hover:text-[var(--btn-neon)] transition-colors leading-tight">
                        {show.movie.title}
                      </h3>
                      <p className="text-xs text-white/40 mt-0.5">
                        {show.showtime.room}
                      </p>
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <p className="text-[10px] text-white/40 mb-1.5 uppercase tracking-wider font-semibold">Tỷ lệ lấp đầy</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${fillPercentage > 80 ? "bg-emerald-400" : fillPercentage > 50 ? "bg-[var(--btn-neon)]" : "bg-blue-400"}`}
                          style={{ width: `${fillPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono font-bold text-white/80">
                        {show.booked}/{show.total}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {upcomingShows.length === 0 && (
              <div className="text-white/30 text-center py-8 text-sm italic">
                Không có suất chiếu sắp diễn ra hôm nay.
              </div>
            )}
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-[#131A2A]/60 border border-white/[0.06] rounded-2xl p-6 flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/[0.06] pb-3 mb-4 flex items-center gap-2.5 text-white/70">
            <Clock className="text-blue-400" size={16} />
            Hoạt động gần đây
          </h2>
          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
            {recentActivities.map((tx, index) => (
              <div
                key={tx.id || index}
                className="flex items-start gap-3 pb-3 border-b border-white/[0.04] last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--btn-neon)]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--btn-neon)]"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold text-sm text-white/80 leading-tight">{tx.type}</p>
                    <span className="text-[10px] text-white/30 font-mono shrink-0">
                      {tx.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30 font-mono mt-0.5 truncate">
                    Mã: {tx.id}
                  </p>
                  {tx.amount > 0 && (
                    <p className="text-xs font-bold text-emerald-400 mt-1">
                      +{tx.amount.toLocaleString()}đ
                    </p>
                  )}
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-white/30 text-center py-8 text-sm italic">
                Không có hoạt động nào gần đây.
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/staff/transactions")}
            className="w-full mt-4 py-2.5 text-xs font-semibold text-white/40 hover:text-white border border-white/[0.06] rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
