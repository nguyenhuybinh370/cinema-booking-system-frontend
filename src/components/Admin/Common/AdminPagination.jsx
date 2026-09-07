import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AdminPagination = ({ page, pageSize, total, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIdx = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, total);

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handleFirst = () => {
    if (page !== 1) onPageChange(1);
  };

  const handleLast = () => {
    if (page !== totalPages) onPageChange(totalPages);
  };

  return (
    <nav className="admin-pagination" aria-label="Phân trang">
      {/* Count text */}
      <span>
        Hiển thị <strong>{startIdx}–{endIdx}</strong> trong <strong>{total}</strong> kết quả
      </span>

      <div className="flex flex-wrap items-center gap-4">
        {/* Page size change dropdown */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-semibold">Số dòng:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="admin-pagination-size"
              aria-label="Số dòng mỗi trang"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleFirst}
            disabled={page === 1}
            type="button"
            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
            aria-label="Trang đầu"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={handlePrev}
            disabled={page === 1}
            type="button"
            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
            aria-label="Trang trước"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold select-none">
            {page} / {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            type="button"
            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
            aria-label="Trang tiếp theo"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={handleLast}
            disabled={page === totalPages}
            type="button"
            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
            aria-label="Trang cuối"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminPagination;
