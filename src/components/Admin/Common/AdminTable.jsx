
const AdminTable = ({ columns, data = [], rowKey, onRowClick }) => {
  return (
    <div className="admin-table-shell">
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="whitespace-nowrap">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`select-none px-5 py-3.5 text-xs font-semibold text-[var(--admin-text-secondary)] ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-14 text-center text-sm text-[var(--admin-text-secondary)]">
                Chưa có dữ liệu phù hợp với bộ lọc hiện tại.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr 
                key={row[rowKey]} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`group whitespace-nowrap ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={`px-5 py-4 align-middle text-[var(--admin-text)] ${col.className || ''}`}>
                    {col.render ? col.render(row) : <span className="text-sm">{row[col.accessor]}</span>}
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
