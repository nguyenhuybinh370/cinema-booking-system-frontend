import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-10 py-4 ${
        isScrolled ? 'bg-navy-deep/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--btn-neon)] rounded-xl flex items-center justify-center rotate-12 shadow-lg shadow-yellow-500/20">
            <span className="text-navy-deep font-black text-2xl -rotate-12">C</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            Cinema<span className="text-[var(--btn-neon)]">Plus</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
          <Link to="/" className="text-[var(--btn-neon)]">Lịch chiếu</Link>
          <Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Phim</Link>
          <Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Rạp</Link>
          <Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Ưu đãi</Link>
          <Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Tin tức</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="hidden sm:block px-6 py-2 border-2 border-white/20 hover:border-[var(--btn-neon)] rounded-full text-sm font-bold transition-all hover:text-[var(--btn-neon)]">
            Đăng nhập
          </button>
          <button className="md:hidden p-2 hover:bg-white/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
