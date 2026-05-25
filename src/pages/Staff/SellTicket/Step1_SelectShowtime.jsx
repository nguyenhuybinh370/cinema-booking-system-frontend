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
      <div className="flex items-center justify-center h-64 text-white/50 font-bold uppercase tracking-wider">
        Đang tải danh sách suất chiếu...
      </div>
    );
  }

  return (
    <div className="flex gap-8 h-full">
      {/* Cột trái: Danh sách phim */}
      <div className="flex-[2] glass-effect rounded-3xl p-6 overflow-y-auto max-h-[70vh]">
        <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest">
          Phim Đang Chiếu
        </h2>

        {movies.length === 0 ? (
          <div className="text-white/40 text-center py-12 italic">
            Không có suất chiếu nào khả dụng tại quầy hôm nay.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className={`movie-card cursor-pointer group ${selectedMovie?.id === movie.id ? "ring-2 ring-[var(--btn-neon)] shadow-[0_0_20px_rgba(253,224,71,0.2)]" : ""}`}
              >
                <div className="aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <div className="p-4 absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
                  <h3 className="font-bold text-lg leading-tight truncate">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 font-mono uppercase">
                    {movie.genre} • {movie.duration} phút
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cột phải: Khung chọn suất chiếu */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col overflow-y-auto max-h-[70vh]">
        <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest text-center">
          Suất Chiếu
        </h2>

        {!selectedMovie ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-center px-4 py-12">
            <div className="w-16 h-16 mb-4 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-2xl">
              🎥
            </div>
            <p>
              Vui lòng chọn một bộ phim bên trái để xem các suất chiếu khả dụng.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[var(--btn-neon)] mb-2 uppercase tracking-wide text-glow">
              {selectedMovie.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {showtimesMap[selectedMovie.id]?.map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleSelectTime(st)}
                  className="bg-white/5 border border-white/10 hover:border-[var(--btn-neon)] hover:bg-[var(--btn-neon)] hover:text-slate-900 transition-all duration-300 rounded-xl p-4 flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-xl font-black">{st.time}</span>
                  <span className="text-xs mt-1 text-white/50 group-hover:text-slate-700 font-medium">
                    {st.room}
                  </span>
                </button>
              ))}
              {(!showtimesMap[selectedMovie.id] || showtimesMap[selectedMovie.id].length === 0) && (
                <div className="col-span-2 text-white/30 text-center py-6 text-sm italic">
                  Không có suất chiếu nào.
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
