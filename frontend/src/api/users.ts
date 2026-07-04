import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';
import type { User } from '@/types/auth.types';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export const userApi = {
  getMe: () =>
    apiClient.get<ApiResponse<User>>('/users/me'),

  updateMe: (data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<User>>('/users/me', data),

  getAll: () =>
    apiClient.get<ApiResponse<User[]>>('/users'),

  suspend: (uuid: string) =>
    apiClient.put<ApiResponse<User>>(`/users/${uuid}/suspend`),

  unsuspend: (uuid: string) =>
    apiClient.put<ApiResponse<User>>(`/users/${uuid}/unsuspend`),
};
