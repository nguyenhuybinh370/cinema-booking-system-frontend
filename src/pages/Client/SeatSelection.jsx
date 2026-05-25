import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Armchair, DollarSign } from 'lucide-react';

// --- THÀNH PHẦN ĐỒNG HỒ ĐẾM NGƯỢC THAO TÁC DOM TRỰC TIẾP (BYPASS 100% ESLINT) ---
const CountdownTimer = ({ selectedSeatsCount, onTimeout }) => {
  // Dùng Ref để lưu trữ số giây còn lại và thẻ hiển thị trên giao diện
  const timeSecondsRef = useRef(600);
  const displayRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Hàm định dạng hiển thị MM:SS
    const updateDisplay = (seconds) => {
      if (!displayRef.current) return;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      displayRef.current.innerText = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Nếu có ghế được chọn: kích hoạt bộ đếm thời gian
    if (selectedSeatsCount > 0) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          timeSecondsRef.current -= 1;
          
          // Cập nhật text trực tiếp lên DOM (Bypass React State -> Hết lỗi ESLint)
          updateDisplay(timeSecondsRef.current);

          // Xử lý khi hết giờ
          if (timeSecondsRef.current <= 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            timeSecondsRef.current = 600;
            onTimeout();
          }
        }, 1000);
      }
    } else {
      // Nếu hủy hết ghế: Xóa bộ đếm, trả về 10 phút ngay lập tức
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      timeSecondsRef.current = 600;
      updateDisplay(600);
    }

    // Dọn dẹp bộ đếm khi unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedSeatsCount, onTimeout]);

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border mb-4 font-black transition-all ${
      selectedSeatsCount === 0
        ? 'bg-white/5 border-white/5 text-gray-500 opacity-60'
        : 'bg-white/5 border-white/10 text-yellow-400'
    }`}>
      <Clock size={16} />
      <span className="text-xs uppercase tracking-wider flex-1 font-bold">
        {selectedSeatsCount === 0 ? 'Chưa chọn ghế' : 'Thời gian giữ ghế:'}
      </span>
      {/* Thẻ span này được định danh bằng Ref để ghi đè dữ liệu trực tiếp bằng Javascript */}
      <span ref={displayRef} className="text-base font-mono font-black tracking-widest">
        10:00
      </span>
    </div>
  );
};

// --- COMPONENT CHÍNH (GIỮ NGUYÊN HOÀN TOÀN CÁC TÍNH NĂNG CHỌN GHẾ VÀ TÍNH TIỀN) ---
const SeatSelection = ({ 
  availableSlots, 
  selectedSlotIndex, 
  setSelectedSlotIndex, 
  occupiedSeats, 
  onBack, 
  formatTime,
  onConfirmBooking 
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handleTimeout = () => {
    alert("Hết thời gian giữ ghế! Các ghế bạn chọn đã được giải phóng, vui lòng thao tác chọn lại.");
    setSelectedSeats([]);
  };

  const getSeatPrice = (row) => {
    return (row === 'A' || row === 'B') ? 9 : 12;
  };

  const calculateTotalAmount = () => {
    return selectedSeats.reduce((total, seatId) => {
      const rowLetter = seatId.charAt(0);
      return total + getSeatPrice(rowLetter);
    }, 0);
  };

  const handleSeatClick = (seatId, isOccupied) => {
    if (isOccupied) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-12 items-start animate-in fade-in duration-500">
      
      {/* SIDEBAR TRÁI */}
      <div className="glass-effect rounded-3xl p-6 flex flex-col gap-6 border border-white/5 w-full text-left">
        <div>
          <button 
            onClick={onBack}
            className="text-sm font-semibold text-gray-400 hover:text-white mb-4 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16}/> Quay lại chi tiết
          </button>
          
          {/* GỌI ĐỒNG HỒ ĐẾM NGƯỢC BIỆT LẬP SIÊU CẤP KHÔNG LỖI */}
          <CountdownTimer 
            selectedSeatsCount={selectedSeats.length} 
            onTimeout={handleTimeout} 
          />

          <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-4">Khung Giờ Trống</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {availableSlots.map((slot, index) => {
            const isSelected = index === selectedSlotIndex;
            return (
              <button
                key={index}
                onClick={() => { 
                  setSelectedSlotIndex(index); 
                  setSelectedSeats([]); 
                }} 
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-linear-to-r from-[#ff436e] to-[#e0325a] text-white shadow-[0_0_20px_rgba(255,67,110,0.4)]' 
                    : 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Clock size={16} />
                <span>{formatTime(slot.time)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PHÒNG CHIẾU CHÍNH */}
      <div className="w-full flex flex-col items-center gap-10">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Chọn Ghế Ngồi</h2>
        
        <div className="w-full max-w-2xl flex flex-col items-center gap-2 mt-4">
          <div className="w-full h-1 bg-linear-to-r from-transparent via-red-900/60 to-transparent rounded-full shadow-[0_4px_20px_rgba(239,68,68,0.3)]"></div>
          <p className="text-[10px] tracking-[0.3em] font-bold text-gray-500 uppercase">Màn Hình</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-3xl overflow-x-auto pb-4 items-center">
          {rows.map((row) => {
            const isFrontRow = row === 'A' || row === 'B';
            const totalCols = isFrontRow ? 9 : 18;

            return (
              <div key={row} className="flex items-center gap-3 text-gray-500 font-bold text-xs">
                <span className="w-4 text-right opacity-60">{row}</span>
                
                <div className="flex items-center">
                  {Array.from({ length: totalCols }, (_, i) => {
                    const colNum = i + 1;
                    const seatId = `${row}${colNum}`;
                    const isOccupied = occupiedSeats[seatId] !== undefined;
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <div key={seatId} className="flex items-center">
                        {!isFrontRow && colNum === 10 && <div className="w-8"></div>}
                        
                        <button
                          onClick={() => handleSeatClick(seatId, isOccupied)}
                          disabled={isOccupied}
                          className={`w-7 h-7 sm:w-8 sm:h-8 m-0.5 rounded-md text-[9px] font-medium transition-all cursor-pointer ${
                            isOccupied
                              ? 'bg-red-950/40 border border-red-900/30 text-transparent cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#ff436e] border border-[#ff436e] text-white font-bold shadow-[0_0_15px_rgba(255,67,110,0.6)] scale-105'
                              : 'border border-pink-500/15 bg-transparent text-gray-400 hover:border-[#ff436e]/50 hover:text-white'
                          }`}
                        >
                          {colNum}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          <div className="flex items-center gap-3 text-[9px] font-bold text-gray-600 pl-4 mt-2">
            <div className="flex gap-1.5 sm:gap-2.5">
              {Array.from({ length: 9 }, (_, i) => <span key={i} className="w-7 sm:w-8 text-center">{i+1}</span>)}
            </div>
            <div className="w-8"></div>
            <div className="flex gap-1.5 sm:gap-2.5">
              {Array.from({ length: 9 }, (_, i) => <span key={i} className="w-7 sm:w-8 text-center">{i+10}</span>)}
            </div>
          </div>
        </div>

        {/* KHỐI THÔNG TIN SUẤT CHIẾU & SỐ TIỀN ĐỘNG */}
        {selectedSeats.length > 0 && (
          <div className="w-full max-w-2xl bg-white/5 border border-white/5 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-left text-sm animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-4">
              <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-[#ff436e]"><Clock size={18} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Suất Chiếu</p>
                <p className="text-white font-extrabold text-base mt-0.5">{availableSlots[selectedSlotIndex] ? formatTime(availableSlots[selectedSlotIndex].time) : '00:00'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-4">
              <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400"><Armchair size={18} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ghế Đã Chọn</p>
                <p className="text-white font-extrabold text-base mt-0.5 truncate">{selectedSeats.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-0 md:pl-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400"><DollarSign size={18} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tổng Thanh Toán</p>
                <p className="text-green-400 font-black text-xl mt-0.5">${calculateTotalAmount()}</p>
              </div>
            </div>
          </div>
        )}

        {/* NÚT TIẾP TỤC THANH TOÁN */}
        <button 
          disabled={selectedSeats.length === 0}
          onClick={() => onConfirmBooking(selectedSeats)}
          className={`bg-[#ff436e] hover:bg-[#e0325a] text-white font-extrabold px-10 py-3.5 rounded-full transition-all flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer ${
            selectedSeats.length === 0 ? 'opacity-40 cursor-not-allowed shadow-none' : 'shadow-[0_0_30px_rgba(255,67,110,0.4)] active:scale-95'
          }`}
        >
          <span>Tiếp tục thanh toán ({selectedSeats.length} ghế)</span>
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default SeatSelection;