import { useState, useEffect } from 'react';
import { Play, Calendar, Clock, Ticket, ChevronLeft, ChevronRight, X } from 'lucide-react';
// Import thêm dummyTrailers từ assets.js
import { assets, dummyShowsData, dummyTrailers } from '../../assets/assets';
import oke from '../../assets/backgroundImage.png';
import { Link } from 'react-router-dom';

const Home = () => {
  const marvelMovie = {
    title: "Guardians of the Galaxy",
    backdrop: oke,
    releaseDate: "2018",
    runtime: "2h 11m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    overview: "A post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.",
    marvelLogo: assets.marvelLogo,
    // Thêm link trailer thật cho phim Hero nếu muốn, hoặc để trống để dùng xoay tua
    videoUrl: 'https://www.youtube.com/watch?v=2LIQ2-PZBC8'
  };

  // --- STATE QUẢN LÝ POPUP TRAILER ---
  const [trailerUrl, setTrailerUrl] = useState(null); // Link video đang phát, null là đóng

  // --- LOGIC CAROUSEL MƯỢT MÀ ---
  const [nowIndex, setNowIndex] = useState(0);
  const [soonIndex, setSoonIndex] = useState(0);
  const totalMovies = dummyShowsData.length;
  const visibleCards = 4; // Số lượng phim hiện trên 1 màn hình
  const maxIndex = totalMovies - visibleCards;

  const handleNext = (currentIndex, setIndex) => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = (currentIndex, setIndex) => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // --- HÀM XỬ LÝ LINK YOUTUBE THÀNH LINK NHÚNG (EMBED) ---
  const getEmbedUrl = (videoUrl, index) => {
    // Nếu phim không có link riêng, lấy xoay tua từ dummyTrailers
    const finalUrl = videoUrl || dummyTrailers[index % dummyTrailers.length]?.videoUrl;
    if (!finalUrl) return '';

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = finalUrl.match(regExp);
    // Trả về link nhúng kèm autoplay=1
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : '';
  };

  // --- EFFECT: KHÓA CUỘN TRANG KHI ĐANG XEM TRAILER ---
  useEffect(() => {
    if (trailerUrl) {
      document.body.style.overflow = 'hidden'; // Khóa cuộn
    } else {
      document.body.style.overflow = 'unset'; // Mở lại cuộn
    }
    // Cleanup function: Đảm bảo mở lại cuộn khi component bị unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [trailerUrl]);


  // --- RENDER MOVIE CARD ---
  const MovieCard = ({ movie, type }) => {
    // TÌM INDEX GỐC: Đảm bảo bộ phim luôn đi kèm với đúng trailer của nó, không bị lệch khi đảo mảng
    const originalIndex = dummyShowsData.findIndex(m => m._id === movie._id);

    return (
      <div className="shrink-0 w-full sm:w-1/2 lg:w-1/4 px-3 group">
        <div className="movie-card bg-transparent rounded-lg overflow-hidden border border-white/5 shadow-none transition-all duration-300 hover:-translate-y-2">

          {/* Poster */}
          <Link to={`/movie/${movie._id}`} className="block relative aspect-2/3 overflow-hidden rounded-lg cursor-pointer">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1 rounded">2D</span>
              <span className="bg-red-600 text-white text-[10px] font-bold px-1 rounded">T18</span>
            </div>
          </Link>

          <div className="p-4 bg-transparent min-h-37.5 flex flex-col justify-between">
            {/* Tên phim */}
            <Link to={`/movie/${movie._id}`}>
              <h3 className="text-white font-bold text-lg leading-tight uppercase line-clamp-2 mb-4 group-hover:text-(--btn-neon) transition-colors text-glow cursor-pointer">
                {movie.title}
              </h3>
            </Link>

            <div className="flex items-center justify-between gap-2">
              {/* Nút Xem Trailer - Truyền originalIndex vào đây */}
              <button
                onClick={() => setTrailerUrl(getEmbedUrl(movie.videoUrl, originalIndex))}
                className="flex items-center gap-2 group/btn cursor-pointer"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/btn:scale-110">
                  <Play size={14} fill="#ef4444" className="text-red-500 ml-0.5" />
                </div>
                <span className="text-white text-sm font-medium underline decoration-1 underline-offset-4 hover:text-(--btn-neon) transition-colors whitespace-nowrap">
                  Xem Trailer
                </span>
              </button>

              {/* Nút Đặt Vé */}
              <Link to={`/movie/${movie._id}`}>
                <button className="bg-[#fde047] hover:bg-[#facc15] text-slate-900 font-extrabold px-6 py-3 rounded-md transition-all active:scale-95 text-base shadow-[0_0_15px_rgba(253,224,71,0.4)] cursor-pointer whitespace-nowrap">
                  {type === 'now' ? 'ĐẶT VÉ' : 'TÌM HIỂU'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[95vh] flex items-center px-6 md:px-20 overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={marvelMovie.backdrop}
            alt={marvelMovie.title}
            className="w-full h-full object-cover object-top opacity-70"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mt-24">
          {marvelMovie.marvelLogo && <img src={marvelMovie.marvelLogo} alt="Marvel Logo" className="h-8 mb-6" />}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-glow italic">{marvelMovie.title}</h1>
          <div className="flex items-center gap-4 text-sm font-semibold mb-6 text-gray-300">
            {marvelMovie.genres.map(genre => <span key={genre}>{genre} | </span>)}
            <span className="flex items-center gap-1"><Calendar size={16} /> {marvelMovie.releaseDate}</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {marvelMovie.runtime}</span>
          </div>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed line-clamp-3">{marvelMovie.overview}</p>
          <div className="flex gap-4">
            <button className="btn-bright flex items-center gap-2 cursor-pointer"><Ticket size={20} /> Đặt Vé Ngay</button>

            {/* SỬA: Nút Xem Trailer Hero - Gắn onClick bật Popup */}
            <button
              onClick={() => setTrailerUrl(getEmbedUrl(marvelMovie.videoUrl, 0))}
              className="glass-effect px-7 py-3 rounded-full font-bold flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <Play size={20} fill="white" /> Xem Trailer
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION PHIM ĐANG CHIẾU --- */}
      <section className="py-16 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-2xl font-bold uppercase mb-8 italic tracking-wider">Phim Đang Chiếu</h2>
          <div className="relative group/carousel">
            <button onClick={() => handlePrev(nowIndex, setNowIndex)} className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 bg-black/50 p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer">
              <ChevronLeft size={30} />
            </button>
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${nowIndex * (100 / visibleCards)}%)` }}>
                {/* Bỏ thuộc tính index={index} */}
                {dummyShowsData.map((movie) => <MovieCard key={movie._id} movie={movie} type="now" />)}
              </div>
            </div>
            <button onClick={() => handleNext(nowIndex, setNowIndex)} className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 bg-black/50 p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer">
              <ChevronRight size={30} />
            </button>
          </div>
          <div className="mt-12 text-center">
            <Link to="/movies/now-showing">
              <button className="px-10 py-2 border border-blue-400 text-blue-400 font-bold rounded hover:bg-blue-400 hover:text-white transition-all uppercase tracking-widest text-sm shadow-xl active:scale-95 cursor-pointer">
                Xem Thêm
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION PHIM SẮP CHIẾU (Độc lập) --- */}
      <section className="py-16 px-6 md:px-16 overflow-hidden bg-white/2">
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-2xl font-bold uppercase mb-8 italic tracking-wider text-blue-400">Phim Sắp Chiếu</h2>
          <div className="relative group/carousel">
            <button onClick={() => handlePrev(soonIndex, setSoonIndex)} className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 bg-black/50 p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer">
              <ChevronLeft size={30} />
            </button>
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${soonIndex * (100 / visibleCards)}%)` }}>
                {/* Bỏ thuộc tính index={index} */}
                {[...dummyShowsData].reverse().map((movie) => <MovieCard key={movie._id} movie={movie} type="soon" />)}
              </div>
            </div>
            <button onClick={() => handleNext(soonIndex, setSoonIndex)} className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 bg-black/50 p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer">
              <ChevronRight size={30} />
            </button>
          </div>
          <div className="mt-12 text-center">
            <Link to="/movies/coming-soon">
              <button className="px-10 py-2 border border-blue-400 text-blue-400 font-bold rounded hover:bg-blue-400 hover:text-white transition-all uppercase tracking-widest text-sm shadow-xl active:scale-95 cursor-pointer">
                Xem Thêm
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* --- ADD: POPUP MODAL PHÁT VIDEO TRAILER (YOUTUBE) --- */}
      {/* Chỉ hiển thị khi trailerUrl có giá trị (khác null) */}
      {trailerUrl && (
        <div className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(253,224,71,0.2)] border border-white/10">

            {/* Nút Đóng Modal (X icon) */}
            <button
              onClick={() => setTrailerUrl(null)} // Click để đóng Popup
              className="absolute top-4 right-4 z-50 p-2.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer group"
            >
              <X size={22} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Iframe trình phát video nhúng Youtube (Autoplay) */}
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
      {/* ============================================================ */}

    </div>
  );
};

export default Home;