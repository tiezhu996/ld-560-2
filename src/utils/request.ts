import axios from 'axios';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const request = axios.create({
  baseURL: '/',
  timeout: 8000
});

request.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;
    if (data && typeof data.code === 'number' && data.code !== 0) {
      window.dispatchEvent(new CustomEvent('app-error', { detail: data.message }));
      return Promise.reject(new Error(data.message));
    }
    return response;
  },
  (error) => {
    window.dispatchEvent(new CustomEvent('app-error', { detail: error.message || '网络请求异常' }));
    return Promise.reject(error);
  }
);
