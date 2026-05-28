import React from 'react';

const AdminToolbar = ({ children, searchPlaceholder, searchValue, onSearchChange, filterSlot, actionSlot }) => {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-2xl">
      {/* Search block */}
      {onSearchChange && (
        <div className="flex-grow max-w-md flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
          <svg className="text-slate-500 w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={searchPlaceholder || "Tìm kiếm..."} 
            className="bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-slate-500 w-full font-bold"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      {/* Filter and custom content block */}
      {filterSlot && (
        <div className="flex flex-wrap items-center gap-3">
          {filterSlot}
        </div>
      )}

      {/* Action block */}
      {actionSlot && (
        <div className="flex items-center gap-3 shrink-0">
          {actionSlot}
        </div>
      )}

      {/* If children is provided instead of standard slots */}
      {children}
    </div>
  );
};

export default AdminToolbar;
