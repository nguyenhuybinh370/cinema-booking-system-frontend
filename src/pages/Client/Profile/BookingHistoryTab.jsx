import BookingCard from './BookingCard';
import { getShowtimeStartFromBooking } from '../../../utils/showtimeHelper';

/**
 * BookingHistoryTab — "Vé Sắp Xem" and "Lịch sử mua hàng" tabs.
 * Renders a filtered list of BookingCard rows.
 * All state ownership and handlers live in the Profile container.
 */
const BookingHistoryTab = ({
  activeTab,
  bookings,
  bookingsLoading,
  bookingsError,
  refundRequests,
  now,
  onViewDetail,
  onCancelBooking,
  onRefundRequest,
  onReview,
}) => {
  const upcomingTickets = bookings.filter(item => {
    const showtimeStart = getShowtimeStartFromBooking(item);
    return item.TrangThai === 'DA_THANH_TOAN' && showtimeStart && showtimeStart >= now;
  });

  const pastTickets = bookings.filter(item => {
    const showtimeStart = getShowtimeStartFromBooking(item);
    return !showtimeStart || item.TrangThai !== 'DA_THANH_TOAN' || showtimeStart < now;
  });

  const list = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-black uppercase tracking-wider italic">
        {activeTab === 'upcoming' ? 'Danh sách vé sắp xem' : 'Lịch sử phim đã xem'}
      </h2>

      {bookingsLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff436e]" />
          <p className="text-gray-400 ml-4">Đang tải lịch sử đặt vé...</p>
        </div>
      ) : bookingsError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 font-bold">
          {bookingsError}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {list.map(booking => (
            <BookingCard
              key={booking.MaPhieuDat}
              booking={booking}
              now={now}
              refundRequests={refundRequests}
              activeTab={activeTab}
              onViewDetail={onViewDetail}
              onCancelBooking={onCancelBooking}
              onRefundRequest={onRefundRequest}
              onReview={onReview}
            />
          ))}

          {list.length === 0 && (
            <div className="glass-effect rounded-2xl border border-white/5 p-12 text-center text-gray-400 text-sm">
              Bạn hiện chưa có lịch sử đặt vé mục này...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryTab;
