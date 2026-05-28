import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { CreditCard, Wallet, Landmark, ShieldCheck, ChevronLeft } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('PAYOS');

  const paymentMethods = [
    { id: 'VNPAY', name: 'VNPay', icon: Wallet, color: 'text-blue-500' },
    { id: 'PAYOS', name: 'PayOS', icon: Landmark, color: 'text-blue-400' },
    { id: 'CARD', name: 'Thẻ Quốc Tế', icon: CreditCard, color: 'text-emerald-500' },
  ];

  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-[#020617] min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
          >
            <ChevronLeft size={18} />
            Quay lại chọn ghế
          </button>

          <h1 className="text-4xl font-black mb-12 uppercase tracking-tighter text-glow">Thanh Toán</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Payment Section */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[var(--btn-neon)] rounded-full"></div>
                  Phương thức thanh toán
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`
                        p-6 rounded-3xl border transition-all flex flex-col items-center gap-4
                        ${paymentMethod === method.id 
                          ? 'bg-[var(--btn-neon)]/10 border-[var(--btn-neon)] shadow-[0_0_20px_rgba(0,255,153,0.1)]' 
                          : 'bg-white/5 border-white/5 hover:border-white/10'}
                      `}
                    >
                      <method.icon className={paymentMethod === method.id ? 'text-[var(--btn-neon)]' : 'text-slate-500'} size={32} />
                      <span className={`font-bold text-sm ${paymentMethod === method.id ? 'text-white' : 'text-slate-500'}`}>
                        {method.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[var(--btn-neon)] rounded-full"></div>
                  Xác nhận thông tin
                </h3>
                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Email nhận vé:</span>
                    <span className="text-white font-bold">nguyenhuybinh@gmail.com</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Số điện thoại:</span>
                    <span className="text-white font-bold">098****321</span>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-3 text-blue-500">
                    <ShieldCheck size={20} className="shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">
                      Thông tin vé sẽ được gửi qua Email và SMS sau khi thanh toán thành công. Vui lòng kiểm tra kỹ trước khi xác nhận.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="aspect-[16/9] w-full relative">
                  <img src="https://image.api.playready.com.vn/api/v2/image/6628b031b268010026e6d338" className="w-full h-full object-cover" alt="Movie" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div>
                    <h4 className="text-xl font-black text-white uppercase leading-tight mb-2">Lật Mặt 7: Một Điều Ước</h4>
                    <p className="text-slate-400 text-sm font-medium">19:30 • Thứ Hai, 13/05/2024</p>
                  </div>

                  <div className="space-y-3 py-6 border-y border-white/5 font-medium text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phòng chiếu:</span>
                      <span className="text-white">Phòng Chiếu 01</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ghế:</span>
                      <span className="text-white">H8, H9</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-white/5">
                      <span className="text-slate-500">Tổng cộng:</span>
                      <span className="text-2xl font-black text-[var(--btn-neon)]">170.000đ</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert("Chuyển hướng đến cổng thanh toán...")}
                    className="w-full py-5 bg-[var(--btn-neon)] text-navy-deep rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(0,255,153,0.3)] transition-all"
                  >
                    Xác nhận & Thanh toán
                  </button>
                  <p className="text-[10px] text-center text-slate-600 italic">
                    Bằng việc nhấn Thanh toán, bạn đồng ý với Điều khoản sử dụng của CinemaPlus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
