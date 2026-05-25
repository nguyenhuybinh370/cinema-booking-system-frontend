import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng nhập với dữ liệu:", formData);
    // Xử lý logic đăng nhập tại đây
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Khối Glassmorphism Form */}
      <div className="w-full max-w-md glass-effect p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Form */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
            Chào Mừng <span className="text-glow text-(--btn-neon)">Trở Lại</span>
          </h2>
          <p className="text-sm text-gray-400">Vui lòng đăng nhập để tiếp tục đặt vé</p>
        </div>

        {/* Form Nhập Liệu */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          
          {/* Ô Nhập Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">địa chỉ email</label>
            <div className="relative">
              <input 
                type="email" 
                required
                placeholder="youremail@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Ô Nhập Mật Khẩu */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Mật khẩu</label>
              <Link to="/forgot-password" className="text-xs text-(--btn-neon) hover:underline">Quên mật khẩu?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              
              {/* Nút Ẩn/Hiện Mật Khẩu */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nút Đăng Nhập (Dùng class của bạn) */}
          <button type="submit" className="btn-bright mt-4 w-full flex items-center justify-center gap-2 cursor-pointer py-3.5 rounded-xl normal-case text-base tracking-normal">
            <span>Đăng Nhập</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer Chuyển Đổi Sang Đăng Ký */}
        <div className="mt-8 text-center border-t border-white/5 pt-5 text-sm text-gray-400">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="text-(--btn-neon) font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;