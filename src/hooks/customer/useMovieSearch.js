import { useEffect, useState } from 'react';
import { getMovies } from '../../api/movieApi';

const normalizeMovies = (response) => {
  if (Array.isArray(response)) return response;
  return Array.isArray(response?.data) ? response.data : [];
};

const useMovieSearch = (query) => {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const keyword = query.trim();
    if (keyword.length < 2) {
      const resetTimer = window.setTimeout(() => {
        setResults([]);
        setIsSearching(false);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await getMovies({ keyword, limit: 6 });
        if (!cancelled) setResults(normalizeMovies(response));
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  return { results, isSearching };
};

export default useMovieSearch;
