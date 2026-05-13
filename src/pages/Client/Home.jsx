
import MainLayout from '../../layouts/MainLayout';
import Hero from '../../components/Home/Hero';
import MovieGrid from '../../components/Movie/MovieGrid';
import { MOVIES_MOCK } from '../../constants/movies';

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      
      <div className="max-w-7xl mx-auto">
        <MovieGrid 
          title="Phim Đang Chiếu" 
          movies={MOVIES_MOCK} 
        />

        {/* You could add more sections here easily */}
        <section className="px-6 md:px-10 py-16 bg-white/5 backdrop-blur-sm mx-6 md:mx-10 rounded-3xl border border-white/10 mb-16 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--btn-neon)] opacity-10 blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-glow opacity-10 blur-[100px]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trở thành thành viên <span className="text-[var(--btn-neon)]">CinemaPlus</span></h2>
              <p className="text-slate-400 leading-relaxed">
                Đăng ký ngay để nhận tích điểm đổi quà, ưu đãi giảm giá vé và tham gia các sự kiện ra mắt phim độc quyền.
              </p>
            </div>
            <button className="btn-bright px-10 py-4 shrink-0 shadow-xl shadow-yellow-500/20">
              Đăng ký ngay
            </button>
          </div>
        </section>

        <MovieGrid 
          title="Phim Sắp Chiếu" 
          movies={[...MOVIES_MOCK].reverse()} 
        />
      </div>
    </MainLayout>
  );
};

export default Home;
