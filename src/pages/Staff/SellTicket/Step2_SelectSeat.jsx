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
      <div className="flex items-center justify-center h-64 text-white/50 font-bold uppercase tracking-wider">
        Đang tải sơ đồ ghế...
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
    <div className="flex gap-8 h-full relative">
      {/* --- CỘT TRÁI: MA TRẬN GHẾ DỰA TRÊN SƠ ĐỒ DÂN DỤNG --- */}
      <div className="flex-[2] glass-effect rounded-3xl p-8 flex flex-col items-center relative overflow-hidden overflow-x-auto max-h-[70vh]">
        <div className="w-[80%] h-12 mb-12 relative flex items-center justify-center shrink-0">
          <div className="absolute top-0 w-full h-full border-t-4 border-[var(--btn-neon)] rounded-[50%] blur-[2px] opacity-70"></div>
          <div className="absolute top-[-10px] w-full h-full border-t-2 border-[var(--btn-neon)] rounded-[50%] shadow-[0_-15px_30px_rgba(253,224,71,0.3)]"></div>
          <span className="text-white/50 text-sm tracking-[0.5em] uppercase font-bold mt-4">
            Màn hình chính
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
                <div className="w-8 text-center text-white/40 font-bold text-sm shrink-0">
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
                  let typeColorClass = "border-white/30 text-white/60 hover:border-white hover:text-white";
                  if (seat.TenLoaiGhe.toUpperCase().includes("VIP")) {
                    typeColorClass = "border-red-500/60 text-red-400 hover:border-red-400 hover:text-red-300 bg-red-500/10";
                  } else if (seat.TenLoaiGhe.toUpperCase().includes("ĐÔI") || seat.TenLoaiGhe.toUpperCase().includes("COUPLE")) {
                    typeColorClass = "border-pink-500/60 text-pink-400 hover:border-pink-400 hover:text-pink-300 bg-pink-500/10";
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
                            ? "bg-red-500/20 text-red-500 border-red-500/30 cursor-not-allowed opacity-50"
                            : isHeld
                            ? "bg-orange-500/20 text-orange-400 border-orange-500/30 cursor-not-allowed opacity-60"
                            : isSelected
                            ? "bg-[var(--btn-neon)] text-slate-900 border-[var(--btn-neon)] shadow-[0_0_10px_rgba(253,224,71,0.5)] scale-110"
                            : typeColorClass
                        }
                      `}
                      title={`${seat.TenGhe} - ${seat.TenLoaiGhe} (${seat.GiaVeTinhToan.toLocaleString()}đ)`}
                    >
                      {isCouple ? "COUPLE" : colNum}
                    </button>
                  );
                })}

                <div className="w-8 text-center text-white/40 font-bold text-sm shrink-0">
                  {rowLetter}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-4 w-full justify-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-white/30 bg-white/5"></div>
            <span className="text-xs text-white/60">Thường</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-red-500/60 bg-red-500/10"></div>
            <span className="text-xs text-white/60">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 rounded border border-pink-500/60 bg-pink-500/10"></div>
            <span className="text-xs text-white/60">Đôi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[var(--btn-neon)]"></div>
            <span className="text-xs text-white/60">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-orange-500/30 bg-orange-500/20"></div>
            <span className="text-xs text-white/60">Đang giữ (Online)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-red-500/30 bg-red-500/20 opacity-50"></div>
            <span className="text-xs text-white/60">Đã bán</span>
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI: CHI TIẾT ĐẶT VÉ --- */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col justify-between overflow-y-auto max-h-[70vh]">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest text-center">
            Chi Tiết Đặt Vé
          </h2>

          <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-xs text-white/50 uppercase mb-1">Phim</p>
              <p className="font-bold text-lg text-[var(--btn-neon)]">
                {bookingData.movie?.title}
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-white/50 uppercase mb-1">Suất chiếu</p>
                <p className="font-bold">
                  {bookingData.showtime?.time} • {bookingData.showtime?.room}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-white/50 uppercase font-bold">
              Ghế đang chọn ({selectedSeats.length})
            </p>

            {selectedSeats.length === 0 && (
              <span className="text-sm text-white/30 italic">
                Chưa chọn ghế nào...
              </span>
            )}

            {Object.keys(breakdown).map((typeName) => (
              <div key={typeName} className="flex items-start gap-2">
                <span className="w-20 text-xs text-white/40 pt-1 truncate">{typeName}:</span>
                <div className="flex flex-wrap gap-1">
                  {breakdown[typeName].map((seatName) => (
                    <span
                      key={seatName}
                      className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-xs font-bold font-mono"
                    >
                      {seatName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex justify-between items-end mb-6">
            <span className="text-sm text-white/60 uppercase tracking-widest">
              Tổng tiền
            </span>
            <span className="text-3xl font-black text-glow text-[var(--btn-neon)]">
              {totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onPrev}
              className="px-6 py-3 rounded-full font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-colors uppercase text-sm border border-white/10 cursor-pointer"
            >
              Quay lại
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className={`flex-1 btn-bright cursor-pointer ${selectedSeats.length === 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
            >
              Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_SelectSeat;
