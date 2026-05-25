import { useState } from 'react';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

const Payment = ({ movie, selectedDateId, currentSlot, selectedSeats, amount, formatTime, onBack, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('momo'); // 'momo' hoặc 'vnpay'

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-16 max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500 text-left">
      
      {/* Tiêu đề trang */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={onBack}
          className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer w-fit"
        >
          <ChevronLeft size={16}/> Quay lại chọn ghế
        </button>
        <h1 className="text-3xl font-black uppercase tracking-wider italic text-white mt-2">Trang Thanh Toán</h1>
      </div>

      {/* Bố cục Grid 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-8 items-start">
        
        {/* CỘT TRÁI: PHƯƠNG THỨC THANH TOÁN */}
        <div className="flex flex-col gap-4 w-full">
          
          {/* Phương thức 1: MoMo */}
          <label 
            onClick={() => setPaymentMethod('momo')}
            className={`flex items-center gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
              paymentMethod === 'momo' 
                ? 'bg-white/5 border-pink-500 shadow-[0_0_15px_rgba(239,68,110,0.15)]' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <input 
              type="radio" 
              name="payment" 
              checked={paymentMethod === 'momo'} 
              onChange={() => {}} 
              className="accent-pink-500 w-4 h-4 cursor-pointer"
            />
            <div className="w-8 h-8 bg-[#a50064] rounded-lg flex items-center justify-center text-white text-xs font-black select-none">
              mo
            </div>
            <span className="text-white font-bold text-sm md:text-base">Momo</span>
          </label>

          {/* Phương thức 2: VNPAY */}
          <label 
            onClick={() => setPaymentMethod('vnpay')}
            className={`flex items-center gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
              paymentMethod === 'vnpay' 
                ? 'bg-white/5 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <input 
              type="radio" 
              name="payment" 
              checked={paymentMethod === 'vnpay'} 
              onChange={() => {}} 
              className="accent-blue-500 w-4 h-4 cursor-pointer"
            />
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black tracking-tighter select-none">
              VN
            </div>
            <span className="text-white font-bold text-sm md:text-base">VNPAY</span>
          </label>

          {/* NÚT THANH TOÁN CHỦ ĐẠO */}
          <button 
            onClick={onPaymentSuccess}
            className="w-full bg-linear-to-r from-[#ff436e] to-[#e0325a] hover:from-[#e0325a] hover:to-[#b81d43] text-white font-black py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(255,67,110,0.3)] text-base tracking-widest uppercase mt-4 cursor-pointer text-center active:scale-[0.99]"
          >
            Xác Nhận Thanh Toán
          </button>
        </div>

        {/* CỘT PHẢI: BẢNG TÓM TẮT THÔNG TIN VÉ PHIM */}
        <div className="w-full bg-blue-600/90 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col gap-4 text-white shadow-2xl">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight truncate text-glow">{movie.title}</h3>
            {/* GIỮ NGUYÊN: Dòng chi tiết phim cảnh báo độ tuổi màu vàng chuẩn UI của bạn */}
            <p className="text-xs text-yellow-300 font-semibold mt-1 leading-relaxed">
              Phim dành cho khán giả từ dưới 13 tuổi với điều kiện xem cùng cha, mẹ hoặc người giám hộ
            </p>
          </div>

          <div className="w-full h-px bg-white/10 my-1"></div>

          {/* Chi tiết nội dung */}
          <div className="flex flex-col gap-3 text-xs text-blue-100 font-medium">
            <div className="grid grid-cols-2 gap-4">
              <p className="flex flex-col gap-0.5">
                <span className="text-blue-200/70 font-bold uppercase tracking-wider text-[10px]">Thời Gian Suất Chiếu</span>
                <span className="text-white font-bold text-sm">{formatTime(currentSlot?.time)} - {selectedDateId}</span>
              </p>
              <p className="flex flex-col gap-0.5">
                <span className="text-blue-200/70 font-bold uppercase tracking-wider text-[10px]">Phòng chiếu & Số Vé</span>
                <span className="text-white font-bold text-sm">Phòng 02 • {selectedSeats.length} Vé</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-1">
              <p className="flex flex-col gap-0.5">
                <span className="text-blue-200/70 font-bold uppercase tracking-wider text-[10px]">Loại Vé</span>
                <span className="text-white font-bold text-sm">Người Lớn (2D)</span>
              </p>
              <p className="flex flex-col gap-0.5">
                <span className="text-blue-200/70 font-bold uppercase tracking-wider text-[10px]">Vị Trí Số Ghế</span>
                <span className="text-yellow-300 font-black text-base tracking-wide">{selectedSeats.join(', ')}</span>
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-white/10 my-1"></div>

          {/* Tổng tiền chân trang */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-100">Số tiền cần thanh toán</span>
            <span className="text-2xl font-black text-yellow-300 drop-shadow-md">
              ${amount}
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-blue-200/50 font-medium mt-1">
            <ShieldCheck size={12} />
            <span>Giao dịch bảo mật an toàn mã hóa SSL</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;