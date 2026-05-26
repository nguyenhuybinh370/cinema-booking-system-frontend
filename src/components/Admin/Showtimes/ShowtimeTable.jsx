import { Eye, Edit2, Trash2, LayoutGrid } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ShowtimeTable = ({ showtimes, onEdit, onDelete, onViewSeatMap }) => (
  <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-white/5 border-b border-white/5">
          {['Mã suất', 'Phim', 'Phòng', 'Thời gian', 'Vé cơ bản', 'Loại ngày', 'Ghế đặt', 'Trạng thái', ''].map(h => (
            <th key={h} className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">{h}</th>
          ))}
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
                <span className="text-sm font-bold text-white font-mono">
                  {st.GioChieu.substring(0, 5)} - {st.GioKetThuc.substring(0, 5)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">{st.NgayChieu}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm font-bold text-slate-200 font-mono">{formatPrice(st.GiaVeCoBan)}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {st.TenLoaiNgay}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => onViewSeatMap(st)}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black hover:bg-emerald-500/20 cursor-pointer"
              >
                <Eye size={12} />
                <span className="font-mono">{st.DaDat} / {st.TongSoGhe}</span>
              </button>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                st.KhaDung === 1
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {st.KhaDung === 1 ? 'Khả dụng' : 'Khóa'}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => onViewSeatMap(st)} className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer" title="Xem sơ đồ ghế">
                  <LayoutGrid size={16} />
                </button>
                <button onClick={() => onEdit(st)} className="p-2 hover:bg-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all cursor-pointer" title="Sửa">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(st)} className="p-2 hover:bg-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer" title="Xóa">
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ShowtimeTable;
