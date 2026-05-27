import { X, Calendar, MapPin, Copy, Check, RotateCcw } from 'lucide-react';
import { formatVND, formatDateTime } from '../../../utils/formatHelper';
import { getShowtimeStartFromBooking } from '../../../utils/showtimeHelper';
import {
  getBookingStatusLabel,
  getTransactionStatusLabel,
  getRefundStatusLabel,
} from '../../../utils/statusHelper';

/**
 * BookingDetailModal — full-screen overlay showing ticket details, QR codes,
 * transaction info, and refund info for a selected booking.
 * All state and handlers come from the Profile container via props.
 */
const BookingDetailModal = ({
  isOpen,
  detailLoading,
  bookingDetail,
  refundRequests,
  copiedTicketId,
  onClose,
  onCopyTicketId,
  onCancelBooking,
  onRefundRequest,
}) => {
  if (!isOpen) return null;

  const now = new Date();

  // Compute detail-level eligibility
  const detailShowtimeStart = bookingDetail ? getShowtimeStartFromBooking(bookingDetail) : null;
  const detailIsFuture = detailShowtimeStart && detailShowtimeStart >= now;
  const detailRefundReq = bookingDetail
    ? refundRequests.find(r => r.PhieuDatVe?.MaPhieuDat === bookingDetail.MaPhieuDat)
    : null;
  const detailHasRefundRecord = !!detailRefundReq;

  const detailCanCancel =
    bookingDetail &&
    bookingDetail.TrangThai === 'DA_THANH_TOAN' &&
    detailIsFuture &&
    !detailHasRefundRecord;

  const detailCanRequestRefund =
    bookingDetail &&
    bookingDetail.TrangThai === 'DA_HUY' &&
    detailIsFuture &&
    !detailHasRefundRecord;

  return (
    <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#020617]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {detailLoading || !bookingDetail ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400" />
            <p className="text-gray-400 text-sm">Đang tải chi tiết đặt vé...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 text-left">
            {/* Header */}
            <div>
              <span className="text-[10px] font-bold text-yellow-400 tracking-widest uppercase">
                Chi tiết đặt vé
              </span>
              <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tight text-glow mt-1">
                {bookingDetail.ChiTietDatVes[0]?.SuatChieu?.Phim?.TenPhim || 'Thông tin vé'}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
                <p className="flex items-center gap-1">
                  <Calendar size={12} />
                  Suất: {detailShowtimeStart ? formatDateTime(detailShowtimeStart) : 'Không xác định'}
                </p>
                <p className="flex items-center gap-1">
                  <MapPin size={12} />
                  Phòng: {bookingDetail.ChiTietDatVes[0]?.SuatChieu?.PhongChieu?.TenPhong}{' '}
                  ({bookingDetail.ChiTietDatVes[0]?.SuatChieu?.PhongChieu?.TenLoaiPhong})
                </p>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

              {/* Left: Tickets list */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Danh sách vé ({bookingDetail.ChiTietDatVes.length})
                </h4>
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {bookingDetail.ChiTietDatVes.map((ticket) => {
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.MaChiTietDat}`;
                    return (
                      <div
                        key={ticket.MaChiTietDat}
                        className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors"
                      >
                        {/* QR Code */}
                        <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden">
                          <img
                            src={qrUrl}
                            alt={`QR Ticket ${ticket.Ghe?.TenGhe}`}
                            className="w-full h-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white text-[8px] font-mono p-1 text-center leading-none hidden">
                            QR Offline
                          </div>
                        </div>

                        {/* Ticket info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-white font-extrabold text-sm">Ghế {ticket.Ghe?.TenGhe}</span>
                            <span className="text-yellow-400 font-bold text-xs">{formatVND(ticket.GiaVe)}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Loại: {ticket.Ghe?.TenLoaiGhe || 'Thường'}
                          </p>
                          {/* Copyable ticket code */}
                          <div className="flex items-center gap-2 mt-2 bg-slate-950/70 py-1 px-2.5 rounded-lg border border-white/5">
                            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider shrink-0">Mã vé:</span>
                            <span className="text-[10px] font-mono text-gray-300 truncate select-all">{ticket.MaChiTietDat}</span>
                            <button
                              type="button"
                              onClick={() => onCopyTicketId(ticket.MaChiTietDat)}
                              className="p-1 hover:text-white text-gray-400 transition-colors cursor-pointer shrink-0 ml-auto"
                              title="Sao chép mã vé"
                            >
                              {copiedTicketId === ticket.MaChiTietDat
                                ? <Check size={12} className="text-emerald-400" />
                                : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Invoice / transaction summary */}
              <div className="flex flex-col gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                  Thông tin hóa đơn
                </h4>

                <div className="flex flex-col gap-3 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Mã phiếu đặt:</span>
                    <span className="text-white font-bold select-all truncate max-w-[150px]" title={bookingDetail.MaPhieuDat}>
                      {bookingDetail.MaPhieuDat}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian lập phiếu:</span>
                    <span className="text-white font-medium">{formatDateTime(bookingDetail.NgayTao)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trạng thái phiếu:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBookingStatusLabel(bookingDetail.TrangThai).css}`}>
                      {getBookingStatusLabel(bookingDetail.TrangThai).text}
                    </span>
                  </div>

                  <hr className="border-white/5 my-1" />

                  {/* Transactions */}
                  {bookingDetail.GiaoDichs && bookingDetail.GiaoDichs.length > 0 ? (
                    bookingDetail.GiaoDichs.map((tx) => (
                      <div key={tx.MaGiaoDich} className="flex flex-col gap-2 bg-slate-950/45 p-3 rounded-xl border border-white/5">
                        <div className="flex justify-between font-bold text-white text-[11px]">
                          <span>Thanh toán {tx.PhuongThuc?.toUpperCase()}</span>
                          <span className={getTransactionStatusLabel(tx.TrangThai).text === 'Thành công' ? 'text-emerald-400' : 'text-yellow-400'}>
                            {getTransactionStatusLabel(tx.TrangThai).text}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 flex flex-col gap-1">
                          <p className="truncate">Mã giao dịch: {tx.MaGiaoDichNgoai || tx.MaGiaoDich}</p>
                          <p>Thời gian GD: {formatDateTime(tx.NgayGiaoDich)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-2">Chưa có thông tin giao dịch thanh toán.</p>
                  )}

                  <hr className="border-white/5 my-1" />

                  {/* Total */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-white">Tổng tiền:</span>
                    <span className="text-lg font-black text-yellow-400">{formatVND(bookingDetail.TongTien)}</span>
                  </div>

                  {/* Refund block */}
                  {detailRefundReq && (
                    <div className="flex flex-col gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl mt-3.5 text-left animate-in fade-in duration-200">
                      <h4 className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider border-b border-white/5 pb-2">
                        Thông tin hoàn tiền
                      </h4>
                      <div className="flex flex-col gap-2 text-[11px] text-gray-400">
                        <div className="flex justify-between">
                          <span>Mã hoàn tiền:</span>
                          <span className="text-white font-mono truncate max-w-[120px] select-all" title={detailRefundReq.MaHoanTien}>
                            {detailRefundReq.MaHoanTien}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Số tiền hoàn:</span>
                          <span className="text-yellow-400 font-bold">{formatVND(detailRefundReq.SoTienHoan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trạng thái:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRefundStatusLabel(detailRefundReq.TrangThai).css}`}>
                            {getRefundStatusLabel(detailRefundReq.TrangThai).text}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ngày yêu cầu:</span>
                          <span className="text-white">{formatDateTime(detailRefundReq.NgayTao)}</span>
                        </div>
                        {detailRefundReq.NgayHoanTien && (
                          <div className="flex justify-between">
                            <span>Ngày xử lý:</span>
                            <span className="text-white">{formatDateTime(detailRefundReq.NgayHoanTien)}</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-1 mt-1 border-t border-white/5 pt-2">
                          <span className="font-bold text-gray-500">Lý do:</span>
                          <p className="text-white italic leading-relaxed">"{detailRefundReq.LyDo}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            {(detailCanCancel || detailCanRequestRefund) && (
              <div className="flex items-center justify-end gap-3 mt-4 border-t border-white/5 pt-4">
                {detailCanCancel && (
                  <button
                    onClick={() => onCancelBooking(bookingDetail.MaPhieuDat)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-in fade-in duration-200"
                  >
                    <X size={14} /><span>Hủy vé &amp; Hoàn tiền</span>
                  </button>
                )}
                {detailCanRequestRefund && (
                  <button
                    onClick={() => onRefundRequest(bookingDetail.MaPhieuDat)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(217,119,6,0.3)] animate-in fade-in duration-200"
                  >
                    <RotateCcw size={14} /><span>Yêu cầu hoàn tiền</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailModal;
