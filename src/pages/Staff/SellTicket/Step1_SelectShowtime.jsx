import { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";

const Step1_SelectShowtime = ({ onNext }) => {
  const [movies, setMovies] = useState([]);
  const [showtimesMap, setShowtimesMap] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        setIsLoading(true);
        // Fetch showtimes with a large limit to capture all active upcoming showtimes
        const res = await axiosClient.get("/staff/ban-ve/suat-chieu?limit=100");
        const list = res.showtimes || res.data || [];
        
        const movieMap = {};
        const stMap = {};
        
        list.forEach((sc) => {
          const m = sc.Phim;
          if (!movieMap[m.MaPhim]) {
            movieMap[m.MaPhim] = {
              id: m.MaPhim,
              title: m.TenPhim,
              duration: m.ThoiLuong,
              genre: m.GioiHanTuoi || "T16",
              poster: m.TenPhim.toLowerCase().includes("dune")
                ? "https://th.bing.com/th/id/OIP.5UgQQ8aaesrvoPpIVoUc8wHaJQ?w=147&h=184&c=7&r=0&o=7&dpr=2.5&pid=1.7&rm=3"
                : m.TenPhim.toLowerCase().includes("panda")
                ? "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                : m.TenPhim.toLowerCase().includes("godzilla")
                ? "https://th.bing.com/th/id/OIP.0swsksupM_GO9tFywO70PQHaLH?w=121&h=182&c=7&r=0&o=7&dpr=2.5&pid=1.7&rm=3"
                : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80",
            };
          }
          
          if (!stMap[m.MaPhim]) {
            stMap[m.MaPhim] = [];
          }
          
          // Format GioChieu
          const gioChieuDate = new Date(sc.GioChieu);
          const timeString = `${gioChieuDate.getHours().toString().padStart(2, "0")}:${gioChieuDate.getMinutes().toString().padStart(2, "0")}`;
          
          stMap[m.MaPhim].push({
            id: sc.MaSuatChieu,
            time: timeString,
            room: sc.PhongChieu.TenPhong,
            basePrice: sc.GiaVeGoc,
            roomSurcharge: sc.LoaiPhong.PhuThu,
            daySurcharge: sc.LoaiNgay.PhuThu,
          });
        });

        // Sort showtimes by time ascending
        Object.keys(stMap).forEach((movieId) => {
          stMap[movieId].sort((a, b) => a.time.localeCompare(b.time));
        });

        setMovies(Object.values(movieMap));
        setShowtimesMap(stMap);
      } catch (err) {
        console.error("Error fetching POS showtimes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadShowtimes();
  }, []);

  const handleSelectTime = (showtime) => {
    onNext({ movie: selectedMovie, showtime: showtime });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-bold uppercase tracking-wider">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--btn-neon)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-glow text-[var(--btn-neon)] text-sm">Đang tải danh sách suất chiếu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
      {/* Left column: Movie grid */}
      <div className="flex-[2] bg-[#131A2A]/50 rounded-2xl p-6 overflow-y-auto max-h-[70vh] border border-white/[0.06]">
        <h2 className="text-lg font-black mb-5 uppercase tracking-widest text-[var(--btn-neon)]">
          Phim Đang Chiếu
        </h2>

        {movies.length === 0 ? (
          <div className="text-white/30 text-center py-12 italic text-sm">
            Không có suất chiếu nào khả dụng tại quầy hôm nay.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {movies.map((movie) => {
              const isSelected = selectedMovie?.id === movie.id;
              const isT18 = movie.genre.includes("18");
              const isT16 = movie.genre.includes("16");
              
              return (
                <div
                  key={movie.id}
                  className={`group relative rounded-xl overflow-hidden transition-all duration-300 border flex flex-col bg-[#1B2435] ${
                    isSelected 
                      ? "border-[var(--btn-neon)] shadow-[0_0_20px_rgba(255,176,0,0.2)] scale-[1.02]" 
                      : "border-white/[0.06] hover:border-white/15"
                  }`}
                >
                  {/* Poster */}
                  <div className="aspect-[2/3] overflow-hidden relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Age badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded tracking-wide uppercase ${
                        isT18 
                          ? "bg-red-600 text-white" 
                          : isT16 
                            ? "bg-orange-500 text-white"
                            : "bg-emerald-600 text-white"
                      }`}>
                        {movie.genre}
                      </span>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-3 flex flex-col gap-2">
                    <h3 className="font-bold text-sm text-white leading-tight truncate">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-mono">⏱ {movie.duration} phút</span>
                    </div>
                    <button
                      onClick={() => setSelectedMovie(movie)}
                      className={`w-full py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[var(--btn-neon)] text-slate-900"
                          : "bg-[var(--btn-neon)]/15 text-[var(--btn-neon)] border border-[var(--btn-neon)]/30 hover:bg-[var(--btn-neon)] hover:text-slate-900"
                      }`}
                    >
                      Chọn phim
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right column: Showtime panel */}
      <div className="flex-1 bg-[#131A2A]/50 rounded-2xl p-6 flex flex-col overflow-y-auto max-h-[70vh] border border-white/[0.06] min-w-[280px]">
        {!selectedMovie ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-4 py-12">
            <div className="w-16 h-16 mb-4 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-3xl animate-bounce">
              🎥
            </div>
            <p className="text-sm font-medium text-white/30">
              Vui lòng chọn một bộ phim bên trái để xem các suất chiếu khả dụng.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Movie info header */}
            <div className="border-b border-white/[0.06] pb-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wide leading-tight">
                {selectedMovie.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedMovie.genre} • {selectedMovie.duration} phút
              </p>
            </div>

            {/* Showtimes heading */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Đặt vào {new Date().toLocaleDateString("vi-VN")}
              </span>
            </div>

            {/* Showtime buttons */}
            <div className="flex flex-col gap-3">
              {showtimesMap[selectedMovie.id]?.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between bg-[#1B2435]/60 border border-white/[0.06] rounded-xl p-4 hover:border-[var(--btn-neon)]/40 transition-all group"
                >
                  <div>
                    <span className="text-lg font-black text-white font-mono">{st.time}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {st.room}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectTime(st)}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[var(--btn-neon)]/40 text-[var(--btn-neon)] hover:bg-[var(--btn-neon)] hover:text-slate-900 transition-all cursor-pointer"
                  >
                    Chọn suất
                  </button>
                </div>
              ))}
              {(!showtimesMap[selectedMovie.id] || showtimesMap[selectedMovie.id].length === 0) && (
                <div className="text-slate-500 text-center py-6 text-sm italic">
                  Không có suất chiếu nào khả dụng.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1_SelectShowtime;
