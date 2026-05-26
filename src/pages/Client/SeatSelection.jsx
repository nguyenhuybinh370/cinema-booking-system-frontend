import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Armchair, DollarSign } from 'lucide-react';
import { formatVND } from '../../utils/formatHelper';
import { getSeatMap } from '../../api/bookingApi';
import toast from 'react-hot-toast';

const SeatSelection = ({ 
  maSuatChieu,
  availableSlots, 
  selectedSlotIndex, 
  setSelectedSlotIndex, 
  onBack, 
  formatTime,
  onConfirmBooking 
}) => {
  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // stores MaGheSuatChieu UUIDs
  const [holding, setHolding] = useState(false);

  const fetchSeatMap = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSeatMap(maSuatChieu);
      setSeatMap(data);
    } catch (err) {
      console.error("Lỗi khi lấy sơ đồ ghế:", err);
      setError(err?.message || "Không thể tải sơ đồ ghế. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (maSuatChieu) {
      fetchSeatMap();
      setSelectedSeats([]); // Reset selection on showtime change
    } else {
      setSeatMap(null);
      setLoading(false);
      setError("Không tìm thấy thông tin suất chiếu hợp lệ.");
    }
  }, [maSuatChieu]);

  const handleSeatClick = (seatId, isOccupied) => {
    if (isOccupied) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const calculateTotalAmount = () => {
    if (!seatMap || !Array.isArray(seatMap.Ghe)) return 0;
    return selectedSeats.reduce((total, seatId) => {
      const seat = seatMap.Ghe.find(g => g.MaGheSuatChieu === seatId);
      return total + (Number(seat?.GiaVeTinhToan) || 0);
    }, 0);
  };

  const getSelectedSeatNames = () => {
    if (!seatMap || !Array.isArray(seatMap.Ghe)) return '';
    return selectedSeats.map(seatId => {
      const seat = seatMap.Ghe.find(g => g.MaGheSuatChieu === seatId);
      return seat ? seat.TenGhe : '';
    }).filter(Boolean).sort().join(', ');
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) return;
    setHolding(true);
    try {
      await onConfirmBooking(selectedSeats);
    } catch (err) {
      console.error("Lỗi khi xác nhận đặt ghế:", err);
      toast.error(err?.message || "Lỗi giữ ghế! Vui lòng chọn lại.");
      // Reload seat map on failure
      fetchSeatMap();
      setSelectedSeats([]);
    } finally {
      setHolding(false);
    }
  };

  // Group seats by row character(s) from TenGhe (e.g. 'A' from 'A5')
  const groupedSeats = useMemo(() => {
    if (!seatMap || !Array.isArray(seatMap.Ghe)) return {};
    const grouped = {};
    seatMap.Ghe.forEach((seat) => {
      const rowMatch = seat.TenGhe.match(/^[a-zA-Z]+/);
      const row = rowMatch ? rowMatch[0] : 'Unknown';
      if (!grouped[row]) {
        grouped[row] = [];
      }
      grouped[row].push(seat);
    });

    // Sort rows alphabetically and sort seats in each row by SoThuTu ascending
    const sorted = {};
    Object.keys(grouped).sort().forEach((row) => {
      sorted[row] = grouped[row].sort((a, b) => a.SoThuTu - b.SoThuTu);
    });
    return sorted;
  }, [seatMap]);

  const sortedRows = useMemo(() => Object.keys(groupedSeats), [groupedSeats]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff436e]"></div>
        <p className="text-gray-400">Đang tải sơ đồ ghế...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-red-500 font-bold">{error}</p>
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl font-bold transition-all text-sm uppercase">
            Quay lại
          </button>
          <button onClick={fetchSeatMap} className="px-6 py-2 bg-[#ff436e] hover:bg-[#e0325a] rounded-xl font-bold transition-all text-sm uppercase">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
          
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-gray-400 mb-4 font-bold text-xs uppercase tracking-wider">
            <Clock size={16} />
            <span>Thời gian giữ ghế: 10 phút</span>
          </div>

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
          {sortedRows.map((row) => {
            const seatsInRow = groupedSeats[row];
            return (
              <div key={row} className="flex items-center gap-3 text-gray-500 font-bold text-xs">
                <span className="w-4 text-right opacity-60">{row}</span>
                
                <div className="flex items-center">
                  {seatsInRow.map((seat) => {
                    const seatId = seat.MaGheSuatChieu;
                    const isOccupied = seat.TrangThai === 'DA_DAT' || seat.TrangThai === 'DANG_GIU';
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <div key={seatId} className="flex items-center">
                        {seat.SoThuTu === 10 && row !== 'A' && row !== 'B' && <div className="w-8"></div>}
                        
                        <button
                          onClick={() => handleSeatClick(seatId, isOccupied)}
                          disabled={isOccupied || holding}
                          className={`w-7 h-7 sm:w-8 sm:h-8 m-0.5 rounded-md text-[9px] font-medium transition-all cursor-pointer ${
                            isOccupied
                              ? seat.TrangThai === 'DANG_GIU'
                                ? 'bg-yellow-600/30 border border-yellow-500/30 text-yellow-500/80 cursor-not-allowed'
                                : 'bg-red-950/40 border border-red-900/30 text-transparent cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#ff436e] border border-[#ff436e] text-white font-bold shadow-[0_0_15px_rgba(255,67,110,0.6)] scale-105'
                              : seat.TenLoaiGhe === 'VIP'
                              ? 'border border-yellow-500/35 bg-transparent text-yellow-500 hover:border-[#ff436e]/50 hover:text-white'
                              : 'border border-pink-500/15 bg-transparent text-gray-400 hover:border-[#ff436e]/50 hover:text-white'
                          }`}
                          title={`${seat.TenGhe} - ${seat.TenLoaiGhe} (${formatVND(seat.GiaVeTinhToan)})`}
                        >
                          {seat.SoThuTu}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* KHỐI THÔNG TIN SUẤT CHIẾU & SỐ TIỀN ĐỘNG */}
        {selectedSeats.length > 0 && seatMap && (
          <div className="w-full max-w-2xl bg-white/5 border border-white/5 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-left text-sm animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-4">
              <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-[#ff436e]"><Clock size={18} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Suất Chiếu</p>
                <p className="text-white font-extrabold text-base mt-0.5">
                  {seatMap.SuatChieu ? formatTime(seatMap.SuatChieu.GioChieu) : '00:00'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-4">
              <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400"><Armchair size={18} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ghế Đã Chọn</p>
                <p className="text-white font-extrabold text-base mt-0.5 truncate">{getSelectedSeatNames()}</p>
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
          disabled={selectedSeats.length === 0 || holding}
          onClick={handleConfirm}
          className={`bg-[#ff436e] hover:bg-[#e0325a] text-white font-extrabold px-10 py-3.5 rounded-full transition-all flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer ${
            (selectedSeats.length === 0 || holding) ? 'opacity-40 cursor-not-allowed shadow-none' : 'shadow-[0_0_30px_rgba(255,67,110,0.4)] active:scale-95'
          }`}
        >
          <span>{holding ? 'Đang thực hiện giữ ghế...' : `Tiếp tục thanh toán (${selectedSeats.length} ghế)`}</span>
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default SeatSelection;