import axiosClient from './axiosClient';

export const getMovies = (params) => {
  return axiosClient.get('/phim', { params });
};

export const getMovieDetail = (maPhim) => {
  return axiosClient.get(`/phim/${maPhim}`);
};

export const getMovieReviews = (maPhim, params) => {
  return axiosClient.get(`/phim/${maPhim}/danh-gia`, { params });
};

export const getMovieShowtimes = (maPhim) => {
  return axiosClient.get(`/phim/${maPhim}/suat-chieu`);
};

export const createReview = (payload) => {
  return axiosClient.post('/danh-gia', payload);
};
