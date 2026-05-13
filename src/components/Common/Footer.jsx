
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-navy-deep border-t border-white/5 pt-20 pb-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[var(--btn-neon)] rounded-lg flex items-center justify-center rotate-12">
                <span className="text-navy-deep font-black text-xl -rotate-12">C</span>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                Cinema<span className="text-[var(--btn-neon)]">Plus</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang đến trải nghiệm giải trí đẳng cấp quốc tế.
            </p>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'youtube', 'twitter'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--btn-neon)] hover:text-navy-deep transition-all">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current opacity-20"></div> {/* Placeholder icon */}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Khám phá</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Phim đang chiếu</Link></li>
              <li><Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Phim sắp chiếu</Link></li>
              <li><Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Rạp toàn quốc</Link></li>
              <li><Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Thành viên</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link to="/" className="hover:text-[var(--btn-neon)] transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Đăng ký nhận tin</h4>
            <p className="text-slate-400 text-sm mb-4">Nhận thông báo về phim mới và khuyến mãi hấp dẫn.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-[var(--btn-neon)] transition-colors"
              />
              <button className="absolute right-2 top-2 bg-[var(--btn-neon)] text-navy-deep px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Gửi
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© 2024 CinemaPlus. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Powered by Antigravity</span>
            <span>Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
