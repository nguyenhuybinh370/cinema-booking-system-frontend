

const Hero = () => {
  return (
    <section className="relative h-[85vh] flex items-center px-6 md:px-10 overflow-hidden">
      {/* Background with parallax effect or just good positioning */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=2070"
          className="w-full h-full object-cover scale-105"
          alt="Hero Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-3xl animate-in fade-in slide-in-from-left-10 duration-1000">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-[var(--btn-neon)] border border-white/10">
            Mới Ra Mắt
          </span>
          <span className="w-8 h-[1px] bg-white/20"></span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
          TRẢI NGHIỆM <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--btn-neon)] to-amber-300">
            ĐIỆN ẢNH
          </span> <br />
          ĐÍCH THỰC
        </h1>
        
        <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
          Hàng ngàn suất chiếu, hàng triệu khán giả. Đặt vé ngay hôm nay để nhận ưu đãi lên đến 50% cho thành viên mới.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button className="btn-bright px-10 py-4 text-base">Đặt Vé Ngay</button>
          <button className="glass-effect px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[var(--btn-neon)] group-hover:text-navy-deep transition-colors">
              ▶
            </span>
            Xem Trailer
          </button>
        </div>

        <div className="mt-16 flex items-center gap-8 text-sm font-medium text-slate-400">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">4K</span>
            <span>Chất lượng</span>
          </div>
          <div className="w-[1px] h-10 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">Dolby</span>
            <span>Âm thanh</span>
          </div>
          <div className="w-[1px] h-10 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">IMAX</span>
            <span>Màn hình</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
