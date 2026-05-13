import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { ROOMS, SEAT_TYPES } from '../../constants/adminMockData';
import { Lock, Unlock, MousePointer2 } from 'lucide-react';

const SeatMaps = () => {
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0].id);
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(10);
  const [matrix, setMatrix] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Generate matrix
  const generateMatrix = () => {
    const newMatrix = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      const rowChar = String.fromCharCode(65 + r); // A, B, C...
      for (let c = 0; c < cols; c++) {
        row.push({
          id: `${rowChar}${c + 1}`,
          type: 'Normal',
          isLocked: false,
          row: rowChar,
          col: c + 1
        });
      }
      newMatrix.push(row);
    }
    setMatrix(newMatrix);
    setSelectedSeats([]);
  };

  useEffect(() => {
    generateMatrix();
  }, []);

  const handleSeatClick = (seatId, e) => {
    if (e.shiftKey) {
      if (selectedSeats.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    } else {
      setSelectedSeats([seatId]);
    }
  };

  const updateSelectedSeats = (updates) => {
    const newMatrix = matrix.map(row => 
      row.map(seat => 
        selectedSeats.includes(seat.id) ? { ...seat, ...updates } : seat
      )
    );
    setMatrix(newMatrix);
  };

  const getSeatColor = (type, isLocked) => {
    if (isLocked) return 'bg-slate-800 border-slate-700 text-slate-600';
    switch (type) {
      case 'VIP': return 'bg-amber-500 border-amber-400 text-navy-deep';
      case 'Sweetbox': return 'bg-rose-500 border-rose-400 text-white';
      default: return 'bg-slate-700 border-slate-600 text-slate-300';
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cấu hình sơ đồ ghế</h1>
          <p className="text-slate-500">Số hóa sơ đồ ghế ngồi và phân loại hạng ghế.</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500"
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
          >
            {ROOMS.map(room => (
              <option key={room.id} value={room.id} className="bg-[#0f1117]">{room.name}</option>
            ))}
          </select>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
            Lưu sơ đồ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Config Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0f1117] border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 text-white border-l-4 border-red-500 pl-4">Cấu hình lưới</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-grow space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Số hàng</label>
                  <input 
                    type="number" 
                    value={rows} 
                    onChange={e => setRows(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div className="flex-grow space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Số cột</label>
                  <input 
                    type="number" 
                    value={cols} 
                    onChange={e => setCols(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm("Tạo lại sơ đồ sẽ xóa cấu hình ghế hiện tại. Tiếp tục?")) {
                    generateMatrix();
                  }
                }}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold transition-all text-xs uppercase tracking-widest"
              >
                Tạo ma trận mới
              </button>
            </div>
          </div>

          <div className="bg-[#0f1117] border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 text-white border-l-4 border-amber-500 pl-4">Chỉnh sửa vùng chọn</h3>
            <p className="text-xs text-slate-500 mb-4 italic">Giữ Shift để chọn nhiều ghế</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phân loại hạng ghế</label>
                <div className="grid grid-cols-1 gap-2">
                  {SEAT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => updateSelectedSeats({ type: type.id })}
                      disabled={selectedSeats.length === 0}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <span className="text-sm font-medium">{type.name}</span>
                      <div className={`w-4 h-4 rounded ${getSeatColor(type.id, false)} border`}></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trạng thái vật lý</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSelectedSeats({ isLocked: true })}
                    disabled={selectedSeats.length === 0}
                    className="flex-grow flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 disabled:opacity-50 transition-all"
                  >
                    <Lock size={16} />
                    <span className="text-xs font-bold uppercase">Khóa</span>
                  </button>
                  <button
                    onClick={() => updateSelectedSeats({ isLocked: false })}
                    disabled={selectedSeats.length === 0}
                    className="flex-grow flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 disabled:opacity-50 transition-all"
                  >
                    <Unlock size={16} />
                    <span className="text-xs font-bold uppercase">Mở</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="lg:col-span-3">
          <div className="bg-[#0f1117] border border-white/5 rounded-[3rem] p-12 flex flex-col items-center">
            {/* Screen indicator */}
            <div className="w-2/3 h-2 bg-gradient-to-b from-slate-700 to-transparent rounded-full mb-20 relative">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Màn Hình</span>
            </div>

            <div className="inline-grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {matrix.flat().map((seat) => (
                <button
                  key={seat.id}
                  onClick={(e) => handleSeatClick(seat.id, e)}
                  className={`
                    w-10 h-10 rounded-lg border text-[10px] font-bold transition-all
                    flex items-center justify-center relative
                    ${getSeatColor(seat.type, seat.isLocked)}
                    ${selectedSeats.includes(seat.id) ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f1117] scale-110 z-10 shadow-2xl' : ''}
                    hover:scale-105
                  `}
                >
                  {seat.isLocked ? <Lock size={12} /> : seat.id}
                  {selectedSeats.includes(seat.id) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-navy-deep rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-20 flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-700 border border-slate-600"></div>
                <span>Ghế thường</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500 border border-amber-400"></div>
                <span>Ghế VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-rose-500 border border-rose-400"></div>
                <span>Sweetbox</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Lock size={8} />
                </div>
                <span>Ghế hỏng/Khóa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SeatMaps;
