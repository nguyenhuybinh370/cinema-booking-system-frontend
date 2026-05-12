

const Home = () => {
  const movies = [
    { id: 1, title: "Lật Mặt 7: Một Điều Ước", image: "https://image.api.playready.com.vn/api/v2/image/6628b031b268010026e6d338", rating: 9.8, tags: "2D | T16" },
    { id: 2, title: "Hành Tinh Khỉ: Vương Quốc Mới", image: "https://image.api.playready.com.vn/api/v2/image/66399f668673a500264024c0", rating: 8.5, tags: "IMAX | P" },
    { id: 3, title: "Dune: Hành Tinh Cát 2", image: "https://image.api.playready.com.vn/api/v2/image/65cae9a0397500002636735e", rating: 9.2, tags: "3D | T13" },
    { id: 4, title: "Kung Fu Panda 4", image: "https://image.api.playready.com.vn/api/v2/image/65e96a40879612002660d5b5", rating: 8.9, tags: "2D | P" },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section - Banner hoành tráng */}
      <section className="relative h-[70vh] flex items-center px-10">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=2070"
            className="w-full h-full object-cover opacity-40"
            alt="Hero Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-6xl font-bold mb-4 leading-tight">
            Trải Nghiệm <span className="text-gradient">Điện Ảnh</span> <br /> Đích Thực
          </h1>
          <p className="text-[var(--text-muted)] text-lg mb-8">
            Hàng ngàn suất chiếu, hàng triệu khán giả. Đặt vé ngay hôm nay để nhận ưu đãi lên đến 50%.
          </p>
          <div className="flex gap-4">
            {/* Thay btn-primary bằng btn-bright mới */}
            <button className="btn-bright">Đặt Vé Ngay</button>
            <button className="glass-effect px-6 py-2.5 rounded-lg font-semibold transition-all">
              Xem Trailer
            </button>
          </div>
        </div>
      </section>

      {/* 2. Movie Grid - Danh sách phim */}
      <section className="px-10 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold border-l-4 border-[var(--primary)] pl-4">Phim Đang Chiếu</h2>
          <button className="text-[var(--primary)] hover:underline">Xem tất cả</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card group">
              {/* ... hình ảnh và tag ... */}
              <div className="relative aspect-[2/3]">
                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                  <span className="text-[var(--accent)] font-bold text-sm">⭐ {movie.rating}</span>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  {/* Thay btn-primary bằng btn-bright mới */}
                  <button className="btn-bright scale-90 group-hover:scale-100 transition-transform">Mua Vé</button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                  <span>{movie.tags}</span>
                  <span className="text-xs uppercase px-2 py-1 border border-slate-700 rounded">Vietsub</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;