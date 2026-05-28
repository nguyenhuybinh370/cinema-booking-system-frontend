import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import { Lock, Unlock, ChevronLeft, Save } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toastHelper';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';

const SeatMaps = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [template, setTemplate] = useState(null);
  const [seatTypes, setSeatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overrides, setOverrides] = useState({}); // { seatId: { MaLoaiGhe, KhaDung } }
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomData, typesData] = await Promise.all([
          adminService.getRoomById(roomId),
          adminService.getSeatTypes()
        ]);
        
        if (!ignore && roomData) {
          setRoom(roomData);
          setSeatTypes(typesData);
          
          // Fetch current seats from backend
          const seatsData = await adminService.getSeatsByRoom(roomId);
          const initialOverrides = {};
          seatsData.forEach(seat => {
            const seatKey = `${roomData.MaPhongChieu}-${seat.ViTriDay}${seat.ViTriCot}`;
            initialOverrides[seatKey] = {
              MaGhe: seat.MaGhe,
              MaLoaiGhe: seat.MaLoaiGhe,
              KhaDung: seat.KhaDung
            };
          });
          setOverrides(initialOverrides);
          
          const templateData = await adminService.getSeatMapByRoomId(roomId);
          if (!ignore) {
            setTemplate(templateData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch seat map data:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, [roomId]);

  // Generate matrix based on template and overrides
  const matrix = useMemo(() => {
    if (!template || !room) return [];
    const rows = template.TongHang;
    const cols = template.TongCot;
    const result = [];

    let struct = { aisles: { rows: [], cols: [] } };
    if (template.CauTruc) {
      try {
        struct = typeof template.CauTruc === 'string' ? JSON.parse(template.CauTruc) : template.CauTruc;
      } catch (e) {
        console.error("JSON Parse error", e);
      }
    }
    
    for (let r = 0; r < rows; r++) {
      const row = [];
      const rowChar = String.fromCharCode(65 + r);
      for (let c = 0; c < cols; c++) {
        let isAisle = struct?.aisles?.cols?.includes(c + 1) || struct?.aisles?.rows?.includes(r + 1);
        if (!isAisle && struct?.aisles?.custom) {
          const customRow = struct.aisles.custom.find(item => item.row === r);
          if (customRow) {
            isAisle = customRow.cols.includes(c) || customRow.cols.includes(c + 1);
          }
        }

        const seatId = `${room.MaPhongChieu}-${rowChar}${c + 1}`;
        const baseSeat = {
          MaChiTietSoDo: seatId,
          MaSoDoGhe: room.MaSoDoGhe,
          MaLoaiGhe: seatTypes[0]?.MaLoaiGhe || 'LG01',
          Hang: rowChar,
          Cot: c + 1,
          KhaDung: 1,
          isAisle
        };
        // Apply overrides
        row.push({ ...baseSeat, ...(overrides[seatId] || {}) });
      }
      result.push(row);
    }
    return result;
  }, [template, room, overrides, seatTypes]);

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
    const newOverrides = { ...overrides };
    selectedSeats.forEach(id => {
      newOverrides[id] = { ...(newOverrides[id] || {}), ...updates };
    });
    setOverrides(newOverrides);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await adminService.saveSeatConfig(roomId, overrides);
      showSuccess("Cấu hình sơ đồ ghế đã được lưu thành công!");
    } catch (error) {
      showError("Lỗi khi lưu cấu hình: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeatColor = (typeId, khaDung) => {
    if (khaDung === 0) return 'bg-slate-800 border-slate-700 text-slate-600 shadow-inner';
    const type = seatTypes.find(t => t.MaLoaiGhe === typeId);
    const typeName = type?.TenLoaiGhe || '';
    if (typeName.includes('VIP')) {
      return 'bg-amber-500 border-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]';
    }
    if (typeName.includes('Sweetbox')) {
      return 'bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]';
    }
    return 'bg-slate-700 border-slate-600 text-slate-300';
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-white animate-pulse font-bold tracking-widest text-sm">ĐANG TẢI SƠ ĐỒ...</div>
      </div>
    </AdminLayout>
  );

  if (!room || !template) return (
    <AdminLayout>
      <div className="text-white p-8">Phòng không tồn tại hoặc chưa cấu hình sơ đồ.</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title={`Cấu hình: ${room.TenPhong}`}
        subtitle={`Sơ đồ gốc: ${template.MaSoDoGhe} (${template.TongHang}x${template.TongCot})`}
        backPath="/admin/rooms"
        action={
          <button 
            onClick={handleSave}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs"
          >
            <Save size={18} />
            Lưu cấu hình
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Toolbox */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Chỉnh sửa vùng chọn</h3>
            <p className="text-[10px] text-slate-500 mb-4 italic leading-relaxed">Giữ Shift để chọn nhiều ghế cùng lúc.</p>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại ghế</label>
                <div className="grid grid-cols-1 gap-2">
                  {seatTypes.map(type => (
                    <button
                      key={type.MaLoaiGhe}
                      onClick={() => updateSelectedSeats({ MaLoaiGhe: type.MaLoaiGhe })}
                      disabled={selectedSeats.length === 0}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all group cursor-pointer"
                    >
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white">{type.TenLoaiGhe}</span>
                      <div className={`w-4 h-4 rounded ${getSeatColor(type.MaLoaiGhe, 1)} border border-white/10`}></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái vận hành</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSelectedSeats({ KhaDung: 0 })}
                    disabled={selectedSeats.length === 0}
                    className="flex-grow flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Lock size={14} />
                    <span className="text-[10px] font-black uppercase">Khóa</span>
                  </button>
                  <button
                    onClick={() => updateSelectedSeats({ KhaDung: 1 })}
                    disabled={selectedSeats.length === 0}
                    className="flex-grow flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Unlock size={14} />
                    <span className="text-[10px] font-black uppercase">Mở</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Stats */}
          {selectedSeats.length > 0 && (
            <div className="bg-white/[0.04] border border-red-500/20 rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-4">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Đang chọn</span>
              <div className="mt-2 text-2xl font-black text-white">{selectedSeats.length} <span className="text-sm font-bold text-slate-500">ghế</span></div>
            </div>
          )}
        </div>

        {/* Matrix Canvas */}
        <div className="lg:col-span-9">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center shadow-2xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-40 bg-red-500/5 blur-[100px]"></div>

            {/* Screen */}
            <div className="w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent rounded-full mb-24 relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-600">Screen</span>
                <div className="w-40 h-px bg-white/5 mt-2"></div>
              </div>
            </div>

            <div 
              className="inline-grid gap-2 p-8 bg-black/40 rounded-[2rem] border border-white/5 overflow-auto max-w-full custom-scrollbar" 
              style={{ gridTemplateColumns: `repeat(${template.TongCot}, minmax(0, 1fr))` }}
            >
              {matrix.flat().map((seat) => {
                if (seat.isAisle) {
                  return (
                    <div key={seat.MaChiTietSoDo} className="w-9 h-9 shrink-0"></div>
                  );
                }
                return (
                  <button
                    key={seat.MaChiTietSoDo}
                    onClick={(e) => handleSeatClick(seat.MaChiTietSoDo, e)}
                    className={`
                      w-9 h-9 rounded-md border text-[9px] font-black transition-all cursor-pointer
                      flex items-center justify-center relative group/seat
                      ${getSeatColor(seat.MaLoaiGhe, seat.KhaDung)}
                      ${selectedSeats.includes(seat.MaChiTietSoDo) ? 'ring-2 ring-red-500 ring-offset-4 ring-offset-[#0b0f19] scale-110 z-10 shadow-2xl' : 'hover:scale-105'}
                    `}
                  >
                    {seat.KhaDung === 0 ? <Lock size={12} className="opacity-50" /> : `${seat.Hang}${seat.Cot}`}
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0a0d14] rounded text-[8px] text-white opacity-0 group-hover/seat:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none border border-white/10">
                      Hàng {seat.Hang} - Cột {seat.Cot}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-slate-700 border border-slate-600"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thường</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-amber-500 border border-amber-400"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VIP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-rose-500 border border-rose-400"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sweetbox</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Lock size={10} className="text-slate-600" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đã Khóa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SeatMaps;
