import { useState, useRef } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import UITLogo from '../assets/LogoUIT2.jpg';
import axiosClient from '../api/axiosClient';
import { getMovies } from '../api/movieApi';
import { getMovieVisuals } from '../utils/visualHelper';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- STATE QUẢN LÝ TÌM KIẾM ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");
  const isLoggedIn = token && role === "CUSTOMER";

  const handleLogout = async () => {
    toast.loading("Đang đăng xuất...");
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosClient.post("/auth/logout", { refreshToken });
      }
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCode");
      localStorage.removeItem("userInfo");
      
      toast.dismiss();
      toast.success("Đã đăng xuất tài khoản!");
      navigate("/login");
    }
  };

  // Debounce timer ref
  const searchTimerRef = useRef(null);

  // Hàm xử lý tìm kiếm phim từ backend
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await getMovies({ keyword: query.trim(), limit: 6 });
        const movies = res?.data || res || [];
        setSearchResults(Array.isArray(movies) ? movies : []);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      }
    }, 300);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 pointer-events-none">
      <div className="w-full flex items-center justify-between pointer-events-auto">

        {/* LOGO - Bên trái */}
        <Link to="/" className="block">
          <div className="flex items-center gap-2 cursor-pointer group">
            {/* <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] group-hover:scale-110 transition-transform">
              U
            </div>
            <span className="text-2xl font-extrabold tracking-tighter text-white">
              IT<span className="text-glow"> Cinema</span>
            </span> */}
            <img src={UITLogo} alt="UIT Logo" className="w-30 h-30 object-contain" />
          </div>
          
        </Link>

        {/* MENU TRUNG TÂM - Capsule Style */}
        <div className="hidden md:flex items-center glass-effect px-8 py-2.5 rounded-full border border-white/10 shadow-xl">
          <ul className="flex gap-8 text-sm font-medium uppercase tracking-widest text-gray-300">
            <Link to="/"><li className="hover:text-white transition-colors cursor-pointer">Trang chủ</li></Link>
            <Link to="/movies/now-showing"><li className="hover:text-white transition-colors cursor-pointer">Phim</li></Link>
            <Link to="/movies/coming-soon"><li className="hover:text-white transition-colors cursor-pointer">Sắp ra mắt</li></Link>
          </ul>
        </div>

        {/* ACTIONS - Bên phải (Search + Login) */}
        <div className="flex items-center gap-4">

          {/* Search Bar - Desktop */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all w-48 focus:w-64 text-sm text-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            {/* --- DROPDOWN HIỂN THỊ KẾT QUẢ TÌM KIẾM --- */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-80 overflow-y-auto flex flex-col text-left">
                {searchResults.map((movie) => {
                  const visuals = getMovieVisuals(movie);
                  return (
                    <Link 
                      key={movie.MaPhim} 
                      to={`/movie/${movie.MaPhim}`}
                      onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                      className="flex items-center gap-3 p-3 hover:bg-white/10 border-b border-white/5 transition-colors group/item"
                    >
                      <img 
                        src={movie.HinhAnh || visuals.thumbnail} 
                        alt={movie.TenPhim} 
                        className="w-10 h-14 object-cover rounded-md shrink-0 border border-white/10"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = visuals.thumbnail;
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-white font-semibold text-sm truncate group-hover/item:text-(--btn-neon) transition-colors">
                          {movie.TenPhim}
                        </span>
                        <span className="text-gray-400 text-xs mt-0.5">
                          {movie.ThoiLuong} phút • {movie.TheLoai}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {/* Trường hợp gõ chữ nhưng không tìm thấy phim */}
            {searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-sm text-gray-400 text-left z-50 shadow-2xl">
                Không tìm thấy phim phù hợp...
              </div>
            )}
          </div>

          {/* Search Icon (Mobile/Tablet) */}
          <button className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <Search className="w-5 h-5" />
          </button>

          {/* Login / Profile & Logout Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap">
                  {userName || "Cá nhân"}
                </button>
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="btn-bright whitespace-nowrap">
                Đăng Nhập
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Dành cho điện thoại) */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 glass-effect rounded-2xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          <ul className="flex flex-col gap-4 text-center font-medium uppercase tracking-widest">
            <Link to="/" onClick={() => setIsMenuOpen(false)}><li className="py-2 border-b border-white/5 text-gray-300">Home</li></Link>
            <Link to="/movies/now-showing" onClick={() => setIsMenuOpen(false)}><li className="py-2 border-b border-white/5 text-gray-300">Movies</li></Link>
            <li className="py-2 border-b border-white/5 text-gray-300">Theatres</li>
            <Link to="/movies/coming-soon" onClick={() => setIsMenuOpen(false)}><li className={`py-2 text-gray-300 ${isLoggedIn ? 'border-b border-white/5' : ''}`}>Releases</li></Link>
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}><li className="py-2 border-b border-white/5 text-yellow-400">Trang cá nhân</li></Link>
                <li onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="py-2 text-rose-500 cursor-pointer">Đăng xuất</li>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}><li className="py-2 text-gray-300">Đăng nhập</li></Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;