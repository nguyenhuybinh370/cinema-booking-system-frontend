import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Key, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPassword, verifyResetOtp, resetPassword } from '../../api/authApi';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Step state: 'email' | 'otp' | 'reset'
  const [step, setStep] = useState('email');
  
  // Form input states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cooldown timer effect for Resend OTP button
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handler for Step 1: Submit Email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!email) {
      toast.error('Vui lòng nhập địa chỉ email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không đúng định dạng');
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      // Even if email is not found, backend returns success.
      toast.success(response?.message || 'Yêu cầu khôi phục đã được xử lý. Vui lòng kiểm tra email.');
      setStep('otp');
      setCooldown(60); // Start 60s resend cooldown
    } catch (err) {
      console.error('Forgot password error:', err);
      const msg = err?.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!otp) {
      toast.error('Vui lòng nhập mã xác nhận');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      toast.error('Mã xác nhận phải gồm đúng 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyResetOtp(email, otp);
      toast.success(response?.message || 'Mã xác nhận hợp lệ.');
      setStep('reset');
    } catch (err) {
      console.error('Verify OTP error:', err);
      const msg = err?.message || 'Mã xác nhận không đúng hoặc đã hết hạn.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Step 2 Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || isLoading) return;

    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      toast.success(response?.message || 'Mã xác nhận mới đã được gửi!');
      setCooldown(60);
      setOtp(''); // Clear old OTP input
    } catch (err) {
      console.error('Resend OTP error:', err);
      const msg = err?.message || 'Không thể gửi lại mã xác nhận. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Step 3: Reset Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu mới không trùng khớp');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(email, otp, newPassword, confirmPassword);
      toast.success(response?.message || 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
      
      // Clear form states
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');

      // Redirect to login page
      navigate('/login');
    } catch (err) {
      console.error('Reset password error:', err);
      const msg = err?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Khối Glassmorphism Form */}
      <div className="w-full max-w-md glass-effect p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500">
        
        {/* Nút quay lại ở góc trên bên trái form */}
        <div className="text-left mb-4">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Quay lại đăng nhập</span>
          </Link>
        </div>

        {/* STEP 1: NHẬP EMAIL */}
        {step === 'email' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
                Khôi Phục <span className="text-glow text-(--btn-neon)">Mật Khẩu</span>
              </h2>
              <p className="text-sm text-gray-400">
                Nhập địa chỉ email của bạn, chúng tôi sẽ gửi mã xác nhận 6 chữ số để tiếp tục.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Địa chỉ email *</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    placeholder="youremail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all disabled:opacity-50"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-bright mt-2 w-full flex items-center justify-center gap-2 cursor-pointer py-3.5 rounded-xl normal-case text-base tracking-normal disabled:opacity-50"
              >
                <span>{isLoading ? 'Đang gửi yêu cầu...' : 'Gửi Mã Xác Nhận'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </>
        )}

        {/* STEP 2: NHẬP OTP */}
        {step === 'otp' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
                Xác Thực <span className="text-glow text-(--btn-neon)">Mã OTP</span>
              </h2>
              <p className="text-sm text-gray-400">
                Nhập mã xác nhận 6 chữ số đã được gửi đến email <span className="text-white font-semibold">{email}</span>.
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Mã xác nhận OTP *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // chỉ giữ số
                      setOtp(val);
                    }}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-center text-lg font-bold tracking-[0.25em] text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all disabled:opacity-50"
                  />
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-bright mt-2 w-full flex items-center justify-center gap-2 cursor-pointer py-3.5 rounded-xl normal-case text-base tracking-normal disabled:opacity-50"
              >
                <span>{isLoading ? 'Đang xác thực...' : 'Xác Nhận OTP'}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-4 text-sm border-t border-white/5 pt-5">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                <span>{cooldown > 0 ? `Gửi lại mã sau (${cooldown}s)` : 'Gửi lại mã xác nhận'}</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                }}
                disabled={isLoading}
                className="text-xs font-bold text-gray-400 hover:text-(--btn-neon) underline decoration-1 underline-offset-4 cursor-pointer transition-colors disabled:opacity-50"
              >
                Đổi email khác
              </button>
            </div>
          </>
        )}

        {/* STEP 3: ĐẶT LẠI MẬT KHẨU */}
        {step === 'reset' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
                Đặt Lại <span className="text-glow text-(--btn-neon)">Mật Khẩu</span>
              </h2>
              <p className="text-sm text-gray-400">
                Nhập mật khẩu mới có độ dài tối thiểu 6 ký tự cho tài khoản của bạn.
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="flex flex-col gap-5 text-left">
              {/* Mật khẩu mới */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Mật khẩu mới *</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all disabled:opacity-50"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Xác nhận mật khẩu mới *</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all disabled:opacity-50"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-bright mt-4 w-full flex items-center justify-center gap-2 cursor-pointer py-3.5 rounded-xl normal-case text-base tracking-normal disabled:opacity-50"
              >
                <span>{isLoading ? 'Đang cập nhật mật khẩu...' : 'Đặt Lại Mật Khẩu'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;