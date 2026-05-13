import { useState, useEffect } from "react";

// Cấu trúc phòng
const TONG_HANG = 8;
const TONG_COT = 12;
const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const AISLE_COLUMNS = [6, 7];
const SOLD_SEATS = ["C5", "C6", "F10", "F11", "H1", "H2"]; // Mock ghế đã bán

// Cấu hình Loại Ghế (Bảng LOAIGHE)
const SEAT_TYPES = {
  REGULAR: {
    name: "Thường",
    surcharge: 0,
    color: "border-white/30 text-white/60 hover:border-white hover:text-white",
  },
  VIP: {
    name: "VIP",
    surcharge: 15000,
    color:
      "border-red-500/60 text-red-400 hover:border-red-400 hover:text-red-300 bg-red-500/10",
  },
  COUPLE: {
    name: "Ghế Đôi",
    surcharge: 25000,
    color:
      "border-pink-500/60 text-pink-400 hover:border-pink-400 hover:text-pink-300 bg-pink-500/10",
  },
};

// Hàm định tuyến Hàng -> Loại ghế
const getSeatType = (row) => {
  if (["A", "B", "C", "D"].includes(row)) return SEAT_TYPES.REGULAR;
  if (["E", "F", "G"].includes(row)) return SEAT_TYPES.VIP;
  if (row === "H") return SEAT_TYPES.COUPLE;
  return SEAT_TYPES.REGULAR;
};

const HOLD_TIME_SECONDS = 300; // 5 phút

