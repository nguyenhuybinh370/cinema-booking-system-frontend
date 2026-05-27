
import MovieCard from './MovieCard';

const MovieGrid = ({ title, movies }) => {
  return (
    <section className="px-6 md:px-10 py-16">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[var(--btn-neon)] rounded-full"></div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        </div>
        <button className="text-slate-400 hover:text-[var(--btn-neon)] transition-colors flex items-center gap-1 group">
          Xem tất cả 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
