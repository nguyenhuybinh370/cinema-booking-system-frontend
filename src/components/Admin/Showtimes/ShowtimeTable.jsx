import { Eye, Edit2, Trash2, LayoutGrid } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ShowtimeTable = ({ showtimes, onEdit, onDelete, onViewSeatMap }) => (
  <div className="bg-[#131A2A]/40 backdrop-blur-md border border-white/[0.06] rounded-3xl overflow-x-auto custom-scrollbar shadow-2xl transition-all duration-300 hover:border-white/10">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-white/[0.02] border-b border-white/[0.06] select-none whitespace-nowrap">
          {['Mã suất', 'Phim', 'Phòng', 'Thời gian', 'Vé cơ bản', 'Loại ngày', 'Ghế đặt', 'Trạng thái', ''].map(h => (
            <th key={h} className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.04]">
        {showtimes.map(st => (
          <tr key={st.MaSuatChieu} className="group hover:bg-white/[0.03] transition-all duration-200 whitespace-nowrap">
            <td className="px-6 py-4">
              <span className="font-mono text-xs font-bold text-red-500">{st.MaSuatChieu}</span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-12 rounded bg-slate-800 shrink-0 overflow-hidden border border-white/5">
                  {st.HinhAnh ? (
                    <img src={st.HinhAnh} className="w-full h-full object-cover" alt="Poster" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600"><Eye size={16} /></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm line-clamp-1 max-w-[200px]">{st.TenPhim}</span>
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
              <span className="px-2.5 py-1 bg-white/[0.04] border border-white/5 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                {st.TenLoaiNgay}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => onViewSeatMap(st)}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/30 rounded-full text-emerald-400 text-xs font-black hover:bg-emerald-500/20 cursor-pointer active:scale-95 transition-all select-none"
              >
                <Eye size={12} />
                <span className="font-mono">{st.DaDat} / {st.TongSoGhe}</span>
              </button>
            </td>
            <td className="px-6 py-4">
              {st.KhaDung === 1 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
                  Khả dụng
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-500/20 bg-red-500/10 text-red-400 uppercase tracking-wider select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0" />
                  Khóa
                </span>
              )}
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-1.5">
                <button onClick={() => onViewSeatMap(st)} className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer" title="Xem sơ đồ ghế">
                  <LayoutGrid size={16} />
                </button>
                <button onClick={() => onEdit(st)} className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all cursor-pointer" title="Sửa">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(st)} className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer" title="Xóa">
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
