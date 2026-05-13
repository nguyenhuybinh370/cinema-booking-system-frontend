
const AdminTable = ({ columns, data, rowKey, onRowClick }) => {
  return (
    <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/5 border-b border-white/5">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row) => (
            <tr 
              key={row[rowKey]} 
              onClick={() => onRowClick && onRowClick(row)}
              className={`group hover:bg-white/[0.02] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, idx) => (
                <td key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.render ? col.render(row) : <span className="text-sm text-slate-300">{row[col.accessor]}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
