import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/auth/login", {
        TenDangNhap: username,
        MatKhau: password,
      });

      const { taiKhoan, tokens } = response;

      if (!taiKhoan || !tokens) {
        throw new Error("Phản hồi đăng nhập không hợp lệ từ máy chủ");
      }

      if (taiKhoan.VaiTro !== "STAFF" && taiKhoan.VaiTro !== "ADMIN") {
        setError("Tài khoản của bạn không có quyền truy cập!");
        setIsLoading(false);
        return;
      }

      // Store tokens and metadata
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("userRole", taiKhoan.VaiTro);
      localStorage.setItem("userName", taiKhoan.HoTen);
      localStorage.setItem("userCode", taiKhoan.TenDangNhap);

      // Redirect depending on role
      if (taiKhoan.VaiTro === "ADMIN") {
        navigate("/admin/rooms");
      } else {
        navigate("/staff/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || err.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--navy-deep)] via-[#090520] to-[#1e1040] opacity-90"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--purple-glow)] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--btn-neon)] rounded-full blur-[150px] opacity-10"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-sm uppercase tracking-[0.4em] text-[var(--btn-neon)] font-black text-glow">
            UIT Cinema
          </h2>
          <h1 className="text-3xl font-black text-white mt-2 uppercase tracking-wide">
            Cổng Nhân Viên
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Vui lòng đăng nhập để bắt đầu ca làm việc
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-semibold text-center animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 pl-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản nhân viên..."
              disabled={isLoading}
              className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[var(--btn-neon)] focus:ring-1 focus:ring-[var(--btn-neon)] transition-all duration-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2 pl-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[var(--btn-neon)] focus:ring-1 focus:ring-[var(--btn-neon)] transition-all duration-300 font-mono tracking-widest text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-bright py-4 flex items-center justify-center gap-2 mt-8 font-black tracking-widest text-base shadow-[0_0_20px_rgba(253,224,71,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                ĐANG ĐĂNG NHẬP...
              </>
            ) : (
              "ĐĂNG NHẬP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
