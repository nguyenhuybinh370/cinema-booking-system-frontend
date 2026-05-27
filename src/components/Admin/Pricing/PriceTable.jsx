import { Edit2, Trash2, Plus } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PriceTable = ({ title, data, typeKey, nameKey, onAdd, onEdit, onDelete }) => (
  <div className="bg-[#131A2A]/40 backdrop-blur-md border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl flex flex-col w-full hover:border-white/10 transition-all duration-300">
    <div className="px-6 py-4 border-b border-white/[0.06] flex justify-between items-center bg-white/[0.02]">
      <h3 className="font-black text-white uppercase tracking-widest text-xs">{title}</h3>
      <button onClick={onAdd}
        className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 hover:border-white/10 cursor-pointer px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-widest transition-all active:scale-95">
        <Plus size={12} /> Thêm mới
      </button>
    </div>
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/[0.06] bg-white/[0.01] select-none whitespace-nowrap">
            {['Mã cấu hình', 'Tên hiển thị', 'Giá phụ thu', 'Mô tả', 'Trạng thái', 'Ngày tạo', 'Cập nhật', ''].map(h => (
              <th key={h} className="px-6 py-4.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {data.map((item) => (
            <tr key={item[typeKey]} className="hover:bg-white/[0.03] transition-all duration-200 group whitespace-nowrap">
              <td className="px-6 py-4 text-xs font-mono font-bold text-red-500">{item[typeKey]}</td>
              <td className="px-6 py-4 text-sm font-bold text-white">{item[nameKey]}</td>
              <td className="px-6 py-4 text-sm font-mono text-emerald-400 font-bold">
                {item.GiaPhuThu > 0 ? `+${formatPrice(item.GiaPhuThu)}` : formatPrice(item.GiaPhuThu)}
              </td>
              <td className="px-6 py-4 text-xs text-slate-400 max-w-[200px] truncate" title={item.MoTa || ''}>
                {item.MoTa || <span className="text-slate-600 italic">Không có mô tả</span>}
              </td>
              <td className="px-6 py-4">
                {item.KhaDung === 1 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
                    Khả dụng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-500/20 bg-red-500/10 text-red-400 uppercase tracking-wider select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0" />
                    Chưa KD
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.NgayTao || '--'}</td>
              <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.NgayCapNhat || <span className="text-slate-700 italic">Chưa có</span>}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1.5">
                  <button onClick={() => onEdit(item)} className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl text-slate-400 hover:text-white cursor-pointer transition-all" title="Sửa">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(item[typeKey])} className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl text-red-400 hover:text-white cursor-pointer transition-all" title="Xóa">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PriceTable;
