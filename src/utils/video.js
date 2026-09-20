/** Chuyển URL YouTube hợp lệ sang URL nhúng dùng cho trailer modal. */
export const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&#/]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : '';
};
