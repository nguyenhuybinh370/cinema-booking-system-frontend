import { assets } from "../assets/assets";
import UITLogo from '../assets/LogoUIT2.jpg'
const Footer = () => {
  return (
    <footer className="w-full pt-16 pb-8 px-6 mt-20 border-t border-white/5 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-12">
          
          {/* Cột 1: Logo & Description */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              {/* <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center font-bold text-lg text-white">
                U
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">
                IT<span className="text-glow"> Cinema</span>
              </span> */}
              <img src={UITLogo} alt="UIT Logo" className="w-35 h-35 object-contain" />
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              UIT Cinema là nền tảng đặt vé xem phim trực tuyến hàng đầu, mang đến cho bạn trải nghiệm điện ảnh tuyệt vời với hệ thống rạp hiện đại và những bộ phim mới nhất mỗi ngày.
            </p>

            {/* App Store Badges */}
            <div className="flex gap-4">
              <button className="flex items-center gap-2 border border-white/20 px-1 py-1 rounded-lg hover:bg-white/5 transition-all group">
                <img src={assets.googlePlay} alt="Google Play" className="h-8" />
              </button>
              <button className="flex items-center gap-2 border border-white/20 px-1 py-1 rounded-lg hover:bg-white/5 transition-all group">
                <img src={assets.appStore} alt="App Store" className="h-8" />
              </button>
            </div>
          </div>

          {/* Cột 2: Company Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">hệ thống</h3>
            <ul className="flex flex-col gap-3 text-gray-400 text-sm">
              <li className="hover:text-(--btn-neon) transition-colors cursor-pointer">Trang chủ</li>
              <li className="hover:text-(--btn-neon) transition-colors cursor-pointer">Về chúng tôi</li>
              <li className="hover:text-(--btn-neon) transition-colors cursor-pointer">Liên hệ</li>
              <li className="hover:text-(--btn-neon) transition-colors cursor-pointer">Điều khoản cá nhân</li>
            </ul>
          </div>

          {/* Cột 3: Get in touch */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Liên hệ với chúng tôi</h3>
            <ul className="flex flex-col gap-3 text-gray-400 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">0907510942</li>
              <li className="hover:text-white transition-colors cursor-pointer">phangiadat300106@gmail.com</li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            Copyright 2026 © UIT Cinema. All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;