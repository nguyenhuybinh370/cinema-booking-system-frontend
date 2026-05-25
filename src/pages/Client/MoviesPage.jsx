import { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dummyShowsData, dummyTrailers } from '../../assets/assets';

const MoviesPage = ({ initialType }) => {
  const [movieType, setMovieType] = useState(initialType); // 'now' hoặc 'soon'
  const [trailerUrl, setTrailerUrl] = useState(null); // Quản lý đóng mở trailer video

  // --- LOGIC PHÂN TRANG (PAGINATION) ---
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 4; // Số lượng phim hiển thị trên một trang (2 hàng x 4 cột)

  // Reset lại trang về trang 1 khi người dùng bấm chuyển đổi Tab
  // useEffect(() => {
  //   setMovieType(initialType);
  //   setCurrentPage(1);
  // }, [initialType]);

  // --- LỌC DỮ LIỆU PHIM THẬT ---
  // Lọc dữ liệu chính xác dựa trên thuộc tính phim từ dữ liệu thật của bạn
  const filteredMovies = dummyShowsData.filter(movie => {
    if (movieType === 'soon') {
      // Nếu phim có thuộc tính isComingSoon hoặc trạng thái sắp chiếu
      return movie.isComingSoon === true || movie.status?.toLowerCase() === 'coming soon';
    } else {
      // Ngược lại mặc định là phim đang chiếu
      return !movie.isComingSoon && movie.status?.toLowerCase() !== 'coming soon';
    }
  });

  // Khôi phục dự phòng: Nếu dữ liệu mẫu của bạn chưa phân loại cờ này, 
  // hệ thống tự động bóc tách mảng (phân nửa đầu và nửa sau) để giao diện không bị trống.
  const displayMovies = filteredMovies.length > 0
    ? filteredMovies
    : (movieType === 'now' ? dummyShowsData.slice(0, 6) : [...dummyShowsData].reverse().slice(0, 6));

  // --- TÍNH TOÁN CHỈ SỐ PHÂN TRANG ---
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = displayMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(displayMovies.length / moviesPerPage);

  // Hàm chuyển đổi trang tự động bảo vệ chỉ số biên
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt lên đầu trang khi qua trang mới
    }
  };

  // Hàm đổi link Youtube sang link nhúng iFrame dựa trên index gốc cố định
  const getEmbedUrl = (videoUrl, movie) => {
    const originalIndex = dummyShowsData.findIndex(m => m._id === movie._id);
    const finalUrl = videoUrl || dummyTrailers[originalIndex % dummyTrailers.length]?.videoUrl;
    if (!finalUrl) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = finalUrl.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : '';
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 md:px-16 max-w-7xl mx-auto flex flex-col gap-10 text-center">

      {/* THANH ĐIỀU HƯỚNG TAB TRÊN ĐẦU TRANG */}
      <div className="flex justify-center gap-6 border-b border-white/10 pb-4">
        <button
          onClick={() => {
            setMovieType('now');
            setCurrentPage(1); // Reset về trang 1 một cách chủ động
          }}
          className={`text-xl font-bold uppercase tracking-widest italic transition-all cursor-pointer ${movieType === 'now' ? 'text-(--btn-neon) border-b-2 border-(--btn-neon) pb-2 scale-105' : 'text-gray-500 hover:text-white'
            }`}
        >
          Phim Đang Chiếu
        </button>

        <button
          onClick={() => {
            setMovieType('soon');
            setCurrentPage(1); // Reset về trang 1 một cách chủ động
          }}
          className={`text-xl font-bold uppercase tracking-widest italic transition-all cursor-pointer ${movieType === 'soon' ? 'text-blue-400 border-b-2 border-blue-400 pb-2 scale-105' : 'text-gray-500 hover:text-white'
            }`}
        >
          Phim Sắp Chiếu
        </button>
      </div>

      {/* LƯỚI DANH SÁCH PHIM PHÂN TRANG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 min-h-[60vh]">
        {currentMovies.map((movie) => (
          <div key={movie._id} className="movie-card bg-transparent rounded-lg overflow-hidden border border-white/5 shadow-none transition-all duration-300 hover:-translate-y-2 flex flex-col">

            {/* Poster */}
            <Link to={`/movie/${movie._id}`} className="block relative aspect-2/3 overflow-hidden rounded-lg cursor-pointer">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1 rounded">2D</span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-1 rounded">T18</span>
              </div>
            </Link>

            {/* Thông tin phim */}
            <div className="p-4 bg-transparent min-h-35 flex flex-col justify-between flex-1 text-left">
              <Link to={`/movie/${movie._id}`}>
                <h3 className="text-white font-bold text-base leading-tight uppercase line-clamp-2 mb-4 hover:text-(--btn-neon) transition-colors text-glow cursor-pointer">
                  {movie.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between gap-2 mt-auto">
                <button
                  onClick={() => setTrailerUrl(getEmbedUrl(movie.videoUrl, movie))}
                  className="flex items-center gap-1.5 group/btn cursor-pointer"
                >
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/btn:scale-110">
                    <Play size={12} fill="#ef4444" className="text-red-500 ml-0.5" />
                  </div>
                  <span className="text-white text-xs font-semibold underline decoration-1 underline-offset-4 hover:text-(--btn-neon) transition-colors">
                    Xem Trailer
                  </span>
                </button>

                <Link to={`/movie/${movie._id}`}>
                  <button className="bg-[#fde047] hover:bg-[#facc15] text-slate-900 font-extrabold px-5 py-2.5 rounded-md transition-all active:scale-95 text-xs tracking-wider shadow-[0_0_15px_rgba(253,224,71,0.3)] cursor-pointer">
                    {movieType === 'now' ? 'ĐẶT VÉ' : 'CHI TIẾT'}
                  </button>
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* --- THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION BAR UI) --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 border-t border-white/5 pt-8">
          {/* Nút lùi trang */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${currentPage === 1
                ? 'border-white/5 text-gray-600 cursor-not-allowed'
                : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Vòng lặp danh sách số trang */}
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all cursor-pointer ${isCurrent
                    ? 'bg-[#fde047] border-[#fde047] text-slate-900 shadow-[0_0_15px_rgba(253,224,71,0.4)]'
                    : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Nút tiến trang */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${currentPage === totalPages
                ? 'border-white/5 text-gray-600 cursor-not-allowed'
                : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* --- POPUP MODAL TRAILER POPUP --- */}
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
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};

export default MoviesPage;