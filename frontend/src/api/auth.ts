import apiClient from './axios';
import type { ApiResponse, AuthData, LoginRequest, RegisterRequest } from '@/types/auth.types';

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<AuthData>>('/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthData>>('/auth/login', data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh-token', { refreshToken }),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<string>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put<ApiResponse<void>>('/auth/change-password', { currentPassword, newPassword }),

  health: () => apiClient.get<ApiResponse<string>>('/auth/health'),
};
