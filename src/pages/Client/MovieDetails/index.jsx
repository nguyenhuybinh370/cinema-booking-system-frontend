import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { showWarning } from '../../../utils/toastHelper';

// ── Hooks ──────────────────────────────────────────────────────────────────
import useMovieDetail from '../../../hooks/customer/useMovieDetail';
import useMovieShowtimes from '../../../hooks/customer/useMovieShowtimes';
import useSeatHoldTimer from '../../../hooks/customer/useSeatHoldTimer';

// ── Sub-components ─────────────────────────────────────────────────────────
import MovieHero from './MovieHero';
import ShowtimeSelector from './ShowtimeSelector';
import ReviewSection from './ReviewSection';
import ReviewModal from './ReviewModal';
import TrailerModal from './TrailerModal';
import BookingFlow from './BookingFlow';

// ─── Helpers ────────────────────────────────────────────────────────────────

const getEmbedUrl = (videoUrl) => {
  if (!videoUrl) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = videoUrl.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    : '';
};

// ─── Container ──────────────────────────────────────────────────────────────

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── Data + review logic ───────────────────────────────────────────────────
  const {
    movie,
    rawMovie,
    reviews,
    ratingSummary,
    showtimes,
    loading,
    isReviewOpen,
    rating,
    comment,
    hoverRating,
    isReviewSubmitting,
    handleOpenReviewModal,
    handleReviewSubmit,
    onCloseReview,
    onSetRating,
    onHoverRating,
    onSetComment,
  } = useMovieDetail(id);

  // ── Showtime grouping + selection ─────────────────────────────────────────
  const {
    realDates,
    selectedDateId,
    availableSlots,
    selectedSlotIndex,
    setSelectedSlotIndex,
    handleSelectDate,
    hasShowtimes,
  } = useMovieShowtimes(showtimes);

  const currentSlot = availableSlots[selectedSlotIndex];

  // ── Booking flow state ────────────────────────────────────────────────────
  // 'detail' | 'seat' | 'payment' | 'ticket'
  const [bookingStage, setBookingStage] = useState('detail');
  const [confirmedSeats, setConfirmedSeats] = useState([]);
  const [confirmedTotalPrice, setConfirmedTotalPrice] = useState(0);
  const [shouldReloadSeatMap, setShouldReloadSeatMap] = useState(0);
  const [bookingResult, setBookingResult] = useState(null);

  // ── Seat hold timer ───────────────────────────────────────────────────────
  const handleHoldExpiry = async () => {
    showWarning('Thời gian giữ ghế đã hết. Các ghế bạn chọn đã được giải phóng.');
    setConfirmedSeats([]);
    setConfirmedTotalPrice(0);
    setBookingStage('seat');
    setShouldReloadSeatMap(Date.now());
    await holdTimer.releaseHold();
  };

  const holdTimer = useSeatHoldTimer(handleHoldExpiry);

  // ── Trailer state ─────────────────────────────────────────────────────────
  const [trailerUrl, setTrailerUrl] = useState(null);
  useEffect(() => {
    document.body.style.overflow = trailerUrl ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [trailerUrl]);

  // ── Booking handlers ──────────────────────────────────────────────────────
  const handleStartBooking = () => {
    if (!hasShowtimes) {
      toast.error('Hiện chưa có suất chiếu cho phim này.');
      return;
    }
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'CUSTOMER') {
      toast.error('Vui lòng đăng nhập tài khoản khách hàng để đặt vé!');
      navigate('/login', { state: { from: `/movie/${id}` } });
      return;
    }
    if (!currentSlot?.MaSuatChieu) {
      toast.error('Vui lòng chọn suất chiếu trước.');
      return;
    }
    setBookingStage('seat');
  };

  const handleBackFromSeats = () => {
    if (holdTimer.hasActiveHoldRef.current && holdTimer.heldSeatIds.length > 0) {
      holdTimer.releaseHold();
      setConfirmedSeats([]);
      setConfirmedTotalPrice(0);
    }
    setBookingStage('detail');
  };

  const handleBackFromPayment = async () => {
    const maSuatChieu = holdTimer.maSuatChieuRef.current;
    const seatIds = holdTimer.heldSeatIds;
    setConfirmedTotalPrice(0);
    setBookingStage('seat');
    setShouldReloadSeatMap(Date.now());
    holdTimer.hasActiveHoldRef.current = false;
    holdTimer.releaseHold();
    if (seatIds.length > 0 && maSuatChieu) {
      // releaseHold already calls cancelHeldSeats, no need to repeat
    }
  };

  const handleConfirmBooking = (seats, totalPrice, heldIds, maSuatChieu) => {
    setConfirmedSeats(seats);
    setConfirmedTotalPrice(totalPrice);
    holdTimer.activateHold(heldIds, maSuatChieu);
    setBookingStage('payment');
  };

  const handlePaymentSuccess = (bookingDetail, checkoutRes) => {
    holdTimer.markPaymentSuccess();
    setBookingResult(bookingDetail || checkoutRes);
    setConfirmedSeats([]);
    setConfirmedTotalPrice(0);
    setBookingStage('ticket');
  };

  const handleHome = () => {
    navigate('/');
  };

  // ── Loading / Not found ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen text-white bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff436e] mx-auto mb-4" />
          <p className="text-gray-400">Đang tải thông tin chi tiết phim...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen text-white bg-[#020617] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">Không tìm thấy thông tin bộ phim này.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-[#ff436e] hover:bg-[#e0325a] font-bold rounded-xl text-white"
        >
          Quay lại Trang Chủ
        </button>
      </div>
    );
  }

  // ── Booking flow screens ─────────────────────────────────────────────────
  if (bookingStage !== 'detail') {
    return (
      <BookingFlow
        stage={bookingStage}
        movie={movie}
        selectedDateId={selectedDateId}
        availableSlots={availableSlots}
        selectedSlotIndex={selectedSlotIndex}
        setSelectedSlotIndex={setSelectedSlotIndex}
        currentSlot={currentSlot}
        confirmedSeats={confirmedSeats}
        confirmedTotalPrice={confirmedTotalPrice}
        heldSeatIds={holdTimer.heldSeatIds}
        timeLeft={holdTimer.timeLeft}
        shouldReloadSeatMap={shouldReloadSeatMap}
        bookingResult={bookingResult}
        maSuatChieu={holdTimer.maSuatChieuRef.current}
        onBackFromSeats={handleBackFromSeats}
        onBackFromPayment={handleBackFromPayment}
        onConfirmBooking={handleConfirmBooking}
        onPaymentSuccess={handlePaymentSuccess}
        onHome={handleHome}
      />
    );
  }

  // ── Default: Movie detail page ────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-28 pb-12 px-6 md:px-20 max-w-7xl mx-auto flex flex-col gap-16 animate-in fade-in duration-500 relative">

      {/* Hero: poster + info */}
      <MovieHero
        movie={movie}
        rawMovie={rawMovie}
        ratingSummary={ratingSummary}
        hasShowtimes={hasShowtimes}
        onShowTrailer={() => setTrailerUrl(getEmbedUrl(movie.videoUrl))}
        onStartBooking={handleStartBooking}
      />

      {/* Showtime selector panel */}
      <ShowtimeSelector
        realDates={realDates}
        selectedDateId={selectedDateId}
        onSelectDate={handleSelectDate}
        availableSlots={availableSlots}
        selectedSlotIndex={selectedSlotIndex}
        onSelectSlot={setSelectedSlotIndex}
        hasShowtimes={hasShowtimes}
        onBook={handleStartBooking}
      />

      {/* Reviews */}
      <ReviewSection
        ratingSummary={ratingSummary}
        reviews={reviews}
        onOpenReviewModal={handleOpenReviewModal}
      />

      {/* Modals */}
      <TrailerModal trailerUrl={trailerUrl} onClose={() => setTrailerUrl(null)} />

      <ReviewModal
        isOpen={isReviewOpen}
        movieTitle={movie?.title || movie?.TenPhim || ''}
        rating={rating}
        hoverRating={hoverRating}
        comment={comment}
        isSubmitting={isReviewSubmitting}
        onClose={onCloseReview}
        onSetRating={onSetRating}
        onHoverRating={onHoverRating}
        onSetComment={onSetComment}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default MovieDetails;
