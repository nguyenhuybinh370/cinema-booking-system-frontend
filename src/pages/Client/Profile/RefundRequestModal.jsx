import { X } from 'lucide-react';

/**
 * RefundRequestModal — form to submit a refund request for an already-cancelled booking.
 * All state and submit logic come from the Profile container.
 */
const RefundRequestModal = ({
  isOpen,
  refundReason,
  onRefundReasonChange,
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
            Yêu cầu hoàn tiền
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mt-1">
            Yêu cầu hoàn tiền cho vé đã hủy của bạn. Quản trị viên rạp phim sẽ xem xét và xử lý yêu cầu này.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
              Lý do hoàn tiền <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows="4"
              placeholder="Vui lòng nhập lý do hoàn tiền cụ thể..."
              value={refundReason}
              onChange={(e) => onRefundReasonChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/10 transition-all resize-none leading-relaxed"
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
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(217,119,6,0.4)]"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundRequestModal;
