import { ChevronLeft, ChevronRight } from 'lucide-react';

const timeSlots = Array.from({ length: 30 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const min = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${min}`;
});

const ShowtimeTimeline = ({ selectedDate, rooms, showtimes, onPrevDay, onNextDay, onClickShowtime }) => (
  <div className="bg-[#0f1117] border border-white/5 rounded-[2.5rem] p-8 overflow-x-auto shadow-2xl">
    {/* Date navigator */}
    <div className="flex items-center gap-4 mb-8">
      <button onClick={onPrevDay} className="p-2 hover:bg-white/5 text-white hover:text-red-500 rounded-full transition-colors cursor-pointer">
        <ChevronLeft size={20} />
      </button>
      <span className="text-xl font-black text-white font-mono">{selectedDate}</span>
      <button onClick={onNextDay} className="p-2 hover:bg-white/5 text-white hover:text-red-500 rounded-full transition-colors cursor-pointer">
        <ChevronRight size={20} />
      </button>
    </div>

    <div className="relative min-w-[1000px]">
      {/* Room header */}
      <div className="grid grid-cols-12 border-b border-white/5">
        <div className="col-span-2 border-r border-white/5 py-4" />
        {rooms.map(room => (
          <div key={room.MaPhongChieu} className="col-span-3 text-center py-4 font-bold text-slate-400 text-sm uppercase tracking-widest">
            {room.TenPhong}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-[800px]">
        {timeSlots.map((time, idx) => (
          <div key={time} className="absolute w-full h-px bg-white/[0.02]" style={{ top: `${idx * 40}px` }}>
            <span className="absolute -top-3 left-0 text-[10px] font-mono text-slate-600">{time}</span>
          </div>
        ))}

        {rooms.map((room, roomIdx) => (
          <div
            key={room.MaPhongChieu}
            className="absolute h-full border-r border-white/5"
            style={{ left: `${(roomIdx * 25) + 16.66}%`, width: '25%' }}
          >
            {showtimes
              .filter(st => st.MaPhongChieu === room.MaPhongChieu && st.NgayChieu === selectedDate && st.KhaDung === 1)
              .map(st => {
                const startMins = parseInt(st.GioChieu.split(':')[0]) * 60 + parseInt(st.GioChieu.split(':')[1]);
                const endMins   = parseInt(st.GioKetThuc.split(':')[0]) * 60 + parseInt(st.GioKetThuc.split(':')[1]);
                const baseMins  = 8 * 60;
                const top    = (startMins - baseMins) * (40 / 30);
                const height = (endMins - startMins) * (40 / 30);

                return (
                  <div
                    key={st.MaSuatChieu}
                    onClick={() => onClickShowtime(st)}
                    className="absolute left-4 right-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex flex-col justify-between group hover:bg-red-500/20 transition-all cursor-pointer overflow-hidden"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div>
                      <h4 className="text-xs font-black text-white line-clamp-2 uppercase leading-tight">{st.TenPhim}</h4>
                      <p className="text-[10px] text-red-400 font-black font-mono mt-1">
                        {st.GioChieu.substring(0, 5)} - {st.GioKetThuc.substring(0, 5)}
                      </p>
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
);

export default ShowtimeTimeline;
