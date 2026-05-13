import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import adminService from '../../services/adminService';
import { List, Calendar as CalendarIcon, AlertCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Showtimes = () => {
  const [viewMode, setViewMode] = useState('Timeline'); // 'List' or 'Timeline'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate] = useState('2024-05-13');
  
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [dayTypes, setDayTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock showtimes (In a real app, this would be in adminService)
  const [showtimes, setShowtimes] = useState([
    { MaSuatChieu: 'ST01', MaPhim: 'M01', MaPhongChieu: 'PC01', NgayChieu: '2024-05-13', GioChieu: '09:00', GioKetThuc: '11:07', MaLoaiNgay: 'LN01', GiaVeCoBan: 85000 },
    { MaSuatChieu: 'ST02', MaPhim: 'M02', MaPhongChieu: 'PC01', NgayChieu: '2024-05-13', GioChieu: '12:00', GioKetThuc: '14:40', MaLoaiNgay: 'LN01', GiaVeCoBan: 85000 },
    { MaSuatChieu: 'ST03', MaPhim: 'M01', MaPhongChieu: 'PC02', NgayChieu: '2024-05-13', GioChieu: '10:30', GioKetThuc: '12:37', MaLoaiNgay: 'LN01', GiaVeCoBan: 85000 },
  ]);

  const [formData, setFormData] = useState({
    MaPhim: 'M01',
    MaPhongChieu: 'PC01',
    NgayChieu: '2024-05-13',
    GioChieu: '15:00',
    GioKetThuc: '17:07',
    MaLoaiNgay: 'LN01',
    GiaVeCoBan: 85000
  });

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const [moviesData, roomsData, dayTypesData] = await Promise.all([
        adminService.getMovies(),
        adminService.getRooms(),
        adminService.getDayTypes()
      ]);
      if (!ignore) {
        setMovies(moviesData);
        setRooms(roomsData);
        setDayTypes(dayTypesData);
        setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, []);

  // Check conflict logic (Derived State)
  const conflict = (() => {
    const isConflict = showtimes.some(st => 
      st.MaPhongChieu === formData.MaPhongChieu && 
      st.NgayChieu === formData.NgayChieu && 
      ((formData.GioChieu >= st.GioChieu && formData.GioChieu < st.GioKetThuc) || 
       (formData.GioKetThuc > st.GioChieu && formData.GioKetThuc <= st.GioKetThuc))
    );
    return isConflict ? `Phòng đã có suất chiếu trong khoảng thời gian này.` : null;
  })();

  const handleAddShowtime = (e) => {
    e.preventDefault();
    if (conflict) return;
    const newShowtime = {
      MaSuatChieu: `ST${String(showtimes.length + 1).padStart(2, '0')}`,
      ...formData
    };
    setShowtimes([...showtimes, newShowtime]);
    setIsModalOpen(false);
  };

  const timeSlots = Array.from({ length: 30 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const min = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${min}`;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mr-4"></div>
          Đang tải dữ liệu lịch chiếu...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý suất chiếu</h1>
          <p className="text-slate-500">Lên lịch chiếu phim và điều phối phòng chiếu.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setViewMode('List')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'List' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('Timeline')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'Timeline' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
            >
              <CalendarIcon size={20} />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
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
              <button className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft size={20}/></button>
              <span className="text-xl font-bold text-white">{selectedDate}</span>
              <button className="p-2 hover:bg-white/5 rounded-full"><ChevronRight size={20}/></button>
            </div>
          </div>

          <div className="relative min-w-[1000px]">
            {/* Header Row (Rooms) */}
            <div className="grid grid-cols-12 border-b border-white/5">
              <div className="col-span-1 border-r border-white/5 py-4"></div>
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
                 <div key={room.MaPhongChieu} className="absolute h-full border-r border-white/5" style={{ left: `${(roomIdx * 25) + 8.33}%`, width: '25%' }}>
                   {showtimes.filter(st => st.MaPhongChieu === room.MaPhongChieu && st.NgayChieu === selectedDate).map(st => {
                     const startMins = parseInt(st.GioChieu.split(':')[0]) * 60 + parseInt(st.GioChieu.split(':')[1]);
                     const endMins = parseInt(st.GioKetThuc.split(':')[0]) * 60 + parseInt(st.GioKetThuc.split(':')[1]);
                     const baseMins = 8 * 60; // 08:00
                     const top = (startMins - baseMins) * (40 / 30);
                     const height = (endMins - startMins) * (40 / 30);
                     const movie = movies.find(m => m.MaPhim === st.MaPhim);

                     return (
                       <div 
                        key={st.MaSuatChieu} 
                        className="absolute left-4 right-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex flex-col justify-between group hover:bg-red-500/20 transition-all cursor-pointer overflow-hidden"
                        style={{ top: `${top}px`, height: `${height}px` }}
                       >
                         <div>
                            <h4 className="text-xs font-black text-white line-clamp-1 uppercase leading-tight">{movie?.TenPhim}</h4>
                            <p className="text-[10px] text-red-500 font-bold mt-1">{st.GioChieu} - {st.GioKetThuc}</p>
                         </div>
                         <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[9px] text-slate-500 font-bold uppercase">{dayTypes.find(d => d.MaLoaiNgay === st.MaLoaiNgay)?.TenLoaiNgay}</span>
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
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Phim</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Phòng</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Thời gian</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Loại ngày</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {showtimes.map(st => (
                <tr key={st.MaSuatChieu} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-12 rounded bg-slate-800 shrink-0 overflow-hidden">
                        <img src={movies.find(m => m.MaPhim === st.MaPhim)?.HinhAnh} className="w-full h-full object-cover" alt="Poster" />
                      </div>
                      <span className="font-bold text-white text-sm">{movies.find(m => m.MaPhim === st.MaPhim)?.TenPhim}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">{rooms.find(r => r.MaPhongChieu === st.MaPhongChieu)?.TenPhong}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{st.GioChieu} - {st.GioKetThuc}</span>
                      <span className="text-xs text-slate-500">{st.NgayChieu}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-slate-400 uppercase">{dayTypes.find(d => d.MaLoaiNgay === st.MaLoaiNgay)?.TenLoaiNgay}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-red-500 hover:underline">Hủy suất</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Showtime Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm suất chiếu mới">
        <form onSubmit={handleAddShowtime} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chọn phim</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
              value={formData.MaPhim}
              onChange={e => setFormData({ ...formData, MaPhim: e.target.value })}
            >
              {movies.map(movie => <option key={movie.MaPhim} value={movie.MaPhim} className="bg-[#0f1117]">{movie.TenPhim}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phòng chiếu</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={formData.MaPhongChieu}
                onChange={e => setFormData({ ...formData, MaPhongChieu: e.target.value })}
              >
                {rooms.map(room => <option key={room.MaPhongChieu} value={room.MaPhongChieu} className="bg-[#0f1117]">{room.TenPhong}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loại ngày</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={formData.MaLoaiNgay}
                onChange={e => setFormData({ ...formData, MaLoaiNgay: e.target.value })}
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
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={formData.NgayChieu}
                onChange={e => setFormData({ ...formData, NgayChieu: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bắt đầu</label>
              <input 
                type="time" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={formData.GioChieu}
                onChange={e => setFormData({ ...formData, GioChieu: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kết thúc</label>
              <input 
                type="time" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none border-red-500 transition-all text-sm opacity-50"
                value={formData.GioKetThuc}
                readOnly
              />
            </div>
          </div>


          {conflict && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-500">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-bold">⚠️ {conflict}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-widest">Hủy</button>
            <button 
              type="submit" 
              disabled={!!conflict}
              className={`flex-grow py-4 rounded-2xl font-bold transition-all shadow-lg text-xs uppercase tracking-widest ${conflict ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'}`}
            >
              Lưu suất chiếu
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Showtimes;
