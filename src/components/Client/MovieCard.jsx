import { CalendarDays, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMovieVisuals } from '../../utils/visualHelper';

const MovieCard = ({ movie, actionLabel = 'Đặt vé', onPlayTrailer }) => {
  const visuals = getMovieVisuals(movie);
  const releaseYear = movie.NgayKhoiChieu ? new Date(movie.NgayKhoiChieu).getFullYear() : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/8 bg-(--client-surface) transition duration-300 hover:-translate-y-1 hover:border-(--client-primary)/50">
      <Link to={`/movie/${movie.MaPhim}`} className="relative block aspect-2/3 overflow-hidden">
        <img src={movie.HinhAnh || visuals.poster} alt={`Poster ${movie.TenPhim}`} className="size-full object-cover transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.src = visuals.poster; }} />
        <span className="absolute left-3 top-3 rounded-md bg-(--client-primary) px-2 py-1 text-xs font-bold text-white">{movie.GioiHanTuoi || 'P'}</span>
        <div className="absolute inset-0 bg-linear-to-t from-(--client-bg) via-transparent to-transparent" />
      </Link>
      <div className="p-4">
        <Link to={`/movie/${movie.MaPhim}`} className="line-clamp-1 text-base font-bold text-white transition hover:text-(--client-secondary)">{movie.TenPhim}</Link>
        <div className="mt-2 flex gap-3 text-xs text-slate-400">
          {releaseYear && <span className="flex items-center gap-1"><CalendarDays size={13} />{releaseYear}</span>}
          {movie.ThoiLuong > 0 && <span className="flex items-center gap-1"><Clock size={13} />{movie.ThoiLuong} phút</span>}
        </div>
        <div className="mt-4 flex gap-2">
          <Link to={`/movie/${movie.MaPhim}`} className="client-primary-button flex-1 justify-center">{actionLabel}</Link>
          <button type="button" onClick={() => onPlayTrailer(visuals.trailer)} className="client-icon-button" aria-label={`Xem trailer ${movie.TenPhim}`}><Play size={17} /></button>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
