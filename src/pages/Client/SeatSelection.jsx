import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { MOVIES_MOCK } from '../../constants/movies';
import { SEAT_TYPES } from '../../constants/adminMockData';
import { ChevronLeft, Info } from 'lucide-react';

const ROWS = 10;
const COLS = 14;
const GENERATED_MATRIX = (() => {
  const newMatrix = [];
  for (let r = 0; r < ROWS; r++) {
    const rowChar = String.fromCharCode(65 + r);
    for (let c = 0; c < COLS; c++) {
      let type = 'LG01'; // Normal
      if (r >= 4 && r <= 7 && c >= 3 && c <= 10) type = 'LG02'; // VIP
      if (r === 9) type = 'LG03'; // Sweetbox
      
      newMatrix.push({
        id: `${rowChar}${c + 1}`,
        type,
        isBooked: Math.random() < 0.1,
        row: rowChar,
        col: c + 1
      });
    }
  }
  return newMatrix;
})();

const SeatSelection = () => {
  const navigate = useNavigate();
  const movie = MOVIES_MOCK[0]; // Mocking for now

  const [selectedSeats, setSelectedSeats] = useState([]);
  const matrix = GENERATED_MATRIX;

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        alert("Bạn chỉ có thể chọn tối đa 8 ghế.");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatColor = (seat) => {
    if (seat.isBooked) return 'bg-slate-800 border-slate-700 cursor-not-allowed opacity-40';
    if (selectedSeats.find(s => s.id === seat.id)) return 'bg-[var(--btn-neon)] border-[var(--btn-neon)] text-navy-deep shadow-[0_0_15px_rgba(0,255,153,0.5)] scale-110';
    
    switch (seat.type) {
      case 'LG02': return 'bg-amber-500/20 border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-navy-deep';
      case 'LG03': return 'bg-rose-500/20 border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white';
      default: return 'bg-slate-700/20 border-slate-600/50 text-slate-400 hover:bg-slate-600 hover:text-white';
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const type = SEAT_TYPES.find(t => t.MaLoaiGhe === seat.type);
      return total + 85000 + (type ? type.GiaPhuThu : 0);
    }, 0);
  };

  return (
    <MainLayout>
      <div className="pt-24 pb-12 bg-[#020617] min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate(-1)}
                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-glow">{movie.TenPhim}</h1>
                <p className="text-slate-500 font-medium">Phòng Chiếu 01 • 19:30, Hôm nay 13/05</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <Info size={16} className="text-slate-500" />
                <span className="text-xs text-slate-400 font-medium italic">Tối đa 8 ghế/giao dịch</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Seat Map */}
            <div className="lg:col-span-3 flex flex-col items-center">
              {/* Screen */}
              <div className="w-4/5 h-2 bg-gradient-to-b from-[var(--btn-neon)] to-transparent rounded-full mb-24 relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[1em] text-[var(--btn-neon)] opacity-50">Màn Hình</div>
              </div>

              {/* Seats Grid */}
              <div className="inline-grid gap-3 mb-16" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
                {matrix.map((seat) => (
                  <button
                    key={seat.id}
                    disabled={seat.isBooked}
                    onClick={() => toggleSeat(seat)}
                    className={`
                      w-8 h-8 md:w-10 md:h-10 rounded-lg border text-[10px] font-black transition-all duration-300
                      flex items-center justify-center relative
                      ${getSeatColor(seat)}
                    `}
                  >
                    {seat.id}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-700/20 border border-slate-600/50"></div>
                  <span>Thường</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50"></div>
                  <span>VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-rose-500/20 border border-rose-500/50"></div>
                  <span>Sweetbox</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700 opacity-40"></div>
                  <span>Đã đặt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[var(--btn-neon)] shadow-[0_0_10px_rgba(0,255,153,0.5)]"></div>
                  <span className="text-white">Đang chọn</span>
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 sticky top-32 shadow-2xl">
                <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[var(--btn-neon)] rounded-full"></div>
                  Thông tin đặt vé
                </h3>

                <div className="space-y-6 mb-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ghế đã chọn</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.length > 0 ? (
                        selectedSeats.map(s => (
                          <span key={s.id} className="px-3 py-1 bg-white/5 rounded-lg text-sm font-bold text-white border border-white/10">
                            {s.id}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm italic">Chưa chọn ghế</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/5 pt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Tạm tính</span>
                      <span className="text-3xl font-black text-[var(--btn-neon)]">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={selectedSeats.length === 0}
                  onClick={() => navigate('/checkout')}
                  className={`
                    w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-500
                    ${selectedSeats.length > 0 
                      ? 'bg-[var(--btn-neon)] text-navy-deep hover:shadow-[0_0_30px_rgba(0,255,153,0.3)] hover:-translate-y-1' 
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}
                  `}
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SeatSelection;
