const AdminToolbar = ({ children, searchPlaceholder, searchValue, onSearchChange, filterSlot, actionSlot }) => {
  return (
    <div className="admin-toolbar">
      {/* Search block */}
      {onSearchChange && (
        <label className="admin-search-field">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={searchPlaceholder || "Tìm kiếm..."} 
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--admin-text-muted)]"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
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
