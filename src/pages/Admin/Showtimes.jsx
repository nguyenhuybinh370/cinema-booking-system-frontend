import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import adminService from '../../services/adminService';
import { 
  List, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Edit2,
  Trash2,
  LayoutGrid,
  Eye,
  DollarSign
} from 'lucide-react';

const Showtimes = () => {
  const [viewMode, setViewMode] = useState('List'); // 'List' or 'Timeline'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-05-22');
  
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [dayTypes, setDayTypes] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Seat map viewer state
  const [selectedShowtimeSeats, setSelectedShowtimeSeats] = useState(null);

  // Edit showtime state
  const [editingShowtime, setEditingShowtime] = useState(null);

  const [formData, setFormData] = useState({
    MaPhim: '',
    MaPhongChieu: '',
    NgayChieu: '2026-05-22',
    GioChieu: '09:00',
    GioKetThuc: '',
    MaLoaiNgay: '',
    GiaVeCoBan: 85000,
    KhaDung: 1
  });

  const loadData = async () => {
    try {
      const [moviesData, roomsData, dayTypesData, showtimesData] = await Promise.all([
        adminService.getMovies(),
        adminService.getRooms(),
        adminService.getDayTypes(),
        adminService.getShowtimes()
      ]);
      setMovies(moviesData.filter(m => m.KhaDung === 1));
      setRooms(roomsData.filter(r => r.KhaDung === 1));
      setDayTypes(dayTypesData.filter(d => d.KhaDung === 1));
      setShowtimes(showtimesData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load showtimes data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateEndTime = (movieId, startTimeStr) => {
    if (!movieId || !startTimeStr) return '';
    const movie = movies.find(m => m.MaPhim === movieId);
    if (!movie) return '';
    
    const duration = movie.ThoiLuong; // in minutes
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    const startTotalMinutes = hours * 60 + minutes;
    const endTotalMinutes = startTotalMinutes + duration;
    
    const endHours = Math.floor(endTotalMinutes / 60) % 24;
    const endMins = endTotalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const handleFormChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (field === 'MaPhim' || field === 'GioChieu') {
      updated.GioKetThuc = calculateEndTime(updated.MaPhim, updated.GioChieu);
    }
    setFormData(updated);
  };

  // Check conflict logic (Derived State)
  const conflict = (() => {
    if (!isModalOpen) return null;
    const { MaPhongChieu, NgayChieu, GioChieu, GioKetThuc, KhaDung } = formData;
    if (!MaPhongChieu || !NgayChieu || !GioChieu || !GioKetThuc || parseInt(KhaDung, 10) !== 1) return null;

    const tStart = GioChieu.length === 5 ? `${GioChieu}:00` : GioChieu;
    const tEnd = GioKetThuc.length === 5 ? `${GioKetThuc}:00` : GioKetThuc;

    const isConflict = showtimes.some(st => 
      st.MaSuatChieu !== (editingShowtime?.MaSuatChieu || '') &&
      st.MaPhongChieu === MaPhongChieu && 
      st.NgayChieu === NgayChieu && 
      st.KhaDung === 1 &&
      ((tStart < st.GioKetThuc && tEnd > st.GioChieu))
    );
    
    if (isConflict) {
      const conflictShow = showtimes.find(st => 
        st.MaSuatChieu !== (editingShowtime?.MaSuatChieu || '') &&
        st.MaPhongChieu === MaPhongChieu && 
        st.NgayChieu === NgayChieu && 
        st.KhaDung === 1 &&
        ((tStart < st.GioKetThuc && tEnd > st.GioChieu))
      );
      return `Phòng này đã có lịch chiếu từ ${conflictShow?.GioChieu.substring(0, 5)} đến ${conflictShow?.GioKetThuc.substring(0, 5)} cho phim "${conflictShow?.TenPhim}".`;
    }
    return null;
  })();

  const openAddModal = () => {
    setEditingShowtime(null);
    const defaultMovieId = movies[0]?.MaPhim || '';
    const defaultRoomId = rooms[0]?.MaPhongChieu || '';
    const defaultDayTypeId = dayTypes[0]?.MaLoaiNgay || '';
    const defaultDate = selectedDate || '2026-05-22';
    const defaultStartTime = '09:00';
    
    setFormData({
      MaPhim: defaultMovieId,
      MaPhongChieu: defaultRoomId,
      NgayChieu: defaultDate,
      GioChieu: defaultStartTime,
      GioKetThuc: calculateEndTime(defaultMovieId, defaultStartTime),
      MaLoaiNgay: defaultDayTypeId,
      GiaVeCoBan: 85000,
      KhaDung: 1
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (st) => {
    if (st.DaDat > 0) {
      alert(`Không thể sửa suất chiếu ${st.MaSuatChieu} vì đã có ${st.DaDat} ghế đã được khách hàng đặt/giữ (Bảng GHE_SUATCHIEU)!`);
      return;
    }
    setEditingShowtime(st);
    setFormData({
      MaPhim: st.MaPhim,
      MaPhongChieu: st.MaPhongChieu,
      NgayChieu: st.NgayChieu,
      GioChieu: st.GioChieu.substring(0, 5),
      GioKetThuc: st.GioKetThuc.substring(0, 5),
      MaLoaiNgay: st.MaLoaiNgay,
      GiaVeCoBan: st.GiaVeCoBan,
      KhaDung: st.KhaDung
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (st) => {
    if (st.DaDat > 0) {
      alert(`Không thể xóa suất chiếu ${st.MaSuatChieu} vì đã có ${st.DaDat} ghế đã được khách hàng đặt/giữ (Bảng GHE_SUATCHIEU / CHITIETDATVE)!`);
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa suất chiếu ${st.MaSuatChieu} của phim "${st.TenPhim}"?`)) {
      try {
        await adminService.deleteShowtime(st.MaSuatChieu);
        alert("Xóa suất chiếu khỏi hệ thống thành công!");
        await loadData();
      } catch (error) {
        alert("Lỗi khi xóa suất chiếu: " + error.message);
      }
    }
  };

  const handleSaveShowtime = async (e) => {
    e.preventDefault();
    if (conflict) return;
    setSubmitting(true);
    try {
      if (editingShowtime) {
        await adminService.updateShowtime(editingShowtime.MaSuatChieu, {
          ...formData,
          KhaDung: parseInt(formData.KhaDung, 10),
          GiaVeCoBan: parseFloat(formData.GiaVeCoBan)
        });
        alert("Cập nhật thông tin suất chiếu thành công!");
      } else {
        await adminService.addShowtime({
          ...formData,
          KhaDung: parseInt(formData.KhaDung, 10),
          GiaVeCoBan: parseFloat(formData.GiaVeCoBan)
        });
        alert("Thêm suất chiếu mới và khởi tạo danh sách ghế thành công!");
      }
      setIsModalOpen(false);
      setEditingShowtime(null);
      await loadData();
    } catch (error) {
      alert("Lỗi khi lưu suất chiếu: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const viewSeatMap = async (st) => {
    try {
      const seats = await adminService.getShowtimeSeats(st.MaSuatChieu);
      setSelectedShowtimeSeats({ showtime: st, seats });
    } catch (error) {
      alert("Lỗi tải thông tin ghế: " + error.message);
    }
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().substring(0, 10));
  };
  
  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().substring(0, 10));
  };

  const timeSlots = Array.from({ length: 30 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const min = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${min}`;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Group seats by row for visual grid mapping
  const renderSeatsGrid = () => {
    if (!selectedShowtimeSeats) return null;
    const { seats } = selectedShowtimeSeats;

    const rowsMap = {};
    seats.forEach(seat => {
      const parts = seat.MaGhe.split('-');
      const coord = parts[1] || 'A1';
      const row = coord.match(/[A-Z]+/)[0];
      const col = parseInt(coord.match(/\d+/)[0], 10);
      if (!rowsMap[row]) rowsMap[row] = [];
      rowsMap[row].push({ ...seat, col });
    });

    Object.keys(rowsMap).forEach(r => {
      rowsMap[r].sort((a, b) => a.col - b.col);
    });

    const getSeatColor = (status, khaDung) => {
      if (khaDung === 0) return 'bg-slate-800 border-slate-900 text-slate-600 shadow-inner cursor-not-allowed';
      if (status === 1) return 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      if (status === 2) return 'bg-amber-500 border-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30';
    };

    return (
      <div className="flex flex-col items-center py-6 bg-black/40 rounded-3xl border border-white/5 overflow-x-auto">
        <div className="w-full max-w-xl h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent rounded-full mb-12 relative shrink-0">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.6em] text-slate-500">MÀN HÌNH</div>
        </div>
        <div className="space-y-2 px-6">
          {Object.keys(rowsMap).sort().map(rowName => (
            <div key={rowName} className="flex gap-2 items-center justify-center">
              <span className="w-6 text-xs font-black text-slate-600 font-mono text-center">{rowName}</span>
              <div className="flex gap-2">
                {rowsMap[rowName].map(seat => {
                  const label = seat.MaGhe.split('-')[1];
                  return (
                    <div
                      key={seat.MaGheSuatChieu}
                      title={`Ghế: ${label} | Trạng thái: ${seat.TrangThai === 0 ? 'Trống' : seat.TrangThai === 1 ? 'Đã đặt' : 'Đang giữ'} | ${seat.KhaDung === 1 ? 'Khả dụng' : 'Bị khóa'}`}
                      className={`w-8 h-8 rounded border text-[9px] font-black flex items-center justify-center transition-all ${getSeatColor(seat.TrangThai, seat.KhaDung)}`}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
              <span className="w-6 text-xs font-black text-slate-600 font-mono text-center">{rowName}</span>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] uppercase font-black tracking-wider text-slate-400 border-t border-white/5 pt-6 w-full px-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30"></div>
            <span>Trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500 border border-amber-400"></div>
            <span>Đang giữ (2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500 border border-red-400"></div>
            <span>Đã bán/Đã đặt (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-800 border border-slate-900"></div>
            <span>Bị khóa / Không khả dụng</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mr-4"></div>
          Đang tải dữ liệu suất chiếu...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Quản lý suất chiếu</h1>
          <p className="text-slate-500 font-medium">Lên lịch chiếu phim, phân bổ phòng chiếu và thiết lập giá vé cơ bản.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setViewMode('List')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'List' ? 'bg-white/10 text-white font-bold' : 'text-slate-500'}`}
              title="Xem danh sách"
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('Timeline')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'Timeline' ? 'bg-white/10 text-white font-bold' : 'text-slate-500'}`}
              title="Xem lịch chiếu (Timeline)"
            >
              <CalendarIcon size={20} />
            </button>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer text-sm"
          >
            <Plus size={20} />
            Thêm suất chiếu
          </button>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'Timeline' ? (
        <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8 overflow-x-auto shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrevDay} 
                className="p-2 hover:bg-white/5 text-white hover:text-red-500 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft size={20}/>
              </button>
              <span className="text-xl font-black text-white font-mono">{selectedDate}</span>
              <button 
                onClick={handleNextDay} 
                className="p-2 hover:bg-white/5 text-white hover:text-red-500 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight size={20}/>
              </button>
            </div>
          </div>

          <div className="relative min-w-[1000px]">
            {/* Header Row (Rooms) */}
            <div className="grid grid-cols-12 border-b border-white/5">
              <div className="col-span-2 border-r border-white/5 py-4"></div>
              {rooms.map(room => (
                <div key={room.MaPhongChieu} className="col-span-3 text-center py-4 font-bold text-slate-400 text-sm uppercase tracking-widest">{room.TenPhong}</div>
              ))}
            </div>

            {/* Content Rows (Time) */}
            <div className="relative h-[800px]">
               {/* Time grid lines */}
               {timeSlots.map((time, idx) => (
                 <div key={time} className="absolute w-full h-px bg-white/[0.02]" style={{ top: `${idx * 40}px` }}>
                   <span className="absolute -top-3 left-0 text-[10px] font-mono text-slate-600">{time}</span>
                 </div>
               ))}

               {/* Showtime Blocks */}
               {rooms.map((room, roomIdx) => (
                 <div key={room.MaPhongChieu} className="absolute h-full border-r border-white/5" style={{ left: `${(roomIdx * 25) + 16.66}%`, width: '25%' }}>
                   {showtimes
                     .filter(st => st.MaPhongChieu === room.MaPhongChieu && st.NgayChieu === selectedDate && st.KhaDung === 1)
                     .map(st => {
                       const startMins = parseInt(st.GioChieu.split(':')[0]) * 60 + parseInt(st.GioChieu.split(':')[1]);
                       const endMins = parseInt(st.GioKetThuc.split(':')[0]) * 60 + parseInt(st.GioKetThuc.split(':')[1]);
                       const baseMins = 8 * 60; // 08:00
                       const top = (startMins - baseMins) * (40 / 30);
                       const height = (endMins - startMins) * (40 / 30);

                       return (
                         <div 
                           key={st.MaSuatChieu} 
                           onClick={() => viewSeatMap(st)}
                           className="absolute left-4 right-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex flex-col justify-between group hover:bg-red-500/20 transition-all cursor-pointer overflow-hidden"
                           style={{ top: `${top}px`, height: `${height}px` }}
                         >
                           <div>
                              <h4 className="text-xs font-black text-white line-clamp-2 uppercase leading-tight">{st.TenPhim}</h4>
                              <p className="text-[10px] text-red-400 font-black font-mono mt-1">{st.GioChieu.substring(0, 5)} - {st.GioKetThuc.substring(0, 5)}</p>
                           </div>
                           <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[9px] text-slate-400 font-bold uppercase">{st.TenLoaiNgay}</span>
                              <span className="text-[9px] text-emerald-400 font-bold font-mono">Đã bán: {st.DaDat}</span>
                           </div>
                         </div>
                       );
                     })}
                 </div>
               ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Mã suất</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Phim</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Phòng</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Thời gian</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Vé cơ bản</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Loại ngày</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Ghế đặt</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {showtimes.map(st => (
                <tr key={st.MaSuatChieu} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-red-500">{st.MaSuatChieu}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-12 rounded bg-slate-800 shrink-0 overflow-hidden">
                        <img src={st.HinhAnh} className="w-full h-full object-cover" alt="Poster" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm line-clamp-1">{st.TenPhim}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{st.ThoiLuong} phút</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-300">{st.TenPhong}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white font-mono">{st.GioChieu.substring(0, 5)} - {st.GioKetThuc.substring(0, 5)}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{st.NgayChieu}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-200 font-mono">{formatPrice(st.GiaVeCoBan)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">{st.TenLoaiNgay}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => viewSeatMap(st)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black hover:bg-emerald-500/20 cursor-pointer"
                    >
                      <Eye size={12} />
                      <span className="font-mono">{st.DaDat} / {st.TongSoGhe}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                      st.KhaDung === 1 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {st.KhaDung === 1 ? 'Khả dụng' : 'Khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => viewSeatMap(st)}
                        className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                        title="Xem sơ đồ ghế thực tế"
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditClick(st)}
                        className="p-2 hover:bg-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all cursor-pointer"
                        title="Sửa suất chiếu"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(st)}
                        className="p-2 hover:bg-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                        title="Xóa suất chiếu"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Showtime Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingShowtime(null);
        }} 
        title={editingShowtime ? `Cập nhật suất chiếu ${editingShowtime.MaSuatChieu}` : "Thêm suất chiếu mới"}
      >
        <form onSubmit={handleSaveShowtime} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chọn phim (MaPhim)</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300 font-bold"
              value={formData.MaPhim}
              onChange={e => handleFormChange('MaPhim', e.target.value)}
            >
              {movies.map(movie => <option key={movie.MaPhim} value={movie.MaPhim} className="bg-[#0f1117]">{movie.TenPhim} ({movie.ThoiLuong} phút)</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phòng chiếu (MaPhongChieu)</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300 font-bold"
                value={formData.MaPhongChieu}
                onChange={e => handleFormChange('MaPhongChieu', e.target.value)}
              >
                {rooms.map(room => <option key={room.MaPhongChieu} value={room.MaPhongChieu} className="bg-[#0f1117]">{room.TenPhong}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loại ngày (MaLoaiNgay)</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300 font-bold"
                value={formData.MaLoaiNgay}
                onChange={e => handleFormChange('MaLoaiNgay', e.target.value)}
              >
                {dayTypes.map(day => <option key={day.MaLoaiNgay} value={day.MaLoaiNgay} className="bg-[#0f1117]">{day.TenLoaiNgay}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày chiếu</label>
              <input 
                type="date" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white font-mono font-bold"
                value={formData.NgayChieu}
                onChange={e => handleFormChange('NgayChieu', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giờ chiếu</label>
              <input 
                type="time" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white font-mono font-bold"
                value={formData.GioChieu}
                onChange={e => handleFormChange('GioChieu', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest opacity-60">Giờ kết thúc</label>
              <input 
                type="time" 
                readOnly
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none text-sm text-slate-500 font-mono font-bold"
                value={formData.GioKetThuc}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giá vé cơ bản (VND)</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-red-500 transition-all text-sm text-white font-mono font-bold"
                  value={formData.GiaVeCoBan}
                  onChange={e => handleFormChange('GiaVeCoBan', e.target.value)}
                />
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Khả dụng (KhaDung)</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm text-slate-300 font-bold"
                value={formData.KhaDung}
                onChange={e => handleFormChange('KhaDung', parseInt(e.target.value, 10))}
              >
                <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
                <option value={0} className="bg-[#0f1117]">0 (Khóa / Không khả dụng)</option>
              </select>
            </div>
          </div>

          {editingShowtime && (
            <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
              <div>Ngày tạo: {editingShowtime.NgayTao || '--:--'}</div>
              <div>Ngày cập nhật: {editingShowtime.NgayCapNhat || 'Chưa cập nhật'}</div>
            </div>
          )}

          {conflict && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-500">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-xs font-bold">⚠️ {conflict}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingShowtime(null);
              }} 
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest text-slate-400 cursor-pointer"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={!!conflict || submitting}
              className={`flex-grow py-3 rounded-xl font-bold transition-all shadow-lg text-xs uppercase tracking-widest cursor-pointer ${
                conflict || submitting
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
              }`}
            >
              {submitting ? 'Đang lưu...' : 'Lưu suất chiếu'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Seat Map Viewer Modal */}
      <Modal
        isOpen={selectedShowtimeSeats !== null}
        onClose={() => setSelectedShowtimeSeats(null)}
        title={`Sơ đồ đặt ghế thực tế: Suất ${selectedShowtimeSeats?.showtime.MaSuatChieu}`}
      >
        {selectedShowtimeSeats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-xs font-bold bg-white/5 border border-white/5 p-4 rounded-2xl">
              <div>
                <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Phim</span>
                <span className="text-white text-sm">{selectedShowtimeSeats.showtime.TenPhim}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Phòng chiếu</span>
                <span className="text-white text-sm">{selectedShowtimeSeats.showtime.TenPhong}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Ngày chiếu</span>
                <span className="text-white font-mono">{selectedShowtimeSeats.showtime.NgayChieu}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase text-[10px] tracking-widest">Giờ chiếu</span>
                <span className="text-white font-mono">{selectedShowtimeSeats.showtime.GioChieu.substring(0, 5)} - {selectedShowtimeSeats.showtime.GioKetThuc.substring(0, 5)}</span>
              </div>
            </div>

            {renderSeatsGrid()}

            <div className="flex pt-4">
              <button 
                type="button" 
                onClick={() => setSelectedShowtimeSeats(null)} 
                className="flex-grow py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-all text-xs uppercase tracking-widest text-white border border-white/5 cursor-pointer text-center"
              >
                Đóng sơ đồ
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Showtimes;
