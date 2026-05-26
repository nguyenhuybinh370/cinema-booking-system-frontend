import { useMemo, useState } from 'react';
import { Ticket, Calendar, Clock, MapPin, CheckCircle, ArrowLeft, Copy, Check, Info } from 'lucide-react';
import { formatVND } from '../../utils/formatHelper';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TicketConfirmation = ({ movie, selectedDateId, currentSlot, selectedSeats, formatTime, onHome, bookingResult }) => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState("");

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success("Đã sao chép mã!");
    setTimeout(() => setCopiedId(""), 2000);
  };

  const isFallbackMode = !bookingResult?.ChiTietDatVes;

  // Transform ticket details from bookingResult safely
  const tickets = useMemo(() => {
    if (!bookingResult) return [];

    if (bookingResult.ChiTietDatVes) {
      return bookingResult.ChiTietDatVes.map(ct => ({
        id: ct.MaChiTietDat,
        seatName: ct.Ghe?.TenGhe || '?',
        price: ct.GiaVe,
        roomName: ct.SuatChieu?.PhongChieu?.TenPhong || currentSlot?.TenPhong || 'Phòng chiếu',
        roomType: ct.SuatChieu?.PhongChieu?.TenLoaiPhong || currentSlot?.TenLoaiPhong || '2D'
      }));
    } else if (bookingResult.DanhSachGhe) {
      return bookingResult.DanhSachGhe.map((g, idx) => ({
        id: 'Đang tải mã vé...',
        seatName: g.TenGhe || (typeof selectedSeats[idx] === 'object' ? selectedSeats[idx].TenGhe : selectedSeats[idx]) || '?',
        price: g.GiaVe || (bookingResult.TongTien / bookingResult.DanhSachGhe.length),
        roomName: currentSlot?.TenPhong || 'Phòng chiếu',
        roomType: currentSlot?.TenLoaiPhong || '2D'
      }));
    }

    return [];
  }, [bookingResult, selectedSeats, currentSlot]);

  // Main QR code data: first ticket ID if available, otherwise the booking ID
  const mainQRData = useMemo(() => {
    if (tickets.length > 0 && tickets[0].id !== 'Đang tải mã vé...') {
      return tickets[0].id;
    }
    return bookingResult?.MaPhieuDat || 'NO_CODE';
  }, [tickets, bookingResult]);

  const displayTime = formatTime(currentSlot?.GioChieu || currentSlot?.time);
  const displayRoom = tickets[0]?.roomName || currentSlot?.TenPhong || 'Phòng chiếu';
  const displayRoomType = tickets[0]?.roomType || currentSlot?.TenLoaiPhong || '2D';

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 md:px-20 max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 animate-in zoom-in-95 duration-500">
      
      {/* Khối thông báo đặt vé thành công */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
          <CheckCircle size={36} />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Đặt Vé Thành Công!</h2>
        <p className="text-gray-400 text-sm max-w-sm">
          Hệ thống đã ghi nhận mã đặt vé điện tử của bạn. Vui lòng xuất trình màn hình này tại quầy để nhận vé cứng vào rạp.
        </p>
      </div>

      {isFallbackMode && (
        <div className="w-full max-w-md bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex gap-3 text-left text-yellow-400 text-xs items-start">
          <Info size={16} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Lưu ý bản Demo:</span> Không thể kết nối máy chủ để tải mã vé chi tiết ngay lập tức. Tuy nhiên, thông tin giao dịch đã được ghi nhận. Bạn có thể kiểm tra chi tiết vé trong mục Lịch sử giao dịch sau.
          </div>
        </div>
      )}

      {/* THẺ VÉ THIẾT KẾ RẠP PHIM CHUYÊN NGHIỆP */}
      <div className="w-full max-w-md bg-[#1b1223]/90 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
        
        {/* Đường cắt răng cưa giả lập vết xé vé */}
        <div className="absolute left-0 right-0 top-[52%] h-0.5 border-t-2 border-dashed border-white/20 z-10"></div>
        <div className="absolute -left-4 top-[52%] -translate-y-1/2 w-8 h-8 bg-[#020617] rounded-full border-r border-white/10 z-10"></div>
        <div className="absolute -right-4 top-[52%] -translate-y-1/2 w-8 h-8 bg-[#020617] rounded-full border-l border-white/10 z-10"></div>

        {/* PHẦN TRÊN VÉ: THÔNG TIN PHIM */}
        <div className="p-8 pb-6 flex flex-col gap-5 text-left">
          <div className="flex gap-4 items-center">
            <img 
              src={movie.poster_path} 
              alt={movie.title} 
              className="w-16 h-24 object-cover rounded-xl border border-white/10 shadow-md" 
            />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-rose-500 tracking-widest uppercase">Vé điện tử</span>
              <h3 className="text-lg font-black text-white uppercase leading-tight line-clamp-2 tracking-tight">{movie.title}</h3>
              <span className="text-xs text-gray-400 font-medium">
                {movie.runtime || '120'} phút • {movie.genres?.map(g => g.name).join(', ') || 'Hành động'}
              </span>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Chi tiết lịch chiếu và vị trí ngồi */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Calendar size={14} className="text-rose-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Ngày chiếu</span>
                <span className="font-semibold text-white">{selectedDateId}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Clock size={14} className="text-rose-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Suất chiếu</span>
                <span className="font-semibold text-white">{displayTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300 col-span-2">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <MapPin size={14} className="text-rose-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Phòng & Loại rạp</span>
                <span className="font-semibold text-white">{displayRoom} • Loại {displayRoomType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN GIỮA VÉ: CHI TIẾT TỪNG VÉ VÀ MÃ COPY */}
        <div className="px-8 py-4 flex flex-col gap-2 text-left bg-white/5 border-t border-b border-white/5 max-h-[140px] overflow-y-auto custom-scrollbar">
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Danh sách vé ({tickets.length})</span>
          {tickets.map((ticket, index) => (
            <div key={index} className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-white font-bold text-xs">Ghế {ticket.seatName}</span>
                <span className="text-[9px] text-gray-500 font-mono select-all truncate max-w-[150px]" title={ticket.id}>
                  {ticket.id}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold text-xs">{formatVND(ticket.price)}</span>
                {ticket.id !== 'Đang tải mã vé...' && (
                  <button 
                    onClick={() => handleCopyCode(ticket.id)}
                    className="p-1 hover:text-white text-gray-400 transition-colors cursor-pointer"
                    title="Sao chép mã vé"
                  >
                    {copiedId === ticket.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PHẦN DƯỚI VÉ: MÃ QR QUÉT CODE */}
        <div className="p-8 pt-6 pb-6 flex flex-col items-center justify-center gap-4 bg-white/1">
          <div className="bg-white p-3 rounded-2xl border border-white/10 shadow-inner">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${mainQRData}`} 
              alt="Mã QR Vé Phim"
              className="w-28 h-28 select-none"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="w-28 h-28 bg-[#020617] text-gray-500 text-[10px] items-center justify-center p-2 text-center leading-normal border border-white/5 rounded-xl hidden">
              Không thể tải QR trực tuyến
            </div>
          </div>
          <div className="text-center flex flex-col gap-0.5">
            <span className="text-[9px] text-gray-500 tracking-widest uppercase font-bold">Mã phiếu đặt</span>
            <div className="flex items-center gap-1.5 justify-center">
              <p className="text-xs font-mono font-bold tracking-widest text-gray-300 select-all">{bookingResult?.MaPhieuDat}</p>
              <button 
                onClick={() => handleCopyCode(bookingResult?.MaPhieuDat)}
                className="p-1 hover:text-white text-gray-400 transition-colors cursor-pointer"
                title="Sao chép mã phiếu đặt"
              >
                {copiedId === bookingResult?.MaPhieuDat ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG TÁC VỤ */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center mt-2">
        <button 
          onClick={onHome}
          className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
        >
          Về Trang Chủ
        </button>
        <button 
          onClick={() => navigate("/profile", { state: { activeTab: "upcoming" } })}
          className="w-full sm:w-auto bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,67,110,0.3)] cursor-pointer"
        >
          Xem vé của tôi
        </button>
      </div>

    </div>
  );
};

export default TicketConfirmation;