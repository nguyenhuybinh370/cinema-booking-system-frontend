import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Armchair, DollarSign } from 'lucide-react';
import { formatVND } from '../../utils/formatHelper';
import { getSeatMap, holdSeats } from '../../api/bookingApi';
import toast from 'react-hot-toast';

// --- SVGs FOR SEATS FROM STAFF SECTION ---
const SeatIcon = ({ className, strokeClassName }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Backrest */}
    <path d="M6 4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v9H6V4z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.75" />
    {/* Cushion */}
    <path d="M5 13c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-3z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} />
    {/* Left Armrest */}
    <rect x="3" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
    {/* Right Armrest */}
    <rect x="18.5" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
  </svg>
);

const CoupleSeatIcon = ({ className, strokeClassName }) => (
  <svg className={className} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Backrest */}
    <path d="M6 4c0-1.1.9-2 2-2h32c1.1 0 2 .9 2 2v9H6V4z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.75" />
    {/* Cushion */}
    <path d="M5 13c0-1.1.9-2 2-2h34c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-3z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} />
    {/* Left Armrest */}
    <rect x="3" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
    {/* Right Armrest */}
    <rect x="42.5" y="7" width="2.5" height="10" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5" className={strokeClassName} opacity="0.9" />
  </svg>
);

// --- STATIC HOLD INDICATOR FOR SELECTION PAGE ---
const SeatHoldIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-4 font-black transition-all bg-white/5 border-white/5 text-slate-400">
    <Clock size={16} className="text-[#ff436e]" />
    <span className="text-[11px] uppercase tracking-wider flex-1 font-bold">
      Hạn thanh toán:
    </span>
    <span className="text-xs font-bold text-white bg-[#ff436e]/10 px-2.5 py-1 rounded-lg">
      10 phút
    </span>
  </div>
);

