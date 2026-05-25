import { useState, useRef, useEffect } from "react";
import { ScanLine, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
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
    const code = ticketId.trim();
    if (!code) return;

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
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--btn-neon)] font-black">Nhân Viên Soát Vé</span>
        <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-white mt-1">
          Hệ Thống Soát Vé
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Sử dụng máy quét mã vạch hoặc nhập thủ công mã chi tiết đặt vé (UUID)
        </p>
      </div>

      {/* Form Nhập Mã */}
      <form
        onSubmit={handleScan}
        className="glass-effect p-4 rounded-2xl flex gap-4 items-center bg-[#131A2A]/40 border border-white/5 shadow-xl"
      >
        <div className="w-14 h-14 bg-[var(--btn-neon)]/10 rounded-xl flex items-center justify-center border border-[var(--btn-neon)]/20 text-[var(--btn-neon)] shadow-inner shrink-0">
          <ScanLine size={28} className="animate-pulse" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="Quét mã QR hoặc nhập mã vé UUID vào đây..."
          disabled={status === "PROCESSING"}
          className="flex-1 bg-transparent text-xl font-mono text-white placeholder-slate-600 focus:outline-none uppercase tracking-widest"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!ticketId || status === "PROCESSING"}
          className="btn-bright px-8 cursor-pointer disabled:opacity-40 text-xs tracking-wider"
        >
          {status === "PROCESSING" ? "Đang quét..." : "Kiểm tra"}
        </button>
      </form>

      {/* Màn hình Hiển thị Trạng thái */}
      <div
        className={`flex-1 rounded-3xl border-2 flex flex-col items-center justify-center p-12 transition-all duration-500 relative overflow-hidden min-h-[380px]
        ${status === "IDLE" ? "border-dashed border-[var(--btn-neon)]/20 bg-slate-950/20" : ""}
        ${status === "PROCESSING" ? "border-dashed border-[var(--btn-neon)]/60 bg-[var(--btn-neon)]/5 animate-pulse" : ""}
        ${status === "SUCCESS" ? "border-solid border-green-500/50 bg-green-950/10 shadow-[0_0_50px_rgba(34,197,94,0.15)]" : ""}
        ${status === "ERROR" ? "border-solid border-red-500/50 bg-red-950/10 shadow-[0_0_50px_rgba(239,68,68,0.15)]" : ""}
      `}
      >
        {status === "IDLE" && (
          <div className="text-center text-slate-500 flex flex-col items-center select-none">
            <ScanLine size={80} className="mb-6 text-[var(--btn-neon)]/40 filter drop-shadow-[0_0_10px_rgba(255,176,0,0.1)]" />
            <h2 className="text-xl font-black uppercase tracking-widest text-slate-400">
              Sẵn sàng quét vé
            </h2>
            <p className="text-xs text-slate-500 mt-2">Đưa mã QR của khách vào trước camera hoặc máy quét</p>
          </div>
        )}

        {status === "PROCESSING" && (
          <div className="text-center flex flex-col items-center">
            <RefreshCw size={80} className="animate-spin text-[var(--btn-neon)] mb-6 filter drop-shadow-[0_0_15px_rgba(255,176,0,0.4)]" />
            <h2 className="text-xl font-black uppercase tracking-widest text-[var(--btn-neon)] text-glow">
              Đang xác thực thông tin...
            </h2>
          </div>
        )}

        {status === "SUCCESS" && (
          <div className="text-center animate-in zoom-in duration-300">
            <CheckCircle2
              size={80}
              className="text-green-400 mx-auto mb-6 filter drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            />
            <h2 className="text-3xl font-black text-green-400 mb-8 tracking-wide drop-shadow-md">
              {message}
            </h2>
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-green-500/20 inline-block text-left min-w-[340px] shadow-2xl relative">
              <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/5 rounded-bl-full pointer-events-none"></div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Bộ Phim</p>
              <p className="font-extrabold text-xl text-white mb-4 uppercase tracking-wide leading-tight">
                {ticketData?.movie}
              </p>
              <div className="flex justify-between gap-8 border-t border-white/5 pt-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">
                    Phòng / Giờ chiếu
                  </p>
                  <p className="font-bold text-sm text-slate-200">
                    🏢 {ticketData?.room} <span className="text-[var(--btn-neon)] ml-1 font-mono">{ticketData?.time}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">
                    Ghế ngồi
                  </p>
                  <p className="font-black text-2xl text-[var(--btn-neon)] font-mono text-glow">
                    {ticketData?.seat}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === "ERROR" && (
          <div className="text-center animate-in shake duration-300">
            <XCircle
              size={80}
              className="text-red-500 mx-auto mb-6 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            />
            <h2 className="text-2xl font-black text-red-500 mb-6 tracking-wide drop-shadow-md">
              {message}
            </h2>
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-red-500/20 inline-block min-w-[320px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2 text-center">
                Thông tin lỗi soát vé
              </p>
              <p className="font-mono text-red-400 text-xs font-bold bg-red-950/40 py-1.5 px-3 rounded border border-red-500/10 text-center uppercase">{ticketData?.errorType}</p>
              {ticketData?.detail && (
                <p className="text-xs text-slate-400 mt-3 max-w-xs text-center mx-auto leading-relaxed">
                  {ticketData.detail}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Nút Reset thủ công */}
        {status !== "IDLE" && status !== "PROCESSING" && (
          <button
            onClick={resetScanner}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-[var(--btn-neon)] hover:text-slate-950 text-slate-400 transition-all duration-300 cursor-pointer shadow-lg border border-white/5 hover:border-transparent"
            title="Quét lại"
          >
            <RefreshCw size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
