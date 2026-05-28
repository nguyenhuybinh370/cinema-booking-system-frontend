import { useState, useMemo, useEffect } from 'react';
import { normalizeText } from '../utils/normalize';

export const useClientPagination = (initialItems = [], searchFields = [], filtersFn = null) => {
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync items state when initialItems prop changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Reset page to 1 when search or filters change
  const setFilterVal = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => {
      // 1. Check search query
      if (searchQuery.trim() !== '') {
        const queryNorm = normalizeText(searchQuery);
        const matchSearch = searchFields.some((field) => {
          const val = item[field];
          if (val === undefined || val === null) return false;
          return normalizeText(String(val)).includes(queryNorm);
        });
        if (!matchSearch) return false;
      }

      // 2. Check custom filters
      if (filtersFn) {
        return filtersFn(item, filters);
      }

      return true;
    });
  }, [items, searchQuery, searchFields, filters, filtersFn]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    filters,
    setFilters,
    setFilterVal,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems: filteredItems.length,
    filteredItems,
    paginatedItems,
  };
};
