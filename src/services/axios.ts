import libAxios, { AxiosInstance, AxiosResponse } from 'axios';

export let BASE_ENDPOINT = '';
BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINT;

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

const axios: AxiosInstance = libAxios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true
});

axios.interceptors.response.use(
  (res: AxiosResponse): AxiosResponse => {
    return res;
  },
  (error) => {
    throw error;
  }
);

export default axios;
