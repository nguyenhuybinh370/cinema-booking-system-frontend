import { useEffect, useRef, useState } from 'react';
import { Film, LogOut, Menu, Search, Ticket, User, X } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import useMovieSearch from '../hooks/customer/useMovieSearch';
import { getMovieVisuals } from '../utils/visualHelper';

const navItems = [
  { to: '/movies/now-showing', label: 'Đang chiếu' },
  { to: '/movies/coming-soon', label: 'Sắp chiếu' },
];

const clearSession = () => {
  ['accessToken', 'refreshToken', 'userRole', 'userName', 'userCode', 'userInfo']
    .forEach((key) => localStorage.removeItem(key));
};

const Brand = () => (
  <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="NexCinema - Trang chủ">
    <span className="grid size-10 place-items-center rounded-xl bg-(--client-primary) text-white shadow-lg shadow-red-950/30">
      <Film size={22} />
    </span>
    <span className="text-xl font-extrabold tracking-tight text-white">
      NEX<span className="text-(--client-primary)">CINEMA</span>
    </span>
  </Link>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { results, isSearching } = useMovieSearch(query);
  const isLoggedIn = Boolean(localStorage.getItem('accessToken') && localStorage.getItem('userRole') === 'CUSTOMER');
  const userName = localStorage.getItem('userName') || 'Tài khoản';

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading('Đang đăng xuất...');
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await axiosClient.post('/auth/logout', { refreshToken });
    } catch {
      // Luôn kết thúc phiên phía client nếu phiên server đã hết hạn.
    } finally {
      clearSession();
      toast.success('Đã đăng xuất', { id: toastId });
      navigate('/login');
    }
  };

  const goToShowtimes = () => {
    if (location.pathname !== '/') {
      navigate('/#lich-chieu-section');
      return;
    }
    document.getElementById('lich-chieu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectMovie = (movieId) => {
    setQuery('');
    setIsSearchOpen(false);
    navigate(`/movie/${movieId}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-(--client-bg)/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `client-nav-link ${isActive ? 'is-active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
          <button type="button" onClick={goToShowtimes} className="client-nav-link">Lịch chiếu</button>
        </nav>

        <div ref={searchRef} className="relative ml-auto hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setIsSearchOpen(true)} placeholder="Tìm phim..." aria-label="Tìm kiếm phim" className="client-search" />
          {isSearchOpen && query.trim().length >= 2 && (
            <div className="client-search-results">
              {isSearching && <p className="p-4 text-sm text-slate-400">Đang tìm phim...</p>}
              {!isSearching && results.length === 0 && <p className="p-4 text-sm text-slate-400">Không tìm thấy phim phù hợp.</p>}
              {!isSearching && results.map((movie) => {
                const visuals = getMovieVisuals(movie);
                return (
                  <button key={movie.MaPhim} type="button" onClick={() => selectMovie(movie.MaPhim)} className="client-search-result">
                    <img src={movie.HinhAnh || visuals.thumbnail} alt="" className="h-14 w-10 rounded-md object-cover" />
                    <span className="min-w-0 text-left">
                      <strong className="block truncate text-sm text-white">{movie.TenPhim}</strong>
                      <span className="block truncate text-xs text-slate-400">{movie.TheLoai || 'Điện ảnh'}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <div className="hidden items-center gap-2 sm:flex">
            <Link to="/profile" className="client-icon-button max-w-36 px-3" title="Vé và tài khoản"><User size={17} /><span className="truncate text-xs font-semibold">{userName}</span></Link>
            <button type="button" onClick={handleLogout} className="client-icon-button" title="Đăng xuất"><LogOut size={18} /></button>
          </div>
        ) : (
          <Link to="/login" className="client-primary-button hidden sm:inline-flex">Đăng nhập</Link>
        )}

        <button type="button" onClick={() => setIsMenuOpen((open) => !open)} className="client-icon-button lg:hidden" aria-label="Mở menu">
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/8 bg-(--client-surface) px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setIsMenuOpen(false)} className="client-nav-link">{item.label}</NavLink>)}
            <button type="button" onClick={goToShowtimes} className="client-nav-link text-left">Lịch chiếu</button>
            <Link to={isLoggedIn ? '/profile' : '/login'} onClick={() => setIsMenuOpen(false)} className="client-nav-link flex items-center gap-2"><Ticket size={17} />{isLoggedIn ? 'Vé của tôi' : 'Đăng nhập'}</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
