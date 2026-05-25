import { useState } from "react";
import axiosClient from "../../../api/axiosClient";

const PAYMENT_METHODS = [
  { id: "TIEN_MAT", name: "Tiền mặt", icon: "💵" },
  { id: "CHUYEN_KHOAN", name: "Chuyển khoản", icon: "💳" },
];

const Step3_Checkout = ({ bookingData, onPrev, onReset }) => {
  const [paymentMethod, setPaymentMethod] = useState("TIEN_MAT");
  const [amountGiven, setAmountGiven] = useState("");
  const [externalRefId, setExternalRefId] = useState("");
  const [note, setNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const totalPrice = bookingData.totalPrice || 0;

  // Group selected seats by type
  const breakdown = {};
  bookingData.seats?.forEach((seat) => {
    const typeName = seat.TenLoaiGhe;
    if (!breakdown[typeName]) {
      breakdown[typeName] = [];
    }
    breakdown[typeName].push(seat);
  });

  // Cash change handling
  const numericAmountGiven = parseInt(amountGiven.replace(/\D/g, "")) || 0;
  const changeAmount = numericAmountGiven - totalPrice;
  const isValidAmount = paymentMethod !== "TIEN_MAT" || numericAmountGiven >= totalPrice;

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

  const handleCheckout = async () => {
    if (!isValidAmount) return;
    setIsProcessing(true);

    try {
      const payload = {
        MaSuatChieu: bookingData.showtime.id,
        DanhSachMaGheSuatChieu: bookingData.seats.map((s) => s.MaGheSuatChieu),
        PhuongThuc: paymentMethod,
        MaGiaoDichNgoai: externalRefId.trim() || undefined,
        GhiChu: note.trim() || undefined,
      };

      const result = await axiosClient.post("/staff/ban-ve/thanh-toan", payload);
      setCheckoutResult(result);
    } catch (err) {
      console.error("POS Checkout error:", err);
      alert(err.response?.data?.message || err.message || "Thanh toán vé thất bại.");
    } finally {
      setIsProcessing(false);
    }
  };

  // thermal receipt print
  const handlePrintTicket = () => {
    const printWindow = window.open("", "_blank", "width=400,height=600");
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const seatsStr = bookingData.seats?.map((s) => s.TenGhe).join(", ") || "";
    const cashierName = localStorage.getItem("userName") || "Nhân viên";

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
              font-size: 18px; 
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
              font-size: 11px; 
              margin-top: 20px; 
              border-top: 2px solid #000;
              padding-top: 10px;
            }
            .barcode {
              text-align: center;
              font-size: 12px;
              margin-top: 10px;
              word-break: break-all;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h2>UIT CINEMA</h2>
              <p>Cửa hàng vé POS tại quầy</p>
            </div>
            
            <div class="movie-title">${bookingData.movie?.title || "Phim"}</div>
            
            <div class="info-row"><span>Ngày in:</span> <span>${dateStr} ${timeStr}</span></div>
            <div class="info-row"><span>Suất chiếu:</span> <span><b>${bookingData.showtime?.time || "--:--"}</b></span></div>
            <div class="info-row"><span>Phòng:</span> <span><b>${bookingData.showtime?.room || "---"}</b></span></div>
            
            <div class="seats">GHẾ: ${seatsStr}</div>
            
            <div class="info-row"><span>Tổng tiền:</span> <span><b>${(totalPrice).toLocaleString("vi-VN")} đ</b></span></div>
            <div class="info-row"><span>Mã đặt vé:</span> <span><b>${checkoutResult?.MaPhieuDat?.substring(0, 8) || "N/A"}</b></span></div>
            <div class="info-row"><span>Thu ngân:</span> <span>${cashierName}</span></div>
            
            <div class="barcode">
              Mã QR check-in:<br>
              <b>${checkoutResult?.QRPayload || "QR_CODE"}</b>
            </div>
            
            <div class="footer">
              Cảm ơn quý khách!<br>
              Vui lòng mang vé đến cổng soát vé.
            </div>
          </div>
          
          <script>
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

  // SUCCESS SCREEN
  if (checkoutResult) {
    return (
      <div className="h-full glass-effect rounded-3xl flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500 max-h-[70vh] overflow-y-auto">
        <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)] shrink-0">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-glow text-white mb-2 uppercase tracking-widest">
          Thanh toán thành công
        </h2>
        <p className="text-white/60 mb-6 max-w-md">
          Giao dịch đã được ghi nhận. Mã hóa đơn: <span className="font-mono text-white font-bold">{checkoutResult.MaPhieuDat}</span>
        </p>

        <div className="bg-black/30 border border-white/10 rounded-2xl p-6 mb-8 max-w-sm w-full text-left space-y-2">
          <p className="text-xs text-white/40 uppercase">Tóm tắt thanh toán</p>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Số lượng ghế:</span>
            <span className="font-bold text-white">{bookingData.seats.length} ghế</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Tổng tiền thu:</span>
            <span className="font-bold text-[var(--btn-neon)]">{checkoutResult.TongTien.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Phương thức:</span>
            <span className="font-bold text-white uppercase">{checkoutResult.GiaoDich.PhuongThuc}</span>
          </div>
          {checkoutResult.QRPayload && (
            <div className="text-center pt-4 border-t border-white/5">
              <span className="text-[10px] uppercase font-bold text-[var(--btn-neon)] tracking-wider">Mã soát vé check-in:</span>
              <p className="font-mono text-xs text-white/50 break-all mt-1 bg-black/40 p-2 rounded border border-white/10">{checkoutResult.QRPayload}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 shrink-0">
          <button
            onClick={handlePrintTicket}
            className="px-8 py-3 rounded-full font-bold text-slate-900 bg-white hover:bg-white/90 transition-colors uppercase text-sm shadow-lg cursor-pointer"
          >
            🖨 In Vé POS
          </button>
          <button onClick={onReset} className="btn-bright cursor-pointer">
            Bán vé mới
          </button>
        </div>
      </div>
    );
  }

  // CHECKOUT SCREEN
  return (
    <div className="flex gap-8 h-full max-h-[70vh]">
      {/* CỘT TRÁI: HÓA ĐƠN CHI TIẾT */}
      <div className="flex-1 glass-effect rounded-3xl p-8 flex flex-col justify-between overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
            Hóa Đơn Chi Tiết
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-white/50 uppercase mb-1">Tên Phim</p>
              <p className="font-bold text-2xl text-[var(--btn-neon)]">
                {bookingData.movie?.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/50 uppercase mb-1">Suất chiếu</p>
                <p className="font-bold text-lg">{bookingData.showtime?.time}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase mb-1">Phòng chiếu</p>
                <p className="font-bold text-lg">{bookingData.showtime?.room}</p>
              </div>
            </div>

            <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
              {Object.keys(breakdown).map((typeName) => {
                const list = breakdown[typeName];
                const sumPrice = list.reduce((sum, s) => sum + s.GiaVeTinhToan, 0);
                return (
                  <div key={typeName} className="flex justify-between text-sm">
                    <span className="text-white/70">
                      {list.length}x {typeName} ({list.map((s) => s.TenGhe).join(", ")})
                    </span>
                    <span className="font-mono text-white">
                      {sumPrice.toLocaleString()} đ
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end shrink-0">
          <span className="text-lg text-white/60 uppercase tracking-widest">
            Tổng Thanh Toán
          </span>
          <span className="text-4xl font-black text-glow text-[var(--btn-neon)]">
            {totalPrice.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>

      {/* CỘT PHẢI: PHƯƠNG THỨC THANH TOÁN */}
      <div className="flex-1 glass-effect rounded-3xl p-8 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
            Phương Thức Thanh Toán
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                  ${
                    paymentMethod === method.id
                      ? "border-[var(--btn-neon)] bg-[var(--btn-neon)]/10 text-[var(--btn-neon)] shadow-[0_0_15px_rgba(253,224,71,0.2)] scale-105"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:bg-white/5"
                  }
                `}
              >
                <span className="text-2xl mb-2">{method.icon}</span>
                <span className="text-sm font-bold uppercase">{method.name}</span>
              </button>
            ))}
          </div>

          {paymentMethod === "TIEN_MAT" ? (
            <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-white/60 uppercase">Tiền khách đưa</label>
                  <button
                    onClick={handleExactAmount}
                    className="text-xs text-[var(--btn-neon)] hover:underline cursor-pointer"
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
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-[var(--btn-neon)] text-right pr-12 font-mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">đ</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-sm text-white/60 uppercase">Tiền thối lại</span>
                <span className={`text-2xl font-bold ${changeAmount >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {changeAmount >= 0 ? `${changeAmount.toLocaleString("vi-VN")} đ` : "---"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs uppercase text-white/50 mb-2 pl-1">
                  Mã giao dịch ngoài (Ngân hàng / QR code bill)
                </label>
                <input
                  type="text"
                  value={externalRefId}
                  onChange={(e) => setExternalRefId(e.target.value)}
                  placeholder="Nhập mã giao dịch đối tác..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] font-mono text-sm"
                />
              </div>
              <p className="text-xs text-white/40 italic">
                * Vui lòng yêu cầu khách chuyển khoản theo mã QR của rạp, sau đó điền mã tham chiếu giao dịch thành công.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase text-white/50 mb-2 pl-1">
              Ghi chú đơn hàng (Tùy chọn)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Khách lấy bắp nước kèm, hoặc thắc mắc ghế..."
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] text-sm"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8 shrink-0">
          <button
            onClick={onPrev}
            disabled={isProcessing}
            className="px-6 py-4 rounded-full font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-colors uppercase text-sm border border-white/10 w-1/3 cursor-pointer disabled:opacity-50"
          >
            Quay Lại
          </button>
          <button
            onClick={handleCheckout}
            disabled={!isValidAmount || isProcessing}
            className={`flex-1 btn-bright py-4 flex justify-center items-center gap-2 cursor-pointer ${!isValidAmount || isProcessing ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          >
            {isProcessing ? "Đang ghi nhận..." : "Hoàn Tất Bán Vé"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3_Checkout;
