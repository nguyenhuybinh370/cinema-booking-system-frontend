import { Edit2, Trash2, Plus } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PriceTable = ({ title, data, typeKey, nameKey, onAdd, onEdit, onDelete }) => (
  <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col w-full">
    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
      <h3 className="font-bold text-white uppercase tracking-widest text-xs">{title}</h3>
      <button onClick={onAdd}
        className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 text-[10px] uppercase tracking-widest border border-white/5">
        <Plus size={12} /> Thêm mới
      </button>
    </div>
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 bg-white/[0.01]">
            {['Mã cấu hình', 'Tên hiển thị', 'Giá phụ thu', 'Mô tả', 'Trạng thái', 'Ngày tạo', 'Cập nhật', ''].map(h => (
              <th key={h} className="px-6 py-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr key={item[typeKey]} className="hover:bg-white/[0.01] transition-colors group">
              <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500">{item[typeKey]}</td>
              <td className="px-6 py-4 text-sm font-bold text-white">{item[nameKey]}</td>
              <td className="px-6 py-4 text-sm font-mono text-emerald-500 font-bold">
                {item.GiaPhuThu > 0 ? `+${formatPrice(item.GiaPhuThu)}` : formatPrice(item.GiaPhuThu)}
              </td>
              <td className="px-6 py-4 text-xs text-slate-400 max-w-[200px] truncate" title={item.MoTa || ''}>
                {item.MoTa || <span className="text-slate-600 italic">Không có mô tả</span>}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
                  item.KhaDung === 0
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {item.KhaDung === 0 ? '0 (Chưa KD)' : '1 (Khả dụng)'}
                </span>
              </td>
              <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.NgayTao || '--'}</td>
              <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.NgayCapNhat || <span className="text-slate-700 italic">Chưa có</span>}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(item)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white cursor-pointer" title="Sửa">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(item[typeKey])} className="p-2 hover:bg-white/5 rounded-xl text-red-400 hover:text-white cursor-pointer" title="Xóa">
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
