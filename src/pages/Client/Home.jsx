import { useCallback, useState } from 'react';
import HomeHero from '../../components/Client/HomeHero';
import MovieSection from '../../components/Client/MovieSection';
import TodayShowtimes from '../../components/Client/TodayShowtimes';
import TrailerModal from '../../components/Client/TrailerModal';
import useHomeContent from '../../hooks/customer/useHomeContent';
import { getYoutubeEmbedUrl } from '../../utils/video';

const Home = () => {
  const { nowShowing, comingSoon, showtimes, isLoading, error, reload } = useHomeContent();
  const [trailerUrl, setTrailerUrl] = useState('');
  const closeTrailer = useCallback(() => setTrailerUrl(''), []);
  const playTrailer = useCallback((url) => setTrailerUrl(getYoutubeEmbedUrl(url)), []);

  if (isLoading) {
    return <div className="client-page-state"><span className="client-loader" /><p>Đang chuẩn bị rạp phim...</p></div>;
  }

  if (error) {
    return <div className="client-page-state"><p>{error}</p><button type="button" onClick={reload} className="client-primary-button">Thử lại</button></div>;
  }

  return (
    <>
      <HomeHero movie={nowShowing[0] || comingSoon[0]} onPlayTrailer={playTrailer} />
      <MovieSection title="Phim đang chiếu" eyebrow="Chọn phim, chọn ghế" movies={nowShowing} viewAllTo="/movies/now-showing" actionLabel="Đặt vé" onPlayTrailer={playTrailer} />
      <TodayShowtimes showtimes={showtimes} />
      <MovieSection title="Phim sắp chiếu" eyebrow="Sắp ra mắt" movies={comingSoon} viewAllTo="/movies/coming-soon" actionLabel="Tìm hiểu" onPlayTrailer={playTrailer} />
      <TrailerModal embedUrl={trailerUrl} onClose={closeTrailer} />
    </>
  );
};

export default Home;
