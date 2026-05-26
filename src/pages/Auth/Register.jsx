import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Bỏ icon IdCard không dùng tới nữa
import { User, Calendar, Phone, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '', // <-- 1. THÊM TRƯỜNG GIỚI TÍNH VÀO STATE
    phone: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không trùng khớp!");
      return;
    }
    
    setIsLoading(true);
    try {
      let gioiTinh = null;
      if (formData.gender === "Nam") {
        gioiTinh = true;
      } else if (formData.gender === "Nữ") {
        gioiTinh = false;
      }

      const response = await axiosClient.post("/auth/register", {
        TenDangNhap: formData.username,
        MatKhau: formData.password,
        XacNhanMatKhau: formData.confirmPassword,
        HoTen: formData.name,
        Email: formData.email,
        SoDienThoai: formData.phone,
        GioiTinh: gioiTinh,
        NgaySinh: formData.dob || undefined,
      });

      const tokens = response?.tokens;
      const taiKhoan = response?.taiKhoan;

      if (tokens && tokens.accessToken && tokens.refreshToken && taiKhoan) {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("userRole", taiKhoan.VaiTro);
        localStorage.setItem("userName", taiKhoan.HoTen);
        localStorage.setItem("userCode", taiKhoan.TenDangNhap);
        localStorage.setItem("userInfo", JSON.stringify(taiKhoan));

        toast.success("Đăng ký tài khoản và đăng nhập thành công!");
        navigate("/");
      } else {
        toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err);
      const msg = err.response?.data?.message || err.message || "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Khối Glassmorphism Form */}
      <div className="w-full max-w-lg glass-effect p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500 my-8">
        
        {/* Header Form */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
            Tạo <span className="text-glow text-(--btn-neon)">Tài Khoản</span>
          </h2>
          <p className="text-sm text-gray-400">Đăng ký để trải nghiệm dịch vụ đặt vé tốt nhất</p>
        </div>

        {/* Form Nhập Liệu */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-left">
          
          {/* 1. Ô Nhập Họ và Tên */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Họ và tên *</label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="Họ và tên"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 2. Ô Nhập Ngày Sinh */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Ngày sinh *</label>
            <div className="relative">
              <input 
                type="date" 
                required
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all dark:scheme-dark"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* --- 3. Ô CHỌN GIỚI TÍNH (MỚI THÊM) --- */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Giới tính *</label>
            <div className="relative">
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all cursor-pointer"
              >
                <option value="" disabled className="bg-[#020617] text-gray-400">Chọn giới tính</option>
                <option value="Nam" className="bg-[#020617] text-white">Nam</option>
                <option value="Nữ" className="bg-[#020617] text-white">Nữ</option>
                <option value="Khác" className="bg-[#020617] text-white">Khác</option>
              </select>
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 4. Ô Nhập Số Điện Thoại */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Số điện thoại *</label>
            <div className="relative">
              <input 
                type="tel" 
                required
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 5. Ô Nhập Tên Đăng Nhập */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Tên đăng nhập *</label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 6. Ô Nhập Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Email *</label>
            <div className="relative">
              <input 
                type="email" 
                required
                placeholder="Điền email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 7. Ô Nhập Mật Khẩu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Mật khẩu *</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 8. Ô Nhập Xác Thực Mật Khẩu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Xác thực mật khẩu *</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Xác thực mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Nút Đăng Ký */}
          <button type="submit" disabled={isLoading} className="btn-bright mt-4 w-full flex items-center justify-center gap-2 cursor-pointer py-3.5 rounded-xl normal-case text-base tracking-normal disabled:opacity-50">
            <span>{isLoading ? "Đang xử lý..." : "Đăng Ký Ngay"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer Chuyển Đổi Sang Đăng Nhập */}
        <div className="mt-6 text-center border-t border-white/5 pt-4 text-sm text-gray-400">
          Bạn đã có tài khoản?{' '}
          <Link to="/login" className="text-(--btn-neon) font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;