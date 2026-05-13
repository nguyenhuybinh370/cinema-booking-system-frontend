import {
  Ticket,
  DollarSign,
  ScanLine,
  Clock,
  Film,
  TrendingUp,
} from "lucide-react";

// Dữ liệu giả lập (Mock Data) cho ca làm việc hiện tại
const SHIFT_STATS = {
  revenue: 3450000,
  ticketsSold: 42,
  ticketsChecked: 28,
  shiftName: "Ca Sáng (08:00 - 16:00)",
};

const UPCOMING_SHOWS = [
  {
    id: "S1",
    movie: "DUNE: PART TWO",
    room: "Phòng IMAX",
    time: "13:30",
    booked: 120,
    total: 150,
  },
  {
    id: "S2",
    movie: "KUNG FU PANDA 4",
    room: "Phòng 1",
    time: "14:00",
    booked: 85,
    total: 100,
  },
  {
    id: "S3",
    movie: "GODZILLA X KONG",
    room: "Phòng 2",
    time: "14:45",
    booked: 40,
    total: 120,
  },
];

const RECENT_TRANSACTIONS = [
  {
    id: "TX001",
    time: "11:42",
    type: "Bán vé",
    amount: 250000,
    status: "Thành công",
  },
  {
    id: "TX002",
    time: "11:38",
    type: "Bán vé",
    amount: 180000,
    status: "Thành công",
  },
  { id: "TX003", time: "11:30", type: "Soát vé", amount: 0, status: "Hợp lệ" },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8 h-full">
      {/* HEADER DASHBOARD */}
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
        <button className="glass-effect px-6 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-colors border border-white/20 flex items-center gap-2">
          <TrendingUp size={16} />
          Chốt Ca & Bàn Giao
        </button>
      </div>

      {/* STATS CARDS (Thẻ thống kê) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--btn-neon)]/10 rounded-full blur-xl group-hover:bg-[var(--btn-neon)]/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[var(--btn-neon)]/10 rounded-2xl border border-[var(--btn-neon)]/20 text-[var(--btn-neon)]">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-white/50 uppercase tracking-wider mb-1">
            Doanh thu tại quầy
          </p>
          <h2 className="text-4xl font-black text-white">
            {SHIFT_STATS.revenue.toLocaleString("vi-VN")}đ
          </h2>
        </div>

        <div className="glass-effect p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
              <Ticket size={24} />
            </div>
          </div>
          <p className="text-sm text-white/50 uppercase tracking-wider mb-1">
            Vé đã bán
          </p>
          <h2 className="text-4xl font-black text-white">
            {SHIFT_STATS.ticketsSold}{" "}
            <span className="text-lg text-white/30 font-normal">vé</span>
          </h2>
        </div>

        <div className="glass-effect p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20 text-green-400">
              <ScanLine size={24} />
            </div>
          </div>
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
        {/* LỊCH CHIẾU SẮP TỚI (Chiếm 2 cột) */}
        <div className="lg:col-span-2 glass-effect p-8 rounded-3xl flex flex-col">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4 mb-6 flex items-center gap-3">
            <Film className="text-[var(--btn-neon)]" size={20} />
            Suất chiếu sắp diễn ra
          </h2>
          <div className="flex-1 space-y-4">
            {UPCOMING_SHOWS.map((show) => {
              const fillPercentage = (show.booked / show.total) * 100;
              return (
                <div
                  key={show.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-black/40 rounded-xl flex flex-col items-center justify-center border border-white/5">
                      <span className="text-sm text-[var(--btn-neon)] font-bold">
                        {show.time}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{show.movie}</h3>
                      <p className="text-sm text-white/50">{show.room}</p>
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
                      <span className="text-sm font-mono font-bold">
                        {show.booked}/{show.total}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HOẠT ĐỘNG GẦN ĐÂY (Chiếm 1 cột) */}
        <div className="glass-effect p-8 rounded-3xl flex flex-col">
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
                <div className="w-2 h-2 mt-2 rounded-full bg-[var(--btn-neon)] shadow-[0_0_8px_rgba(253,224,71,0.8)]"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm">{tx.type}</p>
                    <span className="text-xs text-white/40 font-mono">
                      {tx.time}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Mã: {tx.id}</p>
                  {tx.amount > 0 && (
                    <p className="text-sm font-bold text-green-400 mt-1">
                      +{tx.amount.toLocaleString()}đ
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 text-sm font-bold text-white/50 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
            Xem tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
