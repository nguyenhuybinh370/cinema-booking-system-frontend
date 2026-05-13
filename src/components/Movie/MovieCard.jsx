import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card group">
      <Link to={`/movie/${movie.MaPhim}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={movie.HinhAnh} 
            alt={movie.TenPhim} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          {/* Rating badge */}
          <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
            <span className="text-[var(--btn-neon)] font-bold text-sm flex items-center gap-1">
              ⭐ {movie.Rating}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-transparent opacity-0 group-hover:opacity-100 flex flex-col items-center justify-end p-6 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <button className="btn-bright w-full mb-2 pointer-events-none">Mua Vé</button>
            <span className="text-white text-sm font-medium hover:underline">Chi tiết</span>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/movie/${movie.MaPhim}`}>
          <h3 className="font-bold text-lg mb-1 truncate group-hover:text-[var(--btn-neon)] transition-colors">
            {movie.TenPhim}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{movie.Tags}</span>
          <span className="text-xs uppercase px-2 py-0.5 border border-slate-700 rounded-md bg-slate-800/50">
            Vietsub
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

