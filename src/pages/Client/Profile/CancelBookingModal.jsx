import { X } from 'lucide-react';

/**
 * CancelBookingModal — confirmation dialog for canceling a booking.
 * All state and submit logic come from the Profile container.
 */
const CancelBookingModal = ({
  isOpen,
  cancelReason,
  onCancelReasonChange,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#020617]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1">
            Xác nhận hủy vé
          </h3>
          <p className="text-xs text-red-400 font-semibold leading-relaxed mt-1">
            Lưu ý: Thao tác này sẽ hủy vé xem phim của bạn. Một yêu cầu hoàn tiền tương ứng sẽ tự động được gửi tới ban quản trị để duyệt.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
              Lý do hủy vé (Không bắt buộc)
            </label>
            <textarea
              rows="3"
              placeholder="Nhập lý do hủy vé của bạn..."
              value={cancelReason}
              onChange={(e) => onCancelReasonChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/10 transition-all resize-none leading-relaxed"
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(225,29,72,0.4)]"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelBookingModal;
