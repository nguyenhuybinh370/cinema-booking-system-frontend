import { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";

const HOLD_TIME_SECONDS = 300; // 5 phút visual-only

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
          <div className="w-12 h-12 border-4 border-[var(--btn-neon)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-glow text-[var(--btn-neon)] text-sm">Đang tải sơ đồ ghế...</span>
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

  // Group selected seats for the invoice breakdown display
  const breakdown = {};
  selectedSeats.forEach((seat) => {
    const typeName = seat.TenLoaiGhe;
    if (!breakdown[typeName]) {
      breakdown[typeName] = [];
    }
    breakdown[typeName].push(seat.TenGhe);
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full relative min-h-0">
      {/* --- CỘT TRÁI: MA TRẬN GHẾ DỰA TRÊN SƠ ĐỒ DÂN DỤNG --- */}
      <div className="flex-[2] glass-effect rounded-3xl p-8 flex flex-col items-center relative overflow-hidden overflow-x-auto max-h-[70vh] border border-white/5 shadow-2xl bg-[#131A2A]/40">
        
        {/* Luxury curved screen indicator */}
        <div className="w-[80%] mb-14 relative flex flex-col items-center shrink-0">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[var(--btn-neon)] to-transparent rounded-full shadow-[0_0_25px_rgba(255,176,0,0.9)]"></div>
          <div className="w-[90%] h-10 bg-gradient-to-b from-[var(--btn-neon)]/10 to-transparent blur-md rounded-t-full mt-0.5"></div>
          <span className="text-[var(--btn-neon)]/40 text-[10px] tracking-[0.6em] uppercase font-black mt-2 text-glow">
            Màn hình hiển thị
          </span>
        </div>

        <div className="flex flex-col gap-3 min-w-max p-4">
          {sortedRowKeys.map((rowLetter) => {
            const rowSeats = seatsByRow[rowLetter] || [];
            
            // Build columns mapping to detect aisles
            const colMap = {};
            rowSeats.forEach((seat) => {
              const colNum = parseInt(seat.TenGhe.substring(1), 10);
              colMap[colNum] = seat;
            });

            return (
              <div key={rowLetter} className="flex gap-2 items-center justify-center">
                <div className="w-8 text-center text-slate-500 font-extrabold text-xs shrink-0 font-mono">
                  {rowLetter}
                </div>

                {Array.from({ length: totalCols }).map((_, idx) => {
                  const colNum = idx + 1;
                  const seat = colMap[colNum];

                  // Aisle gap if no seat is configured in this grid slot
                  if (!seat) {
                    return (
                      <div key={`aisle-${rowLetter}-${colNum}`} className="w-8 h-8 shrink-0"></div>
                    );
                  }

                  const isSold = seat.TrangThai === "DA_DAT";
                  const isHeld = seat.TrangThai === "DANG_GIU";
                  const isSelected = selectedSeats.some((s) => s.MaGheSuatChieu === seat.MaGheSuatChieu);
                  
                  // Color configuration based on type names from backend
                  let typeColorClass = "border-slate-700 bg-slate-800/40 text-slate-300 hover:border-[var(--btn-neon)]/75 hover:text-white hover:bg-slate-800/60";
                  if (seat.TenLoaiGhe.toUpperCase().includes("VIP")) {
                    typeColorClass = "border-amber-600/50 bg-amber-950/20 text-amber-400 hover:border-amber-400 hover:text-amber-200 hover:bg-amber-950/30";
                  } else if (seat.TenLoaiGhe.toUpperCase().includes("ĐÔI") || seat.TenLoaiGhe.toUpperCase().includes("COUPLE")) {
                    typeColorClass = "border-pink-500/50 bg-pink-950/15 text-pink-400 hover:border-pink-400 hover:text-pink-200 hover:bg-pink-950/25";
                  }

                  const isCouple = seat.TenLoaiGhe.toUpperCase().includes("ĐÔI") || seat.TenLoaiGhe.toUpperCase().includes("COUPLE");

                  return (
                    <button
                      key={seat.MaGheSuatChieu}
                      disabled={isSold || isHeld}
                      onClick={() => handleSeatClick(seat)}
                      className={`h-8 rounded-t-lg rounded-b-sm text-[10px] font-bold transition-all duration-300 flex items-center justify-center border shrink-0 cursor-pointer
                        ${isCouple ? "w-[72px]" : "w-8"} 
                        ${
                          isSold
                            ? "bg-slate-900/80 text-slate-700 border-slate-800/50 cursor-not-allowed opacity-30"
                            : isHeld
                            ? "bg-orange-950/35 text-orange-500/70 border-orange-950/50 cursor-not-allowed opacity-40"
                            : isSelected
                            ? "bg-gradient-to-r from-[var(--btn-neon)] to-[#E59A00] text-slate-950 border-transparent shadow-[0_0_15px_rgba(255,176,0,0.5)] font-extrabold scale-105"
                            : typeColorClass
                        }
                      `}
                      title={`${seat.TenGhe} - ${seat.TenLoaiGhe} (${seat.GiaVeTinhToan.toLocaleString()}đ)`}
                    >
                      {isCouple ? "COUPLE" : colNum}
                    </button>
                  );
                })}

                <div className="w-8 text-center text-slate-500 font-extrabold text-xs shrink-0 font-mono">
                  {rowLetter}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-5 border-t border-white/5 pt-5 w-full justify-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-t bg-slate-800/40 border border-slate-700"></div>
            <span className="text-[11px] text-slate-400 font-medium">Thường</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-t bg-amber-950/20 border border-amber-600/50"></div>
            <span className="text-[11px] text-slate-400 font-medium">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded-t bg-pink-950/15 border border-pink-500/50"></div>
            <span className="text-[11px] text-slate-400 font-medium">Đôi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-t bg-gradient-to-r from-[var(--btn-neon)] to-[#E59A00] shadow-[0_0_8px_rgba(255,176,0,0.5)]"></div>
            <span className="text-[11px] text-slate-400 font-medium">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-t bg-orange-950/35 border border-orange-950/50 opacity-40"></div>
            <span className="text-[11px] text-slate-400 font-medium">Đang giữ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-t bg-slate-900/80 border border-slate-800/50 opacity-30"></div>
            <span className="text-[11px] text-slate-400 font-medium">Đã bán</span>
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI: CHI TIẾT ĐẶT VÉ --- */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col justify-between overflow-y-auto max-h-[70vh] border border-white/5 shadow-2xl bg-[#131A2A]/40 min-w-[320px]">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-extrabold text-glow uppercase tracking-widest text-[var(--btn-neon)]">
              Chi Tiết Đặt Vé
            </h2>
            {selectedSeats.length > 0 && (
              <span className="px-3 py-1 bg-red-950/60 border border-red-500/30 text-red-400 rounded-full font-mono text-xs font-bold animate-pulse">
                ⏱ {formatTime(timeLeft)}
              </span>
            )}
          </div>

          <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Phim</p>
              <p className="font-extrabold text-base text-white uppercase">
                {bookingData.movie?.title}
              </p>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Suất chiếu</p>
                <p className="font-bold text-sm text-[var(--btn-neon)]">
                  {bookingData.showtime?.time} • {bookingData.showtime?.room}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">
              Ghế đang chọn ({selectedSeats.length})
            </p>

            {selectedSeats.length === 0 && (
              <div className="text-sm text-slate-500 italic py-2">
                Chưa chọn ghế nào...
              </div>
            )}

            {Object.keys(breakdown).map((typeName) => (
              <div key={typeName} className="flex items-start gap-2 border-b border-white/5 pb-2">
                <span className="w-20 text-xs text-slate-400 font-bold pt-1 truncate">{typeName}:</span>
                <div className="flex flex-wrap gap-1">
                  {breakdown[typeName].map((seatName) => (
                    <span
                      key={seatName}
                      className="px-2 py-0.5 bg-[var(--btn-neon)]/10 text-[var(--btn-neon)] rounded border border-[var(--btn-neon)]/20 text-xs font-black font-mono"
                    >
                      {seatName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
          <div className="flex justify-between items-end mb-6">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Tổng tiền
            </span>
            <span className="text-3xl font-black text-glow text-[var(--btn-neon)] tracking-tight">
              {totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onPrev}
              className="px-6 py-3 rounded-full font-bold text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 uppercase text-xs tracking-wider border border-white/5 cursor-pointer"
            >
              Quay lại
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className={`flex-1 btn-bright cursor-pointer ${selectedSeats.length === 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
            >
              Tiếp Tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_SelectSeat;
