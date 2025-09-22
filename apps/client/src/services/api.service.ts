import { ApiResponse } from '@repo/types';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '../storage/auth.storage';
import { logger } from './logger.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status <= 500
  }
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      logger.error('Axios interceptor', '')
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

const getFetch = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
};

const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse<ApiResponse<T>> = await api.get(url, config);
  return response.data;
};

const post = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data, config);
  return response.data;
};

const put = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response: AxiosResponse<ApiResponse<T>> = await api.put(url, data, config);
  return response.data;
};

// ✅ Export as object
const apiCaller = {
  get,
  post,
  put,
  getFetch
};

export default apiCaller;
