
import { useState } from 'react';
import { Eye } from 'lucide-react';
import AdminDetailDialog from './AdminDetailDialog';

const AdminTable = ({ columns, data = [], rowKey, onRowClick }) => {
  const [detailRow, setDetailRow] = useState(null);
  const getDetailTitle = (row) => row?.TenPhim || row?.TenPhong || row?.HoTen || row?.title || row?.name || 'Chi tiết dữ liệu';
  const detailTitle = getDetailTitle(detailRow);

  return (
    <>
    <div className="admin-table-shell">
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="whitespace-nowrap">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`select-none px-5 py-3.5 text-xs font-semibold text-[var(--admin-text-secondary)] ${idx === columns.length - 1 ? 'admin-table-sticky-action' : ''} ${col.className || ''}`}
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
                  <td key={idx} className={`px-5 py-4 align-middle text-[var(--admin-text)] ${idx === columns.length - 1 ? 'admin-table-sticky-action' : ''} ${col.className || ''}`}>
                    {idx === columns.length - 1 ? <div className="admin-table-actions"><button type="button" className="admin-table-action" aria-label={`Xem chi tiết ${getDetailTitle(row)}`} onClick={(event) => { event.stopPropagation(); setDetailRow(row); }}><Eye size={16} /></button>{col.render ? col.render(row) : <span className="text-sm">{row[col.accessor]}</span>}</div> : col.render ? col.render(row) : <span className="text-sm">{row[col.accessor]}</span>}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    <AdminDetailDialog item={detailRow} title={detailTitle} onClose={() => setDetailRow(null)} />
    </>
  );
};

export default AdminTable;
