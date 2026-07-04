import apiClient from './axios';
import type { ApiResponse } from '@/types/auth.types';
import type { DashboardStats } from '@/types/dashboard.types';

export const dashboardApi = {
  getStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/dashboard'),
};
