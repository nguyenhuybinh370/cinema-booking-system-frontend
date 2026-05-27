
const AdminTable = ({ columns, data = [], rowKey, onRowClick }) => {
  return (
    <div className="bg-[#131A2A]/40 backdrop-blur-md border border-white/[0.06] rounded-3xl overflow-x-auto custom-scrollbar shadow-2xl transition-all duration-300 hover:border-white/10">
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="bg-white/[0.02] border-b border-white/[0.06] whitespace-nowrap">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-slate-400 select-none ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 font-medium">
                Không tìm thấy dữ liệu phù hợp.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr 
                key={row[rowKey]} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`group hover:bg-white/[0.03] transition-all duration-200 whitespace-nowrap ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={`px-6 py-4 text-slate-300 align-middle ${col.className || ''}`}>
                    {col.render ? col.render(row) : <span className="text-sm font-semibold">{row[col.accessor]}</span>}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
