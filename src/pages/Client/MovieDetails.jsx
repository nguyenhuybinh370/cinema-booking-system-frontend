import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { dummyShowsData, dummyDateTimeData, dummyDashboardData, dummyTrailers } from '../../assets/assets'; 
import SeatSelection from './SeatSelection';
import TicketConfirmation from './TicketConfirmation'; // Import component vé mới tạo
import Payment from './Payment';
import toast from 'react-hot-toast';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const movie = dummyShowsData.find(m => m._id === id || m.id?.toString() === id) || dummyShowsData[0];

  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const realDates = Object.keys(dummyDateTimeData).map((dateStr) => {
    const dateObj = new Date(dateStr);
    return {
      id: dateStr,
      dayName: daysOfWeek[dateObj.getDay()],
      dateNum: dateObj.getDate()
    };
  });
  
  const [selectedDateId, setSelectedDateId] = useState(realDates[0]?.id || "");
  const [isBookingStage, setIsBookingStage] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [trailerUrl, setTrailerUrl] = useState(null); 

  // --- THÊM STATE QUẢN LÝ MÀN HÌNH VÉ VÀ LƯU GHẾ ĐÃ ĐẶT THÀNH CÔNG ---
  const [isTicketStage, setIsTicketStage] = useState(false);
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  const [isPaymentStage, setIsPaymentStage] = useState(false);

  const handleStartBooking = () => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");
    
    if (!token || role !== "CUSTOMER") {
      toast.error("Vui lòng đăng nhập tài khoản khách hàng để đặt vé!");
      navigate("/login", { state: { from: `/movie/${id}` } });
      return;
    }
    setIsBookingStage(true);
  };

  const availableSlots = dummyDateTimeData[selectedDateId] || [];
  const currentSlot = availableSlots[selectedSlotIndex];

  const activeShowData = dummyDashboardData.activeShows.find(
    show => show._id === currentSlot?.showId || show.movie._id === movie._id
  );
  const occupiedSeats = activeShowData?.occupiedSeats || {};

  const formatTime = (isoString) => {
    if (!isoString) return "00:00";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getEmbedUrl = (videoUrl) => {
    const originalIndex = dummyShowsData.findIndex(m => m._id === movie._id);
    const finalUrl = videoUrl || dummyTrailers[originalIndex % dummyTrailers.length]?.videoUrl;
    
    if (!finalUrl) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = finalUrl.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : '';
  };

  useEffect(() => {
    if (trailerUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [trailerUrl]);

  // --- LOGIC ĐIỀU KIỆN RENDER MÀN HÌNH VÉ ĐÃ ĐẶT ---
  const calculateTotalAmount = (seats) => {
    return seats.reduce((total, seatId) => {
      const rowLetter = seatId.charAt(0);
      const price = (rowLetter === 'A' || rowLetter === 'B') ? 9 : 12;
      return total + price;
    }, 0);
  };

  // MÀN HÌNH 3: XÁC NHẬN NHẬN VÉ THÀNH CÔNG (TICKET CONFIRMATION)
  if (isTicketStage) {
    return (
      <TicketConfirmation 
        movie={movie}
        selectedDateId={selectedDateId}
        currentSlot={currentSlot}
        selectedSeats={confirmedSeats}
        formatTime={formatTime}
        onHome={() => {
          setIsTicketStage(false);
          setIsPaymentStage(false);
          setIsBookingStage(false);
          setConfirmedSeats([]);
        }}
      />
    );
  }

  // MÀN HÌNH 2: CHỌN PHƯƠNG THỨC THANH TOÁN MOMO / VNPAY (NEW PAYMENT STAGE)
  if (isPaymentStage) {
    return (
      <Payment 
        movie={movie}
        selectedDateId={selectedDateId}
        currentSlot={currentSlot}
        selectedSeats={confirmedSeats}
        amount={calculateTotalAmount(confirmedSeats)} // Truyền số tiền đã tính toán sang bên trang thanh toán
        formatTime={formatTime}
        onBack={() => {
          setIsPaymentStage(false); // Bấm quay lại thì ẩn trang thanh toán, đưa về giao diện chọn ghế
          setIsBookingStage(true);
        }}
        onPaymentSuccess={() => {
          setIsPaymentStage(false);
          setIsTicketStage(true);   // Bấm thanh toán thành công thì nhảy ra trang hóa đơn vé điện tử QR Code
        }}
      />
    );
  }

  // MÀN HÌNH 1: TRẠNG THÁI CHỌN GHẾ PHÒNG CHIẾU (SEAT SELECTION)
  if (isBookingStage) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <SeatSelection 
          availableSlots={availableSlots}
          selectedSlotIndex={selectedSlotIndex}
          setSelectedSlotIndex={setSelectedSlotIndex}
          occupiedSeats={occupiedSeats}
          formatTime={formatTime}
          onBack={() => setIsBookingStage(false)}
          // ĐÃ SỬA: Khi bấm chọn ghế xong, lưu danh sách ghế và kích hoạt màn hình PAYMENT trước thay vì ra thẳng hóa đơn
          onConfirmBooking={(seats) => {
            setConfirmedSeats(seats);
            setIsBookingStage(false);
            setIsPaymentStage(true); // Kích hoạt nhảy sang bước chọn MoMo / VNPAY
          }}
        />
      </div>
    );
  }

  // TRANG CHI TIẾT PHIM MẶC ĐỊNH
  return (
    <div className="min-h-screen pt-28 pb-12 px-6 md:px-20 max-w-7xl mx-auto flex flex-col gap-16 animate-in fade-in duration-500 relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="w-full max-w-90 mx-auto lg:mx-0 aspect-2/3 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10">
          <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-6 text-left">
          <span className="text-rose-500 font-bold tracking-widest uppercase text-sm">
            {movie.original_language === 'en' ? 'TIẾNG ANH' : movie.original_language}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none uppercase">{movie.title}</h1>
          <div className="flex items-center gap-2 text-[#ff436e] font-semibold text-base">
            <Star size={18} fill="#ff436e" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '6.4'} Điểm IMDb</span>
          </div>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl">{movie.overview}</p>

          {/* phần tên diễn viên và đạo diễn */}
          <div className="text-gray-400 font-medium text-sm flex flex-col gap-1.5 border-t border-white/5 pt-4 mt-2">
            <p>
              <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mr-2">Đạo diễn:</span>
              {/* Giả định tên đạo diễn mặc định cho data tĩnh, sau này gắn backend sẽ thay thế */}
              <span className="text-white hover:text-(--btn-neon) transition-colors cursor-pointer">Trấn Thành</span>
            </p>
            
            {movie.casts && movie.casts.length > 0 && (
              <p className="line-clamp-1">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mr-2">Diễn viên:</span>
                <span className="text-white">
                  {/* Lấy ra 3 diễn viên đầu tiên từ mảng casts thật để text không bị tràn hàng */}
                  {movie.casts.slice(0, 3).map(c => c.name).join(', ')}
                  {movie.casts.length > 3 && '...'}
                </span>
              </p>
            )}
          </div>
             {/*  kết thúc phần tên diễn viên và đạo diễn */}

          <div className="text-gray-300 font-medium text-sm md:text-base flex flex-wrap items-center gap-2">
            <span>{movie.runtime} phút</span><span>•</span>
            <span>{movie.genres?.map(g => g.name).join(' | ')}</span><span>•</span>
            <span>{movie.release_date}</span>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <button 
              onClick={() => setTrailerUrl(getEmbedUrl(movie.videoUrl))}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 px-6 py-3 rounded-xl font-bold transition-all text-sm uppercase cursor-pointer"
            >
              <Play size={16} fill="white"/> Xem Trailer
            </button>
            <button onClick={handleStartBooking} className="bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_25px_rgba(255,67,110,0.4)] text-sm uppercase cursor-pointer">
              Mua Vé Ngay
            </button>
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-white/10 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#1b1223]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider text-left">Chọn Ngày Chiếu</p>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
            <div className="flex gap-3 overflow-x-auto scrollbar-none">
              {realDates.map((d) => {
                const isSelected = d.id === selectedDateId;
                return (
                  <button
                    key={d.id}
                    onClick={() => { setSelectedDateId(d.id); setSelectedSlotIndex(0); }}
                    className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#ff436e] border-[#ff436e] text-white font-bold shadow-[0_0_15px_rgba(255,67,110,0.4)] scale-105' 
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    <span className="text-[10px] uppercase opacity-70">{d.dayName}</span>
                    <span className="text-lg font-bold">{d.dateNum}</span>
                  </button>
                );
              })}
            </div>
            <button className="text-gray-500 hover:text-white transition-colors"><ChevronRight size={24} /></button>
          </div>
        </div>

        <button 
          onClick={handleStartBooking}
          className="w-full md:w-auto bg-[#ff436e] hover:bg-[#e0325a] text-white font-extrabold px-12 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(255,67,110,0.4)] text-base tracking-wider active:scale-98 whitespace-nowrap cursor-pointer"
        >
          ĐẶT VÉ NGAY
        </button>
      </div>

      {trailerUrl && (
        <div className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,67,110,0.2)] border border-white/10">
            <button 
              onClick={() => setTrailerUrl(null)}
              className="absolute top-4 right-4 z-50 p-2.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer group"
            >
              <X size={22} className="group-hover:scale-110 transition-transform" />
            </button>
            <iframe
              className="w-full h-full"
              src={trailerUrl}
              title="Trình phát Trailer Phim"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;