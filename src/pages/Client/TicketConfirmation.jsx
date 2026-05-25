import { useMemo } from 'react';
import { Ticket, Calendar, Clock, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';

const TicketConfirmation = ({ movie, selectedDateId, currentSlot, selectedSeats, formatTime, onHome }) => {
  // GIẢI PHÁP SỬA LỖI: Không dùng Math.random() nữa để ESLint không bắt lỗi purity.
  // Thay vào đó, tạo một số chuỗi cố định dựa trên ID phim và ký tự tên phim.
  const ticketCode = useMemo(() => {
    const movieId = movie._id || movie.id || '99';
    // Băm nhỏ tên phim thành một chuỗi số để giả lập số ngẫu nhiên cố định
    const movieHash = movie.title 
      ? movie.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) 
      : 123;
    const seatHash = selectedSeats.join('').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const finalCode = (movieHash * seatHash) % 900000 + 100000;
    return `TKT-${movieId}-${finalCode}`;
  }, [movie._id, movie.id, movie.title, selectedSeats]);

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

      {/* THẺ VÉ THIẾT KẾ RẠP PHIM CHUYÊN NGHIỆP */}
      <div className="w-full max-w-md bg-[#1b1223]/90 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
        
        {/* Đường cắt răng cưa giả lập vết xé vé */}
        <div className="absolute left-0 right-0 top-[58%] h-0.5 border-t-2 border-dashed border-white/20 z-10"></div>
        <div className="absolute -left-4 top-[58%] -translate-y-1/2 w-8 h-8 bg-[#020617] rounded-full border-r border-white/10 z-10"></div>
        <div className="absolute -right-4 top-[58%] -translate-y-1/2 w-8 h-8 bg-[#020617] rounded-full border-l border-white/10 z-10"></div>

        {/* PHẦN TRÊN VÉ: THÔNG TIN PHIM */}
        <div className="p-8 flex flex-col gap-6 text-left">
          <div className="flex gap-4 items-center">
            <img 
              src={movie.poster_path} 
              alt={movie.title} 
              className="w-16 h-24 object-cover rounded-xl border border-white/10 shadow-md" 
            />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-rose-500 tracking-widest uppercase">Vé điện tử</span>
              <h3 className="text-xl font-black text-white uppercase leading-tight line-clamp-2 tracking-tight">{movie.title}</h3>
              <span className="text-xs text-gray-400 font-medium">
                {movie.runtime} phút • {movie.genres?.map(g => g.name).join(', ') || 'Hành động'}
              </span>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Chi tiết lịch chiếu và vị trí ngồi */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Calendar size={16} className="text-rose-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Ngày chiếu</span>
                <span className="font-semibold text-white">{selectedDateId}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Clock size={16} className="text-rose-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Suất chiếu</span>
                <span className="font-semibold text-white">{formatTime(currentSlot?.time)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300 col-span-2">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Ticket size={16} className="text-rose-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Ghế đã chọn</span>
                <span className="font-extrabold text-base text-transparent bg-clip-text bg-linear-to-rrom-rose-400 to-pink-500">
                  {selectedSeats.join(', ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300 col-span-2">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <MapPin size={16} className="text-rose-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Rạp chiếu</span>
                <span className="font-semibold text-white">Phòng số 05 • Cinema Star Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN DƯỚI VÉ: MÃ QR QUÉT CODE */}
        <div className="p-8 pt-12 pb-6 flex flex-col items-center justify-center gap-4 bg-white/1">
          <div className="bg-white p-3 rounded-2xl border border-white/10 shadow-inner">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketCode}`} 
              alt="Mã QR Vé Phim"
              className="w-32 h-32 select-none"
            />
          </div>
          <div className="text-center flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Mã đặt vé</span>
            <p className="text-sm font-mono font-bold tracking-widest text-gray-300">{ticketCode}</p>
          </div>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG TÁC VỤ */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center">
        <button 
          onClick={onHome}
          className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} /> Quay lại đặt Vé
        </button>
        <button 
          onClick={() => window.print()} 
          className="w-full sm:w-auto bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold px-6 py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,67,110,0.3)] cursor-pointer"
        >
          In hoặc Lưu vé
        </button>
      </div>

    </div>
  );
};

export default TicketConfirmation;