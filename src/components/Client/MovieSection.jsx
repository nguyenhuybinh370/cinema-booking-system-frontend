import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';

const MovieSection = ({ title, eyebrow, movies, viewAllTo, actionLabel, onPlayTrailer }) => (
  <section className="client-section">
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="client-eyebrow">{eyebrow}</p>
        <h2 className="client-section-title">{title}</h2>
      </div>
      <Link to={viewAllTo} className="hidden items-center gap-2 text-sm font-semibold text-(--client-secondary) hover:text-white sm:flex">Xem tất cả <ArrowRight size={16} /></Link>
    </div>
    {movies.length > 0 ? (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.slice(0, 5).map((movie) => <MovieCard key={movie.MaPhim} movie={movie} actionLabel={actionLabel} onPlayTrailer={onPlayTrailer} />)}
      </div>
    ) : (
      <div className="client-empty-state">Chưa có phim trong danh sách này.</div>
    )}
  </section>
);

export default MovieSection;
