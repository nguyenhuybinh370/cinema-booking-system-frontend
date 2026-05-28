import { Film, Clock, Play, User, Users, Edit2, Trash2 } from 'lucide-react';

const getMovieStatus = (movie) => {
  if (movie.KhaDung === 0) return 'Ended';
  const today = new Date().toISOString().split('T')[0];
  if (today < movie.NgayKhoiChieu) return 'Coming Soon';
  if (movie.NgayKetThuc && today > movie.NgayKetThuc) return 'Ended';
  return 'Showing';
};

const STATUS_LABELS = { Showing: 'Đang chiếu', 'Coming Soon': 'Sắp ra mắt', Ended: 'Ngừng chiếu' };
const STATUS_CLASSES = {
  Showing: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Coming Soon': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Ended: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const MovieCard = ({ movie, onEdit, onDelete }) => {
  const status = getMovieStatus(movie);
  return (
    <div className="group bg-[#131A2A]/40 backdrop-blur-md border border-white/[0.06] rounded-[2.5rem] overflow-hidden hover:border-red-500/30 transition-all duration-300 hover:-translate-y-2 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="relative aspect-video">
          {movie.HinhAnh ? (
            <img src={movie.HinhAnh} alt={movie.TenPhim} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600"><Film size={40} /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${STATUS_CLASSES[status]}`}>
              {STATUS_LABELS[status]}
            </span>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => onEdit(movie)}
              className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-blue-400 hover:text-white hover:bg-blue-500 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all cursor-pointer" title="Sửa">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(movie.MaPhim)}
              className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-red-400 hover:text-white hover:bg-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all cursor-pointer" title="Xóa">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black px-2 py-0.5 border border-red-500/20 rounded text-red-400 uppercase tracking-widest">{movie.GioiHanTuoi}</span>
              <span className="text-slate-600 text-xs font-bold">•</span>
              <span className="text-slate-400 text-xs font-mono font-bold flex items-center gap-1"><Clock size={12} /> {movie.ThoiLuong} phút</span>
              <span className="text-slate-600 text-xs font-bold">•</span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">{movie.MaPhim}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">{movie.TenPhim}</h3>
            <p className="text-slate-500 text-sm line-clamp-1">{movie.TheLoai}</p>
          </div>
          <div className="space-y-1 text-xs text-slate-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
            {movie.DaoDien && (
              <div className="flex items-center gap-1.5"><User size={12} className="text-slate-600" />
                <span className="text-slate-500">Đạo diễn:</span><span className="font-bold text-slate-300">{movie.DaoDien}</span>
              </div>
            )}
            {movie.DienVien && (
              <div className="flex items-center gap-1.5 line-clamp-1"><Users size={12} className="text-slate-600" />
                <span className="text-slate-500">Diễn viên:</span><span className="font-medium text-slate-400">{movie.DienVien}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase text-slate-600 font-bold tracking-widest">Khởi chiếu</span>
          <span className="text-xs font-mono font-bold text-slate-300">{movie.NgayKhoiChieu}</span>
        </div>
        {movie.Trailer && (
          <a href={movie.Trailer} target="_blank" rel="noreferrer"
            className="p-2 hover:bg-red-500/10 text-red-500 hover:text-red-400 rounded-xl transition-all flex items-center gap-1 text-xs font-bold">
            <Play size={14} fill="currentColor" /> Trailer
          </a>
        )}
      </div>
    </div>
  );
};

export { getMovieStatus };
export default MovieCard;
