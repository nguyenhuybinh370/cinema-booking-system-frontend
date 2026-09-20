import axiosClient from './axiosClient';
import axiosPublic from './axiosPublic';

export const getMovies = (params) => {
  return axiosPublic.get('/phim', { params });
};

export const getMovieDetail = (maPhim) => {
  return axiosPublic.get(`/phim/${maPhim}`);
};

export const getMovieReviews = (maPhim, params) => {
  return axiosPublic.get(`/phim/${maPhim}/danh-gia`, { params });
};

export const getMovieShowtimes = (maPhim) => {
  return axiosPublic.get(`/phim/${maPhim}/suat-chieu`);
};

export const createReview = (payload) => {
  return axiosClient.post('/danh-gia', payload);
};
