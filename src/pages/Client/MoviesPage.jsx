import { useState, useEffect } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clientService from '../../services/clientService';

const MoviesPage = ({ initialType }) => {
  const [movieType, setMovieType] = useState(initialType || 'now');
  const [trailerUrl, setTrailerUrl] = useState(null);

  // ─── State dữ liệu từ API ─────────────────────────────────────────────────
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movies = await clientService.getMovies({ limit: 50 });
        if (!cancelled) setAllMovies(movies);
      } catch (err) {
        console.error('Lỗi tải danh sách phim:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchMovies();
    return () => { cancelled = true; };
  }, []);

  // ─── Phân trang ─────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  // Reset về trang 1 khi đổi tab hoặc tải xong
  useEffect(() => { setCurrentPage(1); }, [movieType, allMovies]);

  // ─── Lọc phim đang chiếu / sắp chiếu ────────────────────────────────────────
  const displayMovies = allMovies.filter((m) =>
    movieType === 'soon' ? m.isComingSoon : !m.isComingSoon,
  );

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = displayMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(displayMovies.length / moviesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ─── Embed trailer ──────────────────────────────────────────────────────────
  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : '';
  };

  // ─── Skeleton ────────────────────────────────────────────────────────────────
  const SkeletonCard = () => (
    <div className="movie-card rounded-lg overflow-hidden border border-white/5 animate-pulse flex flex-col">
      <div className="aspect-2/3 bg-slate-800 rounded-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-700 rounded w-3/4" />
        <div className="h-4 bg-slate-700 rounded w-1/2" />
        <div className="h-8 bg-slate-700 rounded w-full mt-auto" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 md:px-16 max-w-7xl mx-auto flex flex-col gap-10 text-center">

      {/* Tab điều hướng */}
      <div className="flex justify-center gap-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setMovieType('now')}
          className={`text-xl font-bold uppercase tracking-widest italic transition-all cursor-pointer ${
            movieType === 'now'
              ? 'text-(--btn-neon) border-b-2 border-(--btn-neon) pb-2 scale-105'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          Phim Đang Chiếu
        </button>
        <button
          onClick={() => setMovieType('soon')}
          className={`text-xl font-bold uppercase tracking-widest italic transition-all cursor-pointer ${
            movieType === 'soon'
              ? 'text-blue-400 border-b-2 border-blue-400 pb-2 scale-105'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          Phim Sắp Chiếu
        </button>
      </div>

      {/* Lưới danh sách phim */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 min-h-[60vh]">
        {loading ? (
          Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : currentMovies.length === 0 ? (
          <div className="col-span-4 flex items-center justify-center h-64 text-slate-500">
            Không có phim {movieType === 'now' ? 'đang chiếu' : 'sắp chiếu'}.
          </div>
        ) : (
          currentMovies.map((movie) => (
            <div
              key={movie._id}
              className="movie-card bg-transparent rounded-lg overflow-hidden border border-white/5 shadow-none transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {/* Poster */}
              <Link to={`/movie/${movie._id}`} className="block relative aspect-2/3 overflow-hidden rounded-lg cursor-pointer">
                {movie.poster_path ? (
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                    Chưa có ảnh
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1 rounded">2D</span>
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1 rounded">
                    {movie.GioiHanTuoi || 'P'}
                  </span>
                </div>
              </Link>

              {/* Info */}
              <div className="p-4 bg-transparent min-h-35 flex flex-col justify-between flex-1 text-left">
                <Link to={`/movie/${movie._id}`}>
                  <h3 className="text-white font-bold text-base leading-tight uppercase line-clamp-2 mb-4 hover:text-(--btn-neon) transition-colors text-glow cursor-pointer">
                    {movie.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  {movie.videoUrl ? (
                    <button
                      onClick={() => setTrailerUrl(getEmbedUrl(movie.videoUrl))}
                      className="flex items-center gap-1.5 group/btn cursor-pointer"
                    >
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/btn:scale-110">
                        <Play size={12} fill="#ef4444" className="text-red-500 ml-0.5" />
                      </div>
                      <span className="text-white text-xs font-semibold underline decoration-1 underline-offset-4 hover:text-(--btn-neon) transition-colors">
                        Xem Trailer
                      </span>
                    </button>
                  ) : (
                    <span />
                  )}
                  <Link to={`/movie/${movie._id}`}>
                    <button className="bg-[#fde047] hover:bg-[#facc15] text-slate-900 font-extrabold px-5 py-2.5 rounded-md transition-all active:scale-95 text-xs tracking-wider shadow-[0_0_15px_rgba(253,224,71,0.3)] cursor-pointer">
                      {movieType === 'now' ? 'ĐẶT VÉ' : 'CHI TIẾT'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 border-t border-white/5 pt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              currentPage === 1
                ? 'border-white/5 text-gray-600 cursor-not-allowed'
                : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#fde047] border-[#fde047] text-slate-900 shadow-[0_0_15px_rgba(253,224,71,0.4)]'
                    : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              currentPage === totalPages
                ? 'border-white/5 text-gray-600 cursor-not-allowed'
                : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Popup trailer */}
      {trailerUrl && (
        <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(253,224,71,0.15)] border border-white/10">
            <button
              onClick={() => setTrailerUrl(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <iframe
              className="w-full h-full"
              src={trailerUrl}
              title="Movie Trailer Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default MoviesPage;