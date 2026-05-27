/**
 * SaleResultModal — success screen shown after a POS checkout completes.
 *
 * Props:
 *  checkoutResult – response from POST /staff/ban-ve/thanh-toan
 *  bookingData    – { movie, showtime, seats }
 *  onPrint        – () => void   (triggers thermal print)
 *  onReset        – () => void   (start new sale)
 */
const SaleResultModal = ({ checkoutResult, bookingData, onPrint, onReset }) => {
  if (!checkoutResult) return null;

  return (
    <div className="h-full glass-effect rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500 max-h-[70vh] overflow-y-auto border border-white/5 bg-[#131A2A]/40 shadow-2xl">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-5 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)] shrink-0">
        <svg className="w-10 h-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-black text-glow text-white mb-2 uppercase tracking-widest">
        Thanh toán thành công
      </h2>
      <p className="text-slate-400 mb-6 text-sm">
        Giao dịch đã được ghi nhận. Mã hóa đơn:{' '}
        <span className="font-mono text-white font-black bg-slate-950/80 px-2 py-1 rounded border border-white/5">
          {checkoutResult.MaPhieuDat}
        </span>
      </p>

      {/* Summary */}
      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 mb-8 max-w-sm w-full text-left space-y-3">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Tóm tắt thanh toán</p>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-medium">Số lượng ghế:</span>
          <span className="font-bold text-white">{bookingData.seats.length} ghế</span>
        </div>
        <div className="flex justify-between text-xs border-t border-white/5 pt-2">
          <span className="text-slate-400 font-medium">Tổng tiền thu:</span>
          <span className="font-black text-[#FFB000]">{checkoutResult.TongTien.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between text-xs border-t border-white/5 pt-2">
          <span className="text-slate-400 font-medium">Phương thức:</span>
          <span className="font-bold text-white uppercase">{checkoutResult.GiaoDich?.PhuongThuc}</span>
        </div>
        {checkoutResult.QRPayload && (
          <div className="text-center pt-4 border-t border-white/5">
            <span className="text-[9px] uppercase font-black text-[#FFB000] tracking-wider">Mã soát vé check-in:</span>
            <p className="font-mono text-xs text-slate-400 break-all mt-1.5 bg-slate-950/80 p-2.5 rounded border border-white/5">
              {checkoutResult.QRPayload}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 shrink-0">
        <button
          onClick={onPrint}
          className="px-6 py-3 rounded-full font-bold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 uppercase text-xs tracking-wider border border-white/5 cursor-pointer"
        >
          🖨 In Vé POS
        </button>
        <button onClick={onReset} className="btn-bright cursor-pointer text-xs tracking-wider">
          Bán vé mới
        </button>
      </div>
    </div>
  );
};

export default SaleResultModal;
