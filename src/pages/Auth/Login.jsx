import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/auth/login", {
        TenDangNhap: formData.username,
        MatKhau: formData.password,
      });

      const { taiKhoan, tokens } = response;

      if (!taiKhoan || !tokens) {
        throw new Error("Phản hồi đăng nhập không hợp lệ từ máy chủ");
      }

      // Store tokens and metadata
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("userRole", taiKhoan.VaiTro);
      localStorage.setItem("userName", taiKhoan.HoTen);
      localStorage.setItem("userCode", taiKhoan.TenDangNhap);
      localStorage.setItem("userInfo", JSON.stringify(taiKhoan));

      toast.success("Đăng nhập thành công!");

      // Role-based redirect
      const from = location.state?.from;
      const role = taiKhoan.VaiTro;

      if (role === "CUSTOMER") {
        navigate(from || "/", { replace: true });
      } else if (role === "STAFF") {
        // If from is a staff page, go there; otherwise staff dashboard
        const staffTarget = from && from.startsWith("/staff") ? from : "/staff/dashboard";
        navigate(staffTarget, { replace: true });
      } else if (role === "ADMIN") {
        const adminTarget = from && from.startsWith("/admin") ? from : "/admin";
        navigate(adminTarget, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || err.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
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
          
          {/* Ô Nhập Tên Đăng Nhập */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Tên đăng nhập</label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all disabled:opacity-50"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all disabled:opacity-50"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              
              {/* Nút Ẩn/Hiện Mật Khẩu */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nút Đăng Nhập */}
          <button type="submit" disabled={isLoading} className="btn-bright mt-4 w-full flex items-center justify-center gap-2 cursor-pointer py-3.5 rounded-xl normal-case text-base tracking-normal disabled:opacity-50">
            <span>{isLoading ? "Đang xử lý..." : "Đăng Nhập"}</span>
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