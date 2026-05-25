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
      {/* Cột trái: Danh sách phim */}
      <div className="flex-[2] glass-effect rounded-3xl p-6 overflow-y-auto max-h-[70vh] border border-white/5 shadow-2xl bg-[#131A2A]/40">
        <h2 className="text-xl font-extrabold text-glow mb-6 uppercase tracking-widest text-[var(--btn-neon)]">
          🎬 Phim Đang Chiếu
        </h2>

        {movies.length === 0 ? (
          <div className="text-white/40 text-center py-12 italic">
            Không có suất chiếu nào khả dụng tại quầy hôm nay.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => {
              const isSelected = selectedMovie?.id === movie.id;
              const isT18 = movie.genre.includes("18");
              const isT16 = movie.genre.includes("16");
              
              return (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className={`movie-card cursor-pointer group relative rounded-2xl overflow-hidden transition-all duration-300 border ${
                    isSelected 
                      ? "border-[var(--btn-neon)] shadow-[0_0_25px_rgba(255,176,0,0.25)] -translate-y-1 scale-[1.02]" 
                      : "border-white/5 hover:border-[var(--btn-neon)]/40"
                  }`}
                >
                  <div className="aspect-[2/3] overflow-hidden relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-75 group-hover:opacity-90"
                    />
                    
                    {/* Badge thể loại/tuổi ở góc trên */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-md tracking-wider uppercase border ${
                        isT18 
                          ? "bg-red-950/80 text-red-400 border-red-500/40" 
                          : isT16 
                            ? "bg-orange-950/80 text-orange-400 border-orange-500/40"
                            : "bg-slate-900/80 text-[var(--btn-neon)] border-[var(--btn-neon)]/40"
                      }`}>
                        {movie.genre}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 absolute bottom-0 w-full bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-14">
                    <h3 className="font-extrabold text-white text-base leading-tight truncate group-hover:text-[var(--btn-neon)] transition-colors duration-300">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-wider">
                      ⏱ {movie.duration} phút
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cột phải: Khung chọn suất chiếu */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col overflow-y-auto max-h-[70vh] border border-white/5 shadow-2xl bg-[#131A2A]/40 min-w-[280px]">
        <h2 className="text-xl font-extrabold text-glow mb-6 uppercase tracking-widest text-[var(--btn-neon)] text-center">
          🕒 Suất Chiếu
        </h2>

        {!selectedMovie ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-4 py-12">
            <div className="w-16 h-16 mb-4 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-3xl animate-bounce">
              🎥
            </div>
            <p className="text-sm font-medium">
              Vui lòng chọn một bộ phim bên trái để xem các suất chiếu khả dụng.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-800 pb-3 mb-2">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">Đang Chọn Phim</span>
              <h3 className="text-lg font-black text-white uppercase tracking-wide truncate">
                {selectedMovie.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {showtimesMap[selectedMovie.id]?.map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleSelectTime(st)}
                  className="bg-[#1B2435]/60 hover:bg-gradient-to-br hover:from-[var(--btn-neon)] hover:to-[#E59A00] border border-white/5 hover:border-transparent hover:text-slate-950 hover:shadow-[0_0_20px_rgba(255,176,0,0.3)] transition-all duration-300 rounded-xl p-4 flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-2xl font-black tracking-tight text-white group-hover:text-slate-950 font-mono transition-colors duration-300">{st.time}</span>
                  <span className="text-xs mt-1 text-slate-400 group-hover:text-slate-950 font-bold transition-colors duration-300">
                    🏢 {st.room}
                  </span>
                </button>
              ))}
              {(!showtimesMap[selectedMovie.id] || showtimesMap[selectedMovie.id].length === 0) && (
                <div className="col-span-2 text-slate-500 text-center py-6 text-sm italic">
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
