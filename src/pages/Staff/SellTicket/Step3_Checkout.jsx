import { useState } from "react";
import axiosClient from "../../../api/axiosClient";
import SaleResultModal from "./SaleResultModal";
import { showError, getErrorMessage } from "../../../utils/toastHelper";



// ── Thermal receipt printer ──────────────────────────────────────────────────
const printThermalReceipt = ({ bookingData, checkoutResult, totalPrice }) => {
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
          body { font-family: 'Courier New', Courier, monospace; color: #000; padding: 20px; display: flex; justify-content: center; }
          .ticket { width: 300px; border: 1px dashed #000; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .header h2 { margin: 0; font-size: 24px; font-weight: 900; }
          .header p { margin: 5px 0 0; font-size: 14px; }
          .movie-title { font-size: 18px; font-weight: bold; text-transform: uppercase; text-align: center; margin-bottom: 15px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .seats { font-size: 18px; font-weight: bold; text-align: center; margin: 15px 0; padding: 10px 0; border-top: 1px dashed #000; border-bottom: 1px dashed #000; }
          .footer { text-align: center; font-size: 11px; margin-top: 20px; border-top: 2px solid #000; padding-top: 10px; }
          .barcode { text-align: center; font-size: 12px; margin-top: 10px; word-break: break-all; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header"><h2>UIT CINEMA</h2><p>Cửa hàng vé POS tại quầy</p></div>
          <div class="movie-title">${bookingData.movie?.title || "Phim"}</div>
          <div class="info-row"><span>Ngày in:</span> <span>${dateStr} ${timeStr}</span></div>
          <div class="info-row"><span>Suất chiếu:</span> <span><b>${bookingData.showtime?.time || "--:--"}</b></span></div>
          <div class="info-row"><span>Phòng:</span> <span><b>${bookingData.showtime?.room || "---"}</b></span></div>
          <div class="seats">GHẾ: ${seatsStr}</div>
          <div class="info-row"><span>Tổng tiền:</span> <span><b>${totalPrice.toLocaleString("vi-VN")} đ</b></span></div>
          <div class="info-row"><span>Mã đặt vé:</span> <span><b>${checkoutResult?.MaPhieuDat?.substring(0, 8) || "N/A"}</b></span></div>
          <div class="info-row"><span>Thu ngân:</span> <span>${cashierName}</span></div>
          <div class="barcode">Mã QR check-in:<br><b>${checkoutResult?.QRPayload || "QR_CODE"}</b></div>
          <div class="footer">Cảm ơn quý khách!<br>Vui lòng mang vé đến cổng soát vé.</div>
        </div>
        <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };</script>
      </body>
    </html>
  `;
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// ── Component ────────────────────────────────────────────────────────────────

const Step3_Checkout = ({ bookingData, onPrev, onReset }) => {
  const [paymentMethod, setPaymentMethod] = useState("TIEN_MAT");
  const [amountGiven, setAmountGiven] = useState("");
  const [note, setNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const totalPrice = bookingData.totalPrice || 0;

  // Group selected seats by type for bill display
  const breakdown = {};
  bookingData.seats?.forEach((seat) => {
    const typeName = seat.TenLoaiGhe;
    if (!breakdown[typeName]) breakdown[typeName] = [];
    breakdown[typeName].push(seat);
  });

  // Cash change logic
  const numericAmountGiven = parseInt(amountGiven.replace(/\D/g, "")) || 0;
  const changeAmount = numericAmountGiven - totalPrice;
  const isValidAmount = paymentMethod !== "TIEN_MAT" || numericAmountGiven >= totalPrice;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmountGiven(value ? parseInt(value).toLocaleString("vi-VN") : "");
  };

  const handleExactAmount = () => setAmountGiven(totalPrice.toLocaleString("vi-VN"));

  // POST /staff/ban-ve/thanh-toan
  const handleCheckout = async () => {
    if (!isValidAmount) return;
    setIsProcessing(true);
    try {
      const payload = {
        MaSuatChieu: bookingData.showtime.id,
        DanhSachMaGheSuatChieu: bookingData.seats.map((s) => s.MaGheSuatChieu),
        PhuongThuc: paymentMethod,
        GhiChu: note.trim() || undefined,
      };
      const result = await axiosClient.post("/staff/ban-ve/thanh-toan", payload);
      setCheckoutResult(result);
    } catch (err) {
      console.error("POS Checkout error:", err);
      showError(getErrorMessage(err, "Thanh toán vé thất bại."));
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (checkoutResult) {
    return (
      <SaleResultModal
        checkoutResult={checkoutResult}
        bookingData={bookingData}
        onPrint={() => printThermalReceipt({ bookingData, checkoutResult, totalPrice })}
        onReset={onReset}
      />
    );
  }

  // ── Checkout screen ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full max-h-[70vh] min-h-0">

      {/* CỘT TRÁI: HÓA ĐƠN CHI TIẾT */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col justify-between overflow-y-auto border border-white/5 shadow-2xl bg-[#131A2A]/40">
        <div>
          <h2 className="text-xl font-extrabold text-glow mb-6 uppercase tracking-widest text-[#FFB000] border-b border-white/5 pb-4">
            🎫 Hóa Đơn Chi Tiết
          </h2>
          <div className="space-y-6">
            <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#FFB000]/5 to-transparent rounded-full" />
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Tên Phim</p>
              <h3 className="font-black text-xl text-white uppercase tracking-wide leading-tight">
                {bookingData.movie?.title}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Suất chiếu</p>
                <p className="font-bold text-sm text-[#FFB000]">{bookingData.showtime?.time}</p>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Phòng chiếu</p>
                <p className="font-bold text-sm text-white">{bookingData.showtime?.room}</p>
              </div>
            </div>
            <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5 pb-2">Danh sách vé</p>
              {Object.keys(breakdown).map((typeName) => {
                const list = breakdown[typeName];
                const sumPrice = list.reduce((sum, s) => sum + s.GiaVeTinhToan, 0);
                return (
                  <div key={typeName} className="flex justify-between items-center text-xs pb-1 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-slate-300 font-medium">
                      {list.length}x {typeName}{" "}
                      <span className="font-bold font-mono text-[#FFB000]">({list.map((s) => s.TenGhe).join(", ")})</span>
                    </span>
                    <span className="font-bold text-white font-mono">{sumPrice.toLocaleString()} đ</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-end shrink-0">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tổng Thanh Toán</span>
          <span className="text-3xl font-black text-glow text-[#FFB000] tracking-tight">
            {totalPrice.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>

      {/* CỘT PHẢI: PHƯƠNG THỨC THANH TOÁN */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col justify-between overflow-y-auto border border-white/5 shadow-2xl bg-[#131A2A]/40 min-w-[320px]">
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-glow mb-6 uppercase tracking-widest text-[#FFB000] border-b border-white/5 pb-4">
            💳 Thanh Toán
          </h2>

          {/* Payment method fixed info */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phương thức thanh toán</span>
            <span className="text-sm font-bold text-[#FFB000]">💵 Tiền mặt</span>
          </div>

          {/* Cash input fields */}
          <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-white/5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Tiền khách đưa</label>
                <button
                  type="button"
                  onClick={handleExactAmount}
                  className="text-xs text-[#FFB000] hover:text-white font-bold bg-[#FFB000]/15 border border-[#FFB000]/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
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
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#FFB000] rounded-xl px-4 py-3 text-2xl font-black text-[#FFB000] focus:outline-none text-right pr-12 font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">đ</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tiền thối lại</span>
              <span className={`text-2xl font-black font-mono ${changeAmount >= 0 ? "text-green-400" : "text-red-400"}`}>
                {changeAmount >= 0 ? `${changeAmount.toLocaleString("vi-VN")} đ` : "---"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2 pl-1">
              Ghi chú đơn hàng (Tùy chọn)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm thông tin..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#FFB000] rounded-xl px-4 py-3 text-white focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8 shrink-0">
          <button
            onClick={onPrev}
            disabled={isProcessing}
            className="px-6 py-4 rounded-full font-bold text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 uppercase text-xs tracking-wider border border-white/5 w-1/3 cursor-pointer disabled:opacity-50"
          >
            Quay Lại
          </button>
          <button
            onClick={handleCheckout}
            disabled={!isValidAmount || isProcessing}
            className={`flex-1 btn-bright py-4 flex justify-center items-center gap-2 cursor-pointer ${
              !isValidAmount || isProcessing ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            {isProcessing ? "Đang ghi nhận..." : "Hoàn Tất Bán Vé"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3_Checkout;
