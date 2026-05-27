import { Calendar, MapPin, CreditCard, ExternalLink, X, RotateCcw, MessageSquare } from 'lucide-react';
import { assets } from '../../../assets/assets';
import { formatVND, formatDateTime } from '../../../utils/formatHelper';
import { getShowtimeStartFromBooking } from '../../../utils/showtimeHelper';
import { getBookingStatusLabel, getRefundStatusLabel } from '../../../utils/statusHelper';
import { getMovieVisuals } from '../../../utils/visualHelper';

/**
 * BookingCard — renders a single booking item row in the booking history/upcoming list.
 * Pure presentational: receives data + action callbacks via props.
 */
const BookingCard = ({
  booking,
  now,
  refundRequests,
  activeTab,
  onViewDetail,
  onCancelBooking,
  onRefundRequest,
  onReview,
}) => {
  const visuals = getMovieVisuals({ TenPhim: booking.Phim?.TenPhim });
  const statusLabel = getBookingStatusLabel(booking.TrangThai);
  const reconstructedMovie = { title: booking.Phim?.TenPhim };

  const showtimeStart = getShowtimeStartFromBooking(booking);
  const isFuture = showtimeStart && showtimeStart >= now;
  const refundReq = refundRequests.find(r => r.PhieuDatVe?.MaPhieuDat === booking.MaPhieuDat);
  const refundStatusLabel = refundReq ? getRefundStatusLabel(refundReq.TrangThai) : null;
  const hasRefundRecord = !!refundReq;

  const canCancel = booking.TrangThai === 'DA_THANH_TOAN' && isFuture && !hasRefundRecord;
  const canRequestRefund = booking.TrangThai === 'DA_HUY' && isFuture && !hasRefundRecord;

  return (
    <div className="glass-effect rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row items-center gap-6 hover:border-white/10 transition-all">
      <img
        src={visuals?.poster || assets.profile}
        alt={booking.Phim?.TenPhim}
        className="w-20 h-28 object-cover rounded-xl border border-white/10 shrink-0"
      />

      <div className="flex-1 min-w-0 flex flex-col gap-2 w-full">
        {/* Title + status badges */}
        <div className="flex items-center gap-3">
          <h3 className="text-white font-bold text-lg uppercase truncate tracking-tight text-glow">
            {booking.Phim?.TenPhim || 'Thông tin vé'}
          </h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusLabel.css}`}>
            {statusLabel.text}
          </span>
          {refundStatusLabel && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${refundStatusLabel.css}`}>
              {refundStatusLabel.text}
            </span>
          )}
        </div>

        {/* Booking meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
          <p className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-500" />
            Suất: {showtimeStart ? formatDateTime(showtimeStart) : 'Không xác định'}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-500" />
            Phòng: <span className="text-white font-bold">{booking.Phim?.TenPhong || 'Chưa cập nhật'}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <CreditCard size={14} className="text-gray-500" />
            Tổng tiền: <span className="text-yellow-400 font-bold">{formatVND(booking.TongTien)}</span>
          </p>
          <p className="flex items-center gap-1.5">
            Số lượng: <span className="text-gray-300 font-medium">{booking.SoLuongVe} vé</span>
          </p>
          <p className="flex items-center gap-1.5 col-span-2">
            Mã phiếu: <span className="text-gray-300 font-mono select-all">{booking.MaPhieuDat}</span>
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-6 flex flex-col items-center justify-center gap-2">
        <button
          onClick={() => onViewDetail(booking.MaPhieuDat)}
          className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <ExternalLink size={14} /><span>Xem chi tiết</span>
        </button>

        {canCancel && (
          <button
            onClick={() => onCancelBooking(booking.MaPhieuDat)}
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-in fade-in duration-200"
          >
            <X size={14} /><span>Hủy vé &amp; Hoàn tiền</span>
          </button>
        )}

        {canRequestRefund && (
          <button
            onClick={() => onRefundRequest(booking.MaPhieuDat)}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(217,119,6,0.3)] animate-in fade-in duration-200"
          >
            <RotateCcw size={14} /><span>Yêu cầu hoàn tiền</span>
          </button>
        )}

        {activeTab === 'past' && booking.TrangThai === 'DA_THANH_TOAN' && (
          <button
            onClick={() => onReview(reconstructedMovie)}
            className="w-full sm:w-auto bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(255,67,110,0.3)]"
          >
            <MessageSquare size={14} /><span>Đánh giá phim</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
