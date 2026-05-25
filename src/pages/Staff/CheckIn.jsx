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
        <h1 className="text-3xl font-black text-glow uppercase tracking-widest text-[var(--btn-neon)]">
          Hệ Thống Soát Vé
        </h1>
        <p className="text-white/50 mt-2">
          Sử dụng máy quét mã vạch hoặc nhập thủ công mã chi tiết đặt vé (UUID)
        </p>
      </div>

      {/* Form Nhập Mã */}
      <form
        onSubmit={handleScan}
        className="glass-effect p-4 rounded-2xl flex gap-4 items-center"
      >
        <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-[var(--btn-neon)]">
          <ScanLine size={28} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="Quét mã QR hoặc nhập mã vé UUID vào đây..."
          disabled={status === "PROCESSING"}
          className="flex-1 bg-transparent text-2xl font-mono text-white placeholder-white/20 focus:outline-none uppercase"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!ticketId || status === "PROCESSING"}
          className="btn-bright px-8 cursor-pointer disabled:opacity-50"
        >
          {status === "PROCESSING" ? "Đang kiểm tra..." : "Kiểm tra"}
        </button>
      </form>

      {/* Màn hình Hiển thị Trạng thái */}
      <div
        className={`flex-1 rounded-3xl border-2 flex flex-col items-center justify-center p-12 transition-all duration-500 relative overflow-hidden min-h-[350px]
        ${status === "IDLE" ? "border-white/10 glass-effect" : ""}
        ${status === "PROCESSING" ? "border-white/20 bg-white/5 animate-pulse" : ""}
        ${status === "SUCCESS" ? "border-green-500 bg-green-500/10 shadow-[0_0_50px_rgba(34,197,94,0.2)]" : ""}
        ${status === "ERROR" ? "border-red-500 bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.2)]" : ""}
      `}
      >
        {status === "IDLE" && (
          <div className="text-center opacity-30 flex flex-col items-center">
            <ScanLine size={80} className="mb-6" />
            <h2 className="text-2xl font-bold uppercase tracking-widest">
              Sẵn sàng quét vé
            </h2>
          </div>
        )}

        {status === "PROCESSING" && (
          <div className="text-center flex flex-col items-center">
            <RefreshCw size={80} className="animate-spin text-[var(--btn-neon)] mb-6" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-[var(--btn-neon)]">
              Đang xác thực thông tin...
            </h2>
          </div>
        )}

        {status === "SUCCESS" && (
          <div className="text-center animate-in zoom-in duration-300">
            <CheckCircle2
              size={100}
              className="text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
            />
            <h2 className="text-4xl font-black text-green-400 mb-8 drop-shadow-md">
              {message}
            </h2>
            <div className="bg-black/30 p-8 rounded-2xl border border-green-500/30 inline-block text-left min-w-[320px]">
              <p className="text-green-200/60 uppercase text-xs mb-1">Phim</p>
              <p className="font-bold text-2xl text-white mb-4">
                {ticketData?.movie}
              </p>
              <div className="flex gap-12">
                <div>
                  <p className="text-green-200/60 uppercase text-xs mb-1">
                    Phòng / Giờ
                  </p>
                  <p className="font-bold text-lg text-white">
                    {ticketData?.room} - {ticketData?.time}
                  </p>
                </div>
                <div>
                  <p className="text-green-200/60 uppercase text-xs mb-1">
                    Ghế ngồi
                  </p>
                  <p className="font-bold text-3xl text-[var(--btn-neon)]">
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
              size={100}
              className="text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            />
            <h2 className="text-3xl font-black text-red-500 mb-6 drop-shadow-md">
              {message}
            </h2>
            <div className="bg-red-950/50 px-6 py-4 rounded-xl border border-red-500/30 inline-block">
              <p className="text-red-200 uppercase text-xs mb-1 text-center font-bold">
                Mã lỗi hệ thống
              </p>
              <p className="font-mono text-red-400 text-sm">{ticketData?.errorType}</p>
              {ticketData?.detail && (
                <p className="text-xs text-red-300/60 mt-2 max-w-xs text-center mx-auto">
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
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            title="Quét lại"
          >
            <RefreshCw size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
