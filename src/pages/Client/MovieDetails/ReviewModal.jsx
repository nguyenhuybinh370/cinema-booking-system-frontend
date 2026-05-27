import { Star, X } from 'lucide-react';

/**
 * ReviewModal — overlay form for submitting a movie review.
 * All state and submit logic live in the MovieDetails container.
 *
 * Props:
 *  isOpen           – boolean
 *  movieTitle       – string
 *  rating           – number 1-5
 *  hoverRating      – number 0-5
 *  comment          – string
 *  isSubmitting     – boolean
 *  onClose          – () => void
 *  onSetRating      – (n) => void
 *  onHoverRating    – (n) => void
 *  onSetComment     – (str) => void
 *  onSubmit         – (e) => void
 */
const ReviewModal = ({
  isOpen,
  movieTitle,
  rating,
  hoverRating,
  comment,
  isSubmitting,
  onClose,
  onSetRating,
  onHoverRating,
  onSetComment,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const ratingLabels = {
    1: 'Rất tệ 😡',
    2: 'Tệ 😞',
    3: 'Bình thường 😐',
    4: 'Hay 🙂',
    5: 'Tuyệt vời! 😍',
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#18101f] border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(255,67,110,0.15)] flex flex-col gap-6 animate-in zoom-in-95 duration-200 text-left">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-600 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer group"
        >
          <X size={18} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Title */}
        <div>
          <span className="text-[#ff436e] font-bold text-xs uppercase tracking-wider">Viết Đánh Giá Phim</span>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1 line-clamp-1">
            {movieTitle}
          </h3>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {/* Star rating */}
          <div className="flex flex-col gap-2 items-center justify-center py-4 bg-white/3 border border-white/5 rounded-2xl">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Chọn số sao đánh giá</p>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isHighlighted = hoverRating >= starNum || (!hoverRating && rating >= starNum);
                return (
                  <button
                    key={starNum}
                    type="button"
                    onClick={() => onSetRating(starNum)}
                    onMouseEnter={() => onHoverRating(starNum)}
                    onMouseLeave={() => onHoverRating(0)}
                    className="text-yellow-400 hover:scale-115 active:scale-95 transition-transform cursor-pointer focus:outline-hidden"
                  >
                    <Star
                      size={36}
                      fill={isHighlighted ? '#facc15' : 'none'}
                      className={isHighlighted ? 'text-yellow-400' : 'text-gray-600 transition-colors duration-250'}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-yellow-400 text-sm font-bold mt-2 tracking-wide uppercase">
              {ratingLabels[rating] || ''}
            </span>
          </div>

          {/* Comment textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">Bình luận phim</label>
            <textarea
              value={comment}
              onChange={(e) => onSetComment(e.target.value)}
              maxLength={255}
              placeholder="Chia sẻ cảm nghĩ của bạn về bộ phim này... (Không bắt buộc, tối đa 255 ký tự)"
              className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-hidden focus:border-[#ff436e] focus:ring-1 focus:ring-[#ff436e] transition-all resize-none leading-relaxed placeholder-gray-500"
            />
            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
              <span>Tránh nội dung Spoil hoặc vi phạm tiêu chuẩn cộng đồng.</span>
              <span className={comment.length >= 240 ? 'text-[#ff436e] font-bold' : ''}>
                {comment.length}/255
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white font-bold transition-all text-sm uppercase cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#ff436e] to-[#e0325a] hover:from-[#e0325a] hover:to-[#c22048] text-white font-bold transition-all text-sm uppercase cursor-pointer flex items-center gap-2 justify-center shadow-[0_0_20px_rgba(255,67,110,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
