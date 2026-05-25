import { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";

const HOLD_TIME_SECONDS = 300; // 5 phút visual-only

// Detailed cinema armchair SVG
const SeatIcon = ({ className, strokeClassName }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Backrest */}
    <path d="M6 4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v9H6V4z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.75" />
    {/* Cushion */}
    <path d="M5 13c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-3z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} />
    {/* Left Armrest */}
    <rect x="3" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
    {/* Right Armrest */}
    <rect x="18.5" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
  </svg>
);

// Detailed double armchair SVG for Couple/Double seats
const CoupleSeatIcon = ({ className, strokeClassName }) => (
  <svg className={className} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Backrest */}
    <path d="M6 4c0-1.1.9-2 2-2h32c1.1 0 2 .9 2 2v9H6V4z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.75" />
    {/* Cushion */}
    <path d="M5 13c0-1.1.9-2 2-2h34c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-3z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} />
    {/* Left Armrest */}
    <rect x="3" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
    {/* Right Armrest */}
    <rect x="42.5" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
  </svg>
);

const Step2_SelectSeat = ({ onNext, onPrev, bookingData }) => {
  const [seatMapData, setSeatMapData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeLeft, setTimeLeft] = useState(HOLD_TIME_SECONDS);
  const [isLoading, setIsLoading] = useState(true);

  // Load Seat Map from Backend
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

  // LOGIC ĐẾM NGƯỢC (Visual-only, does not clear seats)
  useEffect(() => {
    let timer;
    if (selectedSeats.length > 0 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && selectedSeats.length > 0) {
      setTimeLeft(HOLD_TIME_SECONDS); // Loop or reset visual timer quietly
    }
    return () => clearInterval(timer);
  }, [selectedSeats.length, timeLeft]);

  // Reset timer on seat change from 0
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

  const { SoDoGhe, Ghe: gheList } = seatMapData;
  const totalCols = SoDoGhe.TongCot;

  // Group seats by row letter
  const seatsByRow = {};
  gheList.forEach((seat) => {
    const rowLetter = seat.TenGhe.charAt(0);
    if (!seatsByRow[rowLetter]) {
      seatsByRow[rowLetter] = [];
    }
    seatsByRow[rowLetter].push(seat);
  });

  // Sort each row's seats by column number
  Object.keys(seatsByRow).forEach((row) => {
    seatsByRow[row].sort((a, b) => {
      const colA = parseInt(a.TenGhe.substring(1), 10);
      const colB = parseInt(b.TenGhe.substring(1), 10);
      return colA - colB;
    });
  });

  const sortedRowKeys = Object.keys(seatsByRow).sort();

  const handleSeatClick = (seat) => {
    if (seat.TrangThai !== "TRONG") return;

    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.some((s) => s.MaGheSuatChieu === seat.MaGheSuatChieu);
      if (isAlreadySelected) {
        return prev.filter((s) => s.MaGheSuatChieu !== seat.MaGheSuatChieu);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    onNext({ seats: selectedSeats, totalPrice: totalPrice });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Calculate total price using pre-calculated backend GiaVeTinhToan
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.GiaVeTinhToan, 0);

  return (
    <div className="flex flex-col h-full min-h-0 gap-6">
      {/* Seat map area */}
      <div className="flex-1 bg-[#0D1321] rounded-2xl p-6 flex flex-col items-center overflow-auto border border-white/[0.06] min-h-0">
        
        {/* Screen indicator */}
        <div className="w-full max-w-3xl mb-12 flex items-center justify-between shrink-0 select-none px-4 mt-2">
          <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black hidden md:inline">
            MÀN HÌNH CONG CAO CẤP
          </span>

          {/* Curved screen frame */}
          <div className="w-64 h-16 relative flex items-center justify-center mx-4">
            <div className="absolute inset-0 bg-blue-500/5 rounded blur-md"></div>
            {/* SVG shape path for a curved trapezoid screen */}
            <div className="w-full h-full border border-blue-500/30 rounded bg-[#131A2A]/40 flex items-center justify-center shadow-[inset_0_0_15px_rgba(59,130,246,0.1)] relative">
              {/* Curved border line representation */}
              <div className="absolute top-1 inset-x-4 h-1 border-t border-blue-400/60 rounded-[100%] shadow-[0_-2px_6px_rgba(96,165,250,0.4)]"></div>
              {/* Video project icon */}
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

        {/* Legend (Translated to Vietnamese) */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-8 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <SeatIcon className="w-6 h-6 text-[#232B3A]" strokeClassName="stroke-slate-700/40" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">CÒN TRỐNG</span>
          </div>
          <div className="flex items-center gap-2">
            <SeatIcon className="w-6 h-6 text-[#FFB000] filter drop-shadow-[0_0_8px_rgba(255,176,0,0.4)]" strokeClassName="stroke-[#FFB000]" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ĐANG CHỌN</span>
          </div>
          <div className="flex items-center gap-2 opacity-40">
            <SeatIcon className="w-6 h-6 text-[#0E131F]" strokeClassName="stroke-slate-900/60" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ĐÃ BÁN</span>
          </div>
          <div className="flex items-center gap-2">
            <SeatIcon className="w-6 h-6 text-[#18112C]" strokeClassName="stroke-purple-500/70" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">GHẾ VIP</span>
          </div>
        </div>

        {/* Column numbers header */}
        <div className="flex gap-1.5 items-center justify-center mb-3 min-w-max px-4 shrink-0">
          <div className="w-8 shrink-0"></div>
          {Array.from({ length: totalCols }).map((_, idx) => (
            <div key={idx} className="w-9 h-6 flex items-center justify-center text-xs font-black text-[#FFB000] font-mono shrink-0">
              {idx + 1}
            </div>
          ))}
          <div className="w-8 shrink-0"></div>
        </div>

        {/* Seat grid */}
        <div className="flex flex-col gap-1.5 min-w-max px-4">
          {sortedRowKeys.map((rowLetter) => {
            const rowSeats = seatsByRow[rowLetter] || [];
            
            // Build columns mapping to detect aisles
            const colMap = {};
            rowSeats.forEach((seat) => {
              const colNum = parseInt(seat.TenGhe.substring(1), 10);
              colMap[colNum] = seat;
            });

            return (
              <div key={rowLetter} className="flex gap-1.5 items-center justify-center">
                <div className="w-8 text-center text-[#FFB000] font-black text-sm shrink-0 font-mono">
                  {rowLetter}
                </div>

                {Array.from({ length: totalCols }).map((_, idx) => {
                  const colNum = idx + 1;
                  const seat = colMap[colNum];

                  // Aisle gap if no seat is configured in this grid slot
                  if (!seat) {
                    return (
                      <div key={`aisle-${rowLetter}-${colNum}`} className="w-9 h-9 shrink-0"></div>
                    );
                  }

                  const isSold = seat.TrangThai === "DA_DAT";
                  const isHeld = seat.TrangThai === "DANG_GIU";
                  const isSelected = selectedSeats.some((s) => s.MaGheSuatChieu === seat.MaGheSuatChieu);
                  const isVIP = seat.TenLoaiGhe.toUpperCase().includes("VIP");
                  const isCouple = seat.TenLoaiGhe.toUpperCase().includes("ĐÔI") || seat.TenLoaiGhe.toUpperCase().includes("COUPLE");

                  // Seat icon styling classes
                  let iconClass = "text-[#232B3A]";
                  let strokeClass = "stroke-slate-700/40";
                  let textClass = "text-slate-400 group-hover:text-white";

                  if (isVIP) {
                    iconClass = "text-[#18112C]";
                    strokeClass = "stroke-purple-500/70";
                    textClass = "text-purple-400 group-hover:text-purple-200";
                  }
                  if (isCouple) {
                    iconClass = "text-[#281123]";
                    strokeClass = "stroke-pink-500/60";
                    textClass = "text-pink-400 group-hover:text-pink-200";
                  }
                  if (isSelected) {
                    iconClass = "text-[#FFB000] filter drop-shadow-[0_0_8px_rgba(255,176,0,0.5)]";
                    strokeClass = "stroke-[#FFB000]";
                    textClass = "text-slate-950 font-black";
                  }
                  if (isSold) {
                    iconClass = "text-[#0E131F] opacity-30";
                    strokeClass = "stroke-slate-900/60 opacity-30";
                    textClass = "text-slate-700 font-medium opacity-30";
                  }
                  if (isHeld) {
                    iconClass = "text-[#2A160F] opacity-40";
                    strokeClass = "stroke-orange-900/40 opacity-40";
                    textClass = "text-orange-600/50 font-medium opacity-40";
                  }

                  return (
                    <button
                      key={seat.MaGheSuatChieu}
                      disabled={isSold || isHeld}
                      onClick={() => handleSeatClick(seat)}
                      className={`h-9 rounded transition-all duration-200 flex items-center justify-center shrink-0 relative group select-none border-0 bg-transparent
                        ${isCouple ? "w-[76px]" : "w-9"} 
                        ${isSold || isHeld ? "cursor-not-allowed" : "cursor-pointer"}
                      `}
                      title={`${seat.TenGhe} - ${seat.TenLoaiGhe} (${seat.GiaVeTinhToan.toLocaleString()}đ)`}
                    >
                      {isCouple ? (
                        <CoupleSeatIcon className={`absolute inset-0 w-full h-full ${iconClass}`} strokeClassName={strokeClass} />
                      ) : (
                        <SeatIcon className={`absolute inset-0 w-full h-full ${iconClass}`} strokeClassName={strokeClass} />
                      )}
                      
                      <span className={`relative z-10 text-[9px] font-black font-mono tracking-tighter transition-colors ${textClass}`}>
                        {seat.TenGhe}
                      </span>
                    </button>
                  );
                })}

                <div className="w-8 text-center text-[#FFB000] font-black text-sm shrink-0 font-mono">
                  {rowLetter}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom action bar (Clean simple dark background with Vietnamese labels) */}
      <div className="bg-[#131A2A]/90 border border-white/[0.08] rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
        <div className="flex flex-wrap items-center gap-6 md:gap-12">
          {/* Back button */}
          <button
            onClick={onPrev}
            className="px-4 py-2 rounded bg-white/5 hover:bg-white/15 text-slate-300 transition-all text-xs font-black uppercase tracking-wider border border-white/10 cursor-pointer"
          >
            QUAY LẠI
          </button>

          {/* Selected seats */}
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">GHẾ ĐÃ CHỌN:</span>
            <span className="text-sm font-black text-white font-mono mt-0.5 min-h-[20px]">
              {selectedSeats.length === 0 ? "CHƯA CHỌN" : selectedSeats.map(s => s.TenGhe).join(", ")}
            </span>
          </div>

          {/* Total price */}
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">TỔNG TIỀN:</span>
            <span className="text-sm font-black text-[#FFB000] font-mono mt-0.5">
              {totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>

          {/* Timer */}
          {selectedSeats.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-950/20 border border-red-500/20 text-red-400 rounded text-xs font-bold font-mono animate-pulse">
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* Continue button */}
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
