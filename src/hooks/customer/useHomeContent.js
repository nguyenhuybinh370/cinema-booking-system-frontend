import { useCallback, useEffect, useRef, useState } from 'react';
import clientService from '../../services/clientService';

const localDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const isCurrentlyShowing = (movie, today) => {
  const releaseDate = movie.NgayKhoiChieu ? new Date(movie.NgayKhoiChieu) : null;
  const endDate = movie.NgayKetThuc ? new Date(movie.NgayKetThuc) : null;
  return (!releaseDate || releaseDate <= today) && (!endDate || endDate >= today);
};

const isComingSoon = (movie, today) => movie.NgayKhoiChieu && new Date(movie.NgayKhoiChieu) > today;

const useHomeContent = () => {
  const requestId = useRef(0);
  const [state, setState] = useState({
    nowShowing: [],
    comingSoon: [],
    showtimes: [],
    isLoading: true,
    error: null,
  });

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setState((current) => ({ ...current, isLoading: true, error: null }));
    const today = localDate();
    const todayStart = new Date(`${today}T00:00:00`);

    const [nowResult, soonResult, showtimeResult] = await Promise.allSettled([
      clientService.getMovies({ denNgayKhoiChieu: today, limit: 30 }),
      clientService.getMovies({ tuNgayKhoiChieu: today, limit: 30 }),
      clientService.getShowtimes(null, today),
    ]);

    if (currentRequest !== requestId.current) return;
    const nowShowing = nowResult.status === 'fulfilled'
      ? nowResult.value.filter((movie) => isCurrentlyShowing(movie, todayStart))
      : [];
    const comingSoon = soonResult.status === 'fulfilled'
      ? soonResult.value.filter((movie) => isComingSoon(movie, todayStart))
      : [];
    const showtimes = showtimeResult.status === 'fulfilled' ? showtimeResult.value : [];
    const hasMovieError = nowResult.status === 'rejected' && soonResult.status === 'rejected';

    setState({
      nowShowing,
      comingSoon,
      showtimes,
      isLoading: false,
      error: hasMovieError ? 'Không thể tải danh sách phim. Vui lòng thử lại.' : null,
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => {
      window.clearTimeout(timer);
      requestId.current += 1;
    };
  }, [load]);

  return { ...state, reload: load };
};

export default useHomeContent;
