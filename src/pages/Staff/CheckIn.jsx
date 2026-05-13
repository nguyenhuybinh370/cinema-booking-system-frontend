import { useState, useRef, useEffect } from "react";
import { ScanLine, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

const CheckIn = () => {
  const [ticketId, setTicketId] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE, SUCCESS, ERROR
  const [message, setMessage] = useState("");
  const [ticketData, setTicketData] = useState(null);

  const inputRef = useRef(null);

  // Tự động focus vào ô input khi vào trang hoặc sau khi quét xong
  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  // Hàm xử lý khi máy quét bấm Enter (hoặc nhân viên tự gõ rồi Enter)
  const handleScan = (e) => {
    e.preventDefault();
    const code = ticketId.trim();
    if (!code) return;

    // TODO: Chỗ này sau này sẽ gọi axiosClient.post('/api/tickets/checkin', { ticketId: code })
    // Dưới đây là Logic Giả lập (Mock) gọi API mất 0.5s
    setStatus("PROCESSING");

    setTimeout(() => {
      // Giả lập 3 kịch bản mã lỗi (Dựa theo chuẩn Error Convention của bạn)
      if (code === "VALID123") {
        setStatus("SUCCESS");
        setMessage("VÉ HỢP LỆ - XIN MỜI VÀO");
        setTicketData({
          movie: "DUNE: PART TWO",
          room: "Phòng 1",
          seat: "G8",
          time: "19:00",
        });
      } else if (code === "USED123") {
        setStatus("ERROR");
        setMessage("VÉ ĐÃ ĐƯỢC SỬ DỤNG TRƯỚC ĐÓ");
        setTicketData({
          errorType: "TICKET_ALREADY_USED",
          scanTime: "18:45 - 13/05/2026",
        });
      } else {
        setStatus("ERROR");
        setMessage("MÃ VÉ KHÔNG TỒN TẠI HOẶC SAI SUẤT CHIẾU");
        setTicketData({ errorType: "TICKET_NOT_FOUND" });
      }

      setTicketId(""); // Quét xong thì xóa ô input để chờ quét vé tiếp theo
    }, 500);
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
          Sử dụng máy quét mã vạch hoặc nhập thủ công mã vé (UUID)
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
          placeholder="Quét mã QR hoặc nhập mã vé vào đây..."
          disabled={status === "PROCESSING"}
          className="flex-1 bg-transparent text-2xl font-mono text-white placeholder-white/20 focus:outline-none uppercase"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!ticketId || status === "PROCESSING"}
          className="btn-bright px-8"
        >
          {status === "PROCESSING" ? "Đang kiểm tra..." : "Kiểm tra"}
        </button>
      </form>

      {/* Màn hình Hiển thị Trạng thái */}
      <div
        className={`flex-1 rounded-3xl border-2 flex flex-col items-center justify-center p-12 transition-all duration-500 relative overflow-hidden
        ${status === "IDLE" ? "border-white/10 glass-effect" : ""}
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

        {status === "SUCCESS" && (
          <div className="text-center animate-in zoom-in duration-300">
            <CheckCircle2
              size={100}
              className="text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
            />
            <h2 className="text-4xl font-black text-green-400 mb-8 drop-shadow-md">
              {message}
            </h2>
            <div className="bg-black/30 p-8 rounded-2xl border border-green-500/30 inline-block text-left min-w-[300px]">
              <p className="text-green-200/60 uppercase text-sm mb-1">Phim</p>
              <p className="font-bold text-2xl text-white mb-4">
                {ticketData?.movie}
              </p>
              <div className="flex gap-12">
                <div>
                  <p className="text-green-200/60 uppercase text-sm mb-1">
                    Phòng / Giờ
                  </p>
                  <p className="font-bold text-xl text-white">
                    {ticketData?.room} - {ticketData?.time}
                  </p>
                </div>
                <div>
                  <p className="text-green-200/60 uppercase text-sm mb-1">
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
            <h2 className="text-4xl font-black text-red-500 mb-6 drop-shadow-md">
              {message}
            </h2>
            <div className="bg-red-950/50 px-6 py-4 rounded-xl border border-red-500/30 inline-block">
              <p className="text-red-200 uppercase text-sm mb-1 text-center font-bold">
                Mã lỗi hệ thống
              </p>
              <p className="font-mono text-red-400">{ticketData?.errorType}</p>
              {ticketData?.scanTime && (
                <p className="text-xs text-red-300/50 mt-2">
                  Thời gian quét lần đầu: {ticketData.scanTime}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Nút Reset thủ công */}
        {status !== "IDLE" && (
          <button
            onClick={resetScanner}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Quét lại (Esc)"
          >
            <RefreshCw size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
