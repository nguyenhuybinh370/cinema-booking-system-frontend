import { useState, useEffect } from "react";

// Giả lập dữ liệu Sơ đồ ghế (SEAT_LAYOUT)
const TONG_HANG = 8;
const TONG_COT = 12;
const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const PRICE_PER_SEAT = 85000;

// Giả lập trạng thái ghế đã bán
const SOLD_SEATS = ["C5", "C6", "D5", "D6", "D7", "F10", "F11"];
const AISLE_COLUMNS = [6, 7];

const HOLD_TIME_SECONDS = 300; // 5 phút giữ ghế

const Step2_SelectSeat = ({ onNext, onPrev, bookingData }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeLeft, setTimeLeft] = useState(HOLD_TIME_SECONDS);

  // LOGIC ĐẾM NGƯỢC THỜI GIAN
  useEffect(() => {
    let timer;
    // Nếu có chọn ghế và thời gian còn > 0 thì đếm ngược
    if (selectedSeats.length > 0 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    // Hết giờ (Time out)
    else if (timeLeft === 0 && selectedSeats.length > 0) {
      alert(
        "Đã hết thời gian giữ ghế! Vui lòng chọn lại từ đầu để đảm bảo tính công bằng.",
      );
      setSelectedSeats([]); // Xóa rổ hàng
      setTimeLeft(HOLD_TIME_SECONDS); // Reset thời gian
    }

    // Cleanup interval khi component unmount hoặc re-render
    return () => clearInterval(timer);
  }, [selectedSeats.length, timeLeft]);

  // Xử lý chọn/bỏ chọn ghế
  const handleSeatClick = (seatId) => {
    if (SOLD_SEATS.includes(seatId)) return;

    setSelectedSeats((prev) => {
      const isRemoving = prev.includes(seatId);
      const newSeats = isRemoving
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId];

      // Nếu rổ hàng trống sau khi click (bỏ chọn ghế cuối cùng) -> Reset đồng hồ
      if (newSeats.length === 0) {
        setTimeLeft(HOLD_TIME_SECONDS);
      }
      return newSeats;
    });
  };

  const totalPrice = selectedSeats.length * PRICE_PER_SEAT;

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    onNext({
      seats: selectedSeats,
      totalPrice: totalPrice,
      // Khi làm thật có thể truyền thêm ID phiên giữ ghế (Hold Session ID) vào đây
    });
  };

  // Helper format thời gian MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Cảnh báo khi còn dưới 1 phút (nhấp nháy đỏ)
  const isUrgent = timeLeft > 0 && timeLeft <= 60;

  return (
    <div className="flex gap-8 h-full relative">
      {/* Cột trái: Hiển thị Sơ đồ ghế (Giữ nguyên như cũ) */}
      <div className="flex-[2] glass-effect rounded-3xl p-8 flex flex-col items-center relative overflow-hidden">
        {/* Màn hình */}
        <div className="w-[80%] h-12 mb-12 relative flex items-center justify-center">
          <div className="absolute top-0 w-full h-full border-t-4 border-[var(--btn-neon)] rounded-[50%] blur-[2px] opacity-70"></div>
          <div className="absolute top-[-10px] w-full h-full border-t-2 border-[var(--btn-neon)] rounded-[50%] shadow-[0_-15px_30px_rgba(253,224,71,0.3)]"></div>
          <span className="text-white/50 text-sm tracking-[0.5em] uppercase font-bold mt-4">
            Màn hình chính
          </span>
        </div>

        {/* Lưới ghế */}
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

                return (
                  <button
                    key={seatId}
                    disabled={isSold}
                    onClick={() => handleSeatClick(seatId)}
                    className={`w-8 h-8 rounded-t-lg rounded-b-sm text-[10px] font-bold transition-all duration-300 flex items-center justify-center
                      ${
                        isSold
                          ? "bg-red-500/20 text-red-500 border border-red-500/30 cursor-not-allowed"
                          : isSelected
                            ? "bg-[var(--btn-neon)] text-slate-900 shadow-[0_0_10px_rgba(253,224,71,0.5)] scale-110"
                            : "bg-white/10 text-white/60 border border-white/20 hover:border-[var(--btn-neon)] hover:text-[var(--btn-neon)]"
                      }
                    `}
                  >
                    {seatNum}
                  </button>
                );
              })}
              <div className="w-8 text-center text-white/40 font-bold text-sm">
                {row}
              </div>
            </div>
          ))}
        </div>

        {/* Chú thích */}
        <div className="mt-12 flex gap-8 border-t border-white/10 pt-6 w-full justify-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/10 border border-white/20"></div>
            <span className="text-sm text-white/60">Trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[var(--btn-neon)] shadow-[0_0_10px_rgba(253,224,71,0.5)]"></div>
            <span className="text-sm text-white/60">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-red-500/20 border border-red-500/30"></div>
            <span className="text-sm text-white/60">Đã bán</span>
          </div>
        </div>
      </div>

      {/* Cột phải: Thông tin vé & Thanh toán */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
        {/* HIỂU ỨNG ĐỒNG HỒ ĐẾM NGƯỢC */}
        {selectedSeats.length > 0 && (
          <div
            className={`absolute top-0 left-0 w-full py-2 flex justify-center items-center gap-2 font-mono font-bold text-lg border-b
            ${
              isUrgent
                ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                : "bg-[var(--btn-neon)]/10 border-[var(--btn-neon)]/30 text-[var(--btn-neon)]"
            }
          `}
          >
            <span>⏱ Thời gian giữ ghế:</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}

        {/* Nội dung chi tiết (đẩy xuống một chút để nhường chỗ cho đồng hồ) */}
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
                  Giờ chiếu
                </p>
                <p className="font-bold">{bookingData.showtime?.time}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50 uppercase mb-1">Phòng</p>
                <p className="font-bold">{bookingData.showtime?.room}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-white/50 uppercase mb-2">
              Ghế đang chọn ({selectedSeats.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.length === 0 ? (
                <span className="text-sm text-white/30 italic">
                  Chưa chọn ghế nào...
                </span>
              ) : (
                selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="px-3 py-1 bg-white/10 rounded border border-white/20 text-sm font-bold"
                  >
                    {seat}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tổng tiền và Nút điều hướng */}
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
