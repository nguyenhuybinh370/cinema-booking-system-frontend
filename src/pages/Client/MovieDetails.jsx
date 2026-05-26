import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Heart, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import clientService from '../../services/clientService';
import SeatSelection from './SeatSelection';
import TicketConfirmation from './TicketConfirmation';
import Payment from './Payment';

// ─── Helper: Tạo danh sách 7 ngày từ hôm nay ────────────────────────────────
const getNext7Days = () => {
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push({
      id: d.toISOString().substring(0, 10),
      dayName: daysOfWeek[d.getDay()],
      dateNum: d.getDate(),
    });
  }
  return days;
};

const MovieDetails = () => {
  const { id } = useParams();

  // ─── State phim ────────────────────────────────────────────────────────────
  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [movieError, setMovieError] = useState(null);

  // ─── State suất chiếu ──────────────────────────────────────────────────────
  const realDates = getNext7Days();
  const [selectedDateId, setSelectedDateId] = useState(realDates[0]?.id || '');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  // ─── State booking flow ─────────────────────────────────────────────────────
  const [isBookingStage, setIsBookingStage] = useState(false);
  const [isPaymentStage, setIsPaymentStage] = useState(false);
  const [isTicketStage, setIsTicketStage] = useState(false);
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  // ─── State ghế đã đặt ──────────────────────────────────────────────────────
  const [occupiedSeats, setOccupiedSeats] = useState({});
  const [loadingSeats, setLoadingSeats] = useState(false);

  // ─── Trailer popup ──────────────────────────────────────────────────────────
  const [trailerUrl, setTrailerUrl] = useState(null);

  // ─── Fetch chi tiết phim ───────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const fetchMovie = async () => {
      try {
        setLoadingMovie(true);
        const data = await clientService.getMovieById(id);
        if (!cancelled) setMovie(data);
      } catch (err) {
        console.error('Lỗi tải thông tin phim:', err);
        if (!cancelled) setMovieError('Không tìm thấy phim này.');
      } finally {
        if (!cancelled) setLoadingMovie(false);
      }
    };
    fetchMovie();
    return () => { cancelled = true; };
  }, [id]);

  // ─── Fetch suất chiếu theo ngày được chọn ──────────────────────────────────
  const fetchSlots = useCallback(async (maPhim, ngayChieu) => {
    if (!maPhim || !ngayChieu) return;
    try {
      setLoadingSlots(true);
      const slots = await clientService.getShowtimes(maPhim, ngayChieu);
      setAvailableSlots(slots);
      setSelectedSlotIndex(0);
    } catch (err) {
      console.error('Lỗi tải suất chiếu:', err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (movie?.MaPhim && selectedDateId) {
      fetchSlots(movie.MaPhim, selectedDateId);
    }
  }, [movie?.MaPhim, selectedDateId, fetchSlots]);

  // ─── Fetch sơ đồ ghế khi chọn suất ────────────────────────────────────────
  useEffect(() => {
    const currentSlot = availableSlots[selectedSlotIndex];
    if (!currentSlot?.MaSuatChieu) {
      setOccupiedSeats({});
      return;
    }
    let cancelled = false;
    const fetchSeats = async () => {
      try {
        setLoadingSeats(true);
        const { occupiedSeats: occ } = await clientService.getSeatMap(currentSlot.MaSuatChieu);
        if (!cancelled) setOccupiedSeats(occ);
      } catch (err) {
        console.error('Lỗi tải sơ đồ ghế:', err);
      } finally {
        if (!cancelled) setLoadingSeats(false);
      }
    };
    fetchSeats();
    return () => { cancelled = true; };
  }, [availableSlots, selectedSlotIndex]);

  // ─── Khóa scroll khi xem trailer ──────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = trailerUrl ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [trailerUrl]);

  // ─── Helper: embed URL ─────────────────────────────────────────────────────
  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : '';
  };

  // ─── Helper: định dạng giờ ─────────────────────────────────────────────────
  const formatTime = (isoString) => {
    if (!isoString) return '00:00';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const calculateTotalAmount = (seats) => {
    return seats.reduce((total, seatId) => {
      const rowLetter = seatId.charAt(0);
      const price = rowLetter === 'A' || rowLetter === 'B' ? 9 : 12;
      return total + price;
    }, 0);
  };

  const currentSlot = availableSlots[selectedSlotIndex];

  // ─── Loading / Error states ────────────────────────────────────────────────
  if (loadingMovie) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mr-4" />
        Đang tải thông tin phim...
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center text-slate-500">
        <p>{movieError || 'Không tìm thấy phim.'}</p>
      </div>
    );
  }

  // ─── Màn hình 3: Vé xác nhận ──────────────────────────────────────────────
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

  // ─── Màn hình 2: Thanh toán ───────────────────────────────────────────────
  if (isPaymentStage) {
    return (
      <Payment
        movie={movie}
        selectedDateId={selectedDateId}
        currentSlot={currentSlot}
        selectedSeats={confirmedSeats}
        amount={calculateTotalAmount(confirmedSeats)}
        formatTime={formatTime}
        onBack={() => {
          setIsPaymentStage(false);
          setIsBookingStage(true);
        }}
        onPaymentSuccess={() => {
          setIsPaymentStage(false);
          setIsTicketStage(true);
        }}
      />
    );
  }

  // ─── Màn hình 1: Chọn ghế ────────────────────────────────────────────────
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
          onConfirmBooking={(seats) => {
            setConfirmedSeats(seats);
            setIsBookingStage(false);
            setIsPaymentStage(true);
          }}
        />
      </div>
    );
  }

  // ─── Trang chi tiết phim mặc định ─────────────────────────────────────────
  return (
    <div className="min-h-screen pt-28 pb-12 px-6 md:px-20 max-w-7xl mx-auto flex flex-col gap-16 animate-in fade-in duration-500 relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">

        {/* Poster */}
        <div className="w-full max-w-90 mx-auto lg:mx-0 aspect-2/3 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10">
          {movie.poster_path ? (
            <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
              Chưa có ảnh
            </div>
          )}
        </div>

        {/* Thông tin phim */}
        <div className="flex flex-col gap-6 text-left">
          <span className="text-rose-500 font-bold tracking-widest uppercase text-sm">
            {movie.TheLoai || 'Phim chiếu rạp'}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none uppercase">
            {movie.title}
          </h1>
          {movie.vote_average && (
            <div className="flex items-center gap-2 text-[#ff436e] font-semibold text-base">
              <Star size={18} fill="#ff436e" />
              <span>{movie.vote_average.toFixed(1)} Điểm IMDb</span>
            </div>
          )}
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl">
            {movie.overview || 'Chưa có mô tả.'}
          </p>

          {/* Đạo diễn & Diễn viên */}
          <div className="text-gray-400 font-medium text-sm flex flex-col gap-1.5 border-t border-white/5 pt-4 mt-2">
            {movie.DaoDien && (
              <p>
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mr-2">Đạo diễn:</span>
                <span className="text-white">{movie.DaoDien}</span>
              </p>
            )}
            {movie.casts && movie.casts.length > 0 && (
              <p className="line-clamp-1">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mr-2">Diễn viên:</span>
                <span className="text-white">
                  {movie.casts.slice(0, 4).map((c) => c.name).join(', ')}
                  {movie.casts.length > 4 && '...'}
                </span>
              </p>
            )}
          </div>

          {/* Thể loại, thời lượng, ngày chiếu */}
          <div className="text-gray-300 font-medium text-sm md:text-base flex flex-wrap items-center gap-2">
            <span>{movie.runtime} phút</span>
            {movie.genres?.length > 0 && (
              <>
                <span>•</span>
                <span>{movie.genres.map((g) => g.name).join(' | ')}</span>
              </>
            )}
            {movie.release_date && (
              <>
                <span>•</span>
                <span>{movie.release_date}</span>
              </>
            )}
          </div>

          {/* Nút hành động */}
          <div className="flex items-center gap-4 mt-4">
            {movie.videoUrl && (
              <button
                onClick={() => setTrailerUrl(getEmbedUrl(movie.videoUrl))}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 px-6 py-3 rounded-xl font-bold transition-all text-sm uppercase cursor-pointer"
              >
                <Play size={16} fill="white" /> Xem Trailer
              </button>
            )}
            <button
              onClick={() => setIsBookingStage(true)}
              className="bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_25px_rgba(255,67,110,0.4)] text-sm uppercase cursor-pointer"
            >
              Mua Vé Ngay
            </button>
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-white/10 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Chọn ngày & suất chiếu ─────────────────────────────────────────── */}
      <div className="w-full bg-[#1b1223]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-2xl">
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider text-left">
            Chọn Ngày Chiếu
          </p>
          <div className="flex items-center gap-4">
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
          </div>

          {/* Danh sách suất chiếu */}
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-gray-400 font-bold text-sm uppercase tracking-wider text-left">
              Suất Chiếu
            </p>
            {loadingSlots ? (
              <div className="flex gap-2">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="text-slate-500 text-sm">Không có suất chiếu trong ngày này.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={slot.MaSuatChieu}
                    onClick={() => setSelectedSlotIndex(idx)}
                    className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      idx === selectedSlotIndex
                        ? 'bg-[#ff436e] border-[#ff436e] text-white shadow-[0_0_12px_rgba(255,67,110,0.4)]'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {slot.GioChieu}
                    {slot.TenPhong && (
                      <span className="ml-1 text-[10px] opacity-70">· {slot.TenPhong}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (!currentSlot) {
              alert('Vui lòng chọn một suất chiếu trước khi đặt vé!');
              return;
            }
            setIsBookingStage(true);
          }}
          className="w-full md:w-auto bg-[#ff436e] hover:bg-[#e0325a] text-white font-extrabold px-12 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(255,67,110,0.4)] text-base tracking-wider active:scale-98 whitespace-nowrap cursor-pointer"
        >
          ĐẶT VÉ NGAY
        </button>
      </div>

      {/* ─── Popup trailer ─────────────────────────────────────────────────────── */}
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;