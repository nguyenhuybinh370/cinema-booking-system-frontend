import { Star } from 'lucide-react';

/**
 * ReviewSection — rating summary + scrollable review list + "Viết đánh giá" button.
 * Pure presentational.
 */
const ReviewSection = ({ ratingSummary, reviews, onOpenReviewModal }) => {
  return (
    <div className="w-full bg-[#1b1223]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold uppercase italic tracking-wider text-white">
          Đánh Giá Từ Khách Hàng
        </h2>
        <button
          onClick={onOpenReviewModal}
          className="flex items-center gap-2 bg-gradient-to-r from-[#ff436e] to-[#e0325a] hover:from-[#e0325a] hover:to-[#c22048] text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm uppercase cursor-pointer shadow-[0_0_15px_rgba(255,67,110,0.3)] hover:shadow-[0_0_20px_rgba(255,67,110,0.5)] self-start sm:self-auto"
        >
          Viết đánh giá
        </button>
      </div>

      {/* Rating stats */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-6">
        <div className="text-center bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
          <p className="text-4xl font-extrabold text-yellow-400">
            {ratingSummary.DiemTrungBinh || '0.0'}
          </p>
          <div className="flex items-center justify-center gap-1 my-1 text-yellow-400">
            <Star size={16} fill="currentColor" className="text-yellow-400" />
          </div>
          <p className="text-xs text-gray-400 font-medium">
            {ratingSummary.SoLuongDanhGia || 0} đánh giá
          </p>
        </div>
        <div>
          <p className="text-lg font-bold text-white">Điểm đánh giá trung bình</p>
          <p className="text-sm text-gray-400">
            Đánh giá thực tế từ các khán giả đã xem bộ phim này tại cụm rạp.
          </p>
        </div>
      </div>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 italic">Chưa có đánh giá nào cho phim này.</p>
      ) : (
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
          {reviews.map((rev) => (
            <div
              key={rev.MaDanhGia}
              className="bg-white/2 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-sm uppercase">
                    {rev.KhachHang?.HoTen?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{rev.KhachHang?.HoTen || 'Ẩn danh'}</p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(rev.NgayTao).toLocaleDateString('vi-VN')}
                    </p>
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
  );
};

export default ReviewSection;
