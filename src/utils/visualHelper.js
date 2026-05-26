import { dummyShowsData, dummyTrailers } from '../assets/assets';

/**
 * Retrieves fallback poster, backdrop, and trailer URL for a movie
 * by comparing its title with frontend mock data.
 * Falls back to rotating assets by index if no match is found.
 */
export const getMovieVisuals = (movie, index = 0) => {
  if (!movie) {
    return {
      poster: dummyShowsData[0].poster_path,
      backdrop: dummyShowsData[0].backdrop_path,
      trailer: dummyTrailers[0].videoUrl
    };
  }

  const normalizedTitle = (movie.TenPhim || movie.title || '').toLowerCase().trim();
  const mockMovie = dummyShowsData.find(m => 
    (m.title || '').toLowerCase().trim() === normalizedTitle
  );

  const poster = mockMovie?.poster_path || dummyShowsData[index % dummyShowsData.length]?.poster_path;
  const backdrop = mockMovie?.backdrop_path || dummyShowsData[index % dummyShowsData.length]?.backdrop_path;
  const trailer = movie.Trailer || mockMovie?.videoUrl || dummyTrailers[index % dummyTrailers.length]?.videoUrl;

  return { poster, backdrop, trailer };
};
