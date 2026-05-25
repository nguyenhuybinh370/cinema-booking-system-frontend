import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast'; // Dùng thư viện toast có sẵn của bạn để thông báo

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false); // Trạng thái kiểm tra xem đã bấm gửi chưa

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Yêu cầu khôi phục mật khẩu gửi tới email:", email);
    
    // Giả lập gửi mail thành công
    toast.success("Mã khôi phục đã được gửi đến email của bạn!");
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Khối Glassmorphism Form */}
      <div className="w-full max-w-md glass-effect p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-500">
        
        {/* Nút quay lại trang Đăng Nhập ở góc trên bên trái form */}
        <div className="text-left mb-4">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Quay lại đăng nhập</span>
          </Link>
        </div>

        {/* GIAO DIỆN CHƯA GỬI MAIL */}
        {!isSent ? (
          <>
            {/* Header Form */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
                Khôi Phục <span className="text-glow text-(--btn-neon)">Mật Khẩu</span>
              </h2>
              <p className="text-sm text-gray-400">
                Nhập địa chỉ email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu mới.
              </p>
            </div>

            {/* Form nhập liệu */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
              
              {/* Ô Nhập Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Địa chỉ email *</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    placeholder="youremail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--btn-neon) focus:bg-white/10 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Nút Gửi yêu cầu */}
              <button 
                type="submit" 
                className="btn-bright mt-2 w-full flex items-center justify-center gap-2 cursor-pointer py-3.5 rounded-xl normal-case text-base tracking-normal"
              >
                <span>Gửi Mã Xác Nhận</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </>
        ) : (
          /* GIAO DIỆN SAU KHI ĐÃ GỬI MAIL THÀNH CÔNG */
          <div className="text-center py-6 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-400">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-(--btn-neon) shadow-[0_0_20px_rgba(253,224,71,0.2)]">
              <Mail size={28} />
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mt-2">
              Kiểm Tra <span className="text-glow text-(--btn-neon)">Hộp Thư</span>
            </h2>
            
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến địa chỉ <span className="text-white font-semibold">{email}</span>. Vui lòng kiểm tra kỹ cả hộp thư rác (Spam) nếu không tìm thấy.
            </p>

            <button 
              onClick={() => setIsSent(false)}
              className="mt-4 text-xs font-bold text-gray-400 hover:text-(--btn-neon) underline decoration-1 underline-offset-4 cursor-pointer transition-colors"
            >
              Thử lại với một email khác
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;