// --- MAIN SEAT SELECTION COMPONENT ---
const SeatSelection = ({ 
  availableSlots, 
  selectedSlotIndex, 
  setSelectedSlotIndex, 
  onBack, 
  formatTime,
  onConfirmBooking,
  shouldReloadSeatMap
}) => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMapData, setSeatMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHolding, setIsHolding] = useState(false);

  const lastMaSuatChieuRef = useRef("");

  useEffect(() => {
    const fetchSeats = async () => {
      const currentSlot = availableSlots[selectedSlotIndex];
      const maSuatChieu = currentSlot?.MaSuatChieu || currentSlot?.showId;
      if (!maSuatChieu) return;

      try {
        setIsLoading(true);
        const res = await getSeatMap(maSuatChieu);
        setSeatMapData(res);
        
        // Reset only when the showtime actually changes
        if (lastMaSuatChieuRef.current !== maSuatChieu) {
          setSelectedSeats([]);
          lastMaSuatChieuRef.current = maSuatChieu;
        }
      } catch (err) {
        console.error("Error fetching seat map:", err);
        toast.error("Không thể tải sơ đồ ghế của suất chiếu này.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeats();
  }, [selectedSlotIndex, availableSlots, shouldReloadSeatMap]);

  const calculateTotalAmount = () => {
    return selectedSeats.reduce((total, seat) => total + seat.GiaVeTinhToan, 0);
  };

  const handleSeatClick = (seat) => {
    if (seat.TrangThai !== "TRONG") return;

    if (selectedSeats.some(s => s.MaGheSuatChieu === seat.MaGheSuatChieu)) {
      setSelectedSeats(selectedSeats.filter(s => s.MaGheSuatChieu !== seat.MaGheSuatChieu));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) return;
    
    // Auth Guard
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập tài khoản khách hàng để thực hiện đặt vé!");
      const currentSlot = availableSlots[selectedSlotIndex];
      navigate("/login", { state: { from: `/movie/${currentSlot?.MaPhim}` } });
      return;
    }

    const currentSlot = availableSlots[selectedSlotIndex];
    const maSuatChieu = currentSlot?.MaSuatChieu || currentSlot?.showId;
    if (!maSuatChieu) {
      toast.error("Không tìm thấy thông tin suất chiếu.");
      return;
    }

    try {
      setIsHolding(true);
      const seatIds = selectedSeats.map(s => s.MaGheSuatChieu);
      
      await holdSeats(maSuatChieu, seatIds);
      
      // On success, proceed to visual payment step
      onConfirmBooking(selectedSeats, calculateTotalAmount(), seatIds, maSuatChieu);
    } catch (err) {
      console.error("Hold seats error:", err);
      if (err.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login", { state: { from: `/movie/${currentSlot?.MaPhim}` } });
      } else if (err.response?.status === 403) {
        toast.error("Tài khoản không có quyền giữ ghế");
      } else {
        const errMsg = err.response?.data?.message || err.message || "Giữ ghế thất bại, vui lòng chọn ghế khác.";
        toast.error(errMsg);
      }
      
      // Reload seat map on failure
      try {
        const res = await getSeatMap(maSuatChieu);
        setSeatMapData(res);
      } catch (reloadErr) {
        console.error("Error reloading seat map after hold failure:", reloadErr);
      }
    } finally {
      setIsHolding(false);
    }
  };

  // Group and sort seats logic (copied from staff implementation)
  const renderSeatGrid = () => {
    if (!seatMapData) return null;

    const { SoDoGhe, Ghe: gheList } = seatMapData;
    const totalCols = SoDoGhe.TongCot;

    // Group seats by row letter
    const seatsByRow = {};
    gheList.forEach((seat) => {
      const rowLetter = seat.TenGhe.charAt(0);
      if (!seatsByRow[rowLetter]) {
        seatsByRow[rowLetter] = [];
      }
      seatsByRow[rowLetter].push(seat);
    });

    // Sort each row's seats by column number
    Object.keys(seatsByRow).forEach((row) => {
      seatsByRow[row].sort((a, b) => {
        const colA = parseInt(a.TenGhe.substring(1), 10);
        const colB = parseInt(b.TenGhe.substring(1), 10);
        return colA - colB;
      });
    });

    const sortedRowKeys = Object.keys(seatsByRow).sort();

    return (
      <div className="w-full flex flex-col items-center">
        {/* Column numbers header */}
        <div className="flex gap-1.5 items-center justify-center mb-3 min-w-max px-4 shrink-0">
          <div className="w-8 shrink-0"></div>
          {Array.from({ length: totalCols }).map((_, idx) => (
            <div key={idx} className="w-9 h-6 flex items-center justify-center text-xs font-black text-gray-500 font-mono shrink-0">
              {idx + 1}
            </div>
          ))}
          <div className="w-8 shrink-0"></div>
        </div>

        {/* Seat grid rows */}
        <div className="flex flex-col gap-1.5 min-w-max px-4">
          {sortedRowKeys.map((rowLetter) => {
            const rowSeats = seatsByRow[rowLetter] || [];
            
            // Build columns mapping to detect aisles
            const colMap = {};
            rowSeats.forEach((seat) => {
              const colNum = parseInt(seat.TenGhe.substring(1), 10);
              colMap[colNum] = seat;
            });

            return (
              <div key={rowLetter} className="flex gap-1.5 items-center justify-center">
                <div className="w-8 text-center text-gray-400 font-black text-sm shrink-0 font-mono">
                  {rowLetter}
                </div>

                {Array.from({ length: totalCols }).map((_, idx) => {
                  const colNum = idx + 1;
                  const seat = colMap[colNum];

                  let isAisle = false;
                  if (SoDoGhe?.CauTruc) {
                    try {
                      const struct = typeof SoDoGhe.CauTruc === 'string' ? JSON.parse(SoDoGhe.CauTruc) : SoDoGhe.CauTruc;
                      const rIndex = rowLetter.charCodeAt(0) - 65;
                      const cIndex = colNum - 1;
                      isAisle = struct?.aisles?.cols?.includes(cIndex + 1) || struct?.aisles?.rows?.includes(rIndex + 1);
                      if (!isAisle && struct?.aisles?.custom) {
                        const customRow = struct.aisles.custom.find(item => item.row === rIndex);
                        if (customRow) {
                          isAisle = customRow.cols.includes(cIndex) || customRow.cols.includes(cIndex + 1);
                        }
                      }
                    } catch (e) {}
                  }

                  // Aisle gap if no seat is configured in this grid slot or it is defined as an aisle
                  if (!seat || isAisle) {
                    return (
                      <div key={`aisle-${rowLetter}-${colNum}`} className="w-9 h-9 shrink-0"></div>
                    );
                  }

                  const isSold = seat.TrangThai === "DA_DAT";
                  const isHeld = seat.TrangThai === "DANG_GIU";
                  const isSelected = selectedSeats.some(s => s.MaGheSuatChieu === seat.MaGheSuatChieu);
                  const isVIP = seat.TenLoaiGhe.toUpperCase().includes("VIP");
                  const isCouple = seat.TenLoaiGhe.toUpperCase().includes("ĐÔI") || seat.TenLoaiGhe.toUpperCase().includes("COUPLE");

                  // Seat icon styling classes matching staff design
                  let iconClass = "text-[#232B3A]";
                  let strokeClass = "stroke-slate-700/40";
                  let textClass = "text-slate-400 group-hover:text-white";

                  if (isVIP) {
                    iconClass = "text-[#18112C]";
                    strokeClass = "stroke-purple-500/70";
                    textClass = "text-purple-400 group-hover:text-purple-200";
                  }
                  if (isCouple) {
                    iconClass = "text-[#281123]";
                    strokeClass = "stroke-pink-500/60";
                    textClass = "text-pink-400 group-hover:text-pink-200";
                  }
                  if (isSelected) {
                    iconClass = "text-[#ff436e] filter drop-shadow-[0_0_8px_rgba(255,67,110,0.5)]";
                    strokeClass = "stroke-[#ff436e]";
                    textClass = "text-white font-black";
                  }
                  if (isSold) {
                    iconClass = "text-[#0E131F] opacity-30";
                    strokeClass = "stroke-slate-900/60 opacity-30";
                    textClass = "text-slate-700 font-medium opacity-30";
                  }
                  if (isHeld) {
                    iconClass = "text-[#2A160F] opacity-40";
                    strokeClass = "stroke-orange-900/40 opacity-40";
                    textClass = "text-orange-600/50 font-medium opacity-40";
                  }

                  return (
                    <button
                      key={seat.MaGheSuatChieu}
                      disabled={isSold || isHeld}
                      onClick={() => handleSeatClick(seat)}
                      className={`h-9 rounded transition-all duration-200 flex items-center justify-center shrink-0 relative group select-none border-0 bg-transparent
                        ${isCouple ? "w-[76px]" : "w-9"} 
                        ${isSold || isHeld ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"}
                      `}
                      title={`${seat.TenGhe} - ${seat.TenLoaiGhe} (${seat.GiaVeTinhToan.toLocaleString()}đ)`}
                    >
                      {isCouple ? (
                        <CoupleSeatIcon className={`absolute inset-0 w-full h-full ${iconClass}`} strokeClassName={strokeClass} />
                      ) : (
                        <SeatIcon className={`absolute inset-0 w-full h-full ${iconClass}`} strokeClassName={strokeClass} />
                      )}
                      
                      <span className={`relative z-10 text-[9px] font-black font-mono tracking-tighter transition-colors ${textClass}`}>
                        {seat.TenGhe}
                      </span>
                    </button>
                  );
                })}

                <div className="w-8 text-center text-gray-400 font-black text-sm shrink-0 font-mono">
                  {rowLetter}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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
          
          <SeatHoldIndicator />

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
                }} 
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-linear-to-r from-[#ff436e] to-[#e0325a] text-white shadow-[0_0_20px_rgba(255,67,110,0.4)]' 
                    : 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Clock size={16} />
                <span>{formatTime(slot.time || slot.GioChieu)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PHÒNG CHIẾU CHÍNH */}
      <div className="w-full flex flex-col items-center gap-8">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Chọn Ghế Ngồi</h2>
        
        {/* Screen indicator (curved screen frame) */}
        <div className="w-full max-w-2xl flex items-center justify-between shrink-0 select-none px-4 mt-2">
          <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black hidden md:inline">
            MÀN HÌNH CONG CAO CẤP
          </span>

          <div className="w-64 h-16 relative flex items-center justify-center mx-4">
            <div className="absolute inset-0 bg-[#ff436e]/5 rounded blur-md"></div>
            <div className="w-full h-full border border-[#ff436e]/30 rounded bg-[#131A2A]/40 flex items-center justify-center shadow-[inset_0_0_15px_rgba(255,67,110,0.1)] relative">
              <div className="absolute top-1 inset-x-4 h-1 border-t border-[#ff436e]/60 rounded-[100%] shadow-[0_-2px_6px_rgba(255,67,110,0.4)]"></div>
              <svg className="w-7 h-7 text-[#ff436e]/80 mt-1 filter drop-shadow-[0_0_6px_rgba(255,67,110,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="13" rx="2" />
                <path d="M12 16v5M9 21h6M9 8l5 3.5L9 15V8z" />
              </svg>
            </div>
          </div>

          <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black hidden md:inline">
            MÀN HÌNH CONG CAO CẤP
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-2 shrink-0 select-none max-w-2xl bg-white/5 py-4 px-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <SeatIcon className="w-6 h-6 text-[#232B3A]" strokeClassName="stroke-slate-700/40" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">CÒN TRỐNG</span>
          </div>
          <div className="flex items-center gap-2">
            <SeatIcon className="w-6 h-6 text-[#ff436e] filter drop-shadow-[0_0_8px_rgba(255,67,110,0.4)]" strokeClassName="stroke-[#ff436e]" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ĐANG CHỌN</span>
          </div>
          <div className="flex items-center gap-2 opacity-40">
            <SeatIcon className="w-6 h-6 text-[#0E131F]" strokeClassName="stroke-slate-900/60" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ĐÃ ĐẶT</span>
          </div>
          <div className="flex items-center gap-2 opacity-50">
            <SeatIcon className="w-6 h-6 text-[#2A160F]" strokeClassName="stroke-orange-900/40" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ĐANG GIỮ</span>
          </div>
          <div className="flex items-center gap-2">
            <SeatIcon className="w-6 h-6 text-[#18112C]" strokeClassName="stroke-purple-500/70" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">GHẾ VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <CoupleSeatIcon className="w-12 h-6 text-[#281123]" strokeClassName="stroke-pink-500/60" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">GHẾ ĐÔI</span>
          </div>
        </div>

        {/* Dynamic Seats Area */}
        <div className="w-full overflow-x-auto pb-4 rounded-xl flex justify-start lg:justify-center" style={{ scrollbarGutter: 'stable' }}>
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-20 min-w-[600px] w-full justify-center">
              <div className="w-12 h-12 border-4 border-[#ff436e] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-glow text-[#ff436e] text-sm uppercase font-bold tracking-widest">Đang tải sơ đồ ghế...</span>
            </div>
          ) : (
            renderSeatGrid()
          )}
        </div>

        {/* SUẤT CHIẾU & SỐ TIỀN ĐỘNG */}
        {selectedSeats.length > 0 && (
          <div className="w-full max-w-2xl bg-white/5 border border-white/5 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-left text-sm animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-4">
              <div className="w-10 h-10 bg-[#ff436e]/10 rounded-xl flex items-center justify-center text-[#ff436e]"><Clock size={18} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Suất Chiếu</p>
                <p className="text-white font-extrabold text-base mt-0.5">
                  {availableSlots[selectedSlotIndex] ? formatTime(availableSlots[selectedSlotIndex].time || availableSlots[selectedSlotIndex].GioChieu) : '00:00'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-4">
              <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400"><Armchair size={18} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ghế Đã Chọn</p>
                <p className="text-white font-extrabold text-base mt-0.5 truncate">
                  {selectedSeats.map(s => s.TenGhe).join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-0 md:pl-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400"><DollarSign size={18} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tổng Thanh Toán</p>
                <p className="text-green-400 font-black text-xl mt-0.5">{formatVND(calculateTotalAmount())}</p>
              </div>
            </div>
          </div>
        )}

        {/* NÚT TIẾP TỤC THANH TOÁN */}
        <button 
          disabled={selectedSeats.length === 0 || isHolding}
          onClick={handleConfirm}
          className={`bg-[#ff436e] hover:bg-[#e0325a] text-white font-extrabold px-10 py-3.5 rounded-full transition-all flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer ${
            (selectedSeats.length === 0 || isHolding) ? 'opacity-40 cursor-not-allowed shadow-none' : 'shadow-[0_0_30px_rgba(255,67,110,0.4)] active:scale-95'
          }`}
        >
          <span>{isHolding ? 'Đang xử lý...' : `Tiếp tục thanh toán (${selectedSeats.length} ghế)`}</span>
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default SeatSelection;
