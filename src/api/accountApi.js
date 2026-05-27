import axiosClient from './axiosClient';

export const getCustomerProfile = () => {
  return axiosClient.get('/tai-khoan/thong-tin');
};

export const updateCustomerProfile = (payload) => {
  return axiosClient.put('/tai-khoan/thong-tin', payload);
};

export const changeCustomerPassword = (payload) => {
  return axiosClient.put('/tai-khoan/doi-mat-khau', payload);
};
