import { useNavigate } from "react-router-dom";
import {
  Ticket,
  DollarSign,
  ScanLine,
  Clock,
  Film,
  TrendingUp,
} from "lucide-react";

// Định nghĩa lại cấu trúc Mock Data khớp chính xác với Entity PHIM, SUATCHIEU và hệ thống tính giá đã refactor
const UPCOMING_SHOWS = [
  {
    movie: {
      id: "M1",
      title: "DUNE: PART TWO",
      genre: "Sci-Fi, Action",
      duration: 166,
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjcJsV.jpg",
    },
    showtime: {
      id: "S2",
      time: "13:30",
      room: "Phòng IMAX",
      basePrice: 60000,
      roomSurcharge: 30000,
      daySurcharge: 10000,
    },
    booked: 120,
    total: 150,
  },
  {
    movie: {
      id: "M2",
      title: "KUNG FU PANDA 4",
      genre: "Animation, Comedy",
      duration: 94,
      poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    },
    showtime: {
      id: "S4",
      time: "14:00",
      room: "Phòng 3 (Standard)",
      basePrice: 50000,
      roomSurcharge: 0,
      daySurcharge: 0,
    },
    booked: 85,
    total: 100,
  },
  {
    movie: {
      id: "M3",
      title: "GODZILLA X KONG",
      genre: "Action, Sci-Fi",
      duration: 115,
      poster: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLvLuPEtHZpALq1.jpg",
    },
    showtime: {
      id: "S6",
      time: "14:45",
      room: "Phòng IMAX",
      basePrice: 70000,
      roomSurcharge: 30000,
      daySurcharge: 15000,
    },
    booked: 40,
    total: 120,
  },
];

const SHIFT_STATS = {
  revenue: 3450000,
  ticketsSold: 42,
  ticketsChecked: 28,
  shiftName: "Ca Sáng (08:00 - 16:00)",
};

const RECENT_TRANSACTIONS = [
  {
    id: "PDV-8A2B3C4D",
    time: "11:42",
    type: "Bán vé tại quầy",
    amount: 255000,
    status: "Thành công",
  },
  {
    id: "PDV-9E0F1G2H",
    time: "11:38",
    type: "Bán vé tại quầy",
    amount: 180000,
    status: "Thành công",
  },
  {
    id: "PDV-3I4J5K6L",
    time: "11:30",
    type: "Soát vé cửa rạp",
    amount: 0,
    status: "Hợp lệ",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Xử lý click chọn suất chiếu nhanh -> Đẩy dữ liệu qua trang Bán vé bằng Router State
  const handleQuickSell = (show) => {
    navigate("/staff/sell-ticket", {
      state: {
        preSelected: {
          movie: show.movie,
          showtime: show.showtime,
        },
      },
    });
  };

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
        <button className="staff-card-flat px-6 py-3 rounded-full text-sm font-bold hover:bg-white/10 transition-colors border border-white/20 flex items-center gap-2">
          <TrendingUp size={16} />
          Chốt Ca & Bàn Giao
        </button>
      </div>

      {/* STATS CARDS */}
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
        {/* SUẤT CHIẾU SẮP DIỄN RA */}
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
                  title="Click để vào màn hình bán vé nhanh cho suất này"
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

        {/* HOẠT ĐỘNG GẦN ĐÂY */}
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
