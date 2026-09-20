import { CalendarDays, Clock, Play, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMovieVisuals } from '../../utils/visualHelper';

const HomeHero = ({ movie, onPlayTrailer }) => {
  if (!movie) {
    return (
      <section className="client-hero grid min-h-140 place-items-center px-4 pt-20 text-center">
        <div><p className="text-sm font-bold uppercase tracking-[0.3em] text-(--client-secondary)">NexCinema</p><h1 className="mt-4 text-5xl font-black text-white">Điện ảnh bắt đầu từ đây</h1></div>
      </section>
    );
  }

  const visuals = getMovieVisuals(movie);
  const genres = movie.genres?.map((genre) => genre.name).slice(0, 3).join(' • ') || movie.TheLoai;
  const releaseYear = movie.NgayKhoiChieu ? new Date(movie.NgayKhoiChieu).getFullYear() : null;

  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <img src={visuals.backdrop} alt="" className="absolute inset-0 size-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-linear-to-r from-(--client-bg) via-(--client-bg)/75 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-(--client-bg) via-transparent to-(--client-bg)/20" />
      <div className="relative mx-auto w-full max-w-7xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-(--client-secondary)">Đang chiếu nổi bật</p>
        <h1 className="max-w-4xl text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">{movie.TenPhim}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
          {genres && <span>{genres}</span>}
          {releaseYear && <span className="flex items-center gap-1"><CalendarDays size={16} />{releaseYear}</span>}
          {movie.ThoiLuong > 0 && <span className="flex items-center gap-1"><Clock size={16} />{movie.ThoiLuong} phút</span>}
        </div>
        <p className="mt-5 max-w-2xl line-clamp-3 text-base leading-7 text-slate-300">{movie.NoiDung || 'Khám phá bộ phim và chọn suất chiếu phù hợp với bạn.'}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={`/movie/${movie.MaPhim}`} className="client-primary-button"><Ticket size={18} />Đặt vé ngay</Link>
          <button type="button" onClick={() => onPlayTrailer(visuals.trailer)} className="client-secondary-button"><Play size={18} />Xem trailer</button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
