import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import { ADMIN_MOVIES, ROOMS, DAY_TYPES } from '../../constants/adminMockData';
import { List, Calendar as CalendarIcon, Clock, AlertCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Showtimes = () => {
  const [viewMode, setViewMode] = useState('Timeline'); // 'List' or 'Timeline'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024-05-13');
  
  // Mock showtimes
  const [showtimes, setShowtimes] = useState([
    { id: 1, movieId: 'M01', roomId: 'PC01', date: '2024-05-13', startTime: '09:00', endTime: '11:07', dayTypeId: 'Weekday', basePrice: 85000 },
    { id: 2, movieId: 'M02', roomId: 'PC01', date: '2024-05-13', startTime: '12:00', endTime: '14:40', dayTypeId: 'Weekday', basePrice: 85000 },
    { id: 3, movieId: 'M01', roomId: 'PC02', date: '2024-05-13', startTime: '10:30', endTime: '12:37', dayTypeId: 'Weekday', basePrice: 85000 },
  ]);

  const [formData, setFormData] = useState({
    movieId: 'M01',
    roomId: 'PC01',
    date: '2024-05-13',
    startTime: '15:00',
    endTime: '17:07',
    dayTypeId: 'Weekday',
    basePrice: 85000
  });

  const [conflict, setConflict] = useState(null);

  // Check conflict logic
  useEffect(() => {
    const isConflict = showtimes.some(st => 
      st.roomId === formData.roomId && 
      st.date === formData.date && 
      ((formData.startTime >= st.startTime && formData.startTime < st.endTime) || 
       (formData.endTime > st.startTime && formData.endTime <= st.endTime))
    );
    
    if (isConflict) {
      setConflict(`Phòng đã có suất chiếu trong khoảng thời gian này.`);
    } else {
      setConflict(null);
    }
  }, [formData, showtimes]);

  const handleAddShowtime = (e) => {
    e.preventDefault();
    if (conflict) return;
    const newShowtime = {
      id: showtimes.length + 1,
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
              {ROOMS.map(room => (
                <div key={room.id} className="col-span-3 text-center py-4 font-bold text-slate-400 text-sm uppercase tracking-widest">{room.name}</div>
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
               {ROOMS.map((room, roomIdx) => (
                 <div key={room.id} className="absolute h-full border-r border-white/5" style={{ left: `${(roomIdx * 25) + 8.33}%`, width: '25%' }}>
                   {showtimes.filter(st => st.roomId === room.id && st.date === selectedDate).map(st => {
                     const startMins = parseInt(st.startTime.split(':')[0]) * 60 + parseInt(st.startTime.split(':')[1]);
                     const endMins = parseInt(st.endTime.split(':')[0]) * 60 + parseInt(st.endTime.split(':')[1]);
                     const baseMins = 8 * 60; // 08:00
                     const top = (startMins - baseMins) * (40 / 30);
                     const height = (endMins - startMins) * (40 / 30);
                     const movie = ADMIN_MOVIES.find(m => m.id === st.movieId);

                     return (
                       <div 
                        key={st.id} 
                        className="absolute left-4 right-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex flex-col justify-between group hover:bg-red-500/20 transition-all cursor-pointer overflow-hidden"
                        style={{ top: `${top}px`, height: `${height}px` }}
                       >
                         <div>
                            <h4 className="text-xs font-black text-white line-clamp-1 uppercase leading-tight">{movie?.title}</h4>
                            <p className="text-[10px] text-red-500 font-bold mt-1">{st.startTime} - {st.endTime}</p>
                         </div>
                         <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[9px] text-slate-500 font-bold uppercase">{st.dayTypeId}</span>
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
                <tr key={st.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-12 rounded bg-slate-800 shrink-0"></div>
                      <span className="font-bold text-white text-sm">{ADMIN_MOVIES.find(m => m.id === st.movieId)?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">{ROOMS.find(r => r.id === st.roomId)?.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{st.startTime} - {st.endTime}</span>
                      <span className="text-xs text-slate-500">{st.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-slate-400 uppercase">{st.dayTypeId}</span>
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
              value={formData.movieId}
              onChange={e => setFormData({ ...formData, movieId: e.target.value })}
            >
              {ADMIN_MOVIES.map(movie => <option key={movie.id} value={movie.id} className="bg-[#0f1117]">{movie.title}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phòng chiếu</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={formData.roomId}
                onChange={e => setFormData({ ...formData, roomId: e.target.value })}
              >
                {ROOMS.map(room => <option key={room.id} value={room.id} className="bg-[#0f1117]">{room.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loại ngày</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={formData.dayTypeId}
                onChange={e => setFormData({ ...formData, dayTypeId: e.target.value })}
              >
                {DAY_TYPES.map(day => <option key={day.id} value={day.id} className="bg-[#0f1117]">{day.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày chiếu</label>
              <input 
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bắt đầu</label>
              <input 
                type="time" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kết thúc</label>
              <input 
                type="time" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none border-red-500 transition-all text-sm opacity-50"
                value={formData.endTime}
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
