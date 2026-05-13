import { useState } from "react";

// Dữ liệu giả lập (Mock Data) chờ đấu nối API
const MOCK_MOVIES = [
  {
    id: "M1",
    title: "DUNE: PART TWO",
    genre: "Sci-Fi, Action",
    duration: 166,
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjcJsV.jpg",
  },
  {
    id: "M2",
    title: "KUNG FU PANDA 4",
    genre: "Animation, Comedy",
    duration: 94,
    poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
  },
  {
    id: "M3",
    title: "GODZILLA X KONG",
    genre: "Action, Sci-Fi",
    duration: 115,
    poster: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLvLuPEtHZpALq1.jpg",
  },
];

// Thêm thông tin Giá vé, Phụ thu Phòng, Phụ thu Ngày vào Suất chiếu
const MOCK_SHOWTIMES = {
  M1: [
    {
      id: "S1",
      time: "09:00",
      room: "Phòng 1 (Standard)",
      basePrice: 60000,
      roomSurcharge: 0,
      daySurcharge: 10000,
    },
    {
      id: "S2",
      time: "13:30",
      room: "Phòng IMAX",
      basePrice: 60000,
      roomSurcharge: 30000,
      daySurcharge: 10000,
    },
  ],
  M2: [
    {
      id: "S4",
      time: "10:00",
      room: "Phòng 3 (Standard)",
      basePrice: 50000,
      roomSurcharge: 0,
      daySurcharge: 0,
    },
  ],
  M3: [
    {
      id: "S6",
      time: "20:30",
      room: "Phòng IMAX",
      basePrice: 70000,
      roomSurcharge: 30000,
      daySurcharge: 15000,
    },
  ],
};

const Step1_SelectShowtime = ({ onNext }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSelectTime = (showtime) => {
    // Đẩy dữ liệu lên Component cha (SellTicketWizard) và chuyển bước
    onNext({ movie: selectedMovie, showtime: showtime });
  };

  return (
    <div className="flex gap-8 h-full">
      {/* Cột trái: Danh sách phim */}
      <div className="flex-[2] glass-effect rounded-3xl p-6">
        <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest">
          Phim Đang Chiếu
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {MOCK_MOVIES.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className={`movie-card cursor-pointer group ${selectedMovie?.id === movie.id ? "ring-2 ring-[var(--btn-neon)] shadow-[0_0_20px_rgba(253,224,71,0.2)]" : ""}`}
            >
              {/* Ảnh Poster với tỷ lệ 2:3 */}
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
                <p className="text-xs text-white/60 mt-1">
                  {movie.genre} • {movie.duration} phút
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Khung chọn suất chiếu */}
      <div className="flex-1 glass-effect rounded-3xl p-6 flex flex-col">
        <h2 className="text-xl font-bold text-glow mb-6 uppercase tracking-widest text-center">
          Suất Chiếu
        </h2>

        {!selectedMovie ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-center px-4">
            <div className="w-16 h-16 mb-4 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
              🎥
            </div>
            <p>
              Vui lòng chọn một bộ phim bên trái để xem các suất chiếu khả dụng.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[var(--btn-neon)] mb-2">
              {selectedMovie.title}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {MOCK_SHOWTIMES[selectedMovie.id]?.map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleSelectTime(st)}
                  className="bg-white/5 border border-white/10 hover:border-[var(--btn-neon)] hover:bg-[var(--btn-neon)] hover:text-slate-900 transition-all duration-300 rounded-xl p-4 flex flex-col items-center group"
                >
                  <span className="text-xl font-black">{st.time}</span>
                  <span className="text-xs mt-1 text-white/50 group-hover:text-slate-700">
                    {st.room}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1_SelectShowtime;
