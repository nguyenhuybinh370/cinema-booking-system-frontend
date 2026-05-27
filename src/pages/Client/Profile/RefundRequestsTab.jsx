import { Calendar, CreditCard, ExternalLink } from 'lucide-react';
import { assets } from '../../../assets/assets';
import { formatVND, formatDateTime } from '../../../utils/formatHelper';
import { getRefundStatusLabel } from '../../../utils/statusHelper';
import { getMovieVisuals } from '../../../utils/visualHelper';
import { getShowtimeStartFromBooking } from '../../../utils/showtimeHelper';

/**
 * RefundRequestsTab — "Yêu cầu hoàn tiền" tab.
 * Lists all refund requests from the backend.
 * Pure presentational: receives data + callbacks via props.
 */
const RefundRequestsTab = ({
  refundRequests,
  bookingsLoading,
  onViewDetail,
}) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-black uppercase tracking-wider italic">
        Danh sách yêu cầu hoàn tiền
      </h2>

      {bookingsLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff436e]" />
          <p className="text-gray-400 ml-4">Đang tải danh sách hoàn tiền...</p>
        </div>
      ) : refundRequests.length === 0 ? (
        <div className="glass-effect rounded-2xl border border-white/5 p-12 text-center text-gray-400 text-sm">
          Bạn chưa gửi yêu cầu hoàn tiền nào...
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {refundRequests.map((refund) => {
            const statusLabel = getRefundStatusLabel(refund.TrangThai);
            const movie = refund.PhieuDatVe?.Movie;
            const visuals = getMovieVisuals({ TenPhim: movie?.TenPhim });

            // Build a synthetic booking object to reuse the showtime helper
            const syntheticBooking = movie?.NgayChieu
              ? { ChiTietDatVes: [{ SuatChieu: { NgayChieu: movie.NgayChieu, GioChieu: movie.GioChieu } }] }
              : null;
            const showtimeStart = syntheticBooking ? getShowtimeStartFromBooking(syntheticBooking) : null;

            return (
              <div
                key={refund.MaHoanTien}
                className="glass-effect rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row items-center gap-6 hover:border-white/10 transition-all"
              >
                <img
                  src={visuals?.poster || assets.profile}
                  alt={movie?.TenPhim || 'Movie Poster'}
                  className="w-20 h-28 object-cover rounded-xl border border-white/10 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-bold text-lg uppercase truncate tracking-tight text-glow">
                      {movie?.TenPhim || 'Yêu cầu hoàn tiền'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusLabel.css}`}>
                      {statusLabel.text}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
                    <p className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-500" />
                      Suất: {showtimeStart ? formatDateTime(showtimeStart) : 'Không xác định'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-gray-500" />
                      Số tiền hoàn: <span className="text-yellow-400 font-bold">{formatVND(refund.SoTienHoan)}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      Ngày yêu cầu: <span className="text-gray-300 font-medium">{formatDateTime(refund.NgayTao)}</span>
                    </p>
                    {refund.NgayHoanTien && (
                      <p className="flex items-center gap-1.5">
                        Ngày duyệt: <span className="text-gray-300 font-medium">{formatDateTime(refund.NgayHoanTien)}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5 col-span-2">
                      Mã hoàn tiền: <span className="text-gray-300 font-mono select-all">{refund.MaHoanTien}</span>
                    </p>
                    <p className="flex flex-col gap-1 col-span-2 mt-1 border-t border-white/5 pt-2">
                      <span className="font-bold text-gray-500">Lý do hoàn tiền:</span>
                      <span className="text-white italic">"{refund.LyDo}"</span>
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-6 flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => onViewDetail(refund.PhieuDatVe?.MaPhieuDat)}
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <ExternalLink size={14} /><span>Xem chi tiết vé</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RefundRequestsTab;
