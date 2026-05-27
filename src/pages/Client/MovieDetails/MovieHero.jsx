import { Play, Heart, Star } from 'lucide-react';
import { getMovieVisuals } from '../../../utils/visualHelper';

/**
 * MovieHero — left poster + right title/meta/actions block.
 * Pure presentational. All handlers and data passed via props.
 */
const MovieHero = ({
  movie,
  rawMovie,
  ratingSummary,
  hasShowtimes,
  onShowTrailer,
  onStartBooking,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
      {/* Poster */}
      <div className="w-full max-w-90 mx-auto lg:mx-0 aspect-2/3 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getMovieVisuals(rawMovie).poster;
          }}
        />
      </div>

      {/* Info + actions */}
      <div className="flex flex-col gap-6 text-left">
        <span className="text-rose-500 font-bold tracking-widest uppercase text-sm">BẢN ĐẸP 2D</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none uppercase">
          {movie.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 text-[#ff436e] font-semibold text-base">
          <Star size={18} fill="#ff436e" />
          <span>
            {ratingSummary.DiemTrungBinh > 0
              ? `${ratingSummary.DiemTrungBinh} / 5 điểm`
              : 'Chưa có đánh giá'}{' '}
            ({ratingSummary.SoLuongDanhGia} đánh giá)
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl">
          {movie.overview || 'Chưa có mô tả nội dung cho phim này.'}
        </p>

        {/* Director / Cast */}
        <div className="text-gray-400 font-medium text-sm flex flex-col gap-1.5 border-t border-white/5 pt-4 mt-2">
          <p>
            <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mr-2">Đạo diễn:</span>
            <span className="text-white hover:text-(--btn-neon) transition-colors cursor-pointer">
              {movie.DaoDien || 'Chưa cập nhật'}
            </span>
          </p>
          <p className="line-clamp-2">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mr-2">Diễn viên:</span>
            <span className="text-white">{movie.DienVien || 'Chưa cập nhật'}</span>
          </p>
        </div>

        {/* Runtime / Genre / Release */}
        <div className="text-gray-300 font-medium text-sm md:text-base flex flex-wrap items-center gap-2">
          <span>{movie.runtime} phút</span>
          <span>•</span>
          <span>{movie.TheLoai}</span>
          <span>•</span>
          <span>Khởi chiếu: {movie.release_date}</span>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={onShowTrailer}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 px-6 py-3 rounded-xl font-bold transition-all text-sm uppercase cursor-pointer"
          >
            <Play size={16} fill="white" /> Xem Trailer
          </button>
          <button
            onClick={onStartBooking}
            disabled={!hasShowtimes}
            className={`bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold px-8 py-3 rounded-xl transition-all text-sm uppercase cursor-pointer ${
              !hasShowtimes ? 'opacity-40 cursor-not-allowed shadow-none' : 'shadow-[0_0_25px_rgba(255,67,110,0.4)]'
            }`}
          >
            {hasShowtimes ? 'Mua Vé Ngay' : 'Chưa có suất chiếu'}
          </button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-white/10 transition-colors">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
