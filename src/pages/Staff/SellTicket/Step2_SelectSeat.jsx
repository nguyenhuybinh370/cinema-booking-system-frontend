import { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";
import StaffSeatMap from "./StaffSeatMap";
import SeatLegend from "./SeatLegend";

const HOLD_TIME_SECONDS = 300; // 5 phút visual-only

const Step2_SelectSeat = ({ onNext, onPrev, bookingData }) => {
  const [seatMapData, setSeatMapData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeLeft, setTimeLeft] = useState(HOLD_TIME_SECONDS);
  const [isLoading, setIsLoading] = useState(true);

  // Load Seat Map from Backend — GET /staff/ban-ve/suat-chieu/:maSuatChieu/ghe
  useEffect(() => {
    const loadSeatMap = async () => {
      try {
        setIsLoading(true);
        const res = await axiosClient.get(`/staff/ban-ve/suat-chieu/${bookingData.showtime.id}/ghe`);
        setSeatMapData(res);
      } catch (err) {
        console.error("Error loading seat map:", err);
        alert("Không thể tải sơ đồ ghế của suất chiếu này.");
      } finally {
        setIsLoading(false);
      }
    };
    if (bookingData.showtime?.id) {
      loadSeatMap();
    }
  }, [bookingData.showtime]);

  // Visual-only countdown (does not clear seats on expiry)
  useEffect(() => {
    let timer;
    if (selectedSeats.length > 0 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && selectedSeats.length > 0) {
      setTimeLeft(HOLD_TIME_SECONDS);
    }
    return () => clearInterval(timer);
  }, [selectedSeats.length, timeLeft]);

  // Reset timer when seats cleared
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setTimeLeft(HOLD_TIME_SECONDS);
    }
  }, [selectedSeats.length]);

  if (isLoading || !seatMapData) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-bold uppercase tracking-wider">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FFB000] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-glow text-[#FFB000] text-sm">Đang tải sơ đồ ghế...</span>
        </div>
      </div>
    );
  }

  const handleSeatClick = (seat) => {
    if (seat.TrangThai !== "TRONG") return;
    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.some((s) => s.MaGheSuatChieu === seat.MaGheSuatChieu);
      return isAlreadySelected
        ? prev.filter((s) => s.MaGheSuatChieu !== seat.MaGheSuatChieu)
        : [...prev, seat];
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.GiaVeTinhToan, 0);

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    onNext({ seats: selectedSeats, totalPrice });
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-6">
      {/* Seat map area */}
      <div className="flex-1 bg-[#0D1321] rounded-2xl p-6 flex flex-col items-center overflow-auto border border-white/[0.06] min-h-0">

        {/* Screen indicator */}
        <div className="w-full max-w-3xl mb-12 flex items-center justify-between shrink-0 select-none px-4 mt-2">
          <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black hidden md:inline">
            MÀN HÌNH CONG CAO CẤP
          </span>
          <div className="w-64 h-16 relative flex items-center justify-center mx-4">
            <div className="absolute inset-0 bg-blue-500/5 rounded blur-md"></div>
            <div className="w-full h-full border border-blue-500/30 rounded bg-[#131A2A]/40 flex items-center justify-center shadow-[inset_0_0_15px_rgba(59,130,246,0.1)] relative">
              <div className="absolute top-1 inset-x-4 h-1 border-t border-blue-400/60 rounded-[100%] shadow-[0_-2px_6px_rgba(96,165,250,0.4)]"></div>
              <svg className="w-7 h-7 text-blue-400/80 mt-1 filter drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="13" rx="2" />
                <path d="M12 16v5M9 21h6M9 8l5 3.5L9 15V8z" />
              </svg>
            </div>
          </div>
          <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black hidden md:inline">
            MÀN HÌNH CONG CAO CẤP
          </span>
        </div>

        <SeatLegend />

        {/* Seat grid */}
        <div className="w-full overflow-x-auto pb-4 flex justify-start lg:justify-center" style={{ scrollbarGutter: 'stable' }}>
          <StaffSeatMap
            seatMapData={seatMapData}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
          />
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="bg-[#131A2A]/90 border border-white/[0.08] rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
        <div className="flex flex-wrap items-center gap-6 md:gap-12">
          <button
            onClick={onPrev}
            className="px-4 py-2 rounded bg-white/5 hover:bg-white/15 text-slate-300 transition-all text-xs font-black uppercase tracking-wider border border-white/10 cursor-pointer"
          >
            QUAY LẠI
          </button>

          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">GHẾ ĐÃ CHỌN:</span>
            <span className="text-sm font-black text-white font-mono mt-0.5 min-h-[20px]">
              {selectedSeats.length === 0 ? "CHƯA CHỌN" : selectedSeats.map((s) => s.TenGhe).join(", ")}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">TỔNG TIỀN:</span>
            <span className="text-sm font-black text-[#FFB000] font-mono mt-0.5">
              {totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>

          {selectedSeats.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-950/20 border border-red-500/20 text-red-400 rounded text-xs font-bold font-mono animate-pulse">
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}
          className={`px-6 py-2.5 rounded text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            selectedSeats.length === 0
              ? "bg-slate-800 text-slate-500 border border-transparent cursor-not-allowed"
              : "bg-[#FFB000] text-slate-950 border border-[#FFB000] hover:bg-[#FFB000]/80 shadow-[0_0_15px_rgba(255,176,0,0.15)]"
          }`}
        >
          TIẾP TỤC THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default Step2_SelectSeat;
