import { dummyShowsData, dummyTrailers } from '../assets/assets';

/**
 * Generates a stable hash code for any string.
 */
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Normalizes movie titles for stable comparisons.
 * Removes Vietnamese accents, special characters, double spaces, and makes lowercase.
 */
const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD') // Decompose combined graphemes to accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accent characters
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();
};

/**
 * Retrieves fallback poster, backdrop, thumbnail, and trailer URLs for a movie
 * using stable matching rules: exact title, fuzzy title, MaPhim hash, title hash, then default.
 * No Math.random() or component-local index is used.
 */
export const getMovieVisuals = (movie) => {
  if (!movie) {
    return {
      poster: dummyShowsData[0].poster_path,
      backdrop: dummyShowsData[0].backdrop_path,
      thumbnail: dummyShowsData[0].poster_path,
      trailer: dummyTrailers[0].videoUrl,
      source: 'default'
    };
  }

  const titleVal = movie.TenPhim || movie.title || '';
  const normalizedInput = normalizeString(titleVal);

  let mockMovie = null;
  let source = 'default';

  // 1. Match by normalized TenPhim/title exact match against dummyShowsData
  if (normalizedInput) {
    mockMovie = dummyShowsData.find(m => normalizeString(m.title) === normalizedInput);
    if (mockMovie) {
      source = 'exact_title';
    }
  }

  // 2. Match by normalized TenPhim/title fuzzy/simple includes match if safe
  if (!mockMovie && normalizedInput) {
    mockMovie = dummyShowsData.find(m => {
      const normMock = normalizeString(m.title);
      return normMock && (normalizedInput.includes(normMock) || normMock.includes(normalizedInput));
    });
    if (mockMovie) {
      source = 'fuzzy_title';
    }
  }

  // Resolve matching/fallback index
  let finalPoster = '';
  let finalBackdrop = '';
  let finalTrailer = '';

  if (mockMovie) {
    finalPoster = mockMovie.poster_path;
    finalBackdrop = mockMovie.backdrop_path;
    // Map stable trailer based on matched mock movie
    const mockIndex = dummyShowsData.indexOf(mockMovie);
    finalTrailer = mockMovie.videoUrl || dummyTrailers[mockIndex % dummyTrailers.length]?.videoUrl;
  } else {
    // 3. If no title match, generate a deterministic fallback index from MaPhim hash
    if (movie.MaPhim) {
      const hashVal = hashCode(String(movie.MaPhim));
      const idx = hashVal % dummyShowsData.length;
      finalPoster = dummyShowsData[idx]?.poster_path;
      finalBackdrop = dummyShowsData[idx]?.backdrop_path;
      finalTrailer = dummyTrailers[idx % dummyTrailers.length]?.videoUrl;
      source = 'map_id_hash';
    }
    // 4. If MaPhim missing, fallback by normalized TenPhim hash
    else if (normalizedInput) {
      const hashVal = hashCode(normalizedInput);
      const idx = hashVal % dummyShowsData.length;
      finalPoster = dummyShowsData[idx]?.poster_path;
      finalBackdrop = dummyShowsData[idx]?.backdrop_path;
      finalTrailer = dummyTrailers[idx % dummyTrailers.length]?.videoUrl;
      source = 'title_hash';
    }
    // 5. Last resort: generic cinema placeholder
    else {
      finalPoster = dummyShowsData[0]?.poster_path;
      finalBackdrop = dummyShowsData[0]?.backdrop_path;
      finalTrailer = dummyTrailers[0]?.videoUrl;
      source = 'default';
    }
  }

  // Image loading & trailer rules:
  // - If backend HinhAnh exists but fails to load, fallback to getMovieVisuals(movie).poster.
  // - If backend Trailer exists, use backend trailer.
  // - If backend Trailer missing, use fallback trailer.
  const trailer = movie.Trailer || finalTrailer;

  return {
    poster: finalPoster,
    backdrop: finalBackdrop,
    thumbnail: finalPoster,
    trailer: trailer,
    source: source
  };
};
