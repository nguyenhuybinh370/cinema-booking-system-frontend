import { useState } from "react";

const PAYMENT_METHODS = [
  { id: "CASH", name: "Tiền mặt", icon: "💵" },
  { id: "MOMO", name: "MoMo QR", icon: "📱" },
  { id: "VNPAY", name: "VNPay", icon: "💳" },
];

// Cấu hình Loại Ghế (Mang sang từ Bước 2 để bóc tách hóa đơn)
const SEAT_TYPES = {
  REGULAR: { name: "Thường", surcharge: 0, color: "text-white/70" },
  VIP: { name: "VIP", surcharge: 15000, color: "text-red-400" },
  COUPLE: { name: "Ghế Đôi", surcharge: 25000, color: "text-pink-400" },
};

const getSeatType = (row) => {
  if (["A", "B", "C", "D"].includes(row)) return SEAT_TYPES.REGULAR;
  if (["E", "F", "G"].includes(row)) return SEAT_TYPES.VIP;
  if (row === "H") return SEAT_TYPES.COUPLE;
  return SEAT_TYPES.REGULAR;
};

const Step3_Checkout = ({ bookingData, onPrev, onReset }) => {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountGiven, setAmountGiven] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Tính lại Giá cơ bản của 1 vé (Gốc + Phụ thu phòng + Phụ thu ngày)
  const baseTicketPrice =
    (bookingData.showtime?.basePrice || 0) +
    (bookingData.showtime?.roomSurcharge || 0) +
    (bookingData.showtime?.daySurcharge || 0);

  const totalPrice = bookingData.totalPrice || 0;

  // Bóc tách giỏ hàng để in Bill
  const breakdown = { REGULAR: [], VIP: [], COUPLE: [] };
  bookingData.seats?.forEach((seatId) => {
    const row = seatId.charAt(0);
    const typeInfo = getSeatType(row);
    if (typeInfo.name === "Thường") breakdown.REGULAR.push(seatId);
    if (typeInfo.name === "VIP") breakdown.VIP.push(seatId);
    if (typeInfo.name === "Ghế Đôi") breakdown.COUPLE.push(seatId);
  });

  // Xử lý tiền thối
  const numericAmountGiven = parseInt(amountGiven.replace(/\D/g, "")) || 0;
  const changeAmount = numericAmountGiven - totalPrice;
  const isValidAmount =
    paymentMethod !== "CASH" || numericAmountGiven >= totalPrice;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      setAmountGiven(parseInt(value).toLocaleString("vi-VN"));
    } else {
      setAmountGiven("");
    }
  };

  const handleExactAmount = () => {
    setAmountGiven(totalPrice.toLocaleString("vi-VN"));
  };

  const handleCheckout = () => {
    if (!isValidAmount) return;
    setIsProcessing(true);

    // Giả lập thời gian đợi API xử lý hoặc đợi Webhook từ cổng thanh toán
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Hàm xử lý In Vé (Mô phỏng máy in nhiệt POS)
  const handlePrintTicket = () => {
    // 1. Mở một cửa sổ ẩn mới
    const printWindow = window.open("", "_blank", "width=400,height=600");

    // 2. Lấy ngày giờ hiện tại
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    // 3. Chuẩn bị danh sách ghế
    const seatsHtml = bookingData.seats?.join(", ") || "";

    // 4. Đổ mã HTML và CSS (Được style giống bill máy in nhiệt) vào cửa sổ
    const htmlContent = `
      <html>
        <head>
          <title>In Vé - UIT Cinema</title>
          <style>
            body { 
              font-family: 'Courier New', Courier, monospace; 
              color: #000; 
              padding: 20px; 
              display: flex;
              justify-content: center;
            }
            .ticket { 
              width: 300px; 
              border: 1px dashed #000; 
              padding: 20px; 
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #000; 
              padding-bottom: 10px; 
              margin-bottom: 15px; 
            }
            .header h2 { margin: 0; font-size: 24px; font-weight: 900; }
            .header p { margin: 5px 0 0; font-size: 14px; }
            .movie-title { 
              font-size: 20px; 
              font-weight: bold; 
              text-transform: uppercase; 
              text-align: center;
              margin-bottom: 15px; 
            }
            .info-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 8px; 
              font-size: 14px; 
            }
            .seats { 
              font-size: 18px; 
              font-weight: bold; 
              text-align: center;
              margin: 15px 0; 
              padding: 10px 0; 
              border-top: 1px dashed #000; 
              border-bottom: 1px dashed #000; 
            }
            .footer { 
              text-align: center; 
              font-size: 12px; 
              margin-top: 20px; 
              border-top: 2px solid #000;
              padding-top: 10px;
            }
            .barcode {
              text-align: center;
              font-family: 'Libre Barcode 39', cursive; /* Giả lập font mã vạch */
              font-size: 40px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h2>UIT CINEMA</h2>
              <p>Hệ Thống Rạp Chiếu Sinh Viên</p>
            </div>
            
            <div class="movie-title">${bookingData.movie?.title || "Tên Phim"}</div>
            
            <div class="info-row"><span>Ngày in:</span> <span>${dateStr} ${timeStr}</span></div>
            <div class="info-row"><span>Suất chiếu:</span> <span><b>${bookingData.showtime?.time || "--:--"}</b></span></div>
            <div class="info-row"><span>Phòng:</span> <span><b>${bookingData.showtime?.room || "---"}</b></span></div>
            
            <div class="seats">GHẾ: ${seatsHtml}</div>
            
            <div class="info-row"><span>Tổng tiền:</span> <span><b>${(totalPrice || 0).toLocaleString("vi-VN")} đ</b></span></div>
            <div class="info-row"><span>Thu ngân:</span> <span>Đạt Phan</span></div>
            
            <div class="barcode">||| |||| | ||||| |</div>
            
            <div class="footer">
              Cảm ơn quý khách!<br>
              Vui lòng đến trước giờ chiếu 10 phút.
            </div>
          </div>
          
          <script>
            // Tự động gọi lệnh in khi cửa sổ load xong, và đóng cửa sổ khi in xong/hủy in
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // MÀN HÌNH THÀNH CÔNG
  if (isSuccess) {
    return (
      <div className="h-full glass-effect rounded-3xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-glow text-white mb-2 uppercase tracking-widest">
          Giao dịch thành công
        </h2>
        <p className="text-white/60 mb-8">
          Hệ thống đã ghi nhận doanh thu và xuất vé.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handlePrintTicket}
            className="px-8 py-3 rounded-full font-bold text-slate-900 bg-white hover:bg-white/90 transition-colors uppercase text-sm shadow-lg"
          >
            🖨 In Vé (PDF)
          </button>
          <button onClick={onReset} className="btn-bright">
            Bán vé mới
          </button>
        </div>
      </div>
    );
  }

  // MÀN HÌNH THANH TOÁN
  return (
    <div className="flex gap-8 h-full">
      {/* CỘT TRÁI: HÓA ĐƠN CHI TIẾT */}
      <div className="flex-1 glass-effect rounded-3xl p-8 flex flex-col">
        <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
          Hóa Đơn Chi Tiết
        </h2>

        <div className="flex-1 space-y-6">
          <div>
            <p className="text-sm text-white/50 uppercase mb-1">Tên Phim</p>
            <p className="font-bold text-2xl text-[var(--btn-neon)]">
              {bookingData.movie?.title}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/50 uppercase mb-1">Suất chiếu</p>
              <p className="font-bold text-lg">{bookingData.showtime?.time}</p>
            </div>
            <div>
              <p className="text-sm text-white/50 uppercase mb-1">
                Phòng chiếu
              </p>
              <p className="font-bold text-lg">{bookingData.showtime?.room}</p>
            </div>
          </div>

          <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-white/60">Giá vé cơ bản</span>
              <span className="font-bold">
                {baseTicketPrice.toLocaleString()} đ
              </span>
            </div>

            {/* Render chi tiết từng loại ghế */}
            {breakdown.REGULAR.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className={SEAT_TYPES.REGULAR.color}>
                  {breakdown.REGULAR.length}x Ghế Thường (
                  {breakdown.REGULAR.join(", ")})
                </span>
                <span className="font-mono">
                  {(
                    (baseTicketPrice + SEAT_TYPES.REGULAR.surcharge) *
                    breakdown.REGULAR.length
                  ).toLocaleString()}{" "}
                  đ
                </span>
              </div>
            )}

            {breakdown.VIP.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className={SEAT_TYPES.VIP.color}>
                  {breakdown.VIP.length}x Ghế VIP (+15k) (
                  {breakdown.VIP.join(", ")})
                </span>
                <span className="font-mono">
                  {(
                    (baseTicketPrice + SEAT_TYPES.VIP.surcharge) *
                    breakdown.VIP.length
                  ).toLocaleString()}{" "}
                  đ
                </span>
              </div>
            )}

            {breakdown.COUPLE.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className={SEAT_TYPES.COUPLE.color}>
                  {breakdown.COUPLE.length}x Ghế Đôi (+25k) (
                  {breakdown.COUPLE.join(", ")})
                </span>
                <span className="font-mono">
                  {(
                    (baseTicketPrice + SEAT_TYPES.COUPLE.surcharge) *
                    breakdown.COUPLE.length
                  ).toLocaleString()}{" "}
                  đ
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
          <span className="text-lg text-white/60 uppercase tracking-widest">
            Tổng Thanh Toán
          </span>
          <span className="text-4xl font-black text-glow text-[var(--btn-neon)]">
            {totalPrice.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>

      {/* CỘT PHẢI: PHƯƠNG THỨC THANH TOÁN */}
      <div className="flex-1 glass-effect rounded-3xl p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
            Phương Thức Thanh Toán
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300
                  ${
                    paymentMethod === method.id
                      ? "border-[var(--btn-neon)] bg-[var(--btn-neon)]/10 text-[var(--btn-neon)] shadow-[0_0_15px_rgba(253,224,71,0.2)] scale-105"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:bg-white/5"
                  }
                `}
              >
                <span className="text-2xl mb-2">{method.icon}</span>
                <span className="text-sm font-bold uppercase">
                  {method.name}
                </span>
              </button>
            ))}
          </div>

          {paymentMethod === "CASH" ? (
            <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-white/60 uppercase">
                    Tiền khách đưa
                  </label>
                  <button
                    onClick={handleExactAmount}
                    className="text-xs text-[var(--btn-neon)] hover:underline"
                  >
                    Vừa đủ
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={amountGiven}
                    onChange={handleAmountChange}
                    placeholder="Nhập số tiền..."
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-[var(--btn-neon)] text-right pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                    đ
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-sm text-white/60 uppercase">
                  Tiền thối lại
                </span>
                <span
                  className={`text-2xl font-bold ${changeAmount >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {changeAmount >= 0
                    ? changeAmount.toLocaleString("vi-VN")
                    : "---"}{" "}
                  đ
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-black/20 rounded-2xl border border-white/5">
              <div className="w-48 h-48 bg-white/10 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-white/20">
                <span className="text-white/30 text-sm">QR Code Mockup</span>
              </div>
              <p className="text-sm text-[var(--btn-neon)] animate-pulse">
                Đang chờ Webhook từ {paymentMethod}...
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onPrev}
            disabled={isProcessing}
            className="px-6 py-4 rounded-full font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-colors uppercase text-sm border border-white/10 w-1/3"
          >
            Quay Lại
          </button>
          <button
            onClick={handleCheckout}
            disabled={!isValidAmount || isProcessing}
            className={`flex-1 btn-bright py-4 flex justify-center items-center gap-2 ${!isValidAmount || isProcessing ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang Ghi Nhận...
              </>
            ) : (
              "Hoàn Tất Giao Dịch"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3_Checkout;
