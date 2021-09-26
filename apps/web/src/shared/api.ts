import axios from 'axios';

export const API_ROOT = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL || 'http://localhost:1336'
  : process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const api = {
  get(url: string) {
    return axios
      .get(`${API_ROOT}${url}`)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => {
        // eslint-disable-next-line promise/no-return-wrap
        return Promise.reject(error?.response?.data || error?.response || error);
      });
  },
  put(url: string, payload) {
    return axios
      .put(`${API_ROOT}${url}`, payload)
      .then((response) => response.data?.data)
      .catch((error) => {
        // eslint-disable-next-line promise/no-return-wrap
        return Promise.reject(error?.response?.data || error?.response || error);
      });
  },
  post(url: string, payload) {
    return axios
      .post(`${API_ROOT}${url}`, payload)
      .then((response) => response.data?.data)
      .catch((error) => {
        // eslint-disable-next-line promise/no-return-wrap
        return Promise.reject(error?.response?.data || error?.response || error);
      });
  },
};

export function getSignedUrl(extension: string) {
  return api.get(`/v1/storage/upload-url?extension=${extension}`);
}