const Step2_SelectSeat = ({ onNext, onPrev, bookingData }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeLeft, setTimeLeft] = useState(HOLD_TIME_SECONDS);

  // Lấy giá trị cơ bản của Suất chiếu (Giá gốc + Phụ thu Phòng + Phụ thu Ngày)
  const baseTicketPrice =
    (bookingData.showtime?.basePrice || 0) +
    (bookingData.showtime?.roomSurcharge || 0) +
    (bookingData.showtime?.daySurcharge || 0);

  // LOGIC ĐẾM NGƯỢC
  useEffect(() => {
    let timer;
    if (selectedSeats.length > 0 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && selectedSeats.length > 0) {
      alert("Đã hết thời gian giữ ghế! Vui lòng chọn lại.");
      setSelectedSeats([]);
      setTimeLeft(HOLD_TIME_SECONDS);
    }
    return () => clearInterval(timer);
  }, [selectedSeats.length, timeLeft]);

  // Xử lý chọn ghế
  const handleSeatClick = (seatId) => {
    if (SOLD_SEATS.includes(seatId)) return;
    setSelectedSeats((prev) => {
      const newSeats = prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId];
      if (newSeats.length === 0) setTimeLeft(HOLD_TIME_SECONDS);
      return newSeats;
    });
  };

  // Tính toán Tổng tiền phức hợp
  let totalPrice = 0;
  const breakdown = { REGULAR: [], VIP: [], COUPLE: [] };

  selectedSeats.forEach((seatId) => {
    const row = seatId.charAt(0);
    const typeInfo = getSeatType(row);
    const finalPriceForThisSeat = baseTicketPrice + typeInfo.surcharge;

    totalPrice += finalPriceForThisSeat;

    // Gom nhóm để hiển thị
    if (typeInfo.name === "Thường") breakdown.REGULAR.push(seatId);
    if (typeInfo.name === "VIP") breakdown.VIP.push(seatId);
    if (typeInfo.name === "Ghế Đôi") breakdown.COUPLE.push(seatId);
  });

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    onNext({ seats: selectedSeats, totalPrice: totalPrice });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex gap-8 h-full relative">
      {/* --- CỘT TRÁI: MA TRẬN GHẾ --- */}
      <div className="flex-[2] glass-effect rounded-3xl p-8 flex flex-col items-center relative overflow-hidden">
        <div className="w-[80%] h-12 mb-12 relative flex items-center justify-center">
          <div className="absolute top-0 w-full h-full border-t-4 border-[var(--btn-neon)] rounded-[50%] blur-[2px] opacity-70"></div>
          <div className="absolute top-[-10px] w-full h-full border-t-2 border-[var(--btn-neon)] rounded-[50%] shadow-[0_-15px_30px_rgba(253,224,71,0.3)]"></div>
          <span className="text-white/50 text-sm tracking-[0.5em] uppercase font-bold mt-4">
            Màn hình chính
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {ROWS.map((row) => (
            <div key={row} className="flex gap-2 items-center justify-center">
              <div className="w-8 text-center text-white/40 font-bold text-sm">
                {row}
              </div>

              {Array.from({ length: TONG_COT }).map((_, colIndex) => {
                const seatNum = colIndex + 1;
                const seatId = `${row}${seatNum}`;

                if (AISLE_COLUMNS.includes(seatNum)) {
                  return (
                    <div key={`aisle-${seatId}`} className="w-8 h-8"></div>
                  );
                }

                const isSold = SOLD_SEATS.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);
                const seatType = getSeatType(row);

                // Nếu ghế Đôi thì nối 2 ô lại (UI Trick)
                const isCouple = seatType.name === "Ghế Đôi";

                return (
                  <button
                    key={seatId}
                    disabled={isSold}
                    onClick={() => handleSeatClick(seatId)}
                    className={`h-8 rounded-t-lg rounded-b-sm text-[10px] font-bold transition-all duration-300 flex items-center justify-center border
                      ${isCouple ? "w-[72px]" : "w-8"} 
                      ${
                        isSold
                          ? "bg-red-500/20 text-red-500 border-red-500/30 cursor-not-allowed opacity-50"
                          : isSelected
                            ? "bg-[var(--btn-neon)] text-slate-900 border-[var(--btn-neon)] shadow-[0_0_10px_rgba(253,224,71,0.5)] scale-110"
                            : seatType.color
                      }
                    `}
                  >
                    {isCouple ? "COUPLE" : seatNum}
                  </button>
                );
              })}
              <div className="w-8 text-center text-white/40 font-bold text-sm">
                {row}
              </div>
            </div>
          ))}
        </div>

        {/* Chú thích màu sắc */}
        <div className="mt-12 flex gap-8 border-t border-white/10 pt-6 w-full justify-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-white/30 bg-white/5"></div>
            <span className="text-sm text-white/60">Thường</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-red-500/60 bg-red-500/10"></div>
            <span className="text-sm text-white/60">VIP (+15k)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 rounded border border-pink-500/60 bg-pink-500/10"></div>
            <span className="text-sm text-white/60">Ghế Đôi (+25k)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[var(--btn-neon)]"></div>
            <span className="text-sm text-white/60">Đang chọn</span>
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI: CHI TIẾT ĐẶT VÉ --- */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
        {selectedSeats.length > 0 && (
          <div
            className={`absolute top-0 left-0 w-full py-2 flex justify-center items-center gap-2 font-mono font-bold text-lg border-b
            ${timeLeft <= 60 ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse" : "bg-[var(--btn-neon)]/10 border-[var(--btn-neon)]/30 text-[var(--btn-neon)]"}
          `}
          >
            <span>⏱ Giữ ghế: {formatTime(timeLeft)}</span>
          </div>
        )}

        <div className={selectedSeats.length > 0 ? "mt-12" : ""}>
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
                <p className="text-xs text-white/50 uppercase mb-1">
                  Suất chiếu
                </p>
                <p className="font-bold">
                  {bookingData.showtime?.time} • {bookingData.showtime?.room}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50 uppercase mb-1">
                  Giá cơ bản
                </p>
                <p className="font-bold text-green-400">
                  {baseTicketPrice.toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xs text-white/50 uppercase">
              Ghế đang chọn ({selectedSeats.length})
            </p>

            {selectedSeats.length === 0 && (
              <span className="text-sm text-white/30 italic">
                Chưa chọn ghế nào...
              </span>
            )}

            {/* Render ghế theo nhóm */}
            {breakdown.REGULAR.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="w-16 text-xs text-white/40 pt-1">Thường:</span>
                <div className="flex flex-wrap gap-1">
                  {breakdown.REGULAR.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {breakdown.VIP.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="w-16 text-xs text-red-400 pt-1">VIP:</span>
                <div className="flex flex-wrap gap-1">
                  {breakdown.VIP.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-red-500/20 rounded border border-red-500/30 text-red-200 text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {breakdown.COUPLE.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="w-16 text-xs text-pink-400 pt-1">Đôi:</span>
                <div className="flex flex-wrap gap-1">
                  {breakdown.COUPLE.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-pink-500/20 rounded border border-pink-500/30 text-pink-200 text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
              className="px-6 py-3 rounded-full font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-colors uppercase text-sm border border-white/10"
            >
              Quay lại
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className={`flex-1 btn-bright ${selectedSeats.length === 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
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
