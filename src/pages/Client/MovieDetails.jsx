import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { dummyShowsData, dummyDateTimeData, dummyDashboardData, dummyTrailers } from '../../assets/assets'; 
import SeatSelection from './SeatSelection';
import TicketConfirmation from './TicketConfirmation'; 
import Payment from './Payment';
import toast from 'react-hot-toast';
import { getMovieDetail, getMovieReviews, getMovieShowtimes } from '../../api/movieApi';
import { formatVND } from '../../utils/formatHelper';
import { getMovieVisuals } from '../../utils/visualHelper';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE FOR BACKEND INTEGRATION ---
  const [rawMovie, setRawMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ DiemTrungBinh: 0, SoLuongDanhGia: 0 });
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH MOVIE, REVIEWS, AND SHOWTIMES CONCURRENTLY ---
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const [movieRes, reviewsRes, showtimesRes] = await Promise.all([
          getMovieDetail(id),
          getMovieReviews(id),
          getMovieShowtimes(id)
        ]);
        setRawMovie(movieRes);
        setReviews(reviewsRes?.data || []);
        setRatingSummary(reviewsRes?.ratingSummary || { DiemTrungBinh: 0, SoLuongDanhGia: 0 });
        setShowtimes(showtimesRes || []);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết phim:', err);
        toast.error('Không thể tải thông tin bộ phim!');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  // Construct backward-compatible merged movie object
  const movie = useMemo(() => {
    if (!rawMovie) return null;
    const visuals = getMovieVisuals(rawMovie, 0);
    return {
      ...rawMovie,
      _id: rawMovie.MaPhim,
      id: rawMovie.MaPhim,
      title: rawMovie.TenPhim,
      poster_path: visuals.poster,
      backdrop_path: visuals.backdrop,
      release_date: rawMovie.NgayKhoiChieu ? new Date(rawMovie.NgayKhoiChieu).toLocaleDateString('vi-VN') : '',
      runtime: rawMovie.ThoiLuong,
      genres: rawMovie.TheLoai ? rawMovie.TheLoai.split(',').map(g => ({ name: g.trim() })) : [],
      videoUrl: visuals.trailer
    };
  }, [rawMovie]);

  // Group showtimes by date (YYYY-MM-DD)
  const groupedShowtimes = useMemo(() => {
    const groups = {};
    if (Array.isArray(showtimes)) {
      showtimes.forEach((st) => {
        const d = new Date(st.NgayChieu);
        const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        if (!groups[dateStr]) {
          groups[dateStr] = [];
        }
        groups[dateStr].push(st);
      });
    }
    return groups;
  }, [showtimes]);

  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const realDates = useMemo(() => {
    return Object.keys(groupedShowtimes).sort().map((dateStr) => {
      const dateObj = new Date(dateStr);
      return {
        id: dateStr,
        dayName: daysOfWeek[dateObj.getDay()],
        dateNum: dateObj.getDate()
      };
    });
  }, [groupedShowtimes]);

  const [selectedDateId, setSelectedDateId] = useState("");
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  
  // Sync selectedDateId when realDates loads
  useEffect(() => {
    if (realDates.length > 0) {
      if (!selectedDateId || !realDates.some(rd => rd.id === selectedDateId)) {
        setSelectedDateId(realDates[0].id);
        setSelectedSlotIndex(0);
      }
    } else {
      setSelectedDateId("");
    }
  }, [realDates, selectedDateId]);

  const [isBookingStage, setIsBookingStage] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null); 

  const [isTicketStage, setIsTicketStage] = useState(false);
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  const [isPaymentStage, setIsPaymentStage] = useState(false);

  const hasShowtimes = showtimes.length > 0;

  const handleStartBooking = () => {
    if (!hasShowtimes) {
      toast.error("Hiện chưa có suất chiếu cho phim này.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");
    
    if (!token || role !== "CUSTOMER") {
      toast.error("Vui lòng đăng nhập tài khoản khách hàng để đặt vé!");
      navigate("/login", { state: { from: `/movie/${id}` } });
      return;
    }
    if (!currentSlot?.MaSuatChieu) {
      toast.error("Vui lòng chọn suất chiếu trước.");
      return;
    }
    setIsBookingStage(true);
  };

  const availableSlots = useMemo(() => {
    const rawSlots = groupedShowtimes[selectedDateId] || [];
    return rawSlots.map((st) => ({
      ...st,
      time: st.GioChieu,
      showId: st.MaSuatChieu
    }));
  }, [groupedShowtimes, selectedDateId]);

  const currentSlot = availableSlots[selectedSlotIndex];

  const activeShowData = movie && currentSlot ? dummyDashboardData.activeShows.find(
    show => show._id === currentSlot.showId || show.movie._id === movie.MaPhim
  ) : null;
  const occupiedSeats = activeShowData?.occupiedSeats || {};

  const formatTime = (isoString) => {
    if (!isoString) return "00:00";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getEmbedUrl = (videoUrl) => {
    if (!movie) return '';
    const originalIndex = dummyShowsData.findIndex(m => m._id === movie.MaPhim);
    const finalUrl = videoUrl || dummyTrailers[Math.max(0, originalIndex) % dummyTrailers.length]?.videoUrl;
    
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
    const basePrice = Number(currentSlot?.GiaVeGoc) || 90000;
    return seats.reduce((total, seatId) => {
      const rowLetter = seatId.charAt(0);
      const price = (rowLetter === 'A' || rowLetter === 'B') ? basePrice : basePrice + 30000;
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

  if (loading) {
    return (
      <div className="min-h-screen text-white bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff436e] mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin chi tiết phim...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen text-white bg-[#020617] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Không tìm thấy thông tin bộ phim này.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#ff436e] hover:bg-[#e0325a] font-bold rounded-xl text-white">Quay lại Trang Chủ</button>
      </div>
    );
  }

  // TRANG CHI TIẾT PHIM MẶC ĐỊNH
  return (
    <div className="min-h-screen pt-28 pb-12 px-6 md:px-20 max-w-7xl mx-auto flex flex-col gap-16 animate-in fade-in duration-500 relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="w-full max-w-90 mx-auto lg:mx-0 aspect-2/3 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10">
          <img 
            src={movie.poster_path} 
            alt={movie.title} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = dummyShowsData[0]?.poster_path;
            }}
          />
        </div>

        <div className="flex flex-col gap-6 text-left">
          <span className="text-rose-500 font-bold tracking-widest uppercase text-sm">
            BẢN ĐẸP 2D
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none uppercase">{movie.title}</h1>
          <div className="flex items-center gap-2 text-[#ff436e] font-semibold text-base">
            <Star size={18} fill="#ff436e" />
            <span>{ratingSummary.DiemTrungBinh > 0 ? `${ratingSummary.DiemTrungBinh} / 5 điểm` : 'Chưa có đánh giá'} ({ratingSummary.SoLuongDanhGia} đánh giá)</span>
          </div>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl">{movie.overview || 'Chưa có mô tả nội dung cho phim này.'}</p>

          {/* phần tên diễn viên và đạo diễn */}
          <div className="text-gray-400 font-medium text-sm flex flex-col gap-1.5 border-t border-white/5 pt-4 mt-2">
            <p>
              <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mr-2">Đạo diễn:</span>
              <span className="text-white hover:text-(--btn-neon) transition-colors cursor-pointer">{movie.DaoDien || 'Chưa cập nhật'}</span>
            </p>
            
            <p className="line-clamp-2">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mr-2">Diễn viên:</span>
              <span className="text-white">
                {movie.DienVien || 'Chưa cập nhật'}
              </span>
            </p>
          </div>
          {/*  kết thúc phần tên diễn viên và đạo diễn */}

          <div className="text-gray-300 font-medium text-sm md:text-base flex flex-wrap items-center gap-2">
            <span>{movie.runtime} phút</span><span>•</span>
            <span>{movie.TheLoai}</span><span>•</span>
            <span>Khởi chiếu: {movie.release_date}</span>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <button 
              onClick={() => setTrailerUrl(getEmbedUrl(movie.videoUrl))}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 px-6 py-3 rounded-xl font-bold transition-all text-sm uppercase cursor-pointer"
            >
              <Play size={16} fill="white"/> Xem Trailer
            </button>
            <button 
              onClick={handleStartBooking} 
              disabled={!hasShowtimes}
              className={`bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold px-8 py-3 rounded-xl transition-all text-sm uppercase cursor-pointer ${
                !hasShowtimes ? 'opacity-40 cursor-not-allowed shadow-none' : 'shadow-[0_0_25px_rgba(255,67,110,0.4)]'
              }`}
            >
              {hasShowtimes ? 'Mua Vé Ngay' : 'Chưa có suất chiếu'}
            </button>
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-white/10 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#1b1223]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-8 shadow-2xl text-left">
        {/* Chọn Ngày Chiếu */}
        <div className="flex flex-col gap-4 w-full">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Chọn Ngày Chiếu</p>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
            <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
              {realDates.map((d) => {
                const isSelected = d.id === selectedDateId;
                return (
                  <button
                    key={d.id}
                    onClick={() => { setSelectedDateId(d.id); setSelectedSlotIndex(0); }}
                    className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all cursor-pointer shrink-0 ${
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
              {realDates.length === 0 && (
                <p className="text-gray-500 italic text-sm py-2">Hiện tại không có suất chiếu nào khả dụng cho phim này.</p>
              )}
            </div>
            <button className="text-gray-500 hover:text-white transition-colors"><ChevronRight size={24} /></button>
          </div>
        </div>

        {/* Chọn Suất Chiếu & Phòng Chiếu */}
        {realDates.length > 0 && (
          <div className="flex flex-col gap-4 w-full border-t border-white/5 pt-6">
            <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Chọn Suất Chiếu & Phòng Chiếu</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableSlots.map((slot, index) => {
                const isSelected = index === selectedSlotIndex;
                return (
                  <button
                    key={slot.showId || index}
                    onClick={() => setSelectedSlotIndex(index)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-linear-to-r from-[#ff436e] to-[#e0325a] border-[#ff436e] text-white shadow-[0_0_20px_rgba(255,67,110,0.4)] scale-105' 
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    <span className="text-lg font-black tracking-wider">{formatTime(slot.time)}</span>
                    <span className="text-[10px] uppercase opacity-80 mt-1 font-bold">
                      {slot.PhongChieu?.TenPhong || 'Phòng chiếu'}
                    </span>
                    <span className="text-xs font-semibold text-green-400 mt-0.5">
                      {formatVND(slot.GiaVeGoc)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

          {realDates.length === 0 && (
            <div className="w-full text-center py-4">
              <p className="text-gray-400 italic text-sm">Hiện chưa có suất chiếu cho phim này.</p>
            </div>
          )}

          {/* Ghi chú giá vé */}
          {realDates.length > 0 && (
            <p className="text-xs text-gray-500 italic mt-1">* Giá vé gốc hiển thị trên suất chiếu. Giá ghế cuối cùng đã bao gồm phụ thu loại ghế, phòng chiếu và ngày chiếu.</p>
          )}

        {/* Nút hành động */}
        <div className="w-full flex justify-end border-t border-white/5 pt-6">
          <button 
            disabled={!hasShowtimes}
            onClick={handleStartBooking}
            className={`w-full md:w-auto bg-[#ff436e] hover:bg-[#e0325a] text-white font-extrabold px-12 py-4 rounded-2xl transition-all text-base tracking-wider active:scale-98 whitespace-nowrap cursor-pointer ${
              !hasShowtimes ? 'opacity-40 cursor-not-allowed shadow-none' : 'shadow-[0_0_30px_rgba(255,67,110,0.4)]'
            }`}
          >
            {hasShowtimes ? 'ĐẶT VÉ NGAY' : 'CHƯA CÓ SUẤT CHIẾU'}
          </button>
        </div>
      </div>

      {/* SECTION ĐÁNH GIÁ (REVIEWS) */}
      <div className="w-full bg-[#1b1223]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl text-left">
        <h2 className="text-2xl font-bold uppercase italic tracking-wider text-white">Đánh Giá Từ Khách Hàng</h2>
        
        {/* Rating Stats Summary */}
        <div className="flex items-center gap-6 border-b border-white/5 pb-6">
          <div className="text-center bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
            <p className="text-4xl font-extrabold text-yellow-400">{ratingSummary.DiemTrungBinh || '0.0'}</p>
            <div className="flex items-center justify-center gap-1 my-1 text-yellow-400">
              <Star size={16} fill="currentColor" className="text-yellow-400" />
            </div>
            <p className="text-xs text-gray-400 font-medium">{ratingSummary.SoLuongDanhGia || 0} đánh giá</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">Điểm đánh giá trung bình</p>
            <p className="text-sm text-gray-400">Đánh giá thực tế từ các khán giả đã xem bộ phim này tại cụm rạp.</p>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-400 italic">Chưa có đánh giá nào cho phim này.</p>
        ) : (
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {reviews.map((rev) => (
              <div key={rev.MaDanhGia} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-sm uppercase">
                      {rev.KhachHang?.HoTen?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{rev.KhachHang?.HoTen || 'Ẩn danh'}</p>
                      <p className="text-[10px] text-gray-500">{new Date(rev.NgayTao).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/5 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-400/10">
                    <span>{rev.SoSao}</span>
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed pl-10">{rev.BinhLuan}</p>
              </div>
            ))}
          </div>
        )}
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