import { useState, useRef, useEffect } from "react";
import { ScanLine } from "lucide-react";
import axiosClient from "../../../api/axiosClient";
import TicketVerifyForm from "./TicketVerifyForm";
import CheckInResultAlert from "./CheckInResultAlert";
import TicketInfoCard from "./TicketInfoCard";

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

      const info = {
        ...(validation.ticketInfo || {}),
        ...(checkIn.TicketInfo || {}),
      };
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
      <TicketVerifyForm
        ticketId={ticketId}
        status={status}
        inputRef={inputRef}
        onChange={(e) => setTicketId(e.target.value)}
        onSubmit={handleScan}
      />

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
      <CheckInResultAlert
        status={status}
        message={message}
        ticketData={ticketData}
        onReset={resetScanner}
      />

      {/* Ticket Details Panel (Mockup style at bottom) */}
      {status === "SUCCESS" && (
        <TicketInfoCard ticketData={ticketData} />
      )}
    </div>
  );
};

export default CheckIn;
