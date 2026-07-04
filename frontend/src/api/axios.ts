import axios from 'axios';
import { storage } from '@/utils/storage';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const tokens = storage.getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as (typeof error.config) & { _retry?: boolean };
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const tokens = storage.getTokens();
        if (!tokens?.refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post<{ data: { accessToken: string } }>(
          '/api/v1/auth/refresh-token',
          { refreshToken: tokens.refreshToken }
        );

        const newAccessToken = data.data.accessToken;
        storage.setTokens({ ...tokens, accessToken: newAccessToken });

        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest!);
      } catch {
        storage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
