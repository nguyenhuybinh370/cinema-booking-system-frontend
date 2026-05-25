import { useState, useRef, useEffect } from "react";
import { ScanLine, CheckCircle2, XCircle, RefreshCw, Search, Film, Ticket } from "lucide-react";
import axiosClient from "../../api/axiosClient";

const CheckIn = () => {
  const [ticketId, setTicketId] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE, PROCESSING, SUCCESS, ERROR
  const [message, setMessage] = useState("");
  const [ticketData, setTicketData] = useState(null);

  const inputRef = useRef(null);

  // Auto-focus input for physical scanners
  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const handleScan = async (e) => {
    e.preventDefault();
    let code = ticketId.trim();
    if (!code) return;

    // Strip QR_ prefix if present
    code = code.replace(/^QR_/i, "");

    // Validate UUID format first to avoid backend validation crashes
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(code)) {
      setStatus("ERROR");
      setMessage("MÃ VÉ KHÔNG ĐÚNG ĐỊNH DẠNG UUID");
      setTicketData({ errorType: "INVALID_UUID_FORMAT", detail: "Mã vé phải là chuỗi UUID hợp lệ" });
      setTicketId("");
      return;
    }

    setStatus("PROCESSING");

    try {
      // 1. Call Validate endpoint
      const validation = await axiosClient.post("/staff/soat-ve/kiem-tra", {
        MaChiTietDat: code,
      });

      if (!validation.valid) {
        setStatus("ERROR");
        setMessage(validation.reason.toUpperCase());
        setTicketData({
          errorType: "VALIDATION_FAILED",
          detail: validation.reason,
        });
        setTicketId("");
        return;
      }

      // 2. Call Check-in endpoint
      const checkIn = await axiosClient.post("/staff/soat-ve/check-in", {
        MaChiTietDat: code,
      });

      // 3. Render Success View
      setStatus("SUCCESS");
      setMessage("VÉ HỢP LỆ - CHECK-IN THÀNH CÔNG");

      const info = checkIn.TicketInfo || validation.ticketInfo;
      const gioChieuDate = new Date(info.GioChieu);
      const timeString = `${gioChieuDate.getHours().toString().padStart(2, "0")}:${gioChieuDate.getMinutes().toString().padStart(2, "0")}`;

      setTicketData({
        movie: info.TenPhim,
        room: info.TenPhong,
        seat: info.Ghe,
        time: timeString,
        date: new Date(info.NgayChieu).toLocaleDateString("vi-VN"),
        price: info.GiaVe,
      });
    } catch (err) {
      console.error("Check-in error:", err);
      setStatus("ERROR");
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra khi soát vé";
      setMessage(msg.toUpperCase());
      setTicketData({
        errorType: "CHECKIN_FAILED",
        detail: msg,
      });
    } finally {
      setTicketId(""); // Clear input to wait for next scan
    }
  };

  const resetScanner = () => {
    setStatus("IDLE");
    setMessage("");
    setTicketData(null);
    setTicketId("");
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-8 py-2">
      {/* Search Input Bar (Mockup Style) */}
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleScan} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="QUÉT MÃ QR HOẶC NHẬP MÃ VÉ UUID VÀO ĐÂY..."
            disabled={status === "PROCESSING"}
            className="w-full bg-[#131A2A]/80 border border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-purple-300/40 text-center py-4 px-12 rounded-full font-mono text-sm tracking-wider focus:outline-none transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] uppercase"
            autoComplete="off"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
            {status === "PROCESSING" ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
        </form>
      </div>

      {/* Fast Scan Circular Area (Mockup Style) */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative flex items-center justify-center">
          {/* Animated glow rings */}
          <div className={`absolute rounded-full border border-purple-500/20 w-80 h-80 transition-all duration-1000 ${status === "PROCESSING" ? "animate-ping scale-110" : ""}`}></div>
          <div className="absolute rounded-full border border-purple-500/10 w-72 h-72 animate-pulse"></div>
          
          {/* Outer Ring */}
          <div className="w-64 h-64 rounded-full border-2 border-purple-500/40 flex items-center justify-center p-3 shadow-[0_0_30px_rgba(168,85,247,0.25)] bg-[#131A2A]/40 relative">
            
            {/* Dynamic visual waves or flares inside */}
            <div className="absolute inset-0 rounded-full bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none"></div>
            
            {/* Inner Ring */}
            <div className="w-full h-full rounded-full border border-purple-500/60 flex flex-col items-center justify-center text-center p-6 bg-[#0D1321]/90 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]">
              <ScanLine className={`w-12 h-12 text-purple-400 mb-3 ${status === "PROCESSING" ? "animate-bounce" : "animate-pulse"}`} />
              <span className="text-white text-xs font-black tracking-widest uppercase mb-1">
                KHU VỰC QUÉT VÉ NHANH
              </span>
              <p className="text-[10px] text-slate-400 leading-normal max-w-[150px]">
                Vui lòng đặt vé hoặc mã QR vào khu vực này
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {status !== "IDLE" && status !== "PROCESSING" && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-300 relative">
          {status === "SUCCESS" ? (
            <div className="w-full bg-gradient-to-r from-emerald-950/20 via-emerald-800/40 to-emerald-950/20 border-y border-emerald-500/30 py-4 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 text-2xl font-black tracking-widest uppercase">
                  VALID TICKET
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium">
                Tên phim: <span className="font-bold text-white">{ticketData?.movie}</span>, Ghế: <span className="font-bold text-[var(--btn-neon)] font-mono">{ticketData?.seat}</span>, Suất: <span className="font-bold text-[var(--btn-neon)] font-mono">{ticketData?.time}</span>
              </p>
            </div>
          ) : (
            <div className="w-full bg-gradient-to-r from-red-950/20 via-red-800/40 to-red-950/20 border-y border-red-500/30 py-4 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-6 h-6 text-red-500" />
                <span className="text-red-500 text-2xl font-black tracking-widest uppercase">
                  INVALID TICKET
                </span>
              </div>
              <p className="text-xs text-red-200/90 font-medium uppercase font-mono tracking-wider">
                {message || "Vé không hợp lệ hoặc đã được sử dụng"}
              </p>
            </div>
          )}
          
          <button
            onClick={resetScanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-purple-500 hover:text-white text-slate-400 transition-all duration-300 cursor-pointer border border-white/5 shadow-md"
            title="Quét lại (Reset)"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ticket Details Panel (Mockup style at bottom) */}
      {status === "SUCCESS" && ticketData && (
        <div className="w-full max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
          <div className="border border-purple-500/40 rounded-xl overflow-hidden bg-[#131A2A]/90 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            {/* Header */}
            <div className="bg-[#1B2435] border-b border-purple-500/20 px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-black text-purple-300 uppercase tracking-widest">
                CHI TIẾT VÉ VỪA QUÉT
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2 rounded font-black tracking-wider">
                ĐÃ SOÁT VÉ
              </span>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col md:flex-row gap-6">
              {/* Graphic Ticket on Left */}
              <div className="w-full md:w-32 h-44 bg-gradient-to-br from-[#1b2130] to-[#0D1321] border border-white/5 rounded-lg flex flex-col items-center justify-between p-3 shrink-0 relative overflow-hidden select-none">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mt-2">
                  <Film className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MÃ GHẾ</div>
                  <div className="text-2xl font-black text-[var(--btn-neon)] font-mono tracking-tighter text-glow">
                    {ticketData.seat}
                  </div>
                </div>
                <div className="w-full border-t border-dashed border-white/10 pt-2 flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-purple-400/60" />
                </div>
              </div>

              {/* Details on Right */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wide leading-tight mb-2">
                    {ticketData.movie}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Rạp</span>
                      <span className="text-sm font-bold text-slate-200 uppercase">{ticketData.room}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Ghế</span>
                      <span className="text-sm font-bold text-[var(--btn-neon)] font-mono">{ticketData.seat}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Suất chiếu</span>
                      <span className="text-sm font-bold text-slate-200 font-mono">
                        {ticketData.time} - {ticketData.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Giá vé</span>
                      <span className="text-sm font-bold text-slate-200 font-mono">
                        {ticketData.price ? ticketData.price.toLocaleString("vi-VN") : "0"}đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-slate-500">
                  <span>MÃ VÉ (UUID): HỢP LỆ</span>
                  <span>UIT CINEMA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckIn;
