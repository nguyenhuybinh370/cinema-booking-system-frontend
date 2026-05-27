import React from 'react';
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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
      {/* Count text */}
      <span className="text-slate-400 text-xs font-semibold">
        Hiển thị <span className="text-white font-bold">{startIdx}–{endIdx}</span> trong <span className="text-white font-bold">{total}</span> kết quả
      </span>

      <div className="flex flex-wrap items-center gap-4">
        {/* Page size change dropdown */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-semibold">Số dòng:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 cursor-pointer [&>option]:bg-[#0a0d14]"
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
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={handlePrev}
            disabled={page === 1}
            type="button"
            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
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
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={handleLast}
            disabled={page === totalPages}
            type="button"
            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer border border-white/5 disabled:cursor-not-allowed"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPagination;
