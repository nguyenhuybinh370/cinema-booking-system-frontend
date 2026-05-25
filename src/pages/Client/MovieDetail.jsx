import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { MOVIES_MOCK } from '../../constants/movies';

const MovieDetail = () => {
  const { id } = useParams();
  const movie = MOVIES_MOCK.find(m => m.MaPhim === id) || MOVIES_MOCK[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="relative pt-20">
        {/* Backdrop Hero */}
        <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden">
          <img 
            src={movie.HinhAnh} 
            alt={movie.TenPhim} 
            className="w-full h-full object-cover blur-2xl opacity-20 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 py-12">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Poster */}
            <div className="w-full md:w-1/3 shrink-0">
              <div className="movie-card aspect-[2/3] sticky top-32">
                <img src={movie.HinhAnh} alt={movie.TenPhim} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                   <span className="text-[var(--btn-neon)] font-bold">⭐ {movie.Rating}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-[var(--btn-neon)] text-navy-deep font-bold text-xs rounded-full uppercase tracking-widest">
                  Đang Chiếu
                </span>
                <span className="text-slate-400 font-bold">•</span>
                <span className="text-slate-300 font-medium">{movie.Tags}</span>
                <span className="text-slate-400 font-bold">•</span>
                <span className="text-slate-300 font-medium">{movie.ThoiLuong} phút</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase">
                {movie.TenPhim}
              </h1>

              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Khởi chiếu</span>
                  <span className="text-white font-bold">{movie.NgayKhoiChieu}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Ngôn ngữ</span>
                  <span className="text-white font-bold">Phụ đề tiếng Việt</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Thể loại</span>
                  <span className="text-white font-bold">{movie.TheLoai}</span>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-bold mb-4 border-l-4 border-[var(--btn-neon)] pl-4">Nội Dung Phim</h3>
                <p className="text-slate-300 leading-relaxed text-lg italic">
                   "{movie.NoiDung}"
                </p>

                <p className="mt-4 text-slate-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              <div className="flex flex-wrap gap-6">
                <Link to="/booking/ST01" className="btn-bright px-12 py-5 text-base flex items-center gap-3">
                   Đặt Vé Ngay
                   <span className="animate-pulse">🎟️</span>
                </Link>

                <button className="glass-effect px-10 py-5 rounded-full font-bold flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">▶</span>
                  Xem Trailer
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Placeholder */}
          <div className="mt-24">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold">Lịch Chiếu</h2>
                <div className="flex gap-2">
                   {[...Array(7)].map((_, i) => (
                      <button key={i} className={`px-6 py-3 rounded-2xl border ${i === 0 ? 'bg-[var(--btn-neon)] text-navy-deep border-[var(--btn-neon)]' : 'border-white/10 hover:border-white/30'} transition-all font-bold text-center flex flex-col min-w-[100px]`}>
                         <span className="text-xs opacity-60 uppercase">{i === 0 ? 'Hôm nay' : 'Tháng 5'}</span>
                         <span className="text-xl">{13 + i}</span>
                      </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 gap-8">
                {['CGV Vincom Center', 'BHD Star Cineplex', 'Lotte Cinema'].map((cinema, idx) => (
                   <div key={idx} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-all">
                      <div className="flex justify-between items-center mb-6">
                         <h4 className="text-xl font-bold">{cinema}</h4>
                         <span className="text-slate-500 text-sm italic">Cách bạn 2.5km</span>
                      </div>
                      <div className="flex flex-wrap gap-4">
                         {['10:00', '13:30', '16:00', '19:15', '21:30', '23:45'].map(time => (
                            <Link 
                              key={time} 
                              to="/booking/ST01"
                              className="px-6 py-3 bg-navy-deep/50 border border-white/10 rounded-xl hover:border-[var(--btn-neon)] hover:text-[var(--btn-neon)] transition-all font-mono font-bold"
                            >
                               {time}
                            </Link>
                         ))}
                      </div>

                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MovieDetail;